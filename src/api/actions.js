import DeviceInfo from 'react-native-device-info'
import {Alert, AsyncStorage, Platform} from 'react-native';
import {Navigation} from 'react-native-navigation';
import moment from 'moment'
import {parseFormData} from '../utils/api'
import {downloadFile} from '../utils/download'

import {changeAppRoot} from '../reducers/routing/actions';
import {requestPushPermissions} from '../utils/utils';
import * as routes from './routes';
import * as types from './actionTypes';
import {SettingsFront} from './actionTypes';
import {setAutoenrollFaceid, setCredentials} from "../reducers/login/actions";

import * as messagesPageTypes from '../reducers/messagesPage/actionTypes'
import {store} from "../../App";
import {getBaseData} from 'react-native-ubs-mobile-core';

import {SET_NOTIFICATION, SET_VERSION_APP} from '../reducers/login/actionTypes';
import {pushScreen} from '../utils/navigationUtils';
import {onAuthContract} from '../actions/onAuthContract';

let filePathsLinks = {};

export async function myFetch(...params) {
  let isLog = false;

  if (params[1].method === 'POST' && !params[1].noBaseData) {
    const timeRequest = await getBaseData();
    params[1].headers['timeRequest'] = timeRequest;
  }

  if(isLog) console.log('{API REQUEST}: ', params);

  return new Promise((resolve, reject) => {
    fetch(...params)
      .then(res => {
        if (res.status > 400) {
          reject(res)
        }
        return res.json()
      })
      .then(json => {
        if(isLog) console.log('{API RESPONSE}: ', json);
        if (json.codeResult > 0 && json.codeResult !== 10) {
          return reject(json);
        }

        resolve(json);
      })
      .catch(err => {
        console.error('{ API RESPONSE ERROR}: ', err);
        console.error('APR params: ', params);
        reject(err)
      });
  })
}

/**
 *
 * @param options.method – GET or POST
 * @param options.isJwt – insert jwt to data or no
 * @param options.data – payload of request
 * @param options.requestType – redux types
 * @param options.route – url for request
 * @param options.onError – onError callback
 * @param options.onSuccess – onSuccess callback
 *
 * @returns {Function}
 */
export function requestFabric(options = {
  method: 'GET',
  isJwt: false,
  data: {},
  route: '',
  requestType: '',
  onError: () => {
  },
  onSuccess: () => {
  }
}) {
  return async function (dispatch, getState) {
    let apiRout = getState().api.apiRoute.trim();
    const hasError = getState().error.hasError;


    if (!apiRout) {
      return;
    }

    const data = Object.assign({}, options.data);
    //if (options.isJwt) {
    //  data['jwt'] = await AsyncStorage.getItem('jwt');
    //}

    if (options.requestType) {
      dispatch({
        type: options.requestType,
        data
      });
    }

    let fetchOptions = {
      method: options.method,
      credentials: "include",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin':'*',
      }
    };

    if (options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
      let jwtHeader = await AsyncStorage.getItem('jwt');
      if(options.isJwt && jwtHeader !== '') {
        fetchOptions.headers.UbsJWT = jwtHeader;
      }

      let routeTmp = options.route;
      if(routeTmp.startsWith('/')) {
        routeTmp = routeTmp.substring(1);
      }

      fetchOptions.headers.SidRequest = routeTmp;
      options.route = '/execute';

      if(routeTmp === 'execute') {
        let execute = data.sidRequest;
        let idDocument = data.parameters.find(p => p.name === 'Идентификатор документа')
        let sidDocument = data.parameters.find(p => p.name === 'Код вида документа');

        if(execute === 'undefined') {
          execute = sidDocument.value;
        }

        fetchOptions.headers.SidRequest = 'execute/' + execute;

        if(idDocument && idDocument !== 'undefined')
          data.parameters.push({name:'idDocument', type: 'int', value: idDocument.value});
        else if(sidDocument && sidDocument !== 'undefined')
          data.parameters.push({name:'sidDocument', type: 'string', value: sidDocument.value});
      }
    }

    try {
      const response = await myFetch(apiRout + options.route, fetchOptions);
      options.onSuccess(dispatch, getState, response);
      return response;
    } catch (response) {
        if (response.status === 409) {
          if (getState().routing.root !== 'login') {
            dispatch({type: types.LoginPage.EXIT_SUC});
            AsyncStorage.removeItem('push');
            dispatch(changeAppRoot('login'));
            dispatch(setAutoenrollFaceid(false));
            setTimeout(() => {
              Alert.alert(
                'Ошибка',
                'Сервис временно не работает');
            }, 550);
          }
        }
        if (response.codeResult) {
          if (response.codeResult === 2 || response.codeResult === 255 || response.codeResult === 254) {
            if (response.codeResult === 254) {
              AsyncStorage.setItem('contractId', '');
              AsyncStorage.setItem('code', '');
              dispatch(setCredentials(false));
            }
            dispatch({
              type: types.Errors.GLOBAL_ERROR_SHOW,
              error: response.textResult,
              code: response.codeResult,
              toLogin: options.toLogin
            });
          } else if (!hasError) {
            dispatch({
              type: types.Errors.GLOBAL_ERROR_SHOW,
              error: response.textResult,
              code: response.codeResult,
              toLogin: options.toLogin
            });
          }
        }
        options.onError(dispatch, getState, response);
        throw response;
    }
  }
}

export function getPathImage() {
  return routes.firstRequestBase + filePathsLinks.baseImage;
}
export function getPathImageProduct() {
  return routes.firstRequestBase + filePathsLinks.imageProducts;
}
export function getPathImageDocument() {
  return routes.firstRequestBase + filePathsLinks.imageDocuments;
}
export function getPathImageServicePayment() {
  return routes.firstRequestBase + filePathsLinks.imageServicePayment;
}
export function getPathFile() {
  return routes.firstRequestBase + filePathsLinks.unloadFiles;
}
export function getPathDescr() {
  return routes.firstRequestBase + filePathsLinks.linkProductInfo;
}

export function getNotifications(filter) {
  return (dispatch, getState) => {
    if (!filter) filter = getState().notifications.filter;
    dispatch(requestFabric({
      method: 'POST',
      route: routes.EnterPage.getNotifications,
      isJwt: true,
      data: {
        ...filter,
      },
      requestType: types.GetNotifications.REQ,
      onSuccess: (dispatch, getState, response) => {
        dispatch({ type: types.GetNotifications.SUC, payload: {
          notifications: response.notifications,
          countUnreadMessages: response.countUnreadMessages,
        }});
      },
      onError: (dispatch) => {
        dispatch({ type: types.GetNotifications.FAI });
      }
    }));
  }
}

export function sync() {
  return (dispatch) => {
    dispatch(requestFabric({
      method: 'POST',
      route: routes.EnterPage.sync,
      isJwt: true,
      requestType: types.MyBankPage.SYNC_REQ,

      onSuccess: async (dispatch, getState, response) => {
        dispatch({ type: types.MyBankPage.SYNC_SUC, response });
        dispatch(getCards());
        dispatch(getDeposits());
        dispatch(getCredits());
        dispatch(getAccounts());
      },
      onError: (dispatch, getState, response) => {
        dispatch({
          type: types.MyBankPage.SYNC_FAI,
          response
        })
      }
    }))
  }
}

export function getAcceptances() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getAcceptances,
    isJwt: true,
    requestType: types.SbpAcceptancesPage.GET_ACCEPTANCES_REQ,
    data: {},
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.SbpAcceptancesPage.GET_ACCEPTANCES_SUC,
        payload: response.acceptances,
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.SbpAcceptancesPage.GET_ACCEPTANCES_ERR,
        payload: {}
      });
    }
  });
}

export function deliveredPush(dateDelivered, guid, uid, text) {
  return async (dispatch, getState) => {
    const apiRout = getState().api.apiRoute;
    await myFetch(apiRout + routes.EnterPage.getRates, {
      method: "POST",
      noBaseData: true,
      headers: {
        'Content-Type': 'application/json',
        'sidRequest': 'deliveredPush',
      },
      body: JSON.stringify({
        uid,
        text,
        dateDelivered,
        guid,
      })
    });
  };
}

