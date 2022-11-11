import React from 'react';
import {StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f5f7'
  },
  section: {
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },

  sectionHeaderWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500'
  },
  sectionContentWrapper: {
    paddingHorizontal: 30,
    paddingBottom: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionContentLabel: {

  },

  sectionSubContentWrapper: {
    paddingLeft: 45,
    paddingBottom: 10
  },
  sectionSubContentLabel: {
    fontSize: 12,
    color: '#999'
  },
  secondRowText: {
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 12,
  },
  itemRightButtonStyle: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75
  },
  swipeableItemContainer: {
    borderTopWidth: 1,
    minHeight: 75,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  subText: {
    color: '#b5b5b5'
  }
})
