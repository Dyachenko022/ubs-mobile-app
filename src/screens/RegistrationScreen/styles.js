import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import BankTheme from '../../utils/bankTheme';

let {height, width} = Dimensions.get('window');

const AGREE_CHECK_BOX_SIZE = 24;

export default styles = StyleSheet.create({
  agreeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10
  },
  agreeCheckboxContainer: {
    width: AGREE_CHECK_BOX_SIZE,
    height: AGREE_CHECK_BOX_SIZE,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: AGREE_CHECK_BOX_SIZE / 2,
    marginRight: 5
  },
  agreeCheckbox: {
    width: AGREE_CHECK_BOX_SIZE - 6,
    height: AGREE_CHECK_BOX_SIZE - 6,
    position: 'absolute',
    top: 2,
    left: 2,
    borderRadius: (AGREE_CHECK_BOX_SIZE - 4) / 2,
    backgroundColor: 'transparent'
  },
  agreeCheckboxActive: {
    backgroundColor: BankTheme.color1
  },
  agreeText: {
    color: '#aaa'
  },
  agreeTextLink: {
    color: BankTheme.color1
  },
  background: {

    width,
    height,

    paddingTop: '10%',
    // justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 10,

    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDisabled: {
    borderColor: '#aaa'
  }
})