export function checkContractData() {
  return async (dispatch, getState) => {
    const apiRout = getState().api.apiRoute;
    try {
      const response = await myFetch(apiRout + routes.EnterPage.getRates, {
        method: 'POST',
        headers: {
          ubsJwt: await AsyncStorage.getItem('jwt'),
          'Content-Type': 'application/json',
          'sidRequest': routes.EnterPage.checkContractData,
        },
      });
    } catch (e) {
      if (e.codeResult === 4 || e.codeResult === 5) {
        dispatch({
          type: types.UserInfo.CHECK_CONTRACT_DATA,
          payload: {
            visible: true,
            shouldLogout: e.codeResult === 5,
            text: e.textResult,
          }
        });
      }
    }
  }
}

export function getServiceBranch() {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    dispatch({
      type: types.GetServiceBranch.REQ
    });

    // Dispatch vanilla actions asynchronously
    return myFetch(routes.EnterPage.getServiceBranch, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(
      async response => {
        //let currentApiRoute = AsyncStorage.getItem('apiRoute');


        if (true || response.length === 1) {
          dispatch({
            type: types.GetServiceBranch.SET_API_ROUTE,
            route: response[0].urlApi,
            changeRegion: false //20200406 one region
          });
          await AsyncStorage.setItem('apiRoute', response[0].urlApi); //20200406

        } else {
          dispatch({
            type: types.GetServiceBranch.SUC,
            response
          })
        }
      },
      error =>
        dispatch({
          type: types.GetServiceBranch.FAI,
          error
        })
    )
  }
}

export function advertising() {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;

    dispatch({
      type: types.LoginPage.GET_AD_REQ
    });
    // Dispatch vanilla actions asynchronously
    myFetch(apiRout + routes.EnterPage.advertising, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({
      //   Token: token
      // })
    }).then(
      response => {
        dispatch({
          type: types.LoginPage.GET_AD_SUC,
          response
        })
      },
      error =>
        dispatch({
          type: types.LoginPage.GET_AD_FAI,
          error
        })
    )
  };
}

export function getRates() {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;

    dispatch({
      type: types.LoginPage.GET_RATES_REQ
    });

    myFetch(apiRout + routes.EnterPage.getRates, { //20200406-
      method: "POST",
      noBaseData: true,
      headers: {
        'Content-Type': 'application/json',
        'sidRequest': 'rates',
      }
    }).then(
      response => {
        dispatch({
          type: types.LoginPage.GET_RATES_SUC,
          response
        })
      },
      error =>
        dispatch({
          type: types.LoginPage.GET_RATES_FAI,
          error
        })
    )
  }
}

export function serviceNotification() {
  return async function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;
    if (!apiRout) return;

    return myFetch(apiRout + routes.EnterPage.serviceNotification, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      },
    }).then(
      response => {
        dispatch({
          type: SET_NOTIFICATION,
          payload: response
        });
      })
      .catch(
        error => {
          dispatch({
            type: SET_NOTIFICATION,
            payload: null,
          });
        }
      )
  }
}

export function settingsFront() {
  return async function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;
    if (!apiRout) return;

    const settingUsr = myFetch(apiRout + routes.EnterPage.settingsFrontUsr, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      },
    }).then(
      response => {
        dispatch({
          type: SettingsFront.SUC,
          payload: response
        });
      });
    const settingsSys = myFetch(apiRout + routes.EnterPage.settingsFrontSys, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      },
    }).then( response => filePathsLinks = response.api.filePathsLinks);
    return Promise.all([settingsSys, settingUsr]);
  }
}

export function versionApp(onSuccess) {
  return async function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;
    if (!apiRout) return;

    return myFetch(apiRout + routes.EnterPage.versionApp, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0
      },
    }).then(
      response => {
        dispatch({
          type: SET_VERSION_APP,
          payload: response
        });
        onSuccess && onSuccess();
      })
      .catch(
        error => {
          dispatch({
            type: SET_VERSION_APP,
            payload: null,
          });
          onSuccess && onSuccess();
        }
      )
  }
}

export function news() {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;
    if (!apiRout) return;

    dispatch({
      type: types.NewsPage.GET_NEWS_REQ
    });

    // Dispatch vanilla actions asynchronously
    myFetch(apiRout + routes.EnterPage.news, { //20200406 -
    //myFetch(apiRout + '/public/news.json', { //20200406 +
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
      },
      // body: JSON.stringify({
      //   Token: token
      // })
    }).then(
      response => {
        dispatch({
          type: types.NewsPage.GET_NEWS_SUC,
          response
        })
      },
      error =>
        dispatch({
          type: types.NewsPage.GET_NEWS_FAI,
          error
        })
    )
  }
}

export function getMapPoints() {
  return requestFabric({
    method: 'GET',
    isJwt: false,
    route: routes.EnterPage.getMapPoints,
    requestType: types.MapPage.GET_MAP_REQ,

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.MapPage.GET_MAP_SUC,
        response
      })
    },
    onError: async (dispatch, getState, response) => {
      dispatch({
        type: types.MapPage.GET_MAP_FAI,
        response
      })
    }
  })
}

export function clearSession() {
  return function (dispatch) {
    AsyncStorage.clear();
    dispatch(setCredentials(false));

    //dispatch({
    //  type: types.GetServiceBranch.SET_API_ROUTE,
    //  route: ''
    //});
    dispatch(getServiceBranch());
  };
}

export function changeUser() {

  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.exit,
    isJwt: true,
    requestType: types.LoginPage.EXIT_REQ,

    onSuccess: async (dispatch, getState, response) => {
      dispatch({ type: types.LoginPage.EXIT_SUC });
      dispatch(clearSession());
      dispatch(changeAppRoot('login'));
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.EXIT_FAI,
        response
      })
    }
  });
}

export function getPersonalOffers() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getPersonalOffers,
    isJwt: true,

    onSuccess: async (dispatch, getState, response) => {

      if(response.offers) response.offers = response.offers.map(item => {
        item.logo = getPathImage() + item.logo;
        return item;
      });

      dispatch({ type: types.personalOffers.SUC, payload: response });
    },
    onError: (dispatch, getState, response) => {
      console.error(response);
    }
  });
}

export function changePersonalOfferState(id, state) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.changeOfferStatus,
    isJwt: true,
    data: {id, state}
  });
}

export function getPersonalOfferDescription(id) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getPersonalOfferDescription,
    isJwt: true,
    data: {id},
    onSuccess: async (dispatch, getState, response) => {
      if (response.logo) response.logo = getPathImage() + response.logo;
      dispatch({type: types.personalOffers.OFFER_DESCRIPTION_SUC, payload: response,})
    }
  })
}

export function exit() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.exit,
    isJwt: true,
    requestType: types.LoginPage.EXIT_REQ,

    onSuccess: async (dispatch, getState, response) => {
      const { text, visible } = getState().userInfo.checkContractData
      dispatch({ type: types.LoginPage.EXIT_SUC });
      // вероятно надо чистить все, но сделал ровно по задаче
      AsyncStorage.removeItem('push');
      dispatch(changeAppRoot('login'));
      if(visible) {
        Navigation.showOverlay({
          component: {
            name: 'unisab/contractDataErrorModal',
            passProps: {
              text
            },
            options: {
              layout: {
                componentBackgroundColor: 'transparent',
              },
              overlay: {
                interceptTouchOutside: true
              }
            }
          }
        });
      }
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.EXIT_FAI,
        response
      })
    }
  });
}

export function authBase({ username, hash }, onSuccess = () => {
}, onFail = () => {
}) {

  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.authBase,
    isJwt: false,
    data: {
      username, password: hash, source: 'MobileApplication'
    },
    requestType: types.LoginPage.AUTH_BASE_REQ,

    onSuccess: async (dispatch, getState, response) => {
      const jwt = response['jwt'];

      if(jwt)
        await AsyncStorage.setItem('jwt', jwt);

      // TODO: change to encrypt store
      //await AsyncStorage.setItem('username', username);
      //await AsyncStorage.setItem('password', hash);

      dispatch({
        type: types.LoginPage.AUTH_BASE_SUC,
        response
      });

      if (!response.contracts || response.contracts.length === 0) {
        Alert.alert(
          'Ошибка',
          'У абонента нет оплаченных договоров',
          [
            {
              text: 'Закрыть',
              onPress: () => {
              }
            }
          ]
        )
      } else if (response.contracts.length === 1) {
        dispatch(authContract(response.contracts[0].id));
      } else {
        onSuccess();
      }
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.AUTH_BASE_FAI,
        response
      });

      dispatch({
        type: types.Errors.GLOBAL_ERROR_SHOW,
        error: 'Пожалуйста обратитесь в банк!',
        code: 2,
        toLogin: false
      });

      onFail();
    }
  });
}
export function authCode({ uidDevice, authKey, deviceInfo }, onSuccess = () => {
}, onFail = () => {
}) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.authCode,
    isJwt: false,
    data: {
      uid: uidDevice, code: authKey, deviceInfo
    },
    requestType: types.LoginPage.AUTH_BASE_REQ,

    onSuccess: async (dispatch, getState, response) => {
      const jwt = response['jwt'];

      if(jwt)
        await AsyncStorage.setItem('jwt', jwt);

      // TODO: change to encrypt store
      //await AsyncStorage.setItem('username', username);
      //await AsyncStorage.setItem('password', hash);

      dispatch({
        type: types.LoginPage.AUTH_BASE_SUC,
        response
      });

      if (!response.contracts || response.contracts.length === 0) {
        Alert.alert(
          'Ошибка',
          'У абонента нет оплаченных договоров',
          [
            {
              text: 'Закрыть',
              onPress: () => {
              }
            }
          ]
        )
      } else if (response.contracts.length === 1) {
        dispatch(authContract(response.contracts[0].id));
      } else {
        onSuccess();
      }p
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.AUTH_BASE_FAI,
        response
      });

      dispatch({
        type: types.Errors.GLOBAL_ERROR_SHOW,
        error: 'Пожалуйста обратитесь в банк!',
        code: 2,
        toLogin: false
      });

      onFail();
    }
  });
}

export function changePassword(password, onSuccess) {
    return requestFabric({
        method: 'POST',
        route: routes.EnterPage.changePassword,
        isJwt: true,
        data: {
          password,
        },
        requestType: '',
        onSuccess: (dispatch, getState, response) => {
          onSuccess && onSuccess();
        },
      }
    );
}

export function authContract(id, componentId) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.authContract,
    isJwt: true,
    data: {
      id
    },
    requestType: types.LoginPage.AUTH_CONTRACT_REQ,

    onSuccess: async (dispatch, getState, response) => {
      onAuthContract(id, response, dispatch, componentId)
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.AUTH_CONTRACT_FAI,
        response
      })
    }
  });
}

export function registrationAppNew( codeAuth, contractId ) {
  //let brand = DeviceInfo.getBrand() === 'Unknown' ? '' : DeviceInfo.getBrand();
  //let model = DeviceInfo.getModel() === 'Unknown' ? '' : DeviceInfo.getModel();
  let uniqueID = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
  let deviceId = DeviceInfo.getDeviceId() === 'Unknown' ? '' : DeviceInfo.getDeviceId();
  //let contractId = await AsyncStorage.getItem('contractId');
  let deviceName = DeviceInfo.getDeviceName() === 'Unknown' ? DeviceInfo.getModel() : DeviceInfo.getDeviceName();
  //let serialNumber = DeviceInfo.getSerialNumber() === 'Unknown' ? '' : DeviceInfo.getSerialNumber();
  //let codeAuth = '22222';//await AsyncStorage.getItem('code');  //loginCode

  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.registrationAppNew,
    requestType: types.RegistrationAppNew.REQ,
    data: {
      uid: uniqueID +'##' + deviceId + '##' + contractId,               //loginCode
      code: codeAuth,               //loginCode
      name: deviceName,
    },

    toLogin: true,
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.RegistrationAppNew.SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      // dispatch(changeAppRoot('login'));

      response.codeResult = 3;
      dispatch({
        type: types.RegistrationAppNew.FAI,
        response
      })
    }
  })
}

export function registrationApp() {
  // let device = DeviceInfo

  // console.log(DeviceInfo);


  let brand = DeviceInfo.getBrand() === 'Unknown' ? '' : DeviceInfo.getBrand();
  let model = DeviceInfo.getModel() === 'Unknown' ? '' : DeviceInfo.getModel();
  let uniqueID = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
  let deviceId = DeviceInfo.getDeviceId() === 'Unknown' ? '' : DeviceInfo.getDeviceId();
  let deviceName = DeviceInfo.getDeviceName() === 'Unknown' ? '' : DeviceInfo.getDeviceName();
  let serialNumber = DeviceInfo.getSerialNumber() === 'Unknown' ? '' : DeviceInfo.getSerialNumber();
  //let codeAuth = '11111';//await AsyncStorage.getItem('code');  //loginCode

  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.registrationApp,
    requestType: types.RegistrationApp.REQ,
    data: {
      //type: `${brand} ${model}`,   //loginCode
      //uid: uniqueID,               //loginCode
      //name: deviceName || model,   //loginCode
      //code: codeAuth               //loginCode
    },

    toLogin: true,
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.RegistrationApp.SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      // dispatch(changeAppRoot('login'));

      response.codeResult = 3;
      dispatch({
        type: types.RegistrationApp.FAI,
        response
      })
    }
  })
}

/*
* numCard: '4215897811101111',
  numPhone: '9152677788',
  fio: 'Кравцова Валентина Николаевна',
  numDoc: 'VII-ФР 589059',
  login: 'krav'

  {
    numCard: "4215897811101111",
    numPhone: "+79152677788",
    numDoc: "VII-ФР 589059",

    fio: "Кравцова Валентина Николаевна",
    login: "krav"
  }

* */
export function registration(data) {
  return requestFabric({
    method: 'POST',
    // isJwt: true,
    route: routes.EnterPage.registration,
    requestType: types.Registration.REQ,
    data,

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.Registration.SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.Registration.FAI,
        response
      })
    }
  })
}

export function registrationConfirm(guid, code, isRegistration = false) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.registrationConfirm,
    requestType: types.Registration.REQ,
    data: {
      guidRequest: guid,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.RegistrationConfirm.SUC,
        response
      });

      if (isRegistration) {
        Alert.alert(
          'Статус',
          'Регистрация успешно завершена!',
          [
            {
              text: 'Закрыть',
              onPress: () => {
                Navigation.dismissAllModals();
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        dispatch(changeAppRoot('codeSettings'));
      }
    },
    onError: (dispatch, getState, response) => {
      const { wrongTimes } = getState().login;

      if (wrongTimes >= 2) {
        dispatch({
          type: types.RegistrationConfirm.SUC,
          response
        });
        // dispatch(changeAppRoot('login'));
      } else {
        dispatch({
          type: types.RegistrationConfirm.FAI,
          response
        })
      }
    }
  })
}

export function confirmSms( code ) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.confirm,
    requestType: types.LoginPage.AUTH_CONFIRM_REQ,
    data: {
      "code": code
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.AUTH_CONFIRM_SUC,
        response
      });
      dispatch(changeAppRoot('codeSettings'));
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.LoginPage.AUTH_CONFIRM_FAI,
        response
      })
    }
  })
}

export function setTokenApplication(token, tokenType, deviceName) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.execute,
    requestType: types.SettingsPage.SET_TOKEN_REQ,
    data: {
      "sidRequest": 'SetTokenApplication',
      "parameters": [
        {
          "name": "token",
          "type": "string",
          "value": token
        },
        {
          "name": "uid",
          "type": "string",
          "value": DeviceInfo.getUniqueId(),
        },
        {
          "name": "tokenType",
          "type": "string",
          "value": tokenType,
        },
        {
          "name": "nameDevice",
          'type': 'string',
          'value': deviceName,
        }
      ]
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.SettingsPage.SET_TOKEN_SUC
      });
      try {
        for (let i = 0; i < response.values.length; i++) {
          if (response.values[i].name === 'Признак активности пуш уведомлений') {
            const pushValue = response.values[i].value;
            if (pushValue) {
              await AsyncStorage.setItem('push', '1');
              dispatch({type: types.SettingsPage.ENABLED_PUSH_SUC});
            } else {
              await AsyncStorage.setItem('push', '');
              dispatch({type: types.SettingsPage.DISABLED_PUSH_SUC});
            }
          }
        }
      } catch (e) {
        // просто на случай кривого ответа с сервера
      }
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.SettingsPage.SET_TOKEN_FAI
      })
    }
  })
}

