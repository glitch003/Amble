import React, { Component } from 'react'
import {
  StyleSheet,
  WebView,
  ActivityIndicator,
  View
} from 'react-native'
import theme from '../config/Theme'

export default class Transactions extends Component {
  constructor () {
    super()
    this.state = {
      etherscanUrl: global.sdkdConfig.moduleConfig.wallet.etherscanHost + '/txs?a=' + global.currentWallet.getAddressString()
    }
  }
  render () {
    return (
      <WebView
        style={styles.container}
        source={{uri: this.state.etherscanUrl}}
        renderLoading={this.renderLoadingView}
        startInLoadingState
      />
    )
  }
  renderLoadingView () {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size='large'
        />
      </View>
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
