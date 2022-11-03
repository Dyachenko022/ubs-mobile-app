import {BonusesPage as types, LoginPage} from "../../api/actionTypes";

const initialState = {
  bonuses: {},
  loading: false
};

export default function bonusesPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.BONUSES_REQ:
      return {
        ...state,
        loading: true
      };

    case types.BONUSES_SUC:
      return {
        ...state,
        bonuses: {...action.payload},
        loading: false
      };

    default:
      return state;
  }
}