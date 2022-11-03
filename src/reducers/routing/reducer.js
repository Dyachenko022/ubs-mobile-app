import * as types from './actionTypes';
import { SET_LOGON_ROOT_TAB_ID, SET_INITIAL_URL } from './actions';

const initialState = {
  root: undefined, // 'login' / 'after-login'
  logonTabComponentId: '',
  initialUrl: '',
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.ROOT_CHANGED:
      return {
        ...state,
        root: action.root
      };
    case SET_LOGON_ROOT_TAB_ID:
      return  {
        ...state,
        logonTabComponentId: action.componentId,
      };
    case SET_INITIAL_URL:
      return {
        ...state,
        initialUrl: action.payload,
      }
    default:
      return state;
  }
}
