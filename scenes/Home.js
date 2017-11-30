import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image
} from 'react-native'

import SDKDConfig from '@sdkd/sdkd'
import SDKDWallet from '@sdkd/sdkd-wallet'

const SDKD_APIKEY = ''

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
})

export default class Home extends React.Component {
  constructor () {
    super()
    SDKDConfig.init(SDKD_APIKEY)
    let w = new SDKDWallet({debug: true, gcmSenderId: '1048585096908'})
    global.currentWallet = w
    this.state = {
      wallet: w,
      balance: 0,
      scanning: false,
      refreshing: false
      // recovering: true
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps: ' + JSON.stringify(nextProps))
  }
  componentWillMount () {
    this.state.wallet.activate({email: 'cvcassano+' + Platform.OS + '@gmail.com'})
    .then(() => {
      // check balance
      this.checkBalance()
    })
    .catch(err => { throw new Error(err) })
  }
  componentDidMount () {
    this.props.navigation.setParams({ toggleScanner: this.toggleScanner.bind(this) })
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
    if (this.state.scanning) {
      return this.state.wallet.renderSendTxQRScanner((data) => {
        console.log('renderSendTxQRScanner callback data: ' + JSON.stringify(data))
        this.setState({scanning: false})
        this.props.navigation.navigate('Send', {txData: data})
      })
    }
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
      >
        <Text style={styles.balance}>
          Balance: {this.state.wallet.etherUnits.toEther(this.state.balance, 'wei')} ETH
        </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Send')}>
          <Image style={styles.buttons} source={require('../images/Send.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Receive')}>
          <Image style={styles.buttons} source={require('../images/Recieve.png')} />
        </TouchableOpacity>
      </ScrollView>
    )
  }
  toggleScanner () {
    this.setState({scanning: !this.state.scanning})
  }
  onRefresh () {
    this.setState({refreshing: true})
    this.checkBalance()
    .then(() => {
      this.setState({refreshing: false})
    })
  }
  checkBalance () {
    console.log('[Amble]: checking balance')
    return new Promise((resolve, reject) => {
      this.state.wallet.getBalance()
      .then(balance => {
        console.log('[Amble]: setting balance to ' + balance)
        this.setState({balance})
        resolve(balance)
      })
      .catch(err => reject(err))
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#AFD2E9'
  },
  balance: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    margin: 10,
    marginTop: 30
  },
  buttons: {
    margin: 10
  }
})
