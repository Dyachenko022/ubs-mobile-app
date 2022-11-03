import React from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import BankTheme from '../../../utils/bankTheme';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626'
  },

  header: {
    flex: 0,
    justifyContent: 'flex-end',

    minHeight: 165,
    paddingHorizontal: 20,
    paddingVertical: 15,

    backgroundColor: '#fff'
  },
  aboutWrapper: {
    position: 'absolute',
    width: 200,
    height: 20,
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20
  },

  aboutBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BankTheme.color1,

    alignItems: 'center',
    justifyContent: 'center',

    position: 'absolute',
    right: 0,
    top: 0
  },

  aboutBtnCircle: {
    backgroundColor: 'red',
    position: 'absolute'
  },

  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 45,
    borderWidth: 1,
    borderColor: BankTheme.color1,

    width: 90,
    height: 90,
    padding: 15
    // marginBottom: 15,
    // marginLeft: -4
  },
  avatar: {
    width: 76,
    height: 76,

    borderRadius: 38,

    resizeMode: 'cover'
  },

  userName: {
    color: BankTheme.color1
  },

  messagesCount: {
    position: 'absolute',
    top: 0,
    right: 12,
    zIndex: 1,
    backgroundColor: '#f47321',

    padding: 2,

    borderRadius: 9,

    minWidth: 16,
    minHeight: 16,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesCountText: {
    fontSize: 9,
    color: '#fff'
  },

  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    paddingVertical: 10
  },
  action: {
    alignItems: 'center'
  },
  actionText: {
    color: '#fff',
    fontSize: 12
  },

  templatesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    paddingVertical: 10
  },
  templatesHeaderText: {
    color: '#fff'
    // fontSize: 16
  },
  templatesAction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  templatesActionText: {
    color: '#fff',

    fontSize: 12
  },

  menuContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  menuAction: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 10
  },
  menuActionIcon: {
    width: 30,
    marginLeft: -5,
    alignItems: 'center'
    // borderWidth: 1,
    // borderColor: "#fff"
  },
  menuActionText: {
    color: '#fff',
    marginLeft: 10
  },

  templatesList: {
    paddingHorizontal: 15,
    paddingTop: 10
  },
  templateActionTextWrapper: {
    flexDirection: 'column'
  },
  templateActionText: {
    color: '#fff',
    fontSize: 12,

    marginLeft: 10
  },
  iconAndWarningText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  }
});
