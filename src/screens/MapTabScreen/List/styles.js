import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#f2f5f7',

    flex: 1
  },

  row: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingVertical: 10,
    paddingHorizontal: 15
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ddd'
  },

  img: {
    width: 30,
    height: 30,

    borderRadius: 15,
    marginRight: 15

  },

  info: {
    flex: 1
  },

  address: {
    fontSize: 16
  },

  services: {
    fontSize: 13
  }
})
