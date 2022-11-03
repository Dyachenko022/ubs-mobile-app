import {requestFabric} from '../../api/actions'


export const FETCH_REQ = 'notifications:fetch:req';
export const FETCH_SUC = 'notifications:fetch:suc';
export const FETCH_ERR = 'notifications:fetch:err';

export const SAVE_REQ = 'notifications:save:req';
export const SAVE_SUC = 'notifications:save:suc';
export const SAVE_ERR = 'notifications:save:err';

export const SET_VALUE = 'notifications:set';


export const fetch = () => {
  return requestFabric({
    method: 'POST',
    route: 'paramContractPrivate',
    isJwt: true,
    requestType: FETCH_REQ,

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: FETCH_SUC,
        payload: {
          docs: response['clientDocs']
        }
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: FETCH_ERR,
        payload: {
          response
        }
      })
    }
  });
};


export const save = ({docs}) => {
  return requestFabric({
    method: 'POST',
    route: 'saveParamContract',
    isJwt: true,
    requestType: SAVE_REQ,
    data: {
      parameters: [{
        name: 'Документы',
        type: 'array',
        typeColumns: ['string', 'string'],
        value: docs.map(e => [e.type, e.number])
      }]
    },
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: SAVE_SUC,
        payload: {
          docs
        }
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: SAVE_ERR,
        payload: {
          response
        }
      })
    }
  });
};

export const setValue = ({type, value}) => {
  return {
    type: SET_VALUE,
    payload: {
      type, value
    }
  }
};
