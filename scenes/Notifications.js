import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  TouchableHighlight,
  Alert
} from 'react-native'
import theme from '../config/Theme'

export default class Notifications extends React.Component {
  constructor () {
    super()
    this.state = {
      notifications: [],
      refreshing: false
    }
  }
  componentWillMount () {
    this.getNotifications()
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
      <FlatList
        contentContainerStyle={styles.container}
        data={this.state.notifications}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh.bind(this)}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => {
          console.log('rendering ' + JSON.stringify(item))
          return (
            <NotificationListItem
              item={item}
              onPress={(item) => {
                console.log('list item pressed: ' + JSON.stringify(item))
                // take the user to etherscan with tx id if type is txn
                if (item.class_name !== 'EthereumTx') {
                  return
                }
                if (item.status !== 'signed') {
                  // open an alert showing them the tx stuff
                  let value = item.tx_params.value
                  if (value === '0x') {
                    value = 0
                  } else {
                    value = global.ethFuncs.hexToDecimal(value)
                    value = global.etherUnits.toEther(value, 'wei')
                  }
                  Alert.alert('Transaction details', value + ' ETH to ' + item.tx_params.to)
                  return
                }
                let eTx = new global.ethUtil.Tx(item.signed_tx)
                let txHash = '0x' + eTx.hash(true).toString('hex')
                console.log('txHash is ' + txHash)
                let url = global.sdkdConfig.moduleConfig.wallet.etherscanHost + '/tx/' + txHash
                Linking.openURL(url)
                .catch(err => console.error('An error occurred', err))
              }}
            />
          )
        }}
      />
    )
  }
  onRefresh () {
    this.setState({refreshing: true})
    // check for any pushes, async
    this.getNotifications()
  }
  getNotifications () {
    global.currentWallet.getNotifications()
    .then(response => {
      this.setState({ notifications: response, refreshing: false })
    })
  }
}

class NotificationListItem extends React.Component {
  render () {
    return (
      <TouchableHighlight underlayColor='#ddd' onPress={this.props.onPress.bind(this, this.props.item)}>
        <View style={styles.item}>
          <Text style={styles.label}>{this.classNameToHumanName() + ' at ' + this.props.item.created_at}</Text>
          <Text style={styles.label}>{this.itemDetails()}</Text>
        </View>
      </TouchableHighlight>
    )
  }
  itemDetails () {
    return 'Status: ' + this.props.item.status
  }
  classNameToHumanName () {
    const nameMap = {
      EthereumTx: 'ETH Transaction',
      RemotePairingRequest: 'Pairing Request'
    }
    return nameMap[this.props.item.class_name]
  }
}

const styles = StyleSheet.create({
  container: {
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
  },
  item: {
    height: 80,
    justifyContent: 'center',
    paddingLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#000',
  },
  label: {
    fontSize: 16,
  }
})
