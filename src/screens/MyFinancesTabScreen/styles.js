import React from 'react';
import {Platform, Dimensions, StyleSheet} from 'react-native';
import BankTheme from '../../utils/bankTheme';
export const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export default styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
  /**
   * Header
   */
  header: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'transparent',
    // justifyContent: 'center',
    // alignItems: 'center',

    // borderWidth: 1,
  },

  headerButtonsWrapper: {
    // borderWidth: Platform.OS === 'ios' ? 1 : 0,
    width: Screen.width * 0.65,
    minWidth: 160,
    maxWidth: 300,
    flexDirection: 'row',

    alignItems: 'center'
  },

  headerButtonText: {
    textAlign: 'center',
    color: "#fff"
  },
  headerButtonTextActive: {
    textAlign: 'center',
    color: BankTheme.color1,
  },
  headerButton: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '50%'
  },

  headerButtonActive: {
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: 'center',
    padding: 5,
    width: '50%',

    backgroundColor: '#fff'
  },
  /**
   * Header END
   */

  /**
   * PieChart
   * */
  pieAmount: {
    fontSize: 21,
    fontWeight: '600',

    paddingVertical: 15
  },
  pieHeader: {
    backgroundColor: BankTheme.color1,
    height: 30
  },
  pieLabel: {
    fontSize: 12
  },
  pieChartWrapper: {
    paddingVertical: 20,
    height: 150,
    width: 150,
    // borderWidth: 1

    // backgroundColor: '#fff'
  },
  pieWrapper: {
    alignItems: 'center',
    paddingBottom: 15,
    // borderWidth: 1
  },
  /**
   * PieChart
   * */

  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',

    paddingHorizontal: 15,
    paddingVertical: 20
  },

  line: {
    position: 'absolute',
    bottom: -1,
    right: 0,
    left: 60,

    height: 1,
    backgroundColor: "#eee"
  },

  rowInfo: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    paddingLeft: 15
  },

  costLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  rowTitle: {
    flex: 1,
    fontWeight: '500',
    // textAlign: 'right'
  },

  rowAmount: {
    fontSize: 16,
    fontWeight: '500'
  },

  menu: {
    width: 25,
    height: 25,
    paddingBottom: 20
  }
})
