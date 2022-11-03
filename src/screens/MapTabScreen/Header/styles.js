import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

// let {height, width} = Dimensions.get('window');
export const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
}

export default styles = StyleSheet.create({
  header: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    height: '80%',
    marginHorizontal: 20,
    borderRadius: 5,
    borderWidth: 0
  },
  logo: {
    width: 155,
    height: 30,

  },
  menu: {
    marginTop: 5
  },
})
