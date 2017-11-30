import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native'
import theme from '../config/Theme'

export default class Notifications extends React.Component {
  constructor () {
    super()
    this.state = {
      notifications: []
    }
  }
  componentWillMount () {
    global.currentWallet.getNotifications()
    .then(response => {
      this.setState({ notifications: response })
    })
  }
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
        <Text>
          Your notifications are {JSON.stringify(this.state.notifications)}
        </Text>
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})
