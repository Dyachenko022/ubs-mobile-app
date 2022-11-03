import * as types from './actionTypes';
import {LoginPage, RegistrationApp, RegistrationAppNew, Registration, RegistrationConfirm} from '../../api/actionTypes'
import {compareVersionNumbers} from '../../utils/compareVersionNumbers';
import DeviceInfo from 'react-native-device-info'
import {Platform} from 'react-native';


const noNotification = {
  typeNotification: 0,
  logo: '',
  backgroundColor: '',
  text: '',
  buttonText: '',
  textColor:  '',
};

const noVersionApp = {
  version: '',
  logo: '',
  text:'',
  backgroundColor: '',
  butonText: 'Понятно',
  action: 0,
};

const initialState = {
  loading: false,
  credentials: false,
  regimeConfirmation: 0,
  username: '',
  wrongTimes: 0,

  smsCode: {},
  notification: noNotification,
  versionApp: noVersionApp,
  wasNotificationFetched: false,
  autoenrollFaceid: true,

  versionAppWasReceived: false,
  notificationWasReceived: false,
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_CREDENTIALS:
      return {
        ...state,
        credentials: action.credentials
      };
    case types.SET_AUTOENROLL_FACEID:
      return {
        ...state,
        autoenrollFaceid: action.payload,
      }
    case LoginPage.AUTH_CONTRACT_REQ:
      return {
        ...state,
        loading: true
      };


    case LoginPage.AUTH_CONTRACT_FAI:
      return {
        ...state,
        loading: false
      };

    case LoginPage.AUTH_CONTRACT_SUC:
      return {
        ...state,
        loading: false,
        username: action.response.username,
        fullname: action.response.fullname,
        regimeConfirmation: action.response.regimeConfirmation
      };

    case RegistrationApp.SUC:
    case Registration.SUC:
      return {
        ...state,

        smsCode: action.response
      };

    case RegistrationConfirm.FAI:
      return {
        ...state,
        wrongTimes: state.wrongTimes + 1
      };
    case RegistrationConfirm.SUC:
      return {
        ...state,
        wrongTimes: 0
      };

    case types.SET_NOTIFICATION:
      return {
        ...state,
        notificationWasReceived: true,
        notification: action.payload ? {
          typeNotification: action.payload.type,
          logo: action.payload.logoApp,
          text: action.payload.text,
          backgroundColor: action.payload.backgroundColorApp,
          buttonText: action.payload.actionName,
          textColor: action.payload.textColorWeb,
        }
        : noNotification,
      };

    case types.SET_VERSION_APP:
      state.versionAppWasReceived = true;
      if (action.payload) {
        const targetPlatformParam = Platform.OS === 'ios' ? 'versionAppIOS' : 'versionAppAndroid';
        const version =  Platform.OS === 'ios' ? `${DeviceInfo.getVersion()}.${DeviceInfo.getBuildNumber()}`
                                          : DeviceInfo.getVersion();
        const initial = {};
        initial[targetPlatformParam] = version;
        const targetVersion = action.payload.reduce((accum, item) => {
          const itemVersion = item[targetPlatformParam];
          const itemVersionMoreThanCurrent = compareVersionNumbers(itemVersion, version) >= 0;

          if(!itemVersionMoreThanCurrent) return accum;
          if(itemVersionMoreThanCurrent && !accum) return item;
          if (accum) {
            const acumVersion = accum[targetPlatformParam];
            if(compareVersionNumbers(itemVersion, acumVersion) < 0) return item;
            else return acumVersion;
          }
          else return null;
        }, null);
        if(!targetVersion) return state;
        else return {
          ...state,
          versionApp: {
            version: targetVersion[targetPlatformParam],
            logo: targetVersion.logo,
            text: targetVersion.text,
            backgroundColor: targetVersion.background,
            buttonText: targetVersion.actionName,
            action: targetVersion.action,
          }
        }


      }
      else return state;

    default:
      return state;
  }
}
