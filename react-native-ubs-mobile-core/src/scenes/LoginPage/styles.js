import React from 'react';
import { PixelRatio, StyleSheet, Platform, Dimensions } from 'react-native';

let {height, width} = Dimensions.get('window');
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const backgroundHeight = height;

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideHeight = 80;//viewportHeight * 0.4;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default styles = StyleSheet.create({
  background: {
    backgroundColor: '#ccc',

    flex: -1,
    width: width,//'100%',
    height: backgroundHeight,

    //justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'

    // borderWidth: 1,
    // borderColor: 'red'

    // width: '100%',
    // height: '100%'
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: viewportWidth,
    height: viewportHeight - 56
  },


  input: {
    width: '90%',
    height: 56,

    marginBottom: 10,
    padding: 10,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 3
  },

  button: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: 180,
    height: 40,

    backgroundColor: "#123456",

    borderRadius: 20
  },

  loginFormWrapper: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 100,

    width: width*.9,


    backgroundColor: 'rgba(255,255,255,.35)',

    // margin: 20,
    padding: 20,
  },

  inputWrapper: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,

    paddingTop: 3,
    paddingBottom: 3,

    borderWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#e7e7e7',

    borderRadius: 2
  },

  // input: {
  //   // marginLeft: 2
  // },

  textBtn: {
    marginTop: 7
  },

  slideInnerContainer: {
    // ...StyleSheet.absoluteFillObject,
    // width: 100,
    width: itemWidth,
    height: slideHeight,
    // paddingHorizontal: itemHorizontalMargin,
    // paddingTop: 10,
    // paddingBottom: 10, // needed for shadow
    //
    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // borderWidth: 1,
    // borderColor: 'red'
  },

  image: {
    // ...StyleSheet.absoluteFillObject,
    // resizeMode: 'cover',
    // borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,

    // borderWidth: 1,
    // borderColor: 'red',

    width: 60,
    height: 60,
    marginRight: 10
  },
  newsDescription: {
    color: '#fff',
    fontSize: 12,

    borderWidth: 1,
    borderColor: 'red',

    flex: 1,

    backgroundColor: "transparent"
  },
})
