import * as types from '../../api/actionTypes';

export function setContractDataWarning(text, visible, shouldLogout = false) {
  return {
    type: types.UserInfo.CHECK_CONTRACT_DATA,
    payload: {
      visible,
      shouldLogout,
      text,
    },
  };
}
