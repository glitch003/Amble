import React from 'react'
import {
  StyleSheet,
  AsyncStorage,
  Alert
} from 'react-native'

import theme from '../config/Theme'

export default class Recover extends React.Component {
  constructor () {
    super()
    this.state = {
      recoveryScanner: null
    }
  }
  componentDidMount () {
    global.currentWallet.renderRecoveryQRScanner(this.walletReady.bind(this))
    .then((recoveryComponent) => {
      this.setState({recoveryScanner: recoveryComponent})
    })
    .catch(err => Alert.alert('Error', err.message))
  }
  render () {
    return this.state.recoveryScanner
  }

  walletReady () {
    console.log('wallet ready, yay!')
    AsyncStorage.setItem('amble_user_email', global.currentWallet.email)
    this.props.navigation.navigate('SignedIn')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  },
  textInput: {
    width: 300,
    height: 30,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 13,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 6
  },
  introText: {
    marginHorizontal: 20,
    marginVertical: 40
  },
  recoverText: {
    marginHorizontal: 20,
    marginTop: 60
  },
  button: {
    marginTop: 40
  }
})
