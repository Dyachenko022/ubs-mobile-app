import { StyleSheet } from 'react-native';
import BankTheme from '../../../../../utils/bankTheme';

export default StyleSheet.create({
  container: {
    height: 56,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    paddingVertical: 10,

    backgroundColor: '#fff'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  iconContainer:{
    width: 25,
    alignItems: "center"
  },

  headerText: {
    fontSize: 18,
    marginLeft: 7,

    color: "#9fa2a4",
    fontWeight: '400'
  },

  addBtnWrapper: {
    // backgroundColor: 'red',
    height: 56,
    width: 56,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
    marginRight: -15
  },
  addBtn: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderRadius: 12,

    width: 24,
    height: 24,

    borderColor: BankTheme.color1,

    // paddingHorizontal: 7,
    // paddingVertical: 7
  },
  addText: {
    color: "#9fa2a4"
  }
});
