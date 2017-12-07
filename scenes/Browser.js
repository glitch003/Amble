import React, { Component } from 'react'
import {
  StyleSheet,
  WebView,
  Alert,
  Platform,
  View,
  ActivityIndicator
} from 'react-native'
import theme from '../config/Theme'
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
      injectedJs: null
    }
    if (Platform.OS === 'ios') {
      // load the message handler up after the page loads
      this.state['injectedJs'] = 'window.web3_postMessageParent = window.webkit.messageHandlers.reactNative'
    }
  }
  componentWillMount () {
    // get web3 script to inject
    let url = global.sdkdConfig.sdkdHost + '/web3mobile/lib/web3.js'
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
      console.log('injecting web3Js response of length ' + response.length)
      this.setState({web3Js: response})
    })
    // let url = global.sdkdConfig.sdkdHost + '/web3mobile/lib/web3mobile.js'
    // console.log('getting url ' + url)
    // fetch(url)
    // .then((response) => {
    //   return response.text()
    // }).then(response => {
    //   // console.log('got response text: ', response)
    //   response = `${patchPostMessageJsCode}
    //   if (typeof web3mobile === 'undefined') {
    //   ` + '\n' + response
    //   response += `
    //       window.web3 = web3mobile.web3;
    //       web3.version.network = '${global.sdkdConfig.moduleConfig.wallet.networkVersion}';
    //       // start polling for blocks
    //       web3mobile.engine.start();
    //       console.log('loaded web3mobile');
    //     }
    //   `
    //   // let timer = setInterval(() => {
    //   //   if (this.browser && this.browser.refs.webview) {
    //   //     clearInterval(timer)
    //   //     console.log('injectJavaScript!')
    //   //     this.browser.refs.webview.injectJavaScript(response)
    //   //   }
    //   // }, 10)
    //   console.log('injecting response of length ' + response.length)
    //   this.setState({injectedJs: response})
    // })
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
    let url = global.sdkdConfig.sdkdHost + '/web3test.html'
    return (
      <Webbrowser
        url={url}
        hideHomeButton={false}
        hideToolbar={false}
        hideAddressBar={false}
        hideStatusBar={false}
        foregroundColor={theme.headerTintColor}
        backgroundColor={theme.headerStyle.backgroundColor}
        webviewProps={{
          onMessage: this.webviewMessage.bind(this),
          injectedJavaScript: this.state.injectedJs,
          injectJavaScriptBeforeLoad: this.state.web3Js
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
    console.log('webview message received')
    let payload = ''
    if (Platform.OS === 'ios') {
      console.log(e)
      payload = JSON.parse(e.body)
    } else {
      if (!e.nativeEvent.data || !e.nativeEvent.data.length === 0) {
        return
      }
      console.log(e.nativeEvent.data)
      payload = JSON.parse(e.nativeEvent.data)
    }
    if (payload.method === 'getAccounts') {
      let callbackKey = payload.callbackKey
      let cmd = `
      console.log('React native is calling window.web3mobileCallbacks for ${payload.method} and key ${callbackKey}');
      window.web3mobileCallbacks['${payload.method}']['${callbackKey}'](null, ['${global.currentWallet.getAddressString()}']);
      delete window.web3mobileCallbacks['${payload.method}']['${callbackKey}']
      `
      this.evalJs(cmd)
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
      this.evalJs(cmd)
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
              this.evalJs(cmd)
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
              this.evalJs(cmd)
            }
          }
        ]
      )
    }
  }
  evalJs (js) {
    console.log('injecting js: ' + js)
    if (Platform.OS === 'ios') {
      this.browser.refs.webview.evaluateJavaScript(js)
    } else {
      this.browser.refs.webview.injectJavaScript(js)
    }
  }
}

// hack needed because tetzelcoin and other sites already define postMesage
const patchPostMessageFunction = function () {
  console.log('patching post message function')
  var originalPostMessage = window.postMessage

  if (!originalPostMessage) {
    return
  }

  var patchedPostMessage = function (message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = function () {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  }

  window.postMessage = patchedPostMessage
  console.log('patch complete')
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
