import {SbpAcceptancesPage} from '../../api/actionTypes';

const initialState = {
  isLoading: true,
  acceptances: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SbpAcceptancesPage.GET_ACCEPTANCES_REQ:
      return {
        ...state,
        isLoading: true,
      };
    case SbpAcceptancesPage.GET_ACCEPTANCES_SUC:
      return {
        ...state,
        isLoading: false,
        acceptances: action.payload,
      }
    case SbpAcceptancesPage.GET_ACCEPTANCES_ERR:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}

