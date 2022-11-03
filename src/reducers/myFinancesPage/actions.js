import * as types from './actionTypes';

export function changeActiveTab(activeTab) {
  return {type: types.CHANGE_TAB, activeTab: activeTab};
}