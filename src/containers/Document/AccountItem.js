import React, {PureComponent, Fragment} from 'react';
import {
  Text, Image, View,
  ScrollView, BackHandler, TouchableWithoutFeedback,
  ActivityIndicator,
  Slider
} from 'react-native';

import {parseMoney} from "../../utils/text/index";

import CustomStyleSheet from "../../resources/customStyleSheet";

const HEIGHT = 65;


export default class CardInputAccount extends PureComponent {
  static defaultProps = {
    maxLength: 80,
    logo: '',
    code: 'PLCARD',
    contractNumber: '',
    accountNumber: '',
    balance: '',
    currency: '',

    onPress: null
  };

  render() {
    return (
      this.props.onPress ?
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          {this.renderContent()}
        </TouchableWithoutFeedback>
        :
        this.renderContent()
    );
  }

  renderContent() {
    const label = this.props.label.length > this.props.maxLength ?
      (this.props.label.slice(0, this.props.maxLength) + '...') :
      this.props.label;
    return (
      <View style={[styles.itemContainer, this.props.imageContainerStyle]}>
        <View style={styles.imageContainer}>
          <Image style={[styles.imageStyle, this.props.imageStyle]}
                 source={{uri: this.props.logo === '' ? 'https://test.unisab.ru/public/image/products/none.png' : this.props.logo }}/>
        </View>
        <View style={[styles.cardTextContainer, this.props.cardTextContainerStyle]}>
          <Text style={styles.cardNameText}>
            {label}
          </Text>
          <Text style={styles.cardNumberText}>
            {(this.props.code === 'PLCARD' && !this.props.showAccountNumberOnCard)? this.props.contractNumber : this.props.accountNumber}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>
            {parseMoney(this.props.balance, this.props.currency)}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = CustomStyleSheet({
  itemContainer: {
    height: HEIGHT,
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 40,
    width: 60,
    borderRadius: 2,
    marginRight: 10
  },
  cardTextContainer: {
    flex: 5,
    backgroundColor: 'transparent'
  },
  cardNameText: {
    fontSize: 11,
    flexWrap: 'nowrap'
  },
  cardNumberText: {
    fontSize: 10,
    color: '#9e9e9e'
  },
  balanceContainer: {
    flex: 4,
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  balanceText: {
    fontSize: 14,
    flexWrap: 'nowrap'
  }
});
