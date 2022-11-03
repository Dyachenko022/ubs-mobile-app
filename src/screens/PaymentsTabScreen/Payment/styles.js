import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  payments: {
    width: Dimensions.get('window').width,
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingVertical: 10,

    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: .15,
    shadowOffset: {width: 0, height: 0},
  },

  paymentWrapper: {
    height: 80,

    flexBasis: '33.3%',
    flexGrow: 0,
  },
  payment: {
    // borderWidth: 1,


    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    width: 35,
    height: 35
  },

  paymenTitle: {
    fontSize: 12,
    textAlign: 'center',

    marginTop: 10
  }
});