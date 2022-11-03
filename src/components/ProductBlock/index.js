import React from 'react';
import PropTypes from 'prop-types';
import {parseMoney} from '../../utils/text';
import { Image, View} from 'react-native';
import Touchable from '../../components/Touchable';
import moment from 'moment';
import {TextRenderer as Text} from '../../components/TextRenderer';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles';


export default class ProductBlock extends React.Component {
  static propTypes = {
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    let productRenderer;

    switch (this.props.cardType) {
      case 'cards':
        productRenderer = this._cardRenderer();
        break;
      case 'deposits':
        productRenderer = this._depositRenderer();
        break;
      case 'accounts':
        productRenderer = this._accountRenderer();
        break;
      case 'credits':
        productRenderer = this._creditRenderer();
        break;
      default:
        return <Text>Error</Text>
    }

    return (
      <Touchable
        onPress={() => {
          this.props.onPress(this.props.product)
        }}
      >
        {productRenderer}
      </Touchable>
    )
  }

  _cardRenderer() {
    const expireCardText = this.props.product.expireCardText;
    const infoStyle = {...styles.info};
    if (expireCardText) infoStyle.color = 'red';
    const balance = parseMoney(this.props.product.balance, this.props.product.currency, true);
    const stylesContainer = [styles.container];
    if (this.props.product.isAdditionalCard) {
      stylesContainer.push({paddingLeft: 65});
    }
    return (
      <View style={[styles.column, {backgroundColor: '#fff'}, this.props.styles]}>
        <View style={stylesContainer}>

          {expireCardText ? (
            <View style={{position: 'absolute'}}>
              <Image source={require('../../../assets/icons/warning_red.png')}
                     style={{height: 16, width: 16, marginLeft: 10,}}/>
            </View>
          ) : null}

          {this.props.product.isAdditionalCard && (
            <View style={{position: 'absolute', top: 4,}}>
              <Image source={require('../../../assets/icons/additionalCardIndicator.png')}
                     style={{height: 20, width: 20, marginLeft: 35,}}/>
            </View>
          )}

          <View style={{flexShrink: 1,}}>
            <Text style={styles.description} numberOfLines={2}>
              {this.props.product.description}
            </Text>
            <View style={{ alignItems: 'flex-start', flexDirection: 'column',  }}>
              <Text style={infoStyle}>
                {this.props.product.information}
              </Text>
              {expireCardText ? (
                <Text style={infoStyle}>
                  {expireCardText}
                </Text>
              ): null}
            </View>
          </View>

          <View>
            <View style={{height: 40, flex: 1, flexShrink: 0, flexGrow: 1, flexDirection: 'row', alignItems: 'center'}}>
              {
                !!this.props.type &&
                <Icon name={'ios-lock-outline'} size={19} style={{marginRight: 4}}/>
              }
              <Text style={styles.balance}>
                {balance[0]}
              </Text>
              <View>
                {balance[1]}
              </View>
              <Text style={styles.balance}>
                {balance[2]}
              </Text>
            </View>
          </View>
        </View>

        {
          !!this.props.product.type && this.props.product.paymentDate !== '01.01.2222' &&
          <View style={[styles.row, {marginBottom: 7, paddingLeft: 48, paddingRight: 15}]}>
                <Text style={styles.paymentDate}>
                  {moment(this.props.product.paymentDate, 'DD.MM.YYYY').format('к оплате DD MMMM')}
                </Text>

            <View style={styles.paymentAmountContainer}>
              <Text style={styles.paymentAmount}>
                {parseMoney(this.props.product.paymentAmount, this.props.product.currency)}
              </Text>
            </View>

          </View>
        }

      </View>
    )
  }