export function pushON({ uid, token, tokenType }) {
  return (async (dispatch) => {
    let name = '';
    try {
      name = `${Platform.OS === 'ios' ? DeviceInfo.getModel() : DeviceInfo.getBrand()} - ${await DeviceInfo.getDeviceName()}`;
    } catch (e) {
      name = 'UnknownName';
      console.error(e);
    }

    if (__DEV__) {  //Чтобы не было ошибки устройство зарегетрировано
      const devSuffix = await AsyncStorage.getItem('devSuffix');
      name = name + devSuffix;
    }

    dispatch(requestFabric({
      method: 'POST',
      isJwt: true,
      route: routes.EnterPage.execute,
      requestType: types.SettingsPage.ENABLED_PUSH_REQ,
      data: {
        "sidRequest": 'EnabledPushNotification',
        "parameters": [
          {
            "name": "token",
            "type": "string",
            "value": token
          },
          {
            "name": "uid",
            "type": "string",
            "value": uid
          },
          {
            "name": "nameDevice",
            "type": "string",
            "value": name
          },
          {
            "name": "tokenType",
            "type": "string",
            "value": tokenType
          },
        ]
      },

      onSuccess: async (dispatch, getState, response) => {
        await AsyncStorage.setItem('push', '1');
        dispatch({
          type: types.SettingsPage.ENABLED_PUSH_SUC
        })
      },
      onError: (dispatch, getState, response) => {
        dispatch({
          type: types.SettingsPage.ENABLED_PUSH_FAI
        })
      }
    }))
  });
}

export function pushOFF({ uid }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.execute,
    requestType: types.SettingsPage.DISABLED_PUSH_REQ,
    data: {
      "sidRequest": 'DisabledPushNotification',
      "parameters": [
        {
          "name": "uid",
          "type": "string",
          "value": uid
        },
      ]
    },

    onSuccess: async (dispatch, getState, response) => {
      await AsyncStorage.setItem('push', '');
      dispatch({
        type: types.SettingsPage.DISABLED_PUSH_SUC
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.SettingsPage.DISABLED_PUSH_FAI
      })
    }
  })
}

/**
 * User Info
 * */
export function getFotoAbonent() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getFotoAbonent,
    isJwt: true,
    requestType: types.UserInfo.GET_USER_PHOTO_REQ,

    onSuccess: async (dispatch, getState, response) => {
      response.foto = getPathFile() + response.foto;
      dispatch({
        type: types.UserInfo.GET_USER_PHOTO_SUC,
        response
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.UserInfo.GET_USER_PHOTO_FAI,
        response
      })
    }
  });
}

export function disconnectApp(name) {
  return requestFabric({
    method:'POST',
    route: routes.EnterPage.disconnectApp,
    isJwt: true,
    data: { name }
  });
}

export function saveFotoAbonent({ photo, onSuccess, onError }) {
  return async (dispatch, getState) => {
    const basePath = getState().api.apiRoute.trim();
    const path = basePath + 'execute';
    const jwt = await AsyncStorage.getItem('jwt');
    const method = 'POST';

    const headers = {
      'UbsJWT': jwt,
      'sidRequest': 'saveFotoAbonent'
    };

    const body = new FormData();
    //body.append('jwt', jwt);
    body.append('file', photo);

    return myFetch(path, {body, headers, method}).then(onSuccess, onError);

  }
}

export function getProducts() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getProducts,
    isJwt: true,
    data: {
      source: 'MobileApplication',
    },

    onSuccess: async (dispatch, getState, response) => {

      if(response.categories.length > 0) {
        response.categories.forEach(item => item.logo = routes.staticPathToApi + item.logo);
      }

      if(response.products.length > 0) {
        response.products.forEach(item => item.logo = getPathImageProduct() + item.logo);
      }

      dispatch({
        type: types.NewProductsPage.GET_NEW_PRODUCTS_SUC,
        payload: response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.NewProductsPage.GET_NEW_PRODUCTS_ERR,
        payload: response
      })
    }
  });
}

export function getUserInfo() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getUserInfo,
    isJwt: true,
    requestType: types.UserInfo.GET_USER_INFO_REQ,

    onSuccess: async (dispatch, getState, response) => {

      dispatch({
        type: types.UserInfo.GET_USER_INFO_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.UserInfo.GET_USER_INFO_FAI,
        response
      })
    }
  });
}

/**
 * User Info END
 * */

/**
 * Messages
 * */
export function getMessages() {
  return (dispatch) =>
  dispatch(requestFabric({
    method: 'POST',
    route: routes.EnterPage.getUnreadMessages,
    isJwt: true,
    requestType: types.MessagesPage.GET_MESSAGES_REQ,
    data: {
      allMessages: true
    },

    onSuccess: async (dispatch, getState, response) => {

      let inMessages = response.messages;
      let unreadMessages = response.messages.filter(el => el.state === '0');

      dispatch({
        type: messagesPageTypes.SET_UNREAD_MESSAGES_COUNT,
        unreadMessagesCount: unreadMessages.length
      });

      dispatch({
        type: types.MessagesPage.GET_MESSAGES_SUC,
        inMessages,
        unreadMessages
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.GET_MESSAGES_FAI,
        response
      })
    }
  }));
}

export function getOutcomeMessages(params) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.listDocuments,
    requestType: types.MessagesPage.GET_SENT_MESSAGES_REQ,
    data: {
      ...params
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.GET_SENT_MESSAGES_SUC,
        outMessages: response.documents,
        count: response.countDocs
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.GET_SENT_MESSAGES_FAI,
        response
      })
    }
  })
}

export function readMessage(guid) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.readMessage,
    isJwt: true,
    requestType: types.MessagesPage.READ_MESSAGE_REQ,
    data: {
      guidMessage: guid
    },

    onSuccess: async (dispatch, getState, response) => {
      let pathToFile = getPathFile();
      let filesrsp = response.files;
      filesrsp = filesrsp.map(el => {
        let newEl = el;
        newEl[0] = pathToFile + newEl[0].replace(/[\\]/g, "/");
        return newEl;
      });

      dispatch({
        type: types.MessagesPage.READ_MESSAGE_SUC,
        msgInfo: { files: filesrsp },
        guid
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.READ_MESSAGE_FAI,
        response
      })
    }
  });
}

export function stateMessage(guid, state) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.stateMessage,
    isJwt: true,
    requestType: types.MessagesPage.STATE_MESSAGE_REQ,
    data: {
      guidMessage: guid,
      state
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.STATE_MESSAGE_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.STATE_MESSAGE_FAI,
        response
      })
    }
  });
}

export function stateNotification(guid, state) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.stateNotification,
    isJwt: true,
    requestType: '',
    data: {
      guidMessage: guid,
      state
    },

    onSuccess: async (dispatch, getState, response) => {

    },
    onError: (dispatch, getState, response) => {

    }
  });
}

export function getUnreadNotifications() {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.getUnreadNotifications,
    isJwt: true,
    requestType: types.GetUnreadNotifications.REQ,
    data: {},
    onSuccess: async (dispatch, getState, response) => {

      const oldUnreadMessages = getState().notifications.unreadMessages;
      dispatch({ type: types.GetUnreadNotifications.SUC, payload: response.countUnreadMessages });

      if (oldUnreadMessages !== response.countUnreadMessages) {
        const filter = getState().notifications.filter;
        dispatch(getNotifications({...filter, pageNum: 1}));
      }
    },
    onError: (dispatch, getState, response) => {

    }
  });
}

