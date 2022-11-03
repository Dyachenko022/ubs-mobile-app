import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  providerWrapper: {
    height: 56
  },
  provider: {
    // borderWidth: 1,
    // borderColor: 'red',

    // flexWrap: 'wrap',

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 15,

    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },

  image: {
    width: 30,
    height: 30
  },

  providerTitle: {
    // flex: 1,
    // flexWrap: "wrap",

    // borderWidth: 1,
    marginLeft: 10
  }
});
