import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  componentView: {
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 5,
    width: '100%',
  },

  dialogTouchableRow: {
    paddingLeft: 15,
    paddingBottom: 5,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    width:'100%',
  },

  dialogContainer: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 12
  },

  dialogLabelWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },

  dialogWrapperView: {
    width:'100%',
    height:'95%',
    backgroundColor: 'white',
  },
});

export default styles;
