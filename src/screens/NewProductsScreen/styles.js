import {Dimensions, StyleSheet} from "react-native";
import BankTheme from '../../utils/bankTheme';

const widthMargined = Math.round(Dimensions.get('screen').width - 40.0);

export default StyleSheet.create({
  mainContainer: {
    width: '100%', height: '100%',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  htmlContainer: {
    flexWrap: 'wrap',
    width: widthMargined,
    marginLeft: 25,
    paddingRight: 25,
  },
  image: {
    backgroundColor: 'red',
    aspectRatio: 1.5,
    marginTop: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  lgw: {
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
    height: 170,
  },
  itemBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    position: 'absolute',
    bottom: 0,
    backgroundColor: BankTheme.color1,
  },
  buttonBlock: {
    width: '100%',
    backgroundColor: 'red',
  },
  buttonInfoBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 25,
    marginLeft: 25,
    borderTopWidth: 1,
    borderTopColor: '#9fa2a4',
  },
  buttonInfoText: {
    paddingTop: 10,
    color: BankTheme.color1,
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
});
