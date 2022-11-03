import {AsyncStorage} from 'react-native'
import * as types from './actionTypes';
import {serviceNotification} from '../../api/actions';

import {setCredentials} from '../login/actions';

export const SET_LOGON_ROOT_TAB_ID = 'setlogonroottabid';
export const SET_INITIAL_URL = 'routing/setinitialurl';

export function appInitialized() {
  return async function(dispatch, getState) {
    // since all business logic should be inside redux actions
    // this is a good place to put your app initialization code
    let isSavedCode = await AsyncStorage.getItem('code');
//    await dispatch(serviceNotification());
    if (isSavedCode) {
      dispatch(setCredentials(true))
    }
    dispatch(changeAppRoot('login')); //'after-login'
  };
}

export function setLogonRootTabId(componentId) {
  return {type: SET_LOGON_ROOT_TAB_ID, componentId};
}

export function changeAppRoot(root) {
  return {type: types.ROOT_CHANGED, root: root};
}

export function setInitialUrl(initialUrl) {
  return { type: SET_INITIAL_URL, payload: initialUrl };
}

export function login() {
  return async function(dispatch, getState) {
    // login logic would go here, and when it's done, we switch app roots
    dispatch(changeAppRoot('after-login'));
  };
}
