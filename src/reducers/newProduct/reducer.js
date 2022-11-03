import _ from 'lodash'
import {ProductsPage as types} from "../../api/actionTypes";
import {parseFormData} from "../../containers/Document/utils/parseFormData";

const initialState = {
  fieldsLoading: false,
  formData: {
    groups: [],
    valuesGroups: {},
    fields: {},
    values: {},
    listValues: {},
    currentGroupName: '',
    nextSidRequest: null
  },

  cards: [],
  credits: [],
  deposits: []
};

export default function newProductsPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.REQ_PARAM_FIELDS:
      return {
        ...state,
        fieldsLoading: true
      };

    case types.SUC_PARAM_CARD:
      return {
        ...state,
        cards: action.products
      };
    case types.SUC_PARAM_CREDIT:
      return {
        ...state,
        credits: action.products
      };
    case types.SUC_PARAM_DEPOSIT:
      return {
        ...state,
        deposits: action.products
      };

    case types.SUC_PARAM_FIELDS:
      const formData = parseFormData(action.response);
      formData.currentGroupIndex = 0;
      formData.groups = [...state.formData.groups, formData.groups];

      return {
        ...state,
        fieldsLoading: false,
        formData: Object.assign({}, state.formData, formData)
      };

    case types.SET_FIELDS_VALUES:
      return {
        ...state,
        formData: {
          ...state.formData,
          values: action.values
        }

      };

    case types.CLEAR_FIELDS_VALUES:
      const newValues = {};
      Object.keys(state.formData.values).forEach(key => {
        newValues[key] = {
          ...state.formData.values[key],
          value: ''
        }
      });

      return {
        ...state,
        formData: {
          ...state.formData,
          values: newValues
        }
      };

    default:
      return state;
  }
}

export function getProducts(state, type) {

  switch (type) {
    case 'cards':
      return state.newProductPage.cards;
    case 'credits':
      return state.newProductPage.credits;
    case 'deposits':
      return state.newProductPage.deposits;
    default:
      return []
  }
}