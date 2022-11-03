import {execute} from '../../containers/Document/api';
import {getCardLimits} from '../../api/actions';
import {Alert} from 'react-native';

export const GET_LIMITS = 'limitspage/getlimits';
export const SET_LOADING = 'limitspage/loading';
export const SET_ID_OBJECT = 'limitspage/setIdObject';
export const SAVE_LIMITS = 'limitspage/savelimits';
export const RESET = 'limitspaget/reset';

export function getLimits(idObject) {
  return async(dispatch) => {
    dispatch(reset());
    dispatch(setIdObject(idObject));
    dispatch(getCardLimits(idObject));
  }
}

export function setIdObject(idObject) {
  return {
    type: SET_ID_OBJECT,
    payload: idObject,
  };
}

export function saveLimits(limits) {
  return async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const idObject = getState().limitsPage.idObject;
      const apiRoute = getState().api.apiRoute;
      const parameters = [
        {
          name: 'Код вида документа', value: 'UBS_CARD_SETLIMIT', type: 'string', typeColumns: null,
        },
        {
          name: 'Документ.Идентификатор договора', value: idObject, type: 'int', typeColumns: null,
        }
      ];
      const pushLimit = (name, value) => parameters.push({name, value: Number(value), type: 'decimal', typeColumns: null});
      pushLimit('Выдача наличных.Дневной лимит', limits.cashLimits.dailyLimit);
      pushLimit('Выдача наличных.Месячный лимит', limits.cashLimits.monthlyLimit);
      pushLimit('Безналичная оплата.Дневной лимит', limits.cashlessLimits.dailyLimit);
      pushLimit('Безналичная оплата.Месячный лимит', limits.cashlessLimits.monthlyLimit);
      pushLimit('Безнал.оплата в интернете.Дневной лимит', limits.internetLimits.dailyLimit);
      pushLimit('Безнал.оплата в интернете.Месячный лимит', limits.internetLimits.monthlyLimit);

      let data = {
        sidRequest: 'CreateVerify',
        sidDocument: 'UBS_CARD_SETLIMIT',
        parameters,
      };

      const response = await execute(apiRoute ,data);

      const idDocument = response.values.find((item) => item.name === 'Идентификатор документа').value;

      parameters.push({
        name: 'Идентификатор документа', value: idDocument, type: 'int', typeColumns: null,
      });
      data = {
        sidRequest: 'processDocument',
        sidDocument: 'UBS_CARD_SETLIMIT',
        parameters,
      };
      await execute(apiRoute, data);
    } catch (e) {
      Alert.alert('Установка лимитов карты', 'Не удалось установить лимиты. Пожалуйста, обратитесь в банк.');
      console.error(e);
    }
    dispatch(setLoading(false));
  }
}

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    payload: isLoading,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
