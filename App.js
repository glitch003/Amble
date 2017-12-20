import './shim.js'
import React from 'react'
import {
  AsyncStorage,
  Alert,
  ActivityIndicator,
  View,
  StyleSheet,
  Text
} from 'react-native'

import SDKDConfig from '@sdkd/sdkd'
import SDKDWallet from '@sdkd/sdkd-wallet'

import { createRootNavigator } from './Router'

import theme from './config/Theme'

const SDKD_APIKEY = ''
SDKDConfig.init(SDKD_APIKEY)
global.currentWallet = new SDKDWallet({debug: true, gcmSenderId: '1048585096908', network: 'ropsten'})

// use this to debug the JS bridge
// require('MessageQueue').spy(true)

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  componentWillMount () {
    AsyncStorage.getItem('amble_user_email')
    .then(res => {
      console.log('async storage retrieved user email: ' + res)
      if (res) {
        global.currentWallet.activate({email: res})
        .then(() => {
          this.setState({ signedIn: true })
        })
        .catch(err => {
          console.log('err jsonify: ' + JSON.stringify(err))
          Alert.alert('Error', err.message)
          this.setState({ signedIn: false })
        })
      } else {
        this.setState({ signedIn: false })
      }
    })
    .catch(err => Alert.alert('An error occurred', err))
  }

  render () {
    const { signedIn } = this.state

    // If we haven't checked AsyncStorage yet, don't render anything
    if (signedIn === undefined) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            size='large'
          />
          <Text>Loading...</Text>
        </View>
      )
    }

    const Layout = createRootNavigator(signedIn)
    return <Layout />
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
