import {MessagesPage as types, LoginPage} from "../../api/actionTypes";
import * as localTypes from './actionTypes'

const initialState = {
  inMessages: [],
  outMessages: [],
  unreadMessages: [],

  activeTab: 'inbox',
  unreadMessagesCount: 0,

  msgInfo: {},

  loading: false,
  loadingMessage: ''
};

export default function messagesPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_MESSAGES_REQ:
    case types.GET_SENT_MESSAGES_REQ:
      return {
        ...state,
        loading: true
      };

    case types.GET_MESSAGES_SUC:
      return {
        ...state,
        inMessages: action.inMessages,
        unreadMessages: action.unreadMessages,
        loading: false
      };

    case types.GET_SENT_MESSAGES_SUC:
      return {
        ...state,
        outMessages: action.outMessages,
        countOutMessages: action.count,
        loading: false
      };

    case types.STATE_MESSAGE_SUC:
      return {
        ...state,
        message: action.response
      };

    case types.READ_MESSAGE_REQ:
      return {
        ...state,
        loadingMessage: action.data.guid
      };
    case types.READ_MESSAGE_SUC:
      let files = state.msgInfo;
      files[action.guid] = action.msgInfo;

      return {
        ...state,
        msgInfo: files,
        loadingMessage: ''
      };

    case types.READ_SENT_MESSAGES_REQ:
      return {
        ...state,
        loadingMessage: action.data.id
      };
    case types.READ_SENT_MESSAGES_SUC:
      let msgInfo = state.msgInfo;
      msgInfo[action.id] = action.msgInfo;
      return {
        ...state,
        msgInfo,
        loadingMessage: ''
      };

    case localTypes.CHANGE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      };

    case localTypes.SET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadMessagesCount: action.unreadMessagesCount
      };

    default:
      return state;
  }
}
