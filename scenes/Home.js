import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native'

import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class Home extends React.Component {
  constructor () {
    super()
    this.state = {
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
    this.checkBalance()
  }
  componentDidMount () {
    console.log('nav state: ' + JSON.stringify(this.props.navigation.state))
    this.props.navigation.setParams({ toggleScanner: this.toggleScanner.bind(this) })
  }
  render () {
    // use this snippet as an example of how you can recover a user's account from a QR code that was sent to their email
    // if (this.state.recovering) {
    //   return global.currentWallet.renderRecoveryQRScanner(() => {
    //     console.log('wallet has been recovered')
    //     console.log('address is ' + global.currentWallet.getAddressString())
    //     this.setState({recovering: false})
    //     global.currentWallet.getBalance()
    //     .then(balance => this.setState({balance}))
    //   })
    // }
    if (this.state.scanning) {
      return global.currentWallet.renderSendTxQRScanner((data) => {
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
          Balance: {global.currentWallet.etherUnits.toEther(this.state.balance, 'wei')} ETH
        </Text>
        <AmbleButton
          buttonProps={{
            onPress: () => this.props.navigation.navigate('Send'),
            text: 'Send'
          }}
          style={{marginTop: 50}}
        />
        <AmbleButton
          buttonProps={{
            onPress: () => this.props.navigation.navigate('Receive'),
            text: 'Receive'
          }}
        />
      </ScrollView>
    )
  }
  toggleScanner () {
    this.setState({scanning: !this.state.scanning})
  }
  onRefresh () {
    this.setState({refreshing: true})
    // check for any pushes, async
    global.currentWallet.checkForActionableNotifications()
    this.checkBalance()
    .then(() => {
      this.setState({refreshing: false})
    })
  }
  checkBalance () {
    console.log('[Amble]: checking balance')
    return new Promise((resolve, reject) => {
      global.currentWallet.getBalance()
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
    backgroundColor: theme.sceneBackgroundColor
  },
  balance: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    margin: 10,
    marginTop: 30
  }
})
