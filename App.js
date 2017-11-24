import './shim.js'
import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'

import { DrawerNavigator, StackNavigator } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Home from './scenes/Home'
import Notifications from './scenes/Notifications'
import PicEncrypt from './scenes/PicEncrypt'
import Transactions from './scenes/Transactions'
import Receive from './scenes/Receive'

// use this to debug the JS bridge
// require('MessageQueue').spy(true)

const headerLeft = (navigation) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DrawerToggle')}>
      <Ionicons
        name='md-menu'
        size={20}
        style={{paddingLeft: 10}}
      />
    </TouchableOpacity>
  )
}

const headerRight = (navigation) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('DrawerToggle')}>
      <Ionicons
        name='md-qr-scanner'
        size={20}
        style={{paddingRight: 10}}
      />
    </TouchableOpacity>
  )
}

const homeScreenStack = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Amble',
        drawerLabel: 'Amble',
        drawerIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={20}
            style={{ color: tintColor }}
          />
        ),
        headerLeft: headerLeft(navigation),
        headerRight: headerRight(navigation)
      })
    },
    Receive: {
      screen: Receive,
      navigationOptions: ({ navigation }) => ({
        headerMode: 'screen',
        headerTitle: 'Receive'
      })
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: 'Home',
      headerMode: 'screen',
      drawerLabel: 'Amble',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
      headerStyle: {backgroundColor: '#63B4D1'},
      headerTintColor: '#FFFFFF'
    })
  }
)

const notificationScreenStack = StackNavigator(
  {
    Notifications: {
      screen: Notifications
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: 'Notifications',
      headerMode: 'screen',
      headerTitle: 'Notifications',
      drawerLabel: 'Notifications',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-notifications' : 'ios-notifications-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
      headerLeft: headerLeft(navigation)
    })
  }
)

const picEncryptStack = StackNavigator(
  {
    PicEncrypt: {
      screen: PicEncrypt
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: 'PicEncrypt',
      headerMode: 'screen',
      headerTitle: 'Encrypt Photo',
      drawerLabel: 'Encrypt Photo',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-camera' : 'ios-camera-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
      headerLeft: headerLeft(navigation)
    })
  }
)

const transactionsStack = StackNavigator(
  {
    Transactions: {
      screen: Transactions
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      initialRouteName: 'Transactions',
      headerMode: 'screen',
      headerTitle: 'Transactions',
      drawerLabel: 'Transactions',
      drawerIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-filing' : 'ios-filing-outline'}
          size={20}
          style={{ color: tintColor }}
        />
      ),
      headerLeft: headerLeft(navigation)
    })
  }
)

const App = DrawerNavigator(
  {
    Home: {
      screen: homeScreenStack
    },
    Notifications: {
      screen: notificationScreenStack
    },
    PicEncrypt: {
      screen: picEncryptStack
    },
    Transactions: {
      screen: transactionsStack
    }
  }
)

export default App
