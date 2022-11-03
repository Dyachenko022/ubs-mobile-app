import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';


export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#123456',

    flex: -1,
    width: '100%',
    height: '100%',

    alignItems: 'center',

    padding: '10%'
  },

  headerText: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 16,

    marginBottom: 30
  },

  indicatorsWrapper: {
    flex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: 25*5
  },
  indicator: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,

    width: 13,
    height: 13,

    shadowColor: '#fff',
    shadowRadius: 3,
    shadowOpacity: .5,
    shadowOffset: {width: 0, height: 0},


  },

  indicatorFull: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,

    width: 13,
    height: 13,

    shadowColor: '#fff',
    shadowRadius: 3,
    shadowOpacity: .5,
    shadowOffset: {width: 0, height: 0},

    backgroundColor:"#FFF"
  }
})
