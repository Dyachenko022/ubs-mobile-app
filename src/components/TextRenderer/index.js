import React from 'react';
import {Text} from 'react-native';


export const TextRenderer = props => {
  return (
    <Text {...props} style={[props.style, {fontFamily: 'Roboto'}]}>
      {props.children}
    </Text>
  );
}