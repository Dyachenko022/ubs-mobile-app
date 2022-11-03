import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#123456',

    flex: 1,
    width: '100%',
    height: '100%',

    alignItems: 'center',
    justifyContent: 'space-between',

    // marginTop: '10%',
    paddingHorizontal: '10%'
  },

  headerText: {
    color: "#fff",
    textAlign: 'center',
    fontSize: 16,

    marginBottom: 30,
    marginTop: '10%'
  },

  useCode: {
    width: width,
    height: 70,

    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  useCodeText: {
    color: "#fff",
    fontSize: 17
  },

  useTouchId: {
    backgroundColor: "#fff",
    height: 80,
    width: width,

    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  useTouchIdText: {
    fontSize: 17,
    color: "#123456"
  }
})
