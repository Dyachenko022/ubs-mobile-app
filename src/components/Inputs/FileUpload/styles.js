import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'column',
  },

  containerNotValid: {
    borderColor: 'red',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },

  headerText: {
    color: 'gray',
    fontSize: 16,
  },

  uploadFile: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },

  uploadFileText: {
    color: 'gray',
    fontSize: 14,
  },
  fileCountText: {
    color: 'gray',
    fontSize: 12,
    width: '100%',
  }

});
