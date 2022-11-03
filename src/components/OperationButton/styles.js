import {Dimensions, StyleSheet} from 'react-native';
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default StyleSheet.create({
  operationButton: {
    marginLeft: -50,
    paddingLeft: 70,
    paddingVertical: 10,

    alignItems: 'center',

    flexDirection: "row"
  },
  operationButtonText: {
    marginLeft: 50,
    fontSize: 16
  },
  operationButtonLine: {
    height: 1,
    width: viewportWidth - 85,
    backgroundColor: "#eee",

    position: 'absolute',
    bottom: 0,
    right: 0
  }
})