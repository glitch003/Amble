import React, { Component } from 'react'
import {
  StyleSheet,
  Alert,
  Platform,
  View,
  ActivityIndicator
} from 'react-native'

// import theme from '../config/Theme'

import ConfirmTransactionModal from './components/ConfirmTransactionModal'

import BN from 'bn.js'

import Webbrowser from 'react-native-webbrowser-enhanced'

export default class Browser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      web3Js: null,
      injectedJs: null,
      modalVisible: false,
      txQueue: [],
      approvedUnsignedTxQueue: [],
      approvedUnsignedMsgQueue: []
    }
    if (Platform.OS === 'ios') {
      // load the message handler up after the page loads
      this.state['injectedJs'] = 'window.web3_postMessageParent = window.webkit.messageHandlers.reactNative'
    } else if (Platform.OS === 'android') {
      // load the message handler up after the page loads
      // this.state['injectedJs'] = 'eval(web3maker.evalMe())'
    }
  }
  componentWillMount () {
    // get web3 script to inject
    let url = global.sdkdConfig.sdkdStaticHost + '/web3.min.js'
    // let url = 'http://localhost:3000/web3mobile/lib/web3.js'
    console.log('getting url ' + url)
    fetch(url)
    .then((response) => {
      return response.text()
    }).then(response => {
      // console.log('got response text: ', response)
      // response = `${patchPostMessageJsCode}
      // ${response}
      // `
      // window.chrome is a hack to make this work with cryptokitties
      let web3Mobile = {
        selectedAddress: global.currentWallet.getAddressString(),
        rpcUrl: global.sdkdConfig.moduleConfig.wallet.ethNodeHost
      }
      response = `window.chrome = {webstore: true};
      window.web3Mobile = ${JSON.stringify(web3Mobile)};
      ${response}
      `
      console.log('injecting web3Js response of length ' + response.length)
      this.setState({web3Js: response})

      // // this section turns on react debugging of the webview.  make sure to also allow mixed content in the android webview code.
      // let reactDebugUrl = 'http://10.20.1.76:8097'
      // fetch(reactDebugUrl)
      // .then((debugResponse) => {
      //   return debugResponse.text()
      // })
      // .then(debugResponse => {
      //   debugResponse += 'ReactDevToolsBackend.connectToDevTools({host: "10.20.1.76"});'
      //   this.setState({web3Js: debugResponse + '\n' + response})
      // })
    })
  }
  componentDidMount () {
    // tx payload for testing
    // let txPayload = {
    //   tx: {
    //     'from': '0xdbd360f30097fb6d938dcc8b7b62854b36160b45',
    //     'value': '0x1c6bf526340000',
    //     'gasPrice': '0x5d21dba00',
    //     'to': '0x06012c8cf97bead5deae237070f9587f8e7a266d',
    //     'data': '0xf7d8c883000000000000000000000000000000000000000000000000000000000001ce4a0000000000000000000000000000000000000000000000000000000000042190'
    //   }
    // }
    // let txPayload = {
    //   tx: {"from":"0xdbd360f30097fb6d938dcc8b7b62854b36160b45","value":"0x1c6bf526340000","gasPrice":"0x3c","to":"0x06012c8cf97bead5deae237070f9587f8e7a266d","data":"0xf7d8c883000000000000000000000000000000000000000000000000000000000002f09d0000000000000000000000000000000000000000000000000000000000051f40","gas":"0x1dc38"}
    // }
    // this.addTxToQueue(txPayload)
  }
  render () {
    if (this.state.web3Js === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            size='large'
            styles={styles.activityIndicator}
          />
        </View>
      )
    }
    // let url = 'https://tetzelcoin.com/#/confess'
    // let url = global.sdkdConfig.sdkdStaticHost + '/web3test.html'
    // let url = global.sdkdConfig.sdkdStaticHost + '/web3mobile-pentest.htm'
    // let url = 'https://oasisdex.com'
    // let url = 'https://cryptokitties.co'
    // let url = 'https://myetherwallet.com/signmsg.html'
    let url = 'https://faucet.metamask.io/'
    return [
      (<Webbrowser
        key='webbrowser'
        url={url}
        hideHomeButton={false}
        hideToolbar={true}
        hideAddressBar={false}
        hideStatusBar={true}
        foregroundColor={'white'/*theme.headerTintColor*/}
        backgroundColor={'black'/*theme.headerStyle.backgroundColor*/}
        webviewProps={{
          onMessage: this.webviewMessage.bind(this),
          injectedJavaScript: this.state.injectedJs,
          injectJavaScriptBeforeLoad: this.state.web3Js
        }}
        ref={browser => { this.browser = browser }}
      />),
      (this.renderConfirmTransactionModal())
    ]
  }
  renderConfirmTransactionModal () {
    if (this.state.txQueue.length === 0) {
      // nothing in queue to show
      return null
    }
    let txPayload = this.state.txQueue[0]
    return (
      <ConfirmTransactionModal
        key='modal'
        isVisible={this.state.modalVisible}
        tx={txPayload.tx}
        fromAddress={global.currentWallet.getAddressString()}
        onPressReject={this.submitOrRejectTxn.bind(this, false, txPayload)}
        onPressSubmit={this.submitOrRejectTxn.bind(this, true, txPayload)}
      />
    )
  }
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size='large'
          styles={styles.activityIndicator}
        />
      </View>
    )
  }
  webviewMessage (e) {
    console.log('webview message received')
    let payload = ''
    if (Platform.OS === 'ios') {
      console.log(e)
      try {
        payload = JSON.parse(e.body)
      } catch (e) {
        console.log('Error parsing json onMessage on iOS')
        return // couldn't parse json, exit.
      }
    } else if (Platform.OS === 'android') {
      if (!e.nativeEvent.data || !e.nativeEvent.data.length === 0) {
        return
      }
      console.log(e.nativeEvent.data)
      try {
        payload = JSON.parse(e.nativeEvent.data)
      } catch (e) {
        console.log('Error parsing json onMessage on android')
        return // couldn't parse json, exit.
      }
    }
    if (payload.method === 'getAccounts') {
      this.getAccounts(payload)
    } else if (payload.method === 'signTransaction') {
      this.signTx(payload)
    } else if (payload.method === 'approveTransaction') {
      this.addTxToQueue(payload)
    } else if (payload.method === 'signPersonalMessage') {
      this.signPersonalMessage(payload)
    } else if (payload.method === 'approvePersonalMessage') {
      this.askToApproveMsg(payload)
    } else {
      console.log('RN webview message received with invalid method.  See payload log above.')
    }
  }
  evalJs (js) {
    console.log('injecting js into webview: ' + js)
    if (Platform.OS === 'ios') {
      this.browser.refs.webview.evaluateJavaScript(js)
    } else if (Platform.OS === 'android') {
      this.browser.refs.webview.injectJavaScript(js)
    }
  }
  addTxToQueue (txPayload) {
    console.log('possibly estimating gas to add tx to queue: ' + JSON.stringify(txPayload))
    txPayload.tx.gasPrice = global.currentWallet.defaultGasPrice
    if (txPayload.tx.gas) {
      // gas limit is already specified, do not estimate
      if (txPayload.tx.gas.indexOf('0x') === -1) {
        txPayload.tx.gas = txPayload.tx.gas
      } else {
        // convert from hex
        txPayload.tx.gas = global.ethFuncs.hexToDecimal(txPayload.tx.gas)
      }
      this.setState(prevState => ({
        txQueue: [...prevState.txQueue, txPayload],
        modalVisible: true
      }))
      return
    }
    global.ethFuncs.estimateGas(txPayload.tx, (result) => {
      console.log('gas estimate result: ' + JSON.stringify(result))
      if (result.error) {
        throw new Error(result.error)
      }

      txPayload.tx.gas = new BN(result.data)
      // add 100k more gas if the txn has data
      if (txPayload.tx.data && txPayload.tx.data.length !== 0 && txPayload.tx.data !== '0x' && txPayload.tx.data !== '0x0' && txPayload.tx.data !== '0') {
        txPayload.tx.gas = txPayload.tx.gas.add(new BN(100000))
      }
      txPayload.tx.gas = txPayload.tx.gas.toString()

      this.setState(prevState => ({
        txQueue: [...prevState.txQueue, txPayload],
        modalVisible: true
      }))
    })
  }
  submitOrRejectTxn (submitTxn, payload, modifiedTx) {
    console.log('user submitted or rejected txn.  submitTxn: ' + submitTxn.toString() + ' and payload: ' + JSON.stringify(payload) + ' and modifiedTx: ' + JSON.stringify(modifiedTx))
    const finalTx = Object.assign({}, modifiedTx) // clone object
    // convert from gwei to wei
    finalTx.gasPrice = global.etherUnits.toWei(finalTx.gasPrice, 'gwei')
    // convert to hex
    finalTx.gasPrice = '0x' + global.ethFuncs.decimalToHex(finalTx.gasPrice)
    // convert to hex
    finalTx.gas = '0x' + global.ethFuncs.decimalToHex(finalTx.gas)

    this.setState(prevState => ({
      approvedUnsignedTxQueue: submitTxn ? [...prevState.approvedUnsignedTxQueue, finalTx] : prevState.approvedUnsignedTxQueue,
      txQueue: prevState.txQueue.slice(1),
      modalVisible: false
    }))

    let callbackKey = payload.callbackKey
    let cmd = `
      console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].data.tx.gas = '${finalTx.gas}';
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].data.tx.gasPrice = '${finalTx.gasPrice}';
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, ${submitTxn.toString()});
      delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
    `
    this.evalJs(cmd)
  }
  checkArrayForMatch (haystack, needle, propertiesToCompare) {
    let index = -1

    haystack.forEach((pNeedle, i) => {
      // copy over just the properties to compare to new objects
      let possibleNeedle = {}
      let realNeedle = {}
      propertiesToCompare.forEach(p => {
        possibleNeedle[p] = pNeedle[p]
        realNeedle[p] = needle[p]
      })
      console.log('comparing possibleNeedle with realNeedle', JSON.stringify(possibleNeedle), JSON.stringify(realNeedle))
      if (JSON.stringify(possibleNeedle) === JSON.stringify(realNeedle)) {
        index = i
      }
    })

    return index
  }
  signTx (payload) {
    let callbackKey = payload.callbackKey
    let tx = payload.tx
    // validate the tx and make sure it's actually been approved
    let propertiesToCompare = [
      'to',
      'from',
      'value',
      'gasPrice',
      'gas',
      'data'
    ]
    let txIndex = this.checkArrayForMatch(this.state.approvedUnsignedTxQueue, tx, propertiesToCompare)
    if (txIndex === -1) {
      // bail if tx is not approved because it was not found in approved txs
      console.log('Error, a signTransaction command was sent to react native for a transaction that was not approved: ' + JSON.stringify(tx))
      console.log('this.state.approvedUnsignedTxQueue is ' + JSON.stringify(this.state.approvedUnsignedTxQueue))
      return
    }
    // remove approved tx from queue
    let approvedUnsignedTxQueue = this.state.approvedUnsignedTxQueue
    approvedUnsignedTxQueue.splice(txIndex, 1)
    this.setState({
      approvedUnsignedTxQueue: approvedUnsignedTxQueue
    })
    console.log('signing tx ' + JSON.stringify(tx))
    let signedTx = global.currentWallet.signTx(tx)
    let cmd = `
    console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
    window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, '${signedTx}');
    delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
    `
    this.evalJs(cmd)
  }
  getAccounts (payload) {
    let callbackKey = payload.callbackKey
    let cmd = `
    console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
    window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, ['${global.currentWallet.getAddressString()}']);
    delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
    `
    this.evalJs(cmd)
  }
  signPersonalMessage (payload) {
    let callbackKey = payload.callbackKey
    let msg = payload.msg
    let propertiesToCompare = [
      'from', 'data'
    ]
    let msgIndex = this.checkArrayForMatch(this.state.approvedUnsignedMsgQueue, msg, propertiesToCompare)
    if (msgIndex === -1) {
      // bail if msg is not approved because it was not found in approved msgs
      console.log('Error, a signPersonalMessage command was sent to react native for a message that was not approved: ' + JSON.stringify(msg))
      console.log('this.state.approvedUnsignedMsgQueue is ' + JSON.stringify(this.state.approvedUnsignedMsgQueue))
      return
    }
    // remove approved tx from queue
    let approvedUnsignedMsgQueue = this.state.approvedUnsignedMsgQueue
    approvedUnsignedMsgQueue.splice(msgIndex, 1)
    this.setState({
      approvedUnsignedMsgQueue: approvedUnsignedMsgQueue
    })
    console.log('signing message ' + JSON.stringify(msg))
    let signedMsg = global.currentWallet.signMsg(msg.data)
    let cmd = `
    console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
    window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, '${signedMsg}');
    delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
    `
    this.evalJs(cmd)
  }
  askToApproveMsg (payload) {
    let callbackKey = payload.callbackKey
    let msg = payload.msg
    console.log('Asking user to approve msg ' + JSON.stringify(msg.data))

    // ask the user if they wanna approve it
    Alert.alert(
      'New Message Signing Request',
      'Request to sign message: ' + global.ethUtil.toAscii(msg.data),
      [
        {
          text: 'Reject',
          onPress: () => {
            let cmd = `
              console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
              window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, false);
              delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
            `
            this.evalJs(cmd)
          },
          style: 'cancel'
        },
        {
          text: 'Approve',
          onPress: () => {
            this.setState(prevState => ({
              approvedUnsignedMsgQueue: [...prevState.approvedUnsignedMsgQueue, payload.msg]
            }))
            let cmd = `
              console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
              window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'].callback(null, true);
              delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
            `
            this.evalJs(cmd)
          }
        }
      ]
    )
  }
}

// hack needed because tetzelcoin and other sites already define postMesage
// const patchPostMessageFunction = function () {
//   console.log('patching post message function')
//   var originalPostMessage = window.postMessage

//   if (!originalPostMessage) {
//     return
//   }

//   var patchedPostMessage = function (message, targetOrigin, transfer) {
//     originalPostMessage(message, targetOrigin, transfer)
//   }

//   patchedPostMessage.toString = function () {
//     return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
//   }

//   window.postMessage = patchedPostMessage
//   console.log('patch complete')
// }

// const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white' //theme.sceneBackgroundColor
  }
})
