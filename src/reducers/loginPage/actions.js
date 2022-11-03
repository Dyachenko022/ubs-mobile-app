import * as types from './actionTypes';

export function setCredentials(data) {
  return {type: types.SET_CREDENTIALS, credentials: data};
}