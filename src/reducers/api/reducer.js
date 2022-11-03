import {GetServiceBranch as types} from "../../api/actionTypes";

const initialState = {
  apiRoute: '',
  regions: [],
  changeRegion: false,
};

export default function api(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_API_ROUTE:
      return {
        ...state,
        apiRoute: action.route,
        changeRegion: action.changeRegion //gri++ one region
      };

    case types.SUC:
      return {
        ...state,
        regions: action.response,
        changeRegion: true
      };

    default:
      return state;
  }
}
