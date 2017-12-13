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

export default class Import extends React.Component {
  constructor () {
    super()
    this.state = {
      privateKey: '',
      email: ''
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.introText}>Enter your email address to import your key.  Your private key will only be stored locally on your device.
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
        <Text style={styles.introText}>Enter your private key</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(privateKey) => this.setState({privateKey})}
          value={this.state.privateKey}
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid='transparent'
          placeholder='Private key'
        />
        <AmbleButton
          buttonProps={{
            onPress: this.importKey.bind(this),
            text: 'Import key'
          }}
          style={{marginTop: 20}}
        />
      </View>
    )
  }

  importKey () {
    global.currentWallet.activateFromPrivateKey(this.state.email, this.state.privateKey)
    .then(() => {
      AsyncStorage.setItem('amble_user_email', global.currentWallet.email)
      this.props.navigation.navigate('SignedIn')
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
