import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

let {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
  list: {
    height: '100%',
    backgroundColor: '#f2f5f7'
  },

  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  itemBtn: {
    padding: 20,
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
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,

    zIndex: 2
  }
})
