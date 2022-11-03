import {ProductPage as types} from "../../api/actionTypes";
import { CLEAR_CVV_CODE } from './actions';

const initialState = {
  loading: false,
  loadingOp: true,
  loadingProxy: true,

  product: {},
  operations: [],
  proxy: [],
  productType: '',

  actualPayments: [],
  planPayments: [],

  showUnmaskedCard: false,
  unmaskedCardNumber: '',

  accountDetailsFile: '',
  accountDetailsData: {},
  allowedOperations: [],
  cvvCodeShown: false,
  cvvCode: '***',
};

export default function productPage(state = initialState, action = {}) {
  switch (action.type) {
    case types.GET_CARD_INFO_REQ:
    case types.GET_DEPOSIT_INFO_REQ:
    case types.GET_CREDIT_INFO_REQ:
    case types.GET_ACCOUNT_INFO_REQ:
    case types.ACCOUNT_DETAILS_REQ:
      return {
        ...state,
        showUnmaskedCard: false,
        part2Card: '',
        accountDetailsFile: '',
        accountDetailsData: {},
        loading: true,
        productType: '',
        cvvCodeShown: false,
        cvvCode: '***',
      };

    case 'CLEAR_WALLETS':
      return {
        ...state,
        wallet: null,
      };

    case types.GET_WALLETS_SUC: {
      return {
        ...state,
        wallet: {...action.payload}
      };
    }

    case types.GET_CARD_INFO_SUC:
    case types.GET_DEPOSIT_INFO_SUC:
    case types.GET_CREDIT_INFO_SUC:
    case types.GET_ACCOUNT_INFO_SUC:
      let productType = '';

      switch (action.type) {
        case types.GET_CARD_INFO_SUC:
          productType = 'cards';
          break;
        case types.GET_CREDIT_INFO_SUC:
          productType = 'credits';
          break;
        case types.GET_DEPOSIT_INFO_SUC:
          productType = 'deposits';
          break;
        case types.GET_ACCOUNT_INFO_SUC:
          productType = 'accounts';
      }

      return {
        ...state,
        showUnmaskedCard: false,
        part2Card: '',
        loading: false,
        product: {
          ...action.response,
          productType
        },
        productType
      };
    case types.GET_CARD_INFO_FAI:
    case types.GET_DEPOSIT_INFO_FAI:
    case types.GET_CREDIT_INFO_FAI:
    case types.GET_ACCOUNT_INFO_FAI:
    case types.ACCOUNT_DETAILS_FAI:
      return {
        ...state,
        loading: false,
        product: {
          productType: state.product.productType,
          id: -1,
          balance: 'Fetch Error'
        }
      };

    case types.GET_CARD_OP_REQ:
    case types.GET_DEPOSIT_OP_REQ:
    case types.GET_ACCOUNT_OP_REQ:
    case types.GET_CREDIT_OP_REQ:
      return {
        ...state,
        loadingOp: true
      };
    case types.GET_CARD_OP_SUC:
    case types.GET_DEPOSIT_OP_SUC:
    case types.GET_ACCOUNT_OP_SUC:
    case types.GET_CREDIT_OP_SUC:
      return {
        ...state,
        loadingOp: false,
        operations: action.operations,
        order: action.order
      };
    case types.GET_CARD_OP_FAI:
    case types.GET_DEPOSIT_OP_FAI:
    case types.GET_ACCOUNT_OP_FAI:
    case types.GET_CREDIT_OP_FAI:
      return {
        ...state,
        loadingOp: false,
        operations: []
      };

    case types.GET_CARD2_PART_SUC:
      let number = state.product.number;
      const part2Card = action.payload
      const indexOfFirstAsteriks = number.indexOf('*');
      number = number.replace(/(\*)*/g,'');
      const unmaskedNumber = number.slice(0, indexOfFirstAsteriks) + part2Card + number.slice(indexOfFirstAsteriks);
      return {
        ...state,
        unmaskedCardNumber: unmaskedNumber,
        showUnmaskedCard: action.showUnmaskedCard,
        cvvCodeShown: false,
        cvvCode: '***',
      }

    case types.GET_DEPOSIT_PROXY_REQ:
      return {
        ...state,
        loadingProxy: true
      };
    case types.GET_DEPOSIT_PROXY_SUC:
      return {
        ...state,
        loadingProxy: false,
        proxy: action.proxy,
        // order: action.order
      };
    case types.GET_DEPOSIT_PROXY_FAI:
      return {
        ...state,
        loadingProxy: false,
        proxy: []
      };

    case types.GET_CREDIT_SCH_REQ:
      return {
        ...state,
        loadingSchedules: true
      };
    case types.GET_CREDIT_SCH_SUC:
      return {
        ...state,
        loadingSchedules: false,
        actualPayments: action.actualPayments,
        planPayments: action.planPayments,
      };
    case types.GET_CREDIT_SCH_FAI:
      return {
        ...state,
        loadingSchedules: false,
        actualPayments: [],
        planPayments: []
      };

    case types.SetDescriptionProduct_SUC:
      let newProduct = {...state.product};
      newProduct.description = action.description;

      return {...state, product: newProduct};

    case types.ACCOUNT_DETAILS_SUC:

      return {
        ...state,
        loading: false,
        accountDetailsFile: action.accountDetailsFile,
        accountDetailsData: action.accountDetailsData
      };

    case types.EXTRACT_REQ:
        return {
          ...state,
          loading: true,
          file: ''
        };
    case types.EXTRACT_SUC:
      return {
        ...state,
        loading: false,
        file: action.file
      };
    case types.EXTRACT_FAI:
        return {
          ...state,
          loading: false,
          file: ''
        };
    case types.GET_OPERATION_ACCESS_SUC:
      return {
        ...state,
        allowedOperations: action.payload,
      };
    case types.GET_CARD_CVV_SUC: {
      return {
        ...state,
        cvvCodeShown: true,
        cvvCode: action.payload,
        showUnmaskedCard: false,
        unmaskedCardNumber: '',
      };
    }
    case CLEAR_CVV_CODE:
      return {
        ...state,
        cvvCode: '',
        cvvCodeShown: false,
      }

    default:
      return state;
  }
}
