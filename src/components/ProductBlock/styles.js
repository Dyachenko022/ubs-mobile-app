import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 15,
    paddingLeft: 35,
    // paddingBottom: 50,

    backgroundColor: '#fff',
    flexDirection: 'row',

    flex: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    // borderWidth: 1,

    flex: -1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // width: '100%',
    // flexGrow: 0
  },

  column: {
    flexDirection: 'column',
    // flexGrow: 1,
    // marginRight: 15,
    // borderWidth: 1,
  },

  description: {
    marginBottom: 5,
    flexShrink: 1,
    flexBasis: '40%',
    // maxWidth: 180,

    fontWeight: '400'
  },

  info: {
    color: '#9fa2a4',
    fontSize: 11,
    width: 190
  },

  balanceContainer: {
    borderWidth: 1,
    flexBasis: '100%',

    paddingLeft: 15,
    // flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  balance: {
    fontSize: 18,
    marginLeft: 5
  },

  paymentDate: {
    fontSize: 13,

    fontWeight: '200',
    color: '#cb000a'
  },

  paymentAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentAmount: {
    fontSize: 13,

    fontWeight: '200',
    color: '#CB000A'
  },
});
