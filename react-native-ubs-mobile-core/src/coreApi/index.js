import {AsyncStorage, Alert, Platform} from "react-native";
import DeviceInfo from 'react-native-device-info';
const md5 = require('md5');

let baseUrl = '';//http://test.unisab.ru/q3';
let baseImage = '';//"https://test.unisab.ru:4443/public/image/";


const paths = {
  authBase:  'users/auth/base',
  authCode: 'users/auth/code',
  authContract:  'users/auth/contract',
  authSign:  'users/sign',
  registrationApp: 'registrationApp',
  getCodeSms:  'users/getCodeSMS',
  confirm:  'users/confirm',
  changePassword:  'users/changePassword',
  execute:  'execute',
  registration:  'registration',
  registrationClientConfirm:  'registration/confirm',
  baseData: 'baseData',
  reAccess: 'reAccess',
  reAccessConfirm: 'reAccess/confirm',
};

export async function getBaseData() {
  const response = await post(paths.baseData, {}, false, {}, false);
  return response.data.timeRequest;
}

export async function post(path, data = {}, sendRaw, additionalHeaders = {}, setTimeRequest = true) {

  let timeRequest = null;
  if (path !== paths.authBase && path !== paths.authCode && path !== paths.registration && path !== paths.reAccess && setTimeRequest) {
    timeRequest = await getBaseData();
  }

  const req = new XMLHttpRequest();
  const jwt = await AsyncStorage.getItem('jwt');
  const baseExecute =  baseUrl + '/execute';
  req.open('POST', baseExecute);
  req.setRequestHeader("ubsjwt", jwt);
  req.setRequestHeader('sidrequest', path);
  req.setRequestHeader('Accept', 'application/json, text/plain, */*');
  if (timeRequest) req.setRequestHeader('timeRequest', timeRequest);

  if(!sendRaw) req.setRequestHeader("Content-Type", "application/json");
  if(additionalHeaders) {
    for (const key in additionalHeaders) req.setRequestHeader(key, additionalHeaders[key]);
  }

  return new Promise(function (resolve, reject) {
    req.onload  = function() {
      if (req.status === 200) {
        const data=JSON.parse(req.response);
        resolve({data});
      } else if (req.status === 409) {
        resolve({ data: { codeResult: 109, textResult: 'Сервис временно не работает' } })
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send(sendRaw? data : JSON.stringify(data));
  });
}

export function authBase(data) {
  return new Promise(function (resolve, reject) {
    post(paths.authBase, data)
      .then((response) => {
        const data = response.data;
        if (data.contracts) {
          if (data.contracts.length > 0) data.contracts = data.contracts.map(item => ({...item, image: baseImage + item.image}));
        }
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function authCode(uid, code, dontShowPopup = false,) {
  return new Promise(function (resolve, reject) {
    post(paths.authCode, {uid, code})
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          if (!dontShowPopup) handleError(data, resolve, reject);
          else reject(data);
        } else {
          resolve(data);
        }
      });
  })
}

export function authContract(id, dontShowPopup = false) {
    return new Promise(function (resolve, reject) {
      post(paths.authContract, {id})
        .then((response) => {
          const data = response.data;
          if (data.codeResult && data.codeResult != 0) {
            if (!dontShowPopup) handleError(data, resolve, reject);
            else reject(data);
          } else {
            resolve(data);
          }
        });
    })
}

export async function registrationApp(code, contractId, username) {
  let uid = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
  const deviceId = DeviceInfo.getDeviceId() === 'Unknown' ? '' : DeviceInfo.getDeviceId();
  const hashedUsername = md5(username);
  uid = uid +'##' + deviceId + '##' + contractId + '##' + hashedUsername;
  let name = '';
  try {
    name = `${Platform.OS === 'ios' ? DeviceInfo.getModel() : DeviceInfo.getBrand()} - ${await DeviceInfo.getDeviceName()}`;
  } catch (e) {
    name = 'UnknownName';
    console.error(e);
  }

  if (__DEV__) {  //Чтобы не было ошибки устройство зарегетрировано
      const devSuffix = '_dev_' + ((Math.random() + 1) * 10) + '_--_' + Math.random()* 16;
      await AsyncStorage.setItem('devSuffix', devSuffix);
      uid = uid + devSuffix;
      name = name + devSuffix;
    }

  return new Promise(function (resolve, reject) {
    post(paths.registrationApp, { code, name, uid })
      .then((response) => {
        const data = response.data;
        data.deviceName = name;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          AsyncStorage.setItem('hashedUsername', hashedUsername)
            .then(() => resolve(data));
        }
      });
  });
}

export function getCodeSms() {
  return new Promise(function (resolve, reject) {
    DeviceInfo.getDeviceName().then(deviceName =>
      post(paths.getCodeSms, {
        type: Platform.OS === 'ios' ? DeviceInfo.getModel() : DeviceInfo.getBrand(),
        name: deviceName,
      })
    )
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function confirmSms(code) {
  return new Promise(function (resolve, reject) {
    post(paths.confirm, {code})
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function registration (dateBirth, numCard, numDoc, numPhone, fio, login) {
  return new Promise(function (resolve, reject) {
    post(paths.registration, {dateBirth, numCard, numDoc, numPhone, fio, login })
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function forgot (dateBirth, numCard, numDoc, numPhone, fio, login) {
  return new Promise(function (resolve, reject) {
    post(paths.reAccess, {dateBirth, numCard, numDoc, numPhone, fio, login })
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function registrationConfirm(code) {
  return new Promise(function (resolve, reject) {
    post(paths.registrationClientConfirm, { code })
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function forgotConfirm(code) {
  return new Promise(function (resolve, reject) {
    post(paths.reAccessConfirm, { code })
      .then((response) => {
        const data = response.data;
        if (data.codeResult && data.codeResult != 0) {
          handleError(data, resolve, reject)
        } else {
          resolve(data);
        }
      });
  })
}

export function setBaseUrl(url) {
  baseUrl = url;
  baseImage = url + '/public/image/';
}

function handleError(data, resolve, reject) {
  console.error(data);
  Alert.alert('Ошибка', data.textResult ? data.textResult :  'Ошибка, пожалуйста, обратитесь в банк!');
  reject(data);
}
