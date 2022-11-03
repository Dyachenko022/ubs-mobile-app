import {PaymentsPage as types, LoginPage} from "../../api/actionTypes";
import {SEARCH_INPUT} from './actionTypes';
const initialState = {
  configuration: {},
  providers: [],
  services: [],
  systems: [],

  providerSearch: '',
ABC: false,
uidRequestSend: '',

  loading: false,
  loadingServicePayment: false
};

export default function paymentsPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_CONFIGURATION_SUC:
      const confArray = action.configuration || [];
      const configuration = {};
      confArray.forEach((conf) => {
        configuration[conf.sid] = {
          access: conf.access,
          sid: conf.sid,
          logo: conf.logo,
        }
      });
      Object.freeze(configuration);

      return {
        ...state,
        loading: false,
        configuration,
      };

    case types.GET_PROVIDERS_SUC:
      return {
        ...state,
        loading: false,
        services: action.services,
        providers: action.providers
      };

    case types.GET_SYSTEMS_SUC:
      return {
        ...state,
        loading: false,
        systems: action.systems
      };

    case types.GET_SERVICE_PAYMENT_REQ:
      return {
        ...state,
        loadingServicePayment: true,
      };
    case types.GET_SERVICE_PAYMENT_SUC:
      return {
        ...state,
        accountsToPay: action.accountsToPay,
        loadingServicePayment: false,
ABC: true
      };
    case types.GET_SERVICE_PAYMENT_FAI:
      return {
        ...state,
        loadingServicePayment: false
      };


  case types.SEND_REQUEST_PAYMENTS_SERVICE_REQ:
    return{
      ...state
    };
  case types.SEND_REQUEST_PAYMENTS_SERVICE_SUC:
    return{
      ...state,
      uidRequestSend: action.uidRequestSend
    };
  case types.SEND_REQUEST_PAYMENTS_SERVICE_FAI:
    return{
      ...state,
      uidRequestSend: '',
      accountsToPay: [],
      loadingServicePayment: false,
      ABC: true
    };


    case SEARCH_INPUT:
      return {
        ...state,
        providerSearch: action.search
      };

    case types.GET_CONFIGURATION_REQ:
    case types.GET_PROVIDERS_REQ:
    case types.GET_SYSTEMS_REQ:
      return {
        ...state,
        loading: true
      };

    default:
      return state;
  }
}
