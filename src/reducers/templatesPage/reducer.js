import {TemplatesPage as types, LoginPage} from "../../api/actionTypes";

const initialState = {
  templates: [],
  countDocs: 10,
  loading: false,

  isChangeNameModalOpen: false,

};

export default function templatePage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_TEMPLATES_REQ:
      return {
        ...state,
        loading: true
      };

    case types.GET_TEMPLATES_SUC:
      return {
        ...state,
        templates: action.response.documents || [],
        countDocs: action.response.countDocs,
        loading: false
      };

    default:
      return state;
  }
}