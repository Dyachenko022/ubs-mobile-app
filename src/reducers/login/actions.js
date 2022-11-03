import * as types from './actionTypes';

export function setCredentials(data) {
  return {type: types.SET_CREDENTIALS, credentials: data};
}

export function setNotification(data) {
  return {type: types.SET_NOTIFICATION, payload: data};
}

export function setAutoenrollFaceid(autoenroll) {
  return { type: types.SET_AUTOENROLL_FACEID, payload: autoenroll };
}