export function readOutMessage(doc) {
  let { id, stateCode, stateName } = doc;

  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.execute,
    requestType: types.MessagesPage.READ_SENT_MESSAGES_REQ,
    data: {
      parameters: [{
        name: "Идентификатор документа", value: id, type: "int", typeColumns: null
      }, {
        name: "Код вида документа", value: "getDocument", type: "string", typeColumns: null
      }, {
        name: "Вид операции", value: "Просмотр", type: "string", typeColumns: null
      }],
      sidRequest: "getDocument",
      id
    },
    onSuccess: async (dispatch, getState, response) => {
      let data = parseFormData(response);
      let { values } = data;

      let filesRsp = response.files;
      if(filesRsp) {
        let pathToFile = getPathFile();
        filesRsp = filesRsp.map(el => {
          let newEl = el;
          newEl.file = pathToFile + newEl.file.replace(/[\\]/g, "/");
          return newEl;
        });
      }

      let msgInfo = {
        date: moment(values['Документ.Дата'].value).format('DD.MM.YYYY'),
        theme: values['Сообщение.Заголовок'].value,
        reason: values['Причина отбраковки'] ? values['Причина отбраковки'].value : '',
        statusCode: stateCode,
        statusMsg: stateName,
        message: values['Документ.Назначение платежа'].value,
        files: filesRsp
      };

      dispatch({
        type: types.MessagesPage.READ_SENT_MESSAGES_SUC,
        id,
        msgInfo
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MessagesPage.READ_SENT_MESSAGES_FAI,
        response
      })
    }
  })
}

/**
 * Messages END
 * */

/**
 * Templates
 * */
export function getTemplates({ countDocs = 10 }) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.listDocuments,
    isJwt: true,
    requestType: types.TemplatesPage.GET_TEMPLATES_REQ,
    data: {
      "dateFrom": "01.01.2222",
      "dateTo": "01.01.2222",
      "source": "",
      "amount": 0,
      "currency": "",
      "recipient": "",
      "showFavorite": 0,
      "stateCode": [255],
      "sidDoc": "",
      "pageRows": countDocs,
      "pageNum": 1
    },

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImage();
      let documents = response.documents || [];
      documents = documents.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });
      response.documents = documents;
      dispatch({
        type: types.TemplatesPage.GET_TEMPLATES_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.TemplatesPage.GET_TEMPLATES_FAI,
        response
      })
    }
  });
}

export function deleteTemplate(id) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.execute,
    isJwt: true,
    requestType: types.TemplatesPage.DELETE_TEMPLATE_REQ,
    data: {
      sidRequest: 'Delete',
      idDocument: id,
      parameters: [{
        name: 'Код вида документа',
        type: 'string',
        value: 'Delete'
      }, {
        name: 'Идентификатор документа',
        type: 'int',
        value: parseInt(id, 10)
      }]
    },
    onSuccess: async (dispatch, getState, response) => {
      Alert.alert(
        'Удаление шаблона',
        'Успешно!',
        [
          {
            text: 'Закрыть',
            onPress: () => {
            }
          }
        ]
      )
      dispatch({
        type: types.TemplatesPage.DELETE_TEMPLATE_SUC
      });
      dispatch(getTemplates({ countDocs: 10 }));
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.TemplatesPage.DELETE_TEMPLATE_FAI
      })
    }
  })
}

export function renameTemplate({ id, name }) {
  return requestFabric({
    method: 'POST',
    route: routes.EnterPage.execute,
    isJwt: true,
    requestType: types.TemplatesPage.RENAME_TEMPLATE_REQ,
    data: {
      sidRequest: 'SetNameTemplate',
      parameters: [
        { "name": "Идентификатор документа", "type": "int", "value": id },
        { "name": "Шаблон.Название", "type": "string", "value": name }
      ]
    },
    onSuccess: async (dispatch, getState, response) => {
      Alert.alert(
        'Переименование шаблона',
        'Успешно!',
        [
          {
            text: 'Закрыть',
            onPress: () => {
            }
          }
        ]
      )
      dispatch({
        type: types.TemplatesPage.RENAME_TEMPLATE_SUC
      });
      dispatch(getTemplates({ countDocs: 50 }));
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.TemplatesPage.RENAME_TEMPLATE_FAI
      })
    }
  })
}

/**
 * Templates END
 * */

export function getCards() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCards,
    requestType: types.MyBankPage.GET_CARDS_REQ,
    data: {
      platform: Platform.OS,
    },

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImageProduct();
      let cards = response.cards;
      cards = cards.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });
      response.cards = cards;

      dispatch({
        type: types.MyBankPage.GET_CARDS_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MyBankPage.GET_CARDS_FAI,
        response
      })
    }
  })
}

function getProductActionByType(type) {
  switch (type) {
    case 'cards':
      return types.ProductPage.GET_CARD_INFO_SUC;
    case 'deposits':
      return types.ProductPage.GET_DEPOSIT_INFO_SUC;
    case 'credits':
      return types.ProductPage.GET_CREDIT_INFO_SUC;
    case 'accounts':
      return types.ProductPage.GET_ACCOUNT_INFO_SUC;
  }
}

export function setProductInfo({ product, type }) {
  const productActionType = getProductActionByType(type);

  return {
    type: productActionType,
    response: product
  }
}

export function getCardInfo(id) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCardInfo,
    requestType: types.ProductPage.GET_CARD_INFO_REQ,
    data: {
      idObject: id
    },

    onSuccess: async (dispatch, getState, response) => {
      response.logo = getPathImageProduct() + response.logo;
      response.linkProductInfo = getPathDescr() + response.linkProductInfo;
      dispatch({
        type: types.ProductPage.GET_CARD_INFO_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CARD_INFO_FAI,
        response
      })
    }
  })
}

export function getPart2Card(idObject) {
    return requestFabric({
      method: 'POST',
      isJwt: true,
      route: routes.EnterPage.getpart2card,
      requestType: types.ProductPage.GET_CARD2_PART_REQ,
      data: {
        idObject,
        type: 2,
      },
      onSuccess: (dispatch, getState, response) => {
        dispatch({
          type: types.ProductPage.GET_CARD2_PART_SUC,
          payload: response.part2,
          showUnmaskedCard: true,
        })
      }
    }
  );
}

export function getCardCvvCode(idObject) {
  return requestFabric({
      method: 'POST',
      isJwt: true,
      route: routes.EnterPage.getpart2card,
      requestType: types.ProductPage.GET_CARD_CVV_REQ,
      data: {
        idObject,
        type: 1,
      },
      onSuccess: (dispatch, getState, response) => {
        dispatch({
          type: types.ProductPage.GET_CARD_CVV_SUC,
          payload: response.part2,
          showUnmaskedCard: true,
        })
      }
    }
  );
}

export function sendRequisitesCard(idObject) {
  return requestFabric({
      method: 'POST',
      isJwt: true,
      route: routes.EnterPage.sendrequsitescard,
      requestType: 'tt',
      data: {
        idObject,
      },
      onSuccess: (dispatch, getState, response) => {
        Alert.alert('Внимание', response.textResult);
      },
    onError: (dispatch, getState, response) => console.error(response)
    }
  );
}

export function getCardOperations(id) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCardOperations,
    requestType: types.ProductPage.GET_CARD_OP_REQ,
    data: {
      idObject: id
    },

    onSuccess: async (dispatch, getState, response) => {
      let order = [];
      let operations = {};
      response.operations.forEach(el => {

        let date = moment(el.dateTrn, 'DD.MM.YYYY').format('DD MMM YYYY');

        if (operations[date]) {
          operations[date].push(el)
        } else {
          operations[date] = [];
          order.push(date);
          operations[date].push(el);
        }
      });

      dispatch({
        type: types.ProductPage.GET_CARD_OP_SUC,
        order,
        operations
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CARD_OP_FAI,
        response
      })
    }
  })
}

export function getDeposits() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getDeposits,
    requestType: types.MyBankPage.GET_DEPOSITS_REQ,

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImageProduct();
      let deposits = response.deposits;
      deposits = deposits.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });
      response.deposits = deposits;

      dispatch({
        type: types.MyBankPage.GET_DEPOSITS_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MyBankPage.GET_DEPOSITS_FAI,
        response
      })
    }
  })
}

export function getCardLimits(idObject) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCardLimits,
    requestType: types.LimitsPage.GET_LIMITS_REQ,
    data: {
      idObject,
    },
    onSuccess: (dispatch, getState, response) => {
      const limits = response.limits;
      dispatch({type: types.LimitsPage.GET_LIMITS_SUC, payload: limits});
    }
  });
}

function getProductInfoHOC({ idObject, route, requestType, successType, failType, code }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: route,
    requestType: requestType,
    data: {
      idObject,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      response.logo = getPathImageProduct() + response.logo;
      response.linkProductInfo = getPathDescr() + response.linkProductInfo;
      dispatch({
        type: successType,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: failType,
        response
      })
    }
  })
}

