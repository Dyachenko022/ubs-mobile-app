import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  columnWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  columnWrapperRight: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-end'
  },
  subColumn: {
    paddingLeft: 10
  },
  line: {
    backgroundColor: "#eee",
    height: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 15
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
  }
});