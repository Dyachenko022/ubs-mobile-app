import {NewsPage as types} from "../../api/actionTypes";

const initialState = {
  news: []
};

export default function newsPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_NEWS_SUC:
      return {
        ...state,
        news: action.response
      };

    default:
      return state;
  }
}