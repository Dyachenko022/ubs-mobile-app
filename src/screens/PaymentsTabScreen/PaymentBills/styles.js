import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import BankTheme from '../../../utils/bankTheme';

export const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export default styles = StyleSheet.create({
  payments: {
    width: Screen.width,
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',

    paddingHorizontal: 10,
    paddingVertical: 10,

    backgroundColor: "#fff",
    shadowColor: '#000',
    shadowRadius: 2,
    shadowOpacity: .15,
    shadowOffset: {width: 0, height: 0}
  },

  paymentWrapper: {
    height: 80,
width: 150,
    flex: 1,
    flexGrow: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BankTheme.color1,
    marginRight: 10
  },
  payment: {
    // borderWidth: 1,
    flexDirection: 'row',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
alignSelf: 'flex-start'
  },

  image: {
    width: 30,
    height: 30,
    marginLeft: 5
  },

  paymenTitle: {
    // borderWidth: 1,
    fontSize: 12,
    // height: 15,
    textAlign: 'left',
color: '#fff',
    // marginTop: 10,
    marginLeft: 5,
marginRight: 5
  },

  info: {
    paddingHorizontal: 20,
    paddingTop: 5,
    alignItems: 'center',
  }
});
