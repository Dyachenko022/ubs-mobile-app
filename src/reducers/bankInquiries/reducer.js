
import {BankInquiries, BankInquiriesToOrder} from '../../api/actionTypes';

const initialState = {
  inquiriesToOrder: [],
  orderedInquiries: [],
  isLoading: false,
}

export default function bankInquiriesReducer(state = initialState, action = {}){
  switch (action.type) {
    case BankInquiries.REQ:
      return  {
        ...state,
        isLoading: true,
      }
    case BankInquiries.SUC:
      return {
        ...state,
        orderedInquiries: action.data,
        isLoading: false,
      }
    case BankInquiriesToOrder.SUC:
      return {
        ...state,
        inquiriesToOrder: action.payload,
        isLoading: false,
      }
  }
  return state;
}