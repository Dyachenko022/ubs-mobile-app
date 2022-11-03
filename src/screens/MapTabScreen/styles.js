import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';

// let {height, width} = Dimensions.get('window');
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
}

export default styles = StyleSheet.create({
  // container: {
  //   flex: 1
  // },
  // map: {
  //   ...StyleSheet.absoluteFillObject,
  // },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: Platform.OS === 'ios' ? 'stretch' : 'center',
    backgroundColor: '#efefef',

    // borderWidth: 2
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    height: Screen.height + 20,
    padding: 3,
    paddingTop: 14,
    paddingBottom: 100,
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
    paddingHorizontal: 15,
    fontSize: 20,
    height: 25
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },


  info: {
  },

  infoBlock: {
    marginBottom: 10
  },

  infoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    fontWeight: '600'
  },
  infoText: {
    paddingHorizontal: 20
  },


  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  photo: {
    width: Screen.width-40,
    height: 225,
    marginTop: 30
  },
  map: {
    height: Screen.height,
    width: Screen.width
  },

  filterItem: {
    // borderWidth: 1,
    height: 40,
    paddingHorizontal: 15,

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

})
