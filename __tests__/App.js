import 'react-native'
import React from 'react'
import MockAsyncStorage from 'mock-async-storage'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import App from '../App'
import Send from '../scenes/Send'
import Receive from '../scenes/Receive'

jest.mock('WebView', () => 'WebView')

jest.mock('NativeModules', () => {
  return {
    RNRandomBytes: {
      seed: undefined,
      randomBytes: jest.fn()
    }
  }
})

jest.mock('react-native-keychain', () => {
  let domains = {}
  return {
    setInternetCredentials: jest.fn((domain, email, password) => {
      domains[domain] = {
        email: email,
        password: password
      }
      return Promise.resolve()
    }),
    getInternetCredentials: jest.fn((domain) => {
      return new Promise((resolve, reject) => {
        if (domains[domain] === null || domains[domain] === undefined || domains[domain].email == null) {
          resolve(false)
        }
        resolve({username: domains[domain].email, password: domains[domain].password})
      })
    })
  }
})

jest.mock('react-native-camera', () => {
  return {}
})

jest.mock('react-native-push-notification', () => {
  return {
    configure: jest.fn()
  }
})

const mockStorage = () => {
  const mockImpl = new MockAsyncStorage()
  jest.mock('AsyncStorage', () => mockImpl)
}

mockStorage()

it('whole app renders correctly', () => {
  const tree = renderer.create(
    <App />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('send screen renders correctly', () => {
  const tree = renderer.create(
    <Send
      navigation={{
        state: {
          params: {}
        }
      }}
    />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})

it('receive screen renders correctly', () => {
  const tree = renderer.create(
    <Receive address='12345' />
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
