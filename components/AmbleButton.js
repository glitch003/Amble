import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { RoundButton } from 'react-native-button-component'
import theme from '../config/Theme'

export default class AmbleButton extends React.Component {
  render () {
    return (
      <View style={[styles.buttonHolder, this.props.style]}>
        <RoundButton
          textStyle={theme.buttonTextStyle}
          width={200}
          height={50}
          backgroundColors={theme.buttonBackgroundColors}
          gradientStart={{x: 0.5, y: 0}}
          gradientEnd={{x: 0.5, y: 1}}
          {...this.props.buttonProps}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  buttonHolder: {
    margin: 15
  }
})
