import React from 'react';
import PropTypes from 'prop-types';

import {
  Platform,

  View,
  KeyboardAvoidingView,
  ScrollView,

} from 'react-native';
import TouchableOpacity from '../../Touchable';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {TextRenderer as Text} from "../../TextRenderer";

import Input from '../IconInput'


const leftBtn = {
  // title: 'Назад',
  id: 'back',
  icon: require('../../../assets/back.ios.png'),
  // custom: 'unisab/CustomTopBar',
};


export default class TextBoxFind extends React.Component {
  static navigatorButtons = {
    leftButtons: [Platform.OS === 'ios' ? leftBtn : {id: 'back'}]
  };

  static propTypes = {
    value: PropTypes.string,

    data: PropTypes.array,

    onChange: PropTypes.func,
    itemRenderer: PropTypes.func,
    filter: PropTypes.func,
  };
  static defaultProps = {
    value: '',
    onChange: (text) => {this.setState((prevState)=>({input: text}))},

    data: [
      {title: '1asd', subTitle: 'bsd'},
      {title: '2asd', subTitle: 'bsd'},
      {title: '3asd', subTitle: 'bsd'},
      {title: '4asd', subTitle: 'bsd'},
      {title: '5asd', subTitle: 'bsd'},
      {title: '6asd', subTitle: 'bsd'},
      {title: '7asd', subTitle: 'bsd'},
      {title: '8asd', subTitle: 'bsd'},
      {title: '9asd', subTitle: 'bsd'},
      {title: '0asd', subTitle: 'bsd'},
      {title: '12asd', subTitle: 'bsd'},
      {title: '421asd', subTitle: 'bsd'},
      {title: '563asd', subTitle: 'bsd'},
      {title: '65788asd', subTitle: 'bsd'},
      {title: '135asd', subTitle: 'bsd'},
    ],
    itemRenderer: (el, idx) => (
      <TouchableOpacity key={`${idx}-${el.title}`} onPress={() => {}}>
        <Text style={{fontSize: 16, marginBottom: 5}}>{el.title}</Text>
        <Text style={{color: "#ddd", marginBottom: 5}}>{el.subTitle}</Text>
      </TouchableOpacity>
    ),

    filter: (el, cond) => {if (!cond){return el} return el.title.match(cond)}
  };

  render() {
    return (
        <Input inputProps={{
          onFocus: () => {
            this.props.navigator.showModal({
              screen: 'TextBoxFind',
              title: `Title`,
              navigatorStyle: {
                // screenBackgroundColor: '#fff'
              },
              passProps: {

              }
            })
          }
        }}/>
    )
  }
}
