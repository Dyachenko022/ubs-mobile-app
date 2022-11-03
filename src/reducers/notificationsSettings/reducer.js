import {
  FETCH_ERR, FETCH_SUC, FETCH_REQ,
  SAVE_ERR, SAVE_SUC, SAVE_REQ,
  SET_VALUE
} from './actions'

const initialState = {
  docs: [],
  isLoading: false
};

export default function notifications(state = initialState, action = {}) {
  const {type, payload} = action;

  switch (action.type) {
    case FETCH_REQ:
    case SAVE_REQ:
      return {
        ...state,
        isLoading: true
      };

    case FETCH_SUC:
      return {
        ...state,
        docs: payload.docs,
        isLoading: false
      };

    case SAVE_SUC:
      return {
        ...state,
        docs: payload.docs,
        isLoading: false
      };

    case FETCH_ERR:
    case SAVE_ERR:
      return {
        ...state,
        isLoading: false
      };

    case SET_VALUE:
      const {type, value} = payload;
      const docs = [...state.docs];
      const field = docs.find(e => e.type === type);

      field.number = value;

      return {
        ...state,
        docs
      };

    default:
      return state;
  }
}