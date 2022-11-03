import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  View, Platform,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import BankTheme from '../../bankTheme';

let styles = StyleSheet.create({
  container: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#aeaeae',
    backgroundColor: 'white',

    justifyContent: 'center',
    alignItems: 'center'
  },

  active: {
    borderColor: BankTheme.color1,
  }
});

export default class CheckBox extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {this.props.label && (
            <View style={{
              marginRight: 10
            }}>
              <Text>{this.props.label}</Text>
            </View>
          )}
          <View style={[styles.container]}>
            {this.props.value &&
              <Icon
                name={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
                size={25}
                color={BankTheme.color1}
              />
            }
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onPress = () => {
    this.props.onValueChange(!this.props.value)
  }
}
