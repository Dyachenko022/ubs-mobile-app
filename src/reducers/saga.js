import { all } from 'redux-saga/effects';
import loginSaga from '../reducers/login/loginSaga';

export default function* rootSaga() {
  try {
    yield all([
      loginSaga(),
    ]);
  } catch(ex) {
    console.error(ex);
  }
}
