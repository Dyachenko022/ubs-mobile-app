import { stateNotification } from '../../api/actions';
import {dispatch} from 'react-native-navigation-drawer-extension/lib/events';

export const SET_FILTER = 'notifications/SET_FILTER';
export const DELETE_NOTIFICATION = 'notification/DELETE_MESSAGE';
export const SET_MESSAGE_READ = 'notification/SET_MESSAGE_READ';

export function setFilter(filterObj) {
  return {
    type: SET_FILTER,
    payload: filterObj,
  }
}

export function setMessageRead(guid) {
  return async (dispatch) => {
    await dispatch(stateNotification(guid, 1));
    dispatch({
      type: SET_MESSAGE_READ,
      payload: guid,
    });
  }
}

export function deleteNotification(guid) {
  return async (dispatch) => {
    await dispatch(stateNotification(guid, 99));
    dispatch({
      type: DELETE_NOTIFICATION,
      payload: guid,
    });
  }
}