import { takeLatest, put, delay, call, fork, putResolve, all, select } from 'redux-saga/effects';
import {
  advertising, checkContractData,
  exit,
  getAccounts, getBonuses,
  getCards,
  getConfiguguration,
  getCredits,
  getDeposits,
  getFotoAbonent,
  getInquiriesToOrder,
  getMessages,
  getPersonalOffers,
  getProducts,
  getTemplates,
  getUnreadNotifications,
  listDocuments,
  operationsProduct,
  sendRequestServicePayment,
  setTokenApplication,
  sync
} from '../../api/actions';
import {changeAppRoot} from '../routing/actions';
import moment from 'moment';
import BankTheme from '../../utils/bankTheme';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const listDocumentsParams = {
  "dateFrom": "01.01.2222",
  "dateTo": "01.01.2222",
  "source": "",
  "amount": 0,
  "currency": "",
  "recipient": "",
  "showFavorite": 0,
  "stateCode": [],
  "sidDoc": "",
  "pageRows": 10,
  "pageNum": 1
};

function* wrapCheckCode409(saga, ...params) {
  try {
    yield put(saga(...params));
  } catch (ex) {
    if (ex.status === 409) throw ex;
  }
}

function setToken() {
  return async (dispatch) => {
    try {
      let token = '';
      let tokenType = '';
      if (Platform.OS === 'ios') {
        token = await messaging().getToken();
        tokenType = 'Apple';
      } else if (global.hasGms) {
        token = await messaging().getToken();
        tokenType = 'Android';
      }
      const deviceName = `${Platform.OS === 'ios' ? DeviceInfo.getModel() : DeviceInfo.getBrand()} - ${await DeviceInfo.getDeviceName()}`;

      dispatch(setTokenApplication(token, tokenType, deviceName));
    } catch (e) {
      console.error('token_error - ', e);
    }
  }
}

function* loginSaga() {
  const date = moment().format('DD.MM.YYYY');
  const idObject = 0, code = "", type = 1;

  yield put(changeAppRoot('loading'));
  try {

    // Запросы, которые могут продолжать висеть при открытии страницы МойБанк /*
    yield fork(wrapCheckCode409, sync);
    if (BankTheme.bankMessagesUsed) {
      yield fork(wrapCheckCode409, getMessages);
    }
    if (BankTheme.pushNotificationsUsed) {
      yield fork(wrapCheckCode409, getUnreadNotifications);
    }
    yield fork(wrapCheckCode409, getTemplates, {});
    yield fork(wrapCheckCode409, getInquiriesToOrder);
    yield fork(wrapCheckCode409, getProducts);
    yield fork(wrapCheckCode409, advertising);
    yield fork(wrapCheckCode409, sendRequestServicePayment);
    yield fork(wrapCheckCode409, getBonuses);
    yield fork(wrapCheckCode409, listDocuments, listDocumentsParams);
    yield fork(wrapCheckCode409, getFotoAbonent);
    yield fork(wrapCheckCode409, operationsProduct,{period: date, idObject, code, type});
    yield putResolve(setToken());

    // Запросы, которые нужны выполнить ДО открытия МойБанк
    yield all([
      yield putResolve(getPersonalOffers()),
      yield putResolve(getConfiguguration()),
      yield putResolve(getCards()),
      yield putResolve(getDeposits()),
      yield putResolve(getCredits()),
      yield putResolve(getAccounts()),
      yield putResolve(checkContractData())
    ]);

    const { checkContractData: contractData } = yield select((state) => state.userInfo);

    if(contractData?.shouldLogout) {
      yield put(exit())
    } else {
      yield put(changeAppRoot('after-login'));
    }
  } catch (ex) {
    console.error('LOGIN SAGA FAILED', ex);
  }

}


export default function* loginSagaWatcher() {
  yield takeLatest('LOGIN_SAGA', loginSaga);
}
