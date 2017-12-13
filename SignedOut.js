import React from 'react'
import {
  TouchableOpacity
} from 'react-native'

import { StackNavigator } from 'react-navigation'

import SignUp from './scenes/SignUp'
import Recover from './scenes/Recover'
import Import from './scenes/Import'

import theme from './config/Theme'

const SignedOut = StackNavigator(
  {
    SignUp: {
      screen: SignUp,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Amble',
        headerStyle: theme.headerStyle,
        headerTintColor: theme.headerTintColor
      })
    },
    Recover: {
      screen: Recover,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Recover',
        headerStyle: theme.headerStyle,
        headerTintColor: theme.headerTintColor
      })
    },
    Import: {
      screen: Import,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Import private key',
        headerStyle: theme.headerStyle,
        headerTintColor: theme.headerTintColor
      })
    }
  }
)

export default SignedOut
