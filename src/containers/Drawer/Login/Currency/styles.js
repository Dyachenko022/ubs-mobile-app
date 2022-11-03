import React from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  container: {
    flex: -1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '50%',
    // borderWidth: 1,
    // borderColor: '#fff'
  },
  rowWrapper: {
    flex: -1,
    flexDirection: 'row',

    marginBottom: 20
  },
  row: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: "#808080",
    fontSize: 13
  },
  text: {
    color: "#808080",
    fontSize: 12
  },
  currencyText: {
    color: "#cdcdcd",
    fontSize: 30,

    fontFamily: 'Roboto-Light'
  }
})
