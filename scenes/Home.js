import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
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
      balance: 0
      // recovering: true
    }
  }
  componentWillMount () {
    this.state.wallet.activate({email: 'cvcassano+' + Platform.OS + '@gmail.com'})
    .then(() => {
      // check balance
      console.log('[SDKD]: checking balance')
      return this.state.wallet.getBalance()
    })
    .then(balance => {
      console.log('[SDKD]: setting balance')
      this.setState({balance})
      // if(balance > 0){
      //   // try sending tx
      //   return w.sendTx('0x164f64dac95870b7b1261e233221778b1186102a', 100);
      // }
    })
    // .then(txData => console.log(txData))
    .catch(err => { throw new Error(err) })
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
        <Text style={styles.welcome}>
          Balance: {this.state.wallet.etherUnits.toEther(this.state.balance, 'wei')} ETH
        </Text>
        <TouchableOpacity>
          <Image style={styles.buttons} source={require('../images/Send.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Receive')}>
          <Image style={styles.buttons} source={require('../images/Recieve.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  buttons: {
    margin: 10
  }
})
