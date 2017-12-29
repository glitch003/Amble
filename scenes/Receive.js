import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard
} from 'react-native'
import theme from '../config/Theme'

export default class Receive extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      addressString: props.address || global.currentWallet.getAddressString()
    }
  }
  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => Clipboard.setString(this.state.addressString)}>
          <Text style={styles.yourAddress}>
            Your address:
          </Text>
          <Text
            style={styles.welcome}
            adjustsFontSizeToFit
            allowFontScaling
            minimumFontScale={1}
            numberOfLines={1}>
            {this.state.addressString}
          </Text>
        </TouchableOpacity>
        <View style={styles.qrCode}>
          {global.currentWallet.renderAddressQRCode(this.state.addressString)}
        </View>
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
  },
  welcome: {
    textAlign: 'center'
  },
  yourAddress: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  qrCode: {
    marginTop: 20
  }
})
