import { StyleSheet, Dimensions, Platform } from 'react-native';
import BankTheme from '../../utils/bankTheme';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },

  bonusWrapper: {
    backgroundColor: 'rgba(244, 115, 33, .1)',

    borderRadius: 10,
    marginBottom: 10,

    flexBasis: Screen.width / 2 - 10,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },

  programsHeader: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,

    fontSize: 16,
    color: BankTheme.color1,
  },

  programsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    paddingHorizontal: 5
  },

  textWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: "rgba(0,0,0,0.2)"
  },
  textWrapperActive: {
    backgroundColor: "rgba(244,115,33,0.4)"
  },

  bonusLogo: {
    position: 'absolute',

    width: '100%',
    height: '100%',
    borderRadius: 10
  },

  bonusTitle: {
    maxWidth: '90%',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center'
  }
});
