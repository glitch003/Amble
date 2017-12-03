import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AsyncStorage,
  Platform
} from 'react-native'

import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class SignUp extends React.Component {
  constructor () {
    super()
    this.state = {
      email: 'cvcassano+' + Platform.OS + '@gmail.com',
      buttonState: 'submit'
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.introText}>Enter your email address to sign up.  Your email will only be used to send you a recovery QR code, which can be used to recover your private key if you lose or break your phone.
        </Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          autoCapitalize='none'
          autoCorrect={false}
          keyboardType='email-address'
          underlineColorAndroid='transparent'
          placeholder='Email address'
        />
        <AmbleButton
          style={styles.button}
          buttonProps={{
            buttonState: this.state.buttonState,
            states: {
              submit: {
                onPress: () => {
                  this.setState({ buttonState: 'submitting' })
                  this.signUpUser()
                },
                text: 'Sign Up'
              },
              submitting: {
                onPress: () => {
                  this.setState({ buttonState: 'submit' })
                },
                spinner: true,
                text: 'Sending...'
              }
            }
          }}
        />
        <Text style={styles.recoverText}>Already signed up?  Recover your existing account.
        </Text>
        <AmbleButton
          buttonProps={{
            onPress: () => {
              this.props.navigation.navigate('Send')
            },
            text: 'Recover'
          }}
          style={{marginTop: 20}}
        />
      </View>
    )
  }

  signUpUser () {
    global.currentWallet.activate({email: this.state.email})
    .then(() => {
      // save user's email and move to next screen
      AsyncStorage.setItem('amble_user_email', this.state.email)
      this.props.navigation.navigate('SignedIn')
    })
    .catch(err => { throw new Error(err) })
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