function getProductOperationsHOC({ idObject, route, requestType, successType, failType, code }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: route,
    requestType: requestType,
    data: {
      idObject,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      let order = [];
      let operations = {};

      response.operations.forEach(el => {
        let date = moment(el.dateTrn, 'DD.MM.YYYY').format('DD MMM YYYY');

        if (operations[date]) {
          operations[date].push(el)
        } else {
          operations[date] = [];
          order.push(date);
          operations[date].push(el);
        }
      });

      dispatch({
        type: successType,
        order,
        operations
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: failType,
        response
      })
    }
  })
}

export function getDepositInfo(id) {
  return getProductInfoHOC({
    route: routes.EnterPage.getDepositInfo,
    idObject: id,
    code: 'FDEP',
    requestType: types.ProductPage.GET_DEPOSIT_INFO_REQ,
    successType: types.ProductPage.GET_DEPOSIT_INFO_SUC,
    failType: types.ProductPage.GET_DEPOSIT_INFO_FAI
  });
}

export function getDepositOperations(id) {
  return getProductOperationsHOC({
    idObject: id,
    code: 'FDEP',
    route: routes.EnterPage.getDepositOperations,
    requestType: types.ProductPage.GET_DEPOSIT_OP_REQ,
    successType: types.ProductPage.GET_DEPOSIT_OP_SUC,
    failType: types.ProductPage.GET_DEPOSIT_OP_FAI
  });
}

export function getDepositProxy(id) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getDepositProxy,
    requestType: types.ProductPage.GET_DEPOSIT_PROXY_REQ,
    data: {
      idObject: id
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_DEPOSIT_PROXY_SUC,
        proxy: response.proxy
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_DEPOSIT_PROXY_FAI,
        response
      })
    }
  })
}

export function getAccounts() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getAccounts,
    requestType: types.MyBankPage.GET_ACCOUNTS_REQ,

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImageProduct();
      let accounts = response.accounts;
      accounts = accounts.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });
      response.accounts = accounts;

      dispatch({
        type: types.MyBankPage.GET_ACCOUNTS_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MyBankPage.GET_ACCOUNTS_ERR,
        response
      })
    }
  })
}

export function getAccountInfo(id) {
  return getProductInfoHOC({
    idObject: id,
    code: 'OD',
    route: routes.EnterPage.getAccountInfo,
    requestType: types.ProductPage.GET_ACCOUNT_INFO_REQ,
    successType: types.ProductPage.GET_ACCOUNT_INFO_SUC,
    failType: types.ProductPage.GET_ACCOUNT_INFO_FAI
  });
}

export function getAccountOperations(id) {
  return getProductOperationsHOC({
    idObject: id,
    code: 'OD',
    route: routes.EnterPage.getAccountOperations,
    requestType: types.ProductPage.GET_ACCOUNT_OP_REQ,
    successType: types.ProductPage.GET_ACCOUNT_OP_SUC,
    failType: types.ProductPage.GET_ACCOUNT_INFO_FAI
  });
}

export function getCredits() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCredits,
    requestType: types.MyBankPage.GET_CREDITS_REQ,

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImageProduct();
      let credits = response.credits;
      credits = credits.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });
      response.credits = credits;

      dispatch({
        type: types.MyBankPage.GET_CREDITS_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MyBankPage.GET_CREDITS_FAI,
        response
      })
    }
  })
}

export function getCreditInfo(id, code) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCreditInfo,
    requestType: types.ProductPage.GET_CREDIT_INFO_REQ,
    data: {
      idObject: id,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      response.logo = getPathImageProduct() + response.logo;
      response.linkProductInfo = getPathDescr() + response.linkProductInfo;
      dispatch({
        type: types.ProductPage.GET_CREDIT_INFO_SUC,
        response
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CREDIT_INFO_FAI,
        response
      })
    }
  })
}

export function getCreditOperations(id, code) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCreditOperations,
    requestType: types.ProductPage.GET_CREDIT_OP_REQ,
    data: {
      idObject: id,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      let order = [];
      let operations = {};
      response.operations.forEach(el => {

        let date = moment(el.dateTrn, 'DD.MM.YYYYTHH:mm:ss.mmm').format('DD MMM YYYY');
        if (operations[date]) {
          operations[date].push(el)
        } else {
          operations[date] = [];
          order.push(date);
          operations[date].push(el);
        }
      });

      dispatch({
        type: types.ProductPage.GET_CREDIT_OP_SUC,
        order,
        operations
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CREDIT_OP_FAI,
        response
      })
    }
  })
}

export function changeAdditionalCardState(idObject, access) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.changeAdditionalCardAccess,
    data: {idObject, access},
    onSuccess: async (dispatch, getState, response) => {
      const productId = getState().productPage.product.id;
      dispatch(getCardInfo(productId));
    },
  });
}

export function getCreditSchedules(id, code = '') {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getCreditSchedules,
    requestType: types.ProductPage.GET_CREDIT_SCH_REQ,
    data: {
      idObject: id,
      code
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CREDIT_SCH_SUC,
        actualPayments: response.actualPayments,
        planPayments: response.planPayments
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_CREDIT_SCH_FAI,
        response
      })
    }
  })
}

export function printDocumentRb({ format = 'PDF', ids = [],  email = '' }, onSuccess = () => {
}, onError = () => {
}) {
  return requestFabric({
          method: 'POST',
          isJwt: true,
          route: '/printDocumentRb',
          requestType: types.ProductPage.ACCOUNT_DETAILS_REQ,
          data: {
            format,
            ids,
          },
          onSuccess: async (dispatch, getState, response) => {
            const pathToFile = getPathFile();

            response.fileName = response.file;
            response.file = pathToFile + response.file;
            onSuccess({ ...response });
            dispatch({
              type: types.ProductPage.ACCOUNT_DETAILS_SUC,
              accountDetailsFile: response.file,
              accountDetailsData: { ...response }
            })
          },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.ACCOUNT_DETAILS_FAI,
        response
      })
    }
  });
}

export function getOperationAccess(idObject, code) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getOperationAccess,
    requestType: types.ProductPage.GET_OPERATION_ACCESS_REQ,
    data: { idObject, code },
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_OPERATION_ACCESS_SUC,
        payload: response.operationsAccess,
      })
    },
  });
}

export function getAccountDetails({ format = 'HTML', idObject, code, email }, onSuccess = () => {
}, onError = () => {
}) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: '/getAccountDetails',
    requestType: types.ProductPage.ACCOUNT_DETAILS_REQ,
    data: {
      format,
      idObject,
      code
    },
      onSuccess: async (dispatch, getState, response) => {
        const pathToFile = getPathFile();
        response.fileName = response.file;
        response.file = pathToFile + response.file;
        onSuccess({ ...response });
        dispatch({
          type: types.ProductPage.ACCOUNT_DETAILS_SUC,
          accountDetailsFile: response.file,
          accountDetailsData: { ...response }
        })

    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.ACCOUNT_DETAILS_FAI,
        response
      })
    }
  })
}

export function getProductInfo(id, type, code = '') {
  switch (type) {
    case 'cards':
      return getCardInfo(id);

    case 'deposits':
      return getDepositInfo(id);

    case 'accounts':
      return getAccountInfo(id);

    case 'credits':
      return getCreditInfo(id, code);
  }
}

export function getCardWallets({ id, uid }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: 'getCardWallets',
    requestType: types.ProductPage.GET_WALLETS,
    data: {
      id,
      uid
    },
    onSuccess: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_WALLETS_SUC,
        payload: response,
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GET_WALLETS_FAI,
        response
      })
    }
  })
}

export function getPayLoadToWallet({ id, uid }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    requestType: types.ProductPage.GetPayLoadToWallet,
    route: routes.EnterPage.execute,
    data: {
      "sidRequest": 'GetPayLoadToWallet',
      "parameters": [
        {
          "name": "Идентифкатор карты",
          "type": "int32",
          "value": id
        },
        {
          "name": "Уникальный идентификатор приложения",
          "type": "string",
          "value": DeviceInfo.getInstanceId()
        },
        {
          "name": "Идентифкатор устройства",
          "type": "string",
          "value": DeviceInfo.getUniqueId()
        },
        {
          "name": "Тип кошелька",
          "type": "string",
          "value": Platform.OS === 'ios' ? 'apple' : 'android'
        },
      ]
    },

    onSuccess: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GetPayLoadToWallet_SUC,
        payload: response,
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GetPayLoadToWallet_FAI,
        response
      })
    }
  })
}

export function addPassWallet({ id, walletStr }) {
  let uniqueID = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
  return requestFabric({
    method: 'POST',
    isJwt: true,
    requestType: types.ProductPage.GetPayLoadToWallet,
    route: routes.EnterPage.execute,
    data: {
      "sidRequest": 'AddPassWallet',
      "parameters": [
        {
          "name": "Идентификатор карты",
          "type": "int",
          "value": id
        },
        {
          "name": "Уникальный идентификатор приложения",
          "type": "string",
          "value": uniqueID
        },
        {
          "name": "Название устройства",
          "type": "string",
          "value": DeviceInfo.getDeviceName()
        },
        {
          "name": "Идентификатор маршрута",
          "type": "string",
          "value": walletStr
        },
        {
          "name": "Тип маршрута",
          "type": "string",
          "value": Platform.OS === 'ios' ? 'apple' : 'android'
        },
      ]
    },

    onSuccess: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GetPayLoadToWallet_SUC,
        payload: response,
      });
      dispatch(getCardWallets({ id, uid: DeviceInfo.getUniqueId() }));
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.GetPayLoadToWallet_FAI,
        response
      })
    }
  })
}

export function getProductOperations(id, type, code = '') {
  switch (type) {
    case 'cards':
      return getCardOperations(id);

    case 'deposits':
      return getDepositOperations(id);

    case 'accounts':
      return getAccountOperations(id);

    case 'credits':
      return getCreditOperations(id, code);
  }
}

export function setDescriptionProduct(id, code = '', description) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.setDescriptionProduct,
    requestType: types.ProductPage.SetDescriptionProduct_REQ,
    data: {
      id,
      code,
      description
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.SetDescriptionProduct_SUC,
        description,
        id,
        code
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.SetDescriptionProduct_FAI,
        response
      })
    }
  })
}

export function printDocument({ format, id, email }) {
  switch (format) {
    case 'PDF':
      return printDocumentPdf({ id });
    default:
      return printDocumentHTML({ id });
  }
}

function printDocumentPdf({ id }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: '/printDocument',
    requestType: types.DocumentPage.PRINT_DOCUMENT_REQ,
    data: {
      format: 'PDF',
      idDocument: id,
      sendMail: false
    },
    onSuccess: async (dispatch, getState, response) => {
      let file = response.file;
      file =  getPathFile() + file;
      downloadFile(file)
        .then((base64) => {
          dispatch({
            type: types.DocumentPage.PRINT_DOCUMENT_SUC,
            documentFile: file,
            base64,
            src: file
          })
        })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.PRINT_DOCUMENT_FAI,
        response
      })
    }
  })
}

function printDocumentHTML({ id }) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: '/printDocument',
    requestType: types.DocumentPage.PRINT_DOCUMENT_HTML_REQ,
    data: {
      format: 'HTML',
      idDocument: id,
      sendMail: false
    },
    onSuccess: async (dispatch, getState, response) => {

      let file = response.file;
      file =  getPathFile() + file;
      dispatch({
        type: types.DocumentPage.PRINT_DOCUMENT_HTML_SUC,
        htmlFile: file
      })
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductPage.PRINT_DOCUMENT_HTML_FAI,
        response
      })
    }
  })
}

export function getInquiriesToOrder() {
  let type = {
    req: types.BankInquiriesToOrder.REQ,
    suc: types.BankInquiriesToOrder.SUC,
    fai: types.BankInquiriesToOrder.FAI,
  };

  return requestFabric({
    method: 'GET',
    isJwt: false,
    route: routes.EnterPage.inquiries,
    requestType: type.req,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    },
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: type.suc,
        payload: response.inquiries || [],
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: type.fai,
        response
      })
    }
  })
}

export function listOrderedInquiries(params,) {
  let type = {
    req: types.BankInquiries.REQ,
    suc: types.BankInquiries.SUC,
    fai: types.BankInquiries.FAI,
  };

  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.listDocuments,
    requestType: type.req,
    data: {
      ...params
    },
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: type.suc,
        data: response.documents || [],
        count: response.countDocs
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: type.fai,
        response
      })
    }
  })
}

export function listDocuments(params, clear = false, onDone) {
  let type = {
    req: types.HistoryPage.GET_OPERATIONS_REQ,
    suc: types.HistoryPage.GET_OPERATIONS_SUC,
    fai: types.HistoryPage.GET_OPERATIONS_FAI,
  };

  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.listDocuments,
    requestType: type.req,
    data: {
      ...params
    },

    onSuccess: async (dispatch, getState, response) => {
      onDone ? onDone() : null

      dispatch({
        type: type.suc,
        clear,
        data: response.documents || [],
        count: response.countDocs
      });
    },
    onError: (dispatch, getState, response) => {
      onDone ? onDone() : null
      dispatch({
        type: type.fai,
        response
      })
    }
  })
}

//PaymentsPage
function checkMask(array) {
  let flag = false;
  array.map(el => {
    if (el.sid === "UBS_SERVICE_PAYMENT" && el.access > 0) {
      flag = true;
    }
  });
  return flag;
}

export function getConfiguguration() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getConfiguguration,
    requestType: types.PaymentsPage.GET_CONFIGURATION_REQ,
    data: {
      source: 'MobileApplication',
      uid: DeviceInfo.getUniqueId()
    },

    onSuccess: async (dispatch, getState, response) => {
      let pathToImage = getPathImageDocument();
      let conf = response.configuration;
      conf = conf.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo + '.png'
        return newEl;
      });
      dispatch({
        type: types.PaymentsPage.GET_CONFIGURATION_SUC,
        configuration: conf
      });

      if (checkMask(response.configuration)) {
        dispatch(getProviders());
      }
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.GET_CONFIGURATION_FAI,
        response
      });
      dispatch(clearSession());
      // dispatch(changeAppRoot('login'));
    },
    toLogin: true
  })
}

export function f() {

}

export function getProviders() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getProviders,
    requestType: types.PaymentsPage.GET_PROVIDERS_REQ,

    onSuccess: async (dispatch, getState, response) => {

      let pathToImage = getPathImageServicePayment();
      let prov = response.providers;
      prov = prov.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/") + '.png';
        return newEl;
      });

      let serv = response.services;
      serv = serv.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/") + '.png';
        return newEl;
      });

      dispatch({
        type: types.PaymentsPage.GET_PROVIDERS_SUC,
        services: serv,
        providers: prov
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.GET_PROVIDERS_FAI,
        response
      })
    }
  })
}

export function getSystemsTransferMoney() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.getSystemsTransferMoney,
    requestType: types.PaymentsPage.GET_SYSTEMS_REQ,

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.GET_SYSTEMS_SUC,
        systems: response.systems
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.GET_SYSTEMS_FAI,
        response
      })
    }
  })
}

export function sendRequestServicePayment() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.sendRequestServicePayment,
    requestType: types.PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_REQ,
    data: {
      typeRequest: 'Список начислений'
    },
    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_SUC,
        uidRequestSend: response.uidRequest
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.SEND_REQUEST_PAYMENTS_SERVICE_FAI,
        response
      })
    }

  })
}

export function listServicePayment(uid) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.listServicePayment,
    requestType: types.PaymentsPage.GET_SERVICE_PAYMENT_REQ,
data: {
  uidRequest: uid
},


    onSuccess: async (dispatch, getState, response) => {
      let accToPay = response.accountsToPay;

      let pathToImage = getPathImage();
      accToPay = accToPay.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        return newEl;
      });

      dispatch({
        type: types.PaymentsPage.GET_SERVICE_PAYMENT_SUC,
        accountsToPay: accToPay
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.PaymentsPage.GET_SERVICE_PAYMENT_FAI,
        response
      })
    }
  })
}

//
// const getSystemsTransferMoney = function () {
//   return new Promise(function (resolve, reject) {
//     cachedAxios.post(paths.getSystemsTransferMoney, {
//       jwt: storage.get("jwt")
//     })
//       .then(respone => {
//         const data = respone.data;
//         if (data.codeResult != 0) {
//           handleError(data, resolve, reject);
//         } else {
//           resolve(data);
//         }
//       });
//   })
// };
//PaymentsPage END

