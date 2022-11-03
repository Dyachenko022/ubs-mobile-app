import React from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
let {height, width} = Dimensions.get('window');
import BankTheme from '../../../utils/bankTheme';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    height: '100%',

    paddingHorizontal: 25,
    paddingRight: 50,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: "#212121",
  },

  aboutBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BankTheme.color1,

    alignItems: 'center',
    justifyContent: "center",

    position: 'absolute',
    marginTop: 15,
    right: 0
  },

  logo: {
    width: '60%',
    height: 50,

    marginBottom: 50,

    resizeMode: 'contain'
  },

  currenciesWrapper: {
    flex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',

    width: '100%',
  },

  wrapper:{
    alignItems: 'center',
    flexShrink: 0,

    marginBottom: 40
  },
  allBtl: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#808080",

    width: 90,

    padding: 5,
    paddingTop: 7,
    paddingBottom: 7,

    marginTop: 15
  },
  text: {
    color: '#808080',
    fontSize: 12,
    flex: 0,
    textAlign: 'center',
    justifyContent: 'center',
  },

  btn: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 13
  }
})
