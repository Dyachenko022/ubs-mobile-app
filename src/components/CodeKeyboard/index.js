import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {Vibration, View, Text, Platform, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import SvgUri from 'react-native-svg-uri';

import styles, { btwWidth } from './styles'

import {isIphoneX} from "../../utils/platform";
import BankTheme from '../../utils/bankTheme';

const backspaceIconString = `<?xml version="1.0" encoding="iso-8859-1"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="512px" height="512px">
<g>
	<g>
		<path d="M469.333,64h-320c-14.72,0-26.347,7.467-34.027,18.773L0,255.893l115.307,173.12C122.987,440.32,134.613,448,149.333,448    h320C492.907,448,512,428.907,512,405.333V106.667C512,83.093,492.907,64,469.333,64z M405.333,332.48l-30.187,30.187    l-76.48-76.48l-76.48,76.48L192,332.48L268.48,256L192,179.52l30.187-30.187l76.48,76.48l76.48-76.48l30.187,30.187L328.853,256    L405.333,332.48z" fill="#f47321"/>
	</g>
</g>
</svg>
`;


export default class CodeKeyboard extends React.Component {
  constructor(props) {
    super(props);

    this._renderKeyboard = this._renderKeyboard.bind(this);
    this._keysMap = this._keysMap.bind(this);
  }

  render() {
    let margin = this.props.btnMargin;
    return (
      <View style={styles.container}>

        {this._renderKeyboard()}

        {/*<TouchableOpacity onPress={this.props.onDel} style={[styles.btn, {marginLeft: margin, marginRight: margin}]}>*/}
        {/*/!*<Icon name={'arrow-circle-o-left'} size={35} color={'#fff'}/>*!/*/}
        {/*<SvgUri width="35" height="35" source={require('../../../assets/icons/buttons/backspace.svg')}/>*/}
        {/*</TouchableOpacity>*/}
        {/*</View>*/}

      </View>
    )
  }

  _renderKeyboard() {
    let margin = this.props.btnMargin;
    let keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, this.props.touchId ? 'touch' : null, 0, 'del'];

    const keyboard = _.chunk(keys, 3).map((row, index) => (
      <View key={index} style={[styles.row, {marginTop: index > 0 ? margin * 2 : 0}]}>
        {
          row.map(this._keysMap)
        }
      </View>
    ));

    return keyboard;
  }

  _keysMap(el) {
    let margin = this.props.btnMargin;

    switch (el) {
      case 'del':
        return (
          <TouchableOpacity key={el} onPress={this.props.onDel}
                            style={[styles.btn, {marginLeft: margin, marginRight: margin}]}>
            <SvgUri width={`${btwWidth-19}`} height={`${btwWidth-19}`} svgXmlData={backspaceIconString} color={BankTheme.color1}/>
          </TouchableOpacity>
        );
      case 'touch':
        return (
          <TouchableOpacity key={el} onPress={this.props.onPressTouchId}
                            style={[styles.btn, {marginLeft: margin, marginRight: margin}]}>
            {
              isIphoneX() ?
              <Image source={require('../../../assets/icons/faceid-colored.png')} style={{ width: 25, height: 25 }}/>
              :
              <Icon name={Platform.OS === 'ios' ? "ios-finger-print" : 'md-finger-print'} size={btwWidth-16} color={BankTheme.color1}/>
            }
          </TouchableOpacity>
        );
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 0:
        return (
          <TouchableOpacity key={el} onPress={() => this.props.onPress(el)}
                            style={[styles.btn, {marginLeft: margin, marginRight: margin}]}>
            <Text style={styles.btnText}>{el}</Text>
          </TouchableOpacity>
        );
      default:
        return(
          <View key={el} style={
            [
              styles.btn,
              {
                marginLeft: margin, marginRight: margin,
                backgroundColor: 'transparent',
                borderColor: 'transparent'
              }
            ]
          }/>
        )
    }

  }

}

CodeKeyboard.defaultProps = {
  btnMargin: 0,
  touchId: false
};
