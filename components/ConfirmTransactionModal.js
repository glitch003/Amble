
import React from 'react'
import {
  View,
  Slider,
  Text,
  TextInput,
  StyleSheet
} from 'react-native'

import theme from '../config/Theme'
import HorizontalLabel from '../components/HorizontalLabel'
import DismissKeyboardHOC from '../components/DismissKeyboardHOC'

import BN from 'bn.js'

import { RectangleButton } from 'react-native-button-component'
import Modal from 'react-native-modal'

const DismissKeyboardView = DismissKeyboardHOC(View)

export default class ConfirmTransactionModal extends React.Component {
  constructor (props) {
    super(props)
    console.log('ConfirmTransactionModal created with tx with gas price: ' + JSON.stringify(props.tx))
    this.state = {
      sliderValue: 0,
      tx: props.tx,
      usdPrice: global.currentWallet.usdPrice ? global.currentWallet.usdPrice : 0
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.tx !== this.props.tx) {
      this.setState({ tx: nextProps.tx })
    }
  }
  componentWillMount () {
    global.currentWallet.setBalance()
    .then(() => {
      this.setState({ usdPrice: global.currentWallet.usdPrice })
    })
  }
  render () {
    let eTx = new global.ethUtil.Tx(this.state.tx)

    // format and calculate stuff for display
    let txValue = eTx.value.toString('hex')
    txValue = global.currentWallet.formatBalance(txValue)
    let txValueUsd = eTx.value.toString('hex')
    txValueUsd = global.etherUnits.toFiat(new BN(txValueUsd, 16), 'wei', this.state.usdPrice)
    txValueUsd = parseFloat(txValueUsd).toFixed(2)

    let gasLimit = new BN(this.state.tx.gasLimit)
    let gasPrice = new BN(this.state.tx.gasPrice)
    let maxTxFee = gasLimit.mul(gasPrice)
    // console.log('multilying gas limit ' + gasLimit + ' with gas price ' + gasPrice + ' and result is ' + maxTxFee)
    // convert fee from gwei to wei
    maxTxFee = new BN(global.etherUnits.toWei(maxTxFee, 'gwei'))
    let maxTotal = maxTxFee.add(new BN(eTx.value))
    maxTxFee = maxTxFee.toString('hex')
    let maxTxFeeUsd = new BN(maxTxFee, 16)
    maxTxFeeUsd = global.etherUnits.toFiat(maxTxFeeUsd, 'wei', this.state.usdPrice)
    maxTxFeeUsd = parseFloat(maxTxFeeUsd).toFixed(2)
    maxTxFee = global.currentWallet.formatBalance(maxTxFee)

    maxTotal = maxTotal.toString('hex')
    let maxTotalUsd = maxTotal
    maxTotalUsd = global.etherUnits.toFiat(new BN(maxTotalUsd, 16), 'wei', this.state.usdPrice)
    maxTotalUsd = parseFloat(maxTotalUsd).toFixed(2)
    maxTotal = global.currentWallet.formatBalance(maxTotal)

    return (
      <Modal key='modal' isVisible={this.props.isVisible}>
        <DismissKeyboardView>
          <View style={styles.modalContent}>
            <Text
              style={{fontSize: 20}}
            >
              Confirm Transaction
            </Text>
            <HorizontalLabel
              label='From'
              style={{marginTop: 20}}
            >
              <Text
                ellipsizeMode='middle'
                numberOfLines={1}
                style={{flex: 1}}
              >
                {this.props.fromAddress}
              </Text>
            </HorizontalLabel>
            <HorizontalLabel label='To'>
              <Text
                ellipsizeMode='middle'
                numberOfLines={1}
                style={{flex: 1}}
              >
                {'0x' + eTx.to.toString('hex')}
              </Text>
            </HorizontalLabel>
            <HorizontalLabel label='Amount'>
              <Text
                style={{flex: 1, textAlign: 'right'}}
                adjustsFontSizeToFit
                allowFontScaling
                numberOfLines={1}
              >
                {txValue}
              </Text>
            </HorizontalLabel>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1, textAlign: 'right'}}>
                {txValueUsd} USD
              </Text>
            </View>
            <HorizontalLabel
              label='Gas Limit'
              labelStyle={{paddingTop: 4}}
            >
              <TextInput
                style={styles.textInput}
                onChangeText={(gasLimit) => {
                  let tx = this.state.tx
                  tx.gasLimit = gasLimit
                  this.setState({tx})
                }}
                value={this.state.tx.gasLimit}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='numeric'
                underlineColorAndroid='transparent'
              />
              <Text style={styles.rightLabel}>UNITS</Text>
            </HorizontalLabel>
            <HorizontalLabel
              label='Gas Price'
              labelStyle={{paddingTop: 4}}
            >
              <TextInput
                style={styles.textInput}
                onChangeText={(gasPrice) => {
                  let tx = this.state.tx
                  tx.gasPrice = gasPrice
                  this.setState({tx})
                }}
                value={this.state.tx.gasPrice}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='numeric'
                underlineColorAndroid='transparent'
              />
              <Text style={styles.rightLabel}>GWEI</Text>
            </HorizontalLabel>
            <HorizontalLabel label='Max Tx Fee'>
              <Text
                style={{flex: 1, textAlign: 'right'}}
                adjustsFontSizeToFit
                allowFontScaling
                numberOfLines={1}
              >
                {maxTxFee}
              </Text>
            </HorizontalLabel>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1, textAlign: 'right'}}>
                {maxTxFeeUsd} USD
              </Text>
            </View>
            <HorizontalLabel label='Max Total'>
              <Text
                style={{flex: 1, textAlign: 'right'}}
                adjustsFontSizeToFit
                allowFontScaling
                numberOfLines={1}
              >
                {maxTotal}
              </Text>
            </HorizontalLabel>
            <View style={{flexDirection: 'row'}}>
              <Text style={{flex: 1, textAlign: 'right'}}>
                {maxTotalUsd} USD
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{flex: 1, textAlign: 'right'}}>
                Data Included: {eTx.raw[5].length} bytes
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 20}}>
              <RectangleButton
                textStyle={theme.buttonTextStyle}
                width={150}
                height={40}
                onPress={() => this.props.onPressReject(this.state.tx)}
                backgroundColors={theme.buttonBackgroundColors}
                gradientStart={{x: 0, y: 0}}
                gradientEnd={{x: 1, y: 1}}
                buttonStyle={{borderRadius: 5}}
                text='Reject'
              />
            </View>
            <Text style={{
              flexDirection: 'row',
              textAlign: 'center',
              marginTop: 20,
              width: '100%',
              color: this.state.sliderValue === 0 ? 'black' : 'rgba(0,0,0,' + this.state.sliderValue + ')'
            }}>
              { this.state.sliderValue === 0
                ? 'Slide to the right to submit'
                : this.state.sliderValue === 1
                  ? 'Submitted!'
                  : 'Submit transaction...'
              }
            </Text>
            <Slider
              style={{width: '100%', height: 40}}
              value={this.state.sliderValue}
              onSlidingComplete={sliderValue => {
                if (sliderValue !== 1) {
                  // hacky animation code to return slider to 0
                  let timer = setInterval(() => {
                    if (this.state.sliderValue <= 0.01) {
                      clearInterval(timer)
                      this.setState({sliderValue: 0})
                    }
                    this.setState({
                      sliderValue: this.state.sliderValue * 0.9
                    })
                  }, 10)
                }
              }}
              onValueChange={sliderValue => {
                this.setState({ sliderValue })
                if (sliderValue === 1) {
                  // send the txn
                  console.log('slid all the way to the right')
                  this.props.onPressSubmit(this.state.tx)
                }
              }}
            />
          </View>
        </DismissKeyboardView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.sceneBackgroundColor
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    height: 500,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  textInput: {
    height: 26,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 13,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 6,
    textAlign: 'right'
  },
  rightLabel: {
    paddingTop: 4,
    width: 50,
    textAlign: 'right'
  }
})
