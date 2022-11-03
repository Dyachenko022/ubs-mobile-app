import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';


export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerText: {
    color: '#123456',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10
  },

  indicatorsWrapper: {
    flex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: 25*5
  },
  indicator: {
    borderWidth: 1,
    borderColor: '#123456',//"#fff",
    borderRadius: 10,

    width: 13,
    height: 13,

    shadowColor: '#123456',//'#fff',
    shadowRadius: 3,
    shadowOpacity: .5,
    shadowOffset: {width: 0, height: 0},

    backgroundColor: '#123456'
  },

  indicatorFull: {
    borderWidth: 1,
    borderColor: '#123456',//"#fff",
    borderRadius: 10,

    width: 13,
    height: 13,

    shadowColor: '#123456',//'#fff',
    shadowRadius: 3,
    shadowOpacity: .5,
    shadowOffset: {width: 0, height: 0},

    backgroundColor: "#123456"
  },

  btn: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    flexShrink: 0
  },

  btnText: {
    color: '#123456',//"#fff",
    textAlign: 'center',
    fontSize: 16
  },
})
