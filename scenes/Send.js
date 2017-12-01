import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  Alert
} from 'react-native'
import { NavigationActions } from 'react-navigation'
import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class Send extends React.Component {
  constructor () {
    super()
    this.state = {
      to: '',
      value: '',
      data: '',
      buttonState: 'send'
    }
  }

  componentDidMount () {
    console.log('mounting send: ' + JSON.stringify(this.props.navigation.state.params))
    if (this.props.navigation.state.params && this.props.navigation.state.params.txData) {
      const txData = this.props.navigation.state.params.txData
      this.setState({
        to: txData.to,
        value: String(txData.value),
        data: txData.data
      })
    }
  }

  renderDataView () {
    return (
      <View style={styles.horizontalContainer}>
        <Text style={styles.formLabel}>
          Data:
        </Text>
        <TextInput
          style={{height: 40, width: 200, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white'}}
          onChangeText={(data) => this.setState({data})}
          value={this.state.data}
        />
      </View>
    )
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
        <WithLabel label='To' style={{marginTop: 30}}>
          <TextInput
            style={[styles.textInput, {height: 40}]}
            onChangeText={(to) => this.setState({to})}
            value={this.state.to}
            autoCapitalize='none'
            autoCorrect={false}
            multiline
            underlineColorAndroid='transparent'
          />
        </WithLabel>

        <WithLabel label='Value (ETH)'>
          <TextInput
            style={styles.textInput}
            onChangeText={(value) => this.setState({value})}
            value={this.state.value}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='decimal-pad'
            underlineColorAndroid='transparent'
          />
        </WithLabel>

        {this.state.data === '' ? null : this.renderDataView()}

        <AmbleButton
          buttonProps={{
            buttonState: this.state.buttonState,
            states: {
              send: {
                onPress: () => {
                  this.setState({ buttonState: 'sending' })
                  this.sendTransaction()
                },
                text: 'Send'
              },
              sending: {
                onPress: () => {
                  this.setState({ buttonState: 'send' })
                },
                spinner: true,
                text: 'Sending...'
              }
            }
          }}
        />
      </View>
    )
  }

  sendTransaction () {
    // convert eth to wei because that's what sendTx takes
    let weiVal = global.etherUnits.toWei(this.state.value, 'ether')
    global.currentWallet.sendTx(this.state.to, weiVal, this.state.data)
    .then((result) => {
      // tell the user the txn was sent and offer them an option to view on etherscan
      Alert.alert(
        'Success',
        'Your transaction was sent!',
        [
          {
            text: 'Ok',
            onPress: () => {
              // pop to home
              this.props.navigation.dispatch(NavigationActions.back())
            },
            style: 'cancel'
          },
          {
            text: 'View on Etherscan',
            onPress: () => {
              // take the user to etherscan with tx id of result
              let url = global.sdkdConfig.moduleConfig.wallet.etherscanHost + '/tx/' + result
              // pop to home after opening link
              Linking.openURL(url)
              .then(result => {
                this.props.navigation.dispatch(NavigationActions.back())
              })
              .catch(err => console.error('An error occurred', err))
            }
          }
        ]
      )
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
  welcome: {
    textAlign: 'center'
  },
  qrCode: {
    marginTop: 20
  },
  labelContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    height: 40
  },
  label: {
    width: 80,
    alignItems: 'flex-end',
    marginRight: 10,
    paddingTop: 2,
    height: 40
  },
  textInput: {
    height: 26,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 13,
    padding: 4,
    backgroundColor: 'white'
  }
})

class WithLabel extends React.Component {
  render () {
    return (
      <View style={[styles.labelContainer, this.props.style]}>
        <View style={styles.label}>
          <Text>{this.props.label}</Text>
        </View>
        {this.props.children}
      </View>
    )
  }
}
