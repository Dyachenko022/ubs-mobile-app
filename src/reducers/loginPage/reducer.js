import {LoginPage as types} from "../../api/actionTypes";


const initialState = {
  ad: [],
  rates: {
    ratesBank: []
  },
  contracts: [],
  loading: false,

  liveTime: 0,
  phoneSending: '',
  dateGenerate: ''
};

export default function loginPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_AD_SUC:
      return {
        ...state,
        ad: action.response
      };

    case types.GET_RATES_SUC:
      return {
        ...state,
        rates: action.response
      };

    case types.AUTH_BASE_REQ:
      return {
        ...state,
        loading: true
      };

    case types.AUTH_BASE_SUC:
      return {
        ...state,
        loading: false,
        contracts: action.response.contracts
      };
    case types.AUTH_BASE_FAI:
      return {
        ...state,
        loading: false
      };

    case types.EXIT_SUC:
    default:
      return state;
  }
}
