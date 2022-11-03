import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import BankTheme from '../../utils/bankTheme';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#ccc',

    flex: 0,
    width: width,//'100%',
    height: height-56,

    justifyContent: 'center',
    alignItems: 'center',

    // borderWidth: 1,
    // borderColor: 'red'

    // width: '100%',
    // height: '100%'
  },
  backgroundImage: {
    // resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },

  input: {
    width: '90%',
    height: 56,

    marginBottom: 10,
    padding: 10,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 3
  },

  button: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: 180,
    height: 40,

    backgroundColor: BankTheme.color1,

    borderRadius: 3
  },

  loginFormWrapper: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: width*.9,
    height: height*.4,

    backgroundColor: 'rgba(255,255,255,.35)',

    // margin: 20,
    padding: 20,
  },

  inputWrapper: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,

    paddingTop: 3,
    paddingBottom: 3,

    borderWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e7e7e7',

    borderRadius: 2
  },

  // input: {
  //   // marginLeft: 2
  // },

  btn: {
    backgroundColor: BankTheme.color1,
    width: 200,

    flex: -1,
    justifyContent: 'center',

    marginTop: 20
  },

  textBtn: {
    marginTop: 7
  }
})
