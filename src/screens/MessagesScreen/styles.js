import React from 'react';
import {StyleSheet, Platform, Dimensions} from 'react-native';
import BankTheme from '../../utils/bankTheme';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  list: {
    // height: '100%',
    flex: 1
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

  state: {
    fontSize: 11,
    color: "#aaa",
    marginBottom: 5
  },

  fullTextContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,

    zIndex: 2
  },

  header: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
    flexDirection: 'row'
  },

  headerButtonsWrapper: {
    marginHorizontal: 20,
    flex: 3,
    maxWidth: width*.5,
    flexDirection: 'row',

    alignItems: 'center'
  },

  headerButtonText: {
    textAlign: 'center',
    color: "#fff",
    fontSize: 10
  },
  headerButtonTextActive: {
    textAlign: 'center',
    color: BankTheme.color1,
    fontSize: 10
  },
  headerButton: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '54%'
  },

  headerButtonActive: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '54%',

    backgroundColor: '#fff'
  },

  write: {
    height: 46,
    width: '100%',
    backgroundColor: BankTheme.color1,

    alignItems: 'center',
    justifyContent: 'center'
  },
  writeText: {
    fontSize: 16,
    color: "#fff"
  },
})
