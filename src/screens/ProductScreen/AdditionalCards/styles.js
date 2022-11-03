import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
  },
  textHeader: {
    fontSize: 18,
    color: "#aaa",
    textAlign: 'center',
    padding: 10,
  },
  text: {
    fontSize: 14,
    padding: 3,
  },
  nameAndDate: {
    flexDirection: 'column',
    width: '70%',
    paddingLeft: 15,
  },
});