/**
 * MyFinancesPage
 * */

export function operationsProduct(data = {
  "period": moment().format('DD.MM.YYYY'),
  "idObject": "",
  "code": "",
  "type": 3
}) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.operationsProduct,
    requestType: types.MyFinancesPage.OP_PRODUCT_REQ,
    data,

    onSuccess: async (dispatch, getState, response) => {
      let { operations, totalExpend, totalIncome } = response;

      dispatch({
        type: types.MyFinancesPage.OP_PRODUCT_SUC,
        date: data.period,
        costs: { operations, totalExpend, totalIncome }
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.MyFinancesPage.OP_PRODUCT_FAI,
        date: data.period,
        costs: { operations: [], totalExpend: 0, totalIncome: 0 }
      })
    }
  })
}

/**
 * MyFinancesPage END
 * */

/**
 * New Products
 * */
export function listParamsProduct(sid) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.execute,
    requestType: types.ProductsPage.REQ_PARAM_FIELDS,
    data: {
      "sidRequest": sid,
      "parameters": [{
        "name": "Код вида документа",
        "value": sid,
        "type": "string",
        "typeColumns": null
      }, {
        value: DeviceInfo.getUniqueId(),
        name: 'Источник создания',
        type: 'string',
        typeColumns: null
      }]
    },

    onSuccess: async (dispatch, getState, response) => {
      dispatch({
        type: types.ProductsPage.SUC_PARAM_FIELDS,
        response
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductsPage.FAI_PARAM_FIELDS,
        response
      })
    }
  })
}

export function paramProductByType(type = '', data = []) {
  switch (type) {
    case 'cards':
      return paramProductCard(data);
    case 'credits':
      return paramProductCredit(data);
    case 'deposits':
      return paramProductDeposit(data);
    default:
      break;
  }
}

export function paramProductCard(data = []) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.paramProductCard,
    requestType: types.ProductsPage.REQ_PARAM_CARD,
    data,

    onSuccess: async (dispatch, getState, response) => {
      let { products } = response;

      let pathToImage = getPathImageProduct();
      let pathToDescr = getPathDescr();
      products = products.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        newEl.linkProductInfo = pathToDescr + newEl.linkProductInfo.replace(/[\\]/g, "/");
        return newEl;
      });

      dispatch({
        type: types.ProductsPage.SUC_PARAM_CARD,
        products
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductsPage.FAI_PARAM_CARD,
        response
      })
    }
  })
}

export function getSBPayTokens() {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: 'sbp/mapp/tokens',
    requestType: types.SBPayScreen.GET_SBPAY_TOKENS_REQ,
    data: {},

    onSuccess: async (dispatch, getState, response) => {

      dispatch({
        type: types.SBPayScreen.GET_SBPAY_TOKENS_SUC,
        payload: {
          tokens: response.tokens,
        }
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.SBPayScreen.GET_SBPAY_TOKENS_ERR,
      })
    }
  })
}

export function paramProductCredit(data = []) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.paramProductCredit,
    requestType: types.ProductsPage.REQ_PARAM_CREDIT,
    data,

    onSuccess: async (dispatch, getState, response) => {
      let { products } = response;
      let pathToImage = getPathImageProduct();
      let pathToDescr = getPathDescr();
      products = products.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        newEl.linkProductInfo = pathToDescr + newEl.linkProductInfo.replace(/[\\]/g, "/");
        return newEl;
      });

      dispatch({
        type: types.ProductsPage.SUC_PARAM_CREDIT,
        products
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductsPage.FAI_PARAM_CREDIT,
        response
      })
    }
  })
}

export function paramProductDeposit(data = []) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.paramProductDeposit,
    requestType: types.ProductsPage.REQ_PARAM_DEPOSIT,
    data,

    onSuccess: async (dispatch, getState, response) => {
      let { products } = response;
      let pathToImage = getPathImageProduct();
      let pathToDescr = getPathDescr();

      products = products.map(el => {
        let newEl = el;
        newEl.logo = pathToImage + newEl.logo.replace(/[\\]/g, "/");
        newEl.linkProductInfo = pathToDescr + newEl.linkProductInfo.replace(/[\\]/g, "/");
        return newEl;
      });

      dispatch({
        type: types.ProductsPage.SUC_PARAM_DEPOSIT,
        products
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.ProductsPage.FAI_PARAM_DEPOSIT,
        response
      })
    }
  })
}

/**
 * New Products END
 * */

export function extract({ code, id, dateFrom, dateTo, format = 'html' }, onSuccess = () => {
}, onError = () => {
}) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.extract,
    requestType: types.ProductPage.REQ_PARAM_FIELDS,
    data: {
      code,
      dateFrom,
      dateTo,
      format,
      idObject: id,
    },

    onSuccess,
    onError
  })
}

// Bonuses
function bonusesExecute(onSuccess, onError) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.execute,
    requestType: types.ProductsPage.REQ_PARAM_FIELDS,
    data: {
      "sidRequest": 'UBS_CHANGE_CONTRACT',
      "parameters": [{
        name: 'Код вида документа',
        type: 'string',
        value: 'UBS_CHANGE_CONTRACT'
      }, {
        name: 'Код бизнеса',
        type: 'string',
        value: 'RB'
      }]
    },

    onSuccess,
    onError
  })
}

export function getBonuses() {
  // Interpreted by the thunk middleware:
  return function (dispatch, getState) {
    const apiRout = getState().api.apiRoute;

    dispatch({
      type: types.BonusesPage.BONUSES_REQ
    });

    // Dispatch vanilla actions asynchronously
    myFetch(apiRout + routes.EnterPage.bonuses, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
      }
    }).then(
      (response) => {
        const { bonuses } = response;
        const cashBack = bonuses.filter((el) => el.sidCategory === 'CashBack');
        dispatch(requestFabric({
          method: 'POST',
          isJwt: true,
          route: routes.EnterPage.execute,
          requestType: types.BonusesPage.BONUSES_REQ,
          data: {
            "sidRequest": 'UBS_CHANGE_CONTRACT',
            "parameters": [{
              name: 'Код вида документа',
              type: 'string',
              value: 'UBS_CHANGE_CONTRACT'
            }, {
              name: 'Код бизнеса',
              type: 'string',
              value: 'RB'
            }]
          },

          onSuccess: async (dispatch, getState, res) => {
            const data = parseFormData(res).values;

            const choosenProgramm = data["Выбранная программа"] ? data["Выбранная программа"].value.map(el => el[0]) : [];
            const activeProgramm = data["Действующая программа"] ? data["Действующая программа"].value.map(el => el[0]) : [];
            const cash = data["Сумма CashBack"];

            cashBack.forEach(bel => {
              bel.active = choosenProgramm.indexOf(bel.name) > -1;
            });
            const nextProgramms = bonuses.filter(bonus => activeProgramm.indexOf(bonus.name) === -1 && bonus.sid !== '');
            const activeProgramms = bonuses.filter((bonus) => activeProgramm.indexOf(bonus.name) > -1);

            dispatch({
              type: types.BonusesPage.BONUSES_SUC,
              payload: { ...data, cash, cashBack, activeProgramms, nextProgramms }
            });
          },
          onError: (dispatch, getState, error) => {
            dispatch({
              type: types.BonusesPage.BONUSES_FAI,
              error
            });
          }
        }));
      },
      error =>
        dispatch({
          type: types.BonusesPage.BONUSES_FAI,
          error
        })

    )
  }
}

export function saveParamContract(data = [
  {
    name: 'Выбранная программа',
    value: '',
    type: 'array',
    typeColumns: ['string']
  }
]) {
  return requestFabric({
    method: 'POST',
    isJwt: true,
    route: routes.EnterPage.saveParamContract,
    requestType: types.BonusesPage.saveParamContract_REQ,
    data: { parameters: data },

    onSuccess: async (dispatch, getState, response) => {
      // let {products} = response;
      dispatch({
        type: types.BonusesPage.saveParamContract_SUC,
        response
      });
    },
    onError: (dispatch, getState, response) => {
      dispatch({
        type: types.BonusesPage.saveParamContract_FAI,
        response
      })
    }
  })
}
