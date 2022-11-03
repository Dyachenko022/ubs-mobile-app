import * as types from './actionTypes';

export function search(data) {
  return {type: types.SEARCH_INPUT, search: data};
}