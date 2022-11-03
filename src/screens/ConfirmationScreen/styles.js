import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import BankTheme from '../../utils/bankTheme';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#f2f5f7',

    flex: 0,
    width: width,//'100%',
    height: height,

    // paddingTop: '10%',
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
    borderWidth: 1,
    borderRadius: 3,
    borderColor: BankTheme.color1,

    width: 200,
    height: 45,
    marginTop: 30,

    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  inputWrapper: {
    flexDirection: 'row',
    height: 50,
    width: 200,
    // paddingHorizontal: 5,

    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  codeInput: {
    padding: 0,
    margin: 0,
    flex: 1,
    height: 50,

    textAlign: 'center',
    fontSize: 30,
    // letterSpacing: -10
  },

  newCodeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newCodeBtnText: {
    fontWeight: '300'
  }
})
