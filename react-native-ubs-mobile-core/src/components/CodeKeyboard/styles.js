import React from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
let {height, width} = Dimensions.get('window');

export const btwWidth = width <= 350 ? 40 : 50;
const borderRadius = btwWidth/2;


export default styles = StyleSheet.create({
  container: {
    marginTop: width <= 350 ? 20 : 30
  },

  row: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  btn: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: btwWidth,
    height: btwWidth,

    backgroundColor: '#fff',
    borderRadius: borderRadius,

    borderWidth:1
  },
  btnText: {
    color: "#123456",
    fontSize: btwWidth-16
  }
})
