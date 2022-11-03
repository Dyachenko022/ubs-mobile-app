import {StyleSheet} from "react-native";
import BankTheme from '../../../utils/bankTheme';

export default styles = StyleSheet.create({
  logoView: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    height:'30%',
  },
  textView: {
    flex: 0,
    height:'60%',
    width:  '100%',
  },
  buttonView: {
    height:'10%',
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: 180,
    height: 40,

    backgroundColor: BankTheme.color1,

    borderRadius: 20
  },
});
