import {Errors as types} from "../../api/actionTypes";

const initialState = {
  hasError: false,
  error: '',
  toLogin: false,
  title: 'Ошибка!'
};

export default function historyPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GLOBAL_ERROR_SHOW:
      return {
        ...state,
        error: action.error,
        title: action.title,
        code: action.code,
        hasError: true,
        toLogin: action.toLogin
      };

    case types.GLOBAL_ERROR_HIDE:
      return {
        ...state,
        error: '',
        code: 0,
        hasError: false,
        toLogin: false,
        title: 'Ошибка!'
      };

    default:
      return state;
  }
}
