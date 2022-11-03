import {SettingsPage, UserInfo as types, LoginPage} from "../../api/actionTypes";

const initialState = {
  foto: '',
  fullname: '',
  push: false,
  checkContractData: {
    visible: false,
    shouldLogout: false,
    text: '',
  }
};

export default function userInfo(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_USER_PHOTO_SUC:
      return {
        ...state,
        foto: action.response.foto
      };

    case types.GET_USER_INFO_SUC:
      return {
        ...state,
        fullname: action.fullname,
      };

    case SettingsPage.ENABLED_PUSH_SUC:
      return {
        ...state,
        push: true
      };

    case SettingsPage.DISABLED_PUSH_SUC:
      return {
        ...state,
        push: false
      };

    case types.CHECK_CONTRACT_DATA:
      return {
        ...state,
        checkContractData: {
          visible: action.payload.visible,
          shouldLogout: action.payload.shouldLogout,
          text: action.payload.text,
        }
      }
    default:
      return state;
  }
}
