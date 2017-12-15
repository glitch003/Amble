import React from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

export default class HorizontalLabel extends React.Component {
  render () {
    return (
      <View style={[styles.labelContainer, this.props.style]}>
        <View style={[styles.label, this.props.labelStyle]}>
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
    marginTop: 10
  },
  label: {
    alignItems: 'flex-start',
    width: 80
  }
})
