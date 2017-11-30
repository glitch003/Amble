import React, { Component } from 'react'
import {
  StyleSheet,
  WebView,
  View
} from 'react-native'
import theme from '../config/Theme'

export default class Transactions extends React.Component {
  render () {
    let etherscanUrl = global.sdkdConfig.moduleConfig.wallet.etherscanHost + '/txs?a=' + global.currentWallet.getAddressString()
    return (
      <WebView
        style={styles.container}
        source={{uri: etherscanUrl}}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  }
})
