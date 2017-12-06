import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import theme from '../config/Theme'

export default class Receive extends React.Component {
  // constructor () {
  //   super()
  //   this.state = {
  //     notifications: []
  //   }
  // }
  // componentWillMount () {
  //   global.currentWallet.getNotifications()
  //   .then(response => {
  //     this.setState({ notifications: response })
  //   })
  // }
  render () {
    // use this snippet as an example of how you can recover a user's account from a QR code that was sent to their email
    // if (this.state.recovering) {
    //   return this.state.wallet.renderRecoveryQRScanner(() => {
    //     console.log('wallet has been recovered')
    //     console.log('address is ' + this.state.wallet.getAddressString())
    //     this.setState({recovering: false})
    //     this.state.wallet.getBalance()
    //     .then(balance => this.setState({balance}))
    //   })
    // }
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Clipboard.setString(global.currentWallet.getAddressString())}>
          <Text style={styles.yourAddress}>
            Your address:
          </Text>
          <Text
            style={styles.welcome}
            adjustsFontSizeToFit
            allowFontScaling
            minimumFontScale={1}
            numberOfLines={1}>
            {global.currentWallet.getAddressString()}
          </Text>
        </TouchableOpacity>
        <View style={styles.qrCode}>
          {global.currentWallet.renderAddressQRCode()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  },
  welcome: {
    textAlign: 'center'
  },
  yourAddress: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  qrCode: {
    marginTop: 20
  }
})
