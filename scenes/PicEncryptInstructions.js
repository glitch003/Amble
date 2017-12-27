import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput
} from 'react-native'
import theme from '../config/Theme'
import AmbleButton from '../components/AmbleButton'

export default class PicEncryptInstructions extends React.Component {
  constructor () {
    super()
    this.state = {
      password: '',
      hidePassword: true
    }
  }
  componentWillMount () {

  }
  render () {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <Text>
            This tool lets you take a secure photo with your phone.  The photo is encrypted on your phone using the password supplied below, and the encrypted photo is sent as an attachment to your email.
          </Text>
          <Text style={{marginTop: 20}}>
            This is useful for things like 24 word seed phrases that you have written down in plain text.
          </Text>
          <Text style={{marginTop: 20}}>
            Enter the password you want to use to encrypt the photo:
          </Text>
          <TextInput
            style={[styles.textInput, {marginTop: 20, height: 40}]}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={this.state.hidePassword}
            underlineColorAndroid='transparent'
          />
          <AmbleButton
            buttonProps={{
              onPress: () => {
                this.setState(prevState => ({hidePassword: !prevState.hidePassword}))
              },
              text: this.state.hidePassword ? 'View Password' : 'Hide Password'
            }}
          />
          <AmbleButton
            buttonProps={{
              onPress: () => {
                Keyboard.dismiss()
                this.props.navigation.navigate('PicEncrypt', {password: this.state.password})
              },
              text: 'Submit'
            }}
          />
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor,
    padding: 20,
    flex: 1
  },
  textInput: {
    width: 280,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 13,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 6
  }
})
