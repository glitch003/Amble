import React from 'react'
import {
  TouchableOpacity
} from 'react-native'

import { StackNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import SignUp from './scenes/SignUp'

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
    }
  }
)

export default SignedOut
