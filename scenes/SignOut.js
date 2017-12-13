import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  Alert
} from 'react-native'

import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class SignOut extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.introText}>Are you sure you want to sign out?</Text>
        <AmbleButton
          buttonProps={{
            onPress: this.signOutUser.bind(this),
            text: 'Sign Out'
          }}
          style={{marginTop: 20}}
        />
      </View>
    )
  }

  signOutUser () {
    AsyncStorage.removeItem('amble_user_email')
    global.currentWallet.reset()
    this.props.navigation.navigate('SignedOut')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  },
  introText: {
    marginTop: 50
  }
})
