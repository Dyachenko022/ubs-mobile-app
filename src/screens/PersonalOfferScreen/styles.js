import {StyleSheet, Dimensions, } from 'react-native';
import BankTheme from '../../utils/bankTheme';

// Раньше было 30%, но из-за того, что начали использовать ScrollView, проценты в высоте перестали работать
const imageHeight = Math.round(Dimensions.get('screen').height * 0.25);
const widthMargined = Math.round(Dimensions.get('screen').width - 40.0);

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: imageHeight,
  },
  panelValidUntil: {position: 'absolute',
    bottom: 0,
    zIndex: 200,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    marginBottom: 20,
    color: 'white'
  },
  questionIcon: {
    position: 'absolute', bottom:20, right: 20, zIndex: 200,
  },
  appeal: {
    paddingTop: 15, width: widthMargined, marginBottom: 30, marginTop: 30, alignSelf: 'center',
  },
  separatorHorizontal: {
    height: 20
  },
  webViewContainer: {
   width: widthMargined, height: 400, alignSelf: 'center',
  },
  webView: {
    width: widthMargined,
  },
  buttonAccept: {
    width: widthMargined, marginTop: 5, borderRadius: 8, fontSize: 16, backgroundColor: BankTheme.color1
  },
  buttonReject: {
    width: widthMargined, marginTop: 5, marginBottom: 3, borderRadius: 8, fontSize: 16, borderWidth: 1, backgroundColor: 'white', borderColor: BankTheme.color1,
  }
});