  _depositRenderer() {
    const balance = parseMoney(this.props.product.sumContract, this.props.product.currency, true);
    return (
      <View style={[styles.container, this.props.styles]}>

        <View style={{flexShrink: 1}}>
          <Text style={styles.description} numberOfLines={2}>
            {this.props.product.description}
          </Text>
          <Text style={styles.info}>
          {moment(this.props.product.dateFinish, 'DD.MM.YYYY').format('DD.MM.YYYY') === '01.01.2222' ? "" : moment(this.props.product.dateFinish, 'DD.MM.YYYY').format('до DD MMM YYYY')}
          </Text>
        </View>

        <View>
          <View style={{height: 40, flex: 1, flexShrink: 0, flexGrow: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.balance}>
              {balance[0]}
            </Text>
            <View>
              {balance[1]}
            </View>
            <Text style={styles.balance}>
              {balance[2]}
            </Text>
          </View>
        </View>

        {/*<View style={styles.row}>*/}

        {/*<View style={styles.column}>*/}
        {/*<Text style={styles.description} numberOfLines={1}>*/}
        {/*{this.props.product.description}*/}
        {/*</Text>*/}
        {/*<Text style={styles.info} numberOfLines={1} >*/}
        {/*{moment(this.props.product.dateFinish).format('до DD MMM YYYY')}*/}
        {/*</Text>*/}
        {/*</View>*/}

        {/*<View style={styles.balanceContainer}>*/}
        {/*<Text style={styles.balance}>*/}
        {/*{balance[0]}*/}
        {/*</Text>*/}
        {/*<View>*/}
        {/*{balance[1]}*/}
        {/*</View>*/}
        {/*<Text style={styles.balance}>*/}
        {/*{balance[2]}*/}
        {/*</Text>*/}
        {/*</View>*/}

        {/*</View>*/}

      </View>
    )
  }

  _accountRenderer() {
    const balance = parseMoney(this.props.product.balance, this.props.product.currency, true);
    return (
      <View style={[styles.container, this.props.styles]}>

        <View style={{flexShrink: 1}}>
          <Text style={styles.description} numberOfLines={2}>
            {this.props.product.description}
          </Text>
          <Text style={styles.info}>
            {this.props.product.account}
          </Text>
        </View>

        <View>
          <View style={{height: 40, flex: 1, flexShrink: 0, flexGrow: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.balance}>
              {balance[0]}
            </Text>
            <View>
              {balance[1]}
            </View>
            <Text style={styles.balance}>
              {balance[2]}
            </Text>
          </View>
        </View>

        {/*<View style={styles.row}>*/}

        {/*<View style={styles.column}>*/}
        {/*<Text style={styles.description}>*/}
        {/*{this.props.product.description}*/}
        {/*</Text>*/}
        {/*<Text style={styles.info}>*/}
        {/*{this.props.product.account}*/}
        {/*</Text>*/}
        {/*</View>*/}

        {/*<View style={styles.balanceContainer}>*/}
        {/*<Text style={styles.balance}>*/}
        {/*{balance[0]}*/}
        {/*</Text>*/}
        {/*<View>*/}
        {/*{balance[1]}*/}
        {/*</View>*/}
        {/*<Text style={styles.balance}>*/}
        {/*{balance[2]}*/}
        {/*</Text>*/}
        {/*</View>*/}

        {/*</View>*/}

      </View>
    )
  }

  _creditRenderer() {
    const balance = parseMoney(this.props.product.debtAmount, this.props.product.currency, true);

    return (
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <View style={[styles.container, this.props.styles, {paddingBottom: 30}]}>

          <View style={{flexShrink: 1}}>
            <Text style={styles.description} numberOfLines={2}>
              {this.props.product.description}
            </Text>
            <Text style={styles.info}>
              {moment(this.props.product.dateFinish, 'DD.MM.YYYY').format('до DD MMM YYYY')}
            </Text>
          </View>

          <View>
            <View style={{height: 40, flex: 1, flexShrink: 0, flexGrow: 1, flexDirection: 'row', alignItems: 'center'}}>
              {
                !!this.props.product.type &&
                <Icon name={'ios-lock-outline'} size={19} style={{marginRight: 4}}/>
              }
              <Text style={styles.balance}>
                {balance[0]}
              </Text>
              <View>
                {balance[1]}
              </View>
              <Text style={styles.balance}>
                {balance[2]}
              </Text>
            </View>
          </View>
          {/*<View style={styles.row}>*/}

          {/*<View style={styles.column}>*/}
          {/*<Text style={styles.description}>*/}
          {/*{this.props.product.description}*/}
          {/*</Text>*/}
          {/*<Text style={styles.info}>*/}
          {/*{moment(this.props.product.dateFinish).format('до DD MMM YYYY')}*/}
          {/*</Text>*/}
          {/*</View>*/}

          {/*<View style={styles.balanceContainer}>*/}
          {/*{*/}
          {/*!!this.props.product.type &&*/}
          {/*<Icon name={'ios-lock-outline'} size={19} style={{marginRight: 4}}/>*/}
          {/*}*/}
          {/*<Text style={styles.balance}>*/}
          {/*{balance[0]}*/}
          {/*</Text>*/}
          {/*<View>*/}
          {/*{balance[1]}*/}
          {/*</View>*/}
          {/*<Text style={styles.balance}>*/}
          {/*{balance[2]}*/}
          {/*</Text>*/}
          {/*</View>*/}

          {/*</View>*/}
        </View>

        <View style={[styles.container, {marginTop: -40, backgroundColor: 'transparent'}]}>
          <Text style={styles.paymentDate}>
            {moment(this.props.product.paymentDate, 'DD.MM.YYYY').format('к оплате DD MMM YYYY')}
          </Text>

          <View style={styles.paymentAmountContainer}>
            <Text style={styles.paymentAmount}>
              {parseMoney(this.props.product.paymentAmount, this.props.product.currency)}
            </Text>
          </View>

        </View>
      </View>
    )
  }
}
