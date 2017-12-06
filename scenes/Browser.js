import React, { Component } from 'react'
import {
  StyleSheet,
  WebView,
  Alert,
  Text,
  View,
  ActivityIndicator
} from 'react-native'
import theme from '../config/Theme'
import Webbrowser from 'react-native-webbrowser-enhanced'

export default class Browser extends Component {
  constructor () {
    super()
    this.state = {
      injectedJs: null
    }
  }
  componentWillMount () {
    // get web3 script to inject
    fetch('http://localhost:3000/web3mobile/lib/web3mobile.js')
    .then((response) => {
      return response.text()
    }).then(response => {
      response = `${patchPostMessageJsCode}
      if (typeof web3mobile === 'undefined') {
      ` + '\n' + response
      response += `
          var web3 = web3mobile.web3;
          web3.version.network = '${global.sdkdConfig.moduleConfig.wallet.networkVersion}';
          // start polling for blocks
          web3mobile.engine.start()
        }
      `
      this.setState({injectedJs: response})
    })
  }
  render () {
    if (this.state.injectedJs === null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            size='large'
            styles={styles.activityIndicator}
          />
        </View>
      )
    }
    let url = 'https://tetzelcoin.com/#/confess'
    return (
      <Webbrowser
        url={url}
        hideHomeButton={false}
        hideToolbar={false}
        hideAddressBar={false}
        hideStatusBar={false}
        foregroundColor={'#efefef'}
        backgroundColor={'#333'}
        webviewProps={{
          onMessage: this.webviewMessage.bind(this),
          injectedJavaScript: this.state.injectedJs
        }}
        ref={browser => { this.browser = browser }}
      />
    )
  }
      //   <WebView
      //   onMessage={this.webviewMessage.bind(this)}
      //   style={styles.container}
      //   source={{uri: url}}
      //   injectedJavaScript={this.state.injectedJs}
      //   ref={webview => { this.webview = webview }}
      //   renderLoading={this.renderLoadingView}
      //   startInLoadingState
      // />
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
    console.log(e.nativeEvent.data)
    if (!e.nativeEvent.data || !e.nativeEvent.data.length === 0) {
      return
    }
    let payload = JSON.parse(e.nativeEvent.data)
    if (payload.method === 'getAccounts') {
      let callbackKey = payload.callbackKey
      let cmd = `
      console.log('React native is calling window.web3mobileCallbacks for ${payload.method} and key ${callbackKey}');
      window.web3mobileCallbacks['${payload.method}']['${callbackKey}'](null, ['${global.currentWallet.getAddressString()}']);
      delete window.web3mobileCallbacks['${payload.method}']['${callbackKey}']
      `
      console.log('injecting js: ' + cmd)
      this.browser.refs.webview.injectJavaScript(cmd)
    } else if (payload.method === 'signTransaction') {
      let callbackKey = payload.callbackKey
      let tx = payload.tx
      console.log('signing tx ' + JSON.stringify(tx))
      let signedTx = global.currentWallet.signTx(tx)
      let cmd = `
      console.log('React native is calling window.web3mobileCallbacks for ${payload.method} and key ${callbackKey}');
      window.web3mobileCallbacks['${payload.method}']['${callbackKey}'](null, '${signedTx}');
      delete window.web3mobileCallbacks['${payload.method}']['${callbackKey}']
      `
      console.log('injecting js: ' + cmd)
      this.browser.refs.webview.injectJavaScript(cmd)
    } else if (payload.method === 'approveTransaction') {
      let callbackKey = payload.callbackKey
      let tx = payload.tx
      // convert to ETH
      let value = tx.value
      if (value === '0x') {
        value = 0
      } else {
        value = global.ethFuncs.hexToDecimal(value)
        value = global.etherUnits.toEther(value, 'wei')
      }

      console.log('Asking user to approve tx ' + JSON.stringify(tx))

      // ask the user if they wanna approve it
      Alert.alert(
        'New Spending Request',
        'Request to send ' + value + ' ETH to ' + tx.to,
        [
          {
            text: 'Reject',
            onPress: () => {
              let cmd = `
                console.log('React native is calling window.web3mobileCallbacks for ${payload.method} and key ${callbackKey}');
                window.web3mobileCallbacks['${payload.method}']['${callbackKey}'](null, false);
                delete window.web3mobileCallbacks['${payload.method}']['${callbackKey}']
              `
              console.log('injecting js: ' + cmd)
              this.browser.refs.webview.injectJavaScript(cmd)
            },
            style: 'cancel'
          },
          {
            text: 'Approve',
            onPress: () => {
              let cmd = `
                console.log('React native is calling window.web3mobileCallbacks for ${payload.method} and key ${callbackKey}');
                window.web3mobileCallbacks['${payload.method}']['${callbackKey}'](null, true);
                delete window.web3mobileCallbacks['${payload.method}']['${callbackKey}']
              `
              console.log('injecting js: ' + cmd)
              this.browser.refs.webview.injectJavaScript(cmd)
            }
          }
        ]
      )
    }
  }
}

// hack needed because tetzelcoin and other sites already define postMesage
const patchPostMessageFunction = function () {
  var originalPostMessage = window.postMessage

  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }

  window.postMessage = patchedPostMessage
}

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  }
})
