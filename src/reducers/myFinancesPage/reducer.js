import {MyFinancesPage as types, LoginPage} from "../../api/actionTypes";
import * as localTypes from './actionTypes'
import moment from "moment/moment";
import {operationsProduct} from "../../api/actions";

let date = moment().format('DD.MM.YYYY');
let format = 'DD.MM.YYYY';
let costs = {};
for (let i = 0; i < 12; i++) {
  costs[date] = {operations: [], loading: true};
  date = moment(date, format).subtract(1, 'months').format(format);
}

const initialState = {
  activeTab: 'costs',

  costs: {...costs},
  costsLoading: false,
  isCredit: true,
};

let newCosts = {};

export default function myFinancesPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case localTypes.CHANGE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      };
    case types.OP_PRODUCT_REQ:
      return {
        ...state,
        costsLoading: true,
      }

    case types.OP_PRODUCT_SUC:
      newCosts = {...state.costs};
      newCosts[action.date] = {...action.costs, loading: false};

      return {
        ...state,
        costs: newCosts,
        costsLoading: false,
      };
    case types.OP_PRODUCT_FAI:
      newCosts = {...state.costs};
      newCosts[action.date] = {operations: [], loading: false};

      return {
        ...state,
        costs: newCosts,
        costsLoading: false,
      };

    case types.SET_IS_CREDIT:
      return {
        ...state,
        isCredit: Boolean(action.payload.isCredit)
      };

    default:
      return state;
  }
}
