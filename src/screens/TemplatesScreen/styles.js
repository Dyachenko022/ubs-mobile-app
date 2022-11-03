import React from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
import BankTheme from '../../utils/bankTheme';

let {height, width} = Dimensions.get('window');

export default StyleSheet.create({
  list: {
    // height: '100%',
    flex: 1
  },
  textFooter: {
    color: '#9b9b9b',
    fontSize: 12,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  itemBtn: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  title: {
    fontSize: 13,
    color: "#444"
  },

  date: {
    fontSize: 11,
    color: "#aaa"
  },

  fullTextContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,

    zIndex: 2
  },

  header: {
    flexDirection: 'row'
  },

  headerButtonsWrapper: {
    flex: 3,
    flexDirection: 'row',

    alignItems: 'center'
  },

  headerButtonText: {
    textAlign: 'center',
    color: "#fff"
  },
  headerButtonTextActive: {
    textAlign: 'center',
    color: BankTheme.color1
  },
  headerButton: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '50%'
  },

  headerButtonActive: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '50%',

    backgroundColor: '#fff'
  },

  write: {
    height: 56,
    width: '100%',
    backgroundColor: BankTheme.color1,

    alignItems: 'center',
    justifyContent: 'center'
  },
  writeText: {
    fontSize: 16,
    color: "#fff"
  },

  swipeOut: {
    // flex: 1,
    height: '100%',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },

  swipeOutText: {
    color: '#fff',
    fontSize: 10,
    width: '100%',
    textAlign: 'center',
  }
})
