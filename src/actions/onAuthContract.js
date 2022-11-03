import {Alert, AsyncStorage} from "react-native";
import moment from 'moment';
import {changeAppRoot} from "../reducers/routing/actions";
import {
  clearSession,
} from "../api/actions";
import {store} from "../../App";
import * as types from "../api/actionTypes";
import {setAutoenrollFaceid} from '../reducers/login/actions';
import {pushScreen} from '../utils/navigationUtils';

export async function onAuthContract(id, response, dispatch, componentId) {
  let isContractHere = await AsyncStorage.getItem('contractId');
  let isCodeHere = await AsyncStorage.getItem('code');

  const expireDate = moment(response.expireDatePassword, 'DD.MM.YYYYTHH:mm:ss');
  const expired = moment().isAfter(expireDate);

  const goNext = async () => {
    if (isContractHere === null) {
      await AsyncStorage.setItem('contractId', String(id));
      dispatch(changeAppRoot('loginConfirmation'))
    } else {
      if (isCodeHere === null) {
        dispatch(changeAppRoot('loginConfirmation'))
      } else {
        if (isContractHere !== id) // 20200406++ for one region
          await AsyncStorage.setItem('contractId', String(id));
        dispatch(setAutoenrollFaceid(true));
        dispatch({type: 'LOGIN_SAGA'});
      }
    }
  }

  if (response.changePassword === 1) {
    if (isContractHere === null) await AsyncStorage.setItem('contractId', String(id));
    if (isCodeHere) {
      pushScreen({
        componentId, screenName: 'unisab/ChangePasswordScreen', passProps: {
          proceedLoginFunction: goNext,
        }
      });
    } else {
      dispatch(changeAppRoot('changePassword'));
    }
  } else if (response.expireDatePassword !== '01.01.0001T00:00:00' && response.expireDatePassword !== '01.01.2222T00:00:00') {
    if (expired) {
      Alert.alert(`Уважаемый(ая) ${response.fullname}`, 'Срок действия пароля истек, пожалуйста, смените пароль', [
        {text: 'OK', onPress: async () => {
          if (isContractHere === null) await AsyncStorage.setItem('contractId', String(id));
          if (isCodeHere) {
            pushScreen({
              componentId, screenName: 'unisab/ChangePasswordScreen', passProps: {
                proceedLoginFunction: goNext,
              }
            });
          } else {
            dispatch(changeAppRoot('changePassword'));
          }
        }}
      ]);
    } else {
      Alert.alert(
        `Уважаемый(ая) ${response.fullname}`,
        `Срок действия пароля истекает ${expireDate.format('DD.MM.YYYY')}, не забудьте сменить пароль в Интернет-банке`,
        [
          {
            text: 'Сменить пароль',
            onPress: async () => {
              if (isContractHere === null) await AsyncStorage.setItem('contractId', String(id));
              if (isCodeHere) {
                pushScreen({
                  componentId, screenName: 'unisab/ChangePasswordScreen', passProps: {
                    proceedLoginFunction: goNext,
                  }
                });
              } else {
                dispatch(changeAppRoot('changePassword'));
              }
            }
          },
          {
            text: 'Продолжить',
            onPress: goNext
          }
        ]
      );
    }
  } else {
    goNext()
  }
  dispatch({
    type: types.LoginPage.AUTH_CONTRACT_SUC,
    response,
    id,
  })
  dispatch({
    type: types.UserInfo.GET_USER_INFO_SUC,
    fullname: response.fullname,
  })
}

export async function authContractAfterChangePassword(dispatch) {
  dispatch(changeAppRoot('loginConfirmation'));
}
