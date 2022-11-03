import {StyleSheet} from "react-native";
import BankTheme from '../../utils/bankTheme';

export default StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%'
  },
  backgroundScrollView: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },

  fieldBlock: {width: '100%', height: '95%', paddingTop: 30, flex: 1, alignItems: 'center'},

  fieldRow: {paddingLeft:20, paddingRight: 20, width: '100%', paddingBottom: 15,},

  buttonAccept: {width: '80%', marginBottom: 15, borderRadius: 0, backgroundColor: BankTheme.color1},

  buttonClear: {backgroundColor: 'white', color:'#9fa2a4', width:'40%'},
});
