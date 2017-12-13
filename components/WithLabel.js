import React from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

export default class WithLabel extends React.Component {
  render () {
    return (
      <View style={[styles.labelContainer, this.props.style]}>
        <View style={styles.label}>
          <Text>{this.props.label}</Text>
        </View>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    height: 40
  },
  label: {
    width: 80,
    alignItems: 'flex-end',
    marginRight: 10,
    paddingTop: 2,
    height: 40
  }
})
