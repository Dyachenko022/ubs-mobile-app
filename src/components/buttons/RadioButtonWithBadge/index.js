import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import BankTheme from '../../../utils/bankTheme';
import {Badge} from 'react-native-ui-lib';

export default function RadioButtonWidthBadge(props) {
  return (
    <View style={props.containerStyle ? props.containerStyle : null}>
      <TouchableOpacity onPress={props.onPress} style={props.isPressed ? styles.pressed : styles.unpressed}>
        <Text style={props.isPressed ? styles.pressedText : styles.unpressedText}>
          {props.title}
        </Text>
      </TouchableOpacity>
      {props.badgeLabel ? (
        <Badge
          label={props.badgeLabel}
          size={"small"}
          backgroundColor={"red"}
          style={{position: 'absolute', top: -5, left: '90%',  zIndex: 200}}
        />
      ) : null}
      </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    borderRadius: 25,
    padding: 5,
    borderWidth: 1,
    borderColor: BankTheme.color1,
    backgroundColor: BankTheme.color1,
  },
  pressedText: {
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5,
  },
  unpressed: {
    borderRadius: 25,
    padding: 5,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
  },
  unpressedText: {
    color: 'gray',
    paddingLeft: 5,
    paddingRight: 5,
  }
});

RadioButtonWidthBadge.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  isPressed: PropTypes.bool,
  containerStyle: PropTypes.object,
  badgeLabel: PropTypes.number,
}