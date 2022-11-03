import { SBPayScreen as actionTypes } from '../../api/actionTypes';

const initialState = {
  isLoading: false,
  tokens: [],
}

export default function SBPayReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.GET_SBPAY_TOKENS_REQ:
      return {
        ...state,
        isLoading: true,
      }
    case actionTypes.GET_SBPAY_TOKENS_SUC:
      return {
        ...state,
        isLoading: false,
        tokens: action.payload.tokens,
      }
    case actionTypes.GET_SBPAY_TOKENS_ERR:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}
