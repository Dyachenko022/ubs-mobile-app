import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {itemWidth, slideHeight} from "../MyBankTabScreen/styles";
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

export default styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: "#eee",
    height: 30,
    justifyContent: 'center'
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
    // fontSize: 11,
  },

  title: {
    paddingHorizontal: 10,
    paddingVertical: 15,

    fontSize: 16,
    // fontWeight: '500',

    textAlign: 'center'
  },

  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    height: Screen.height + 300,
    padding: 20,
    paddingTop: 14,
    backgroundColor: '#f7f5eee8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 35,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 5
  },
  panelTitle: {
    fontSize: 20,
    height: 25
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },

  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: "100%",
    height: "100%"
  },
  textConteiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newsDescription: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: "transparent"
  },
});
