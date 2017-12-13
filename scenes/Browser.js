import React, { Component } from 'react'
import {
  StyleSheet,
  Alert,
  Platform,
  View,
  ActivityIndicator
} from 'react-native'

import theme from '../config/Theme'

import ConfirmTransactionModal from '../components/ConfirmTransactionModal'

import Webbrowser from 'react-native-webbrowser-enhanced'

export default class Browser extends Component {
  constructor () {
    super()
    // this.state = {
    //   injectedJs: `${patchPostMessageJsCode}
    //   var s = document.createElement("script");
    //   s.type = "text/javascript";
    //   s.src = "${global.sdkdConfig.sdkdHost}/web3mobile/lib/web3.js";
    //   document.head.insertBefore(s, document.head.firstChild);
    //   `
    // }
    this.state = {
      web3Js: null,
      injectedJs: null,
      modalVisible: true,
      txQueue: []
    }
    if (Platform.OS === 'ios') {
      // load the message handler up after the page loads
      this.state['injectedJs'] = 'window.web3_postMessageParent = window.webkit.messageHandlers.reactNative'
    } else if (Platform.OS === 'android') {
      // load the message handler up after the page loads
      // this.state['injectedJs'] = 'eval(web3maker.evalMe())'
    }
    let txPayload = {
      tx: {
        to: '0xdbd360F30097fB6d938dcc8B7b62854B36160B45',
        value: global.ethFuncs.decimalToHex(100000000000000),
        data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000003',
        gasLimit: global.globalFuncs.defaultTxGasLimit.toString(),
        gasPrice: global.currentWallet.defaultGasPrice
      }
    }
    this.addTxToQueue(txPayload)
  }
  addTxToQueue (txPayload) {
    console.log('estimating gas to add tx to queue: ' + JSON.stringify(txPayload))
    global.ethFuncs.estimateGas(txPayload.tx, (result) => {
      console.log('gas estimate result: ' + JSON.stringify(result))
      if (result.error) {
        throw new Error(result.error)
      }

      txPayload.tx.gasLimit = result.data

      this.setState(prevState => ({
        txQueue: [...prevState.txQueue, txPayload]
      }))
    })
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
      response = `window.chrome = {webstore: true};
      window.web3Mobile = {
        selectedAddress: '${global.currentWallet.getAddressString()}'
      };
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
  render () {
    // if (this.state.web3Js === null) {
    //   return (
    //     <View style={styles.container}>
    //       <ActivityIndicator
    //         size='large'
    //         styles={styles.activityIndicator}
    //       />
    //     </View>
    //   )
    // }
    // let url = 'https://tetzelcoin.com/#/confess'
    // let url = global.sdkdConfig.sdkdStaticHost + '/web3test.html'
    // let url = 'https://oasisdex.com'
    let url = 'https://cryptokitties.co'
    // let url = 'https://myetherwallet.com/signmsg.html'
    return [
      // (<Webbrowser
      //   key='webbrowser'
      //   url={url}
      //   hideHomeButton={false}
      //   hideToolbar={false}
      //   hideAddressBar={false}
      //   hideStatusBar={false}
      //   foregroundColor={theme.headerTintColor}
      //   backgroundColor={theme.headerStyle.backgroundColor}
      //   webviewProps={{
      //     onMessage: this.webviewMessage.bind(this),
      //     injectedJavaScript: this.state.injectedJs,
      //     injectJavaScriptBeforeLoad: this.state.web3Js
      //   }}
      //   ref={browser => { this.browser = browser }}
      // />),
      (<View key='test' style={styles.container}>
        <ActivityIndicator
          size='large'
          styles={styles.activityIndicator}
        />
      </View>),
      (this.renderConfirmTransactionModal())
    ]
  }
  renderConfirmTransactionModal () {
    if (this.state.txQueue.length === 0) {
      // nothing in queue to show
      return null
    }
    let txPayload = this.state.txQueue[0]
    console.log('creating eTx with tx: ' + JSON.stringify(txPayload.tx))
    let eTx = new global.ethUtil.Tx(txPayload.tx)
    console.log('tx: ' + JSON.stringify(eTx.to))
    return (
      <ConfirmTransactionModal
        key='modal'
        isVisible={this.state.modalVisible}
        tx={eTx}
        fromAddress={global.currentWallet.getAddressString()}
        onPressReject={this.submitOrRejectTxn.bind(this, false, txPayload)}
        onPressSubmit={this.submitOrRejectTxn.bind(this, true, txPayload)}
      />
    )
  }

  submitOrRejectTxn (submitTxn, payload) {
    console.log('user submitted or rejected txn.  submitTxn: ' + submitTxn.toString() + ' and payload: ' + JSON.stringify(payload))
    this.setState({
      modalVisible: false,
      txQueue: this.state.txQueue.slice(1)
    })
    let callbackKey = payload.callbackKey
    let cmd = `
      console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, ${submitTxn.toString()});
      delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
    `
    this.evalJs(cmd)
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
      let callbackKey = payload.callbackKey
      let cmd = `
      console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, ['${global.currentWallet.getAddressString()}']);
      delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
      `
      this.evalJs(cmd)
    } else if (payload.method === 'signTransaction') {
      let callbackKey = payload.callbackKey
      let tx = payload.tx
      console.log('signing tx ' + JSON.stringify(tx))
      let signedTx = global.currentWallet.signTx(tx)
      let cmd = `
      console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, '${signedTx}');
      delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
      `
      this.evalJs(cmd)
    } else if (payload.method === 'approveTransaction') {
      this.addTxToQueue(payload)
    } else if (payload.method === 'signPersonalMessage') {
      let callbackKey = payload.callbackKey
      let msg = payload.msg
      console.log('signing message ' + JSON.stringify(msg))
      let signedMsg = global.currentWallet.signMsg(msg.data)
      let cmd = `
      console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
      window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, '${signedMsg}');
      delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
      `
      this.evalJs(cmd)
    } else if (payload.method === 'approvePersonalMessage') {
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
                window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, false);
                delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
              `
              this.evalJs(cmd)
            },
            style: 'cancel'
          },
          {
            text: 'Approve',
            onPress: () => {
              let cmd = `
                console.log('React native is calling window.web3Mobile._bridge_callbacks for ${payload.method} and key ${callbackKey}');
                window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}'](null, true);
                delete window.web3Mobile._bridge_callbacks['${payload.method}']['${callbackKey}']
              `
              this.evalJs(cmd)
            }
          }
        ]
      )
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
    backgroundColor: theme.sceneBackgroundColor
  }
})
