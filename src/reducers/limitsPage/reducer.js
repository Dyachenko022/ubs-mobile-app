import { SET_ID_OBJECT,  SET_LOADING,  RESET} from './actions';
import { LimitsPage} from '../../api/actionTypes';

const initialState = {
  limits: {
    cashLimits: {
      monthlyLimit: 1110,
      monthlyLimitUsed: 900,
      monthlyLimitCurrencyISO: 'RUB',
      dailyLimit: 500,
      dailyLimitUsed: 50,
      dailyLimitCurrencyISO: 'RUB',
      maxMonthlyLimit: 10000,
      maxDailyLimit: 1000,
    },
    cashlessLimits: {
      monthlyLimit: 0,
      monthlyLimitUsed: 0,
      monthlyLimitCurrencyISO: 'RUB',
      maxMonthlyLimit: 0,
      dailyLimit: 0,
      dailyLimitUsed: 0,
      dailyLimitCurrencyISO: 'RUB',
      maxDailyLimit: 0,
    },
    internetLimits: {
      monthlyLimit: 0,
      monthlyLimitUsed: 0,
      monthlyLimitCurrencyISO: 'RUB',
      dailyLimit: 0,
      dailyLimitUsed: 0,
      dailyLimitCurrencyISO: 'RUB',
      maxMonthlyLimit: 0,
      maxDailyLimit: 0,
    },
  },
  idObject: 0,
  isLoading: true,
  limitsToSet: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LimitsPage.GET_LIMITS_SUC:
      return {
        ...state,
        limits: action.payload,
        isLoading: false,
      };
    case SET_ID_OBJECT:
      return {
        ...state,
        idObject: action.payload,
      };
    case LimitsPage.GET_LIMITS_REQ:
      return {
        ...state,
        isLoading: true,
      };
    case LimitsPage.GET_LIMITS_ERR:
      return {
        ...state,
        isLoading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case RESET:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
}
