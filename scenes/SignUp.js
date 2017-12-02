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

import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class SignUp extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text>Enter your email address to sign up.  Your email will only be used to send you a recovery QR code, which can be used to recover your private key if you lose or break your phone.  
        <AmbleButton
          buttonProps={{
            buttonState: this.state.buttonState,
            states: {
              send: {
                onPress: () => {
                  this.setState({ buttonState: 'sending' })
                  this.sendTransaction()
                },
                text: 'Sign Up'
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  }
})
