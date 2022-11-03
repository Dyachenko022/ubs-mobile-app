import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#f2f5f7',

    flex: 0,
    width: width,//'100%',
    height: height,

    paddingTop: '10%',
    // justifyContent: 'center',
    alignItems: 'center',

    // borderWidth: 1,
    // borderColor: 'red'

    // width: '100%',
    // height: '100%'
  },
  formWrapper: {
    width: '85%'
  },

  btn: {

    width: 200,
    // height: 45,
    marginBottom: 50,

    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
