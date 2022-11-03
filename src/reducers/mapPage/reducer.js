import {MapPage as types} from "../../api/actionTypes";

const initialState = {
  points: [],
  filterTypes: ['Банкоматы']
};

export default function mapPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_MAP_SUC:
      return {
        ...state,
        points: action.response
      };

    case types.SET_FILTER_TYPES:
      return {
        ...state,
        filterTypes: action.filterTypes
      };

    default:
      return state;
  }
}
