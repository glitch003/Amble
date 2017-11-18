import './shim.js'
import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'

import { DrawerNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Home from './scenes/Home'
import Notifications from './scenes/Notifications'

// use this to debug the JS bridge
// require('MessageQueue').spy(true)

const App = DrawerNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      drawerLabel: 'Home',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      )
    }
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      drawerLabel: 'Notifications',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      )
    }
  }
})

export default App
