import React from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { RectangleButton } from 'react-native-button-component'
import theme from '../config/Theme'

export default class AmbleButton extends React.Component {
  render () {
    return (
      <View style={[styles.buttonHolder, this.props.style]}>
        <RectangleButton
          textStyle={theme.buttonTextStyle}
          width={150}
          height={50}
          backgroundColors={theme.buttonBackgroundColors}
          gradientStart={{x: 0, y: 0}}
          gradientEnd={{x: 1, y: 1}}
          buttonStyle={{borderRadius: 5}}
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
