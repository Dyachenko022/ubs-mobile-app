import 'url-search-params-polyfill';
import { AppRegistry, NativeModules, Linking } from 'react-native';
import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import {setBaseUrl, setUiColor} from 'react-native-ubs-mobile-core';

import {
  Text,
  Alert,
  TextInput,
  AppState,
  AsyncStorage,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Navigation } from 'react-native-navigation';
import BackgroundTimer from 'react-native-background-timer';
import { createLogger } from 'redux-logger';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import 'moment/locale/ru';
import BankTheme from './src/utils/bankTheme';
import * as types from './src/api/actionTypes';
import * as reducers from './src/reducers';
import * as routingActions from './src/reducers/routing/actions';
import { getServiceBranch, news, advertising, getMapPoints, getRates,
  serviceNotification, versionApp, settingsFront } from './src/api/actions';
import {changeAppRoot, setInitialUrl} from './src/reducers/routing/actions';

import { registerScreens /*, registerScreenVisibilityListener*/ } from './src/screens';
import {showModal} from './src/utils/navigationUtils';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './src/reducers/saga';
import DeviceInfo from 'react-native-device-info';
import notifee from '@notifee/react-native';
import {dispatch} from 'react-native-navigation-drawer-extension/lib/events';

const logger = createLogger({ collapsed: true, timestamp: true });
const sagaMiddleware = createSagaMiddleware();

const middlewares = [ thunk, sagaMiddleware ];
if (__DEV__ ) middlewares.push(logger);

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(...middlewares))(createStore);
const reducer = combineReducers(reducers);

export const store = createStoreWithMiddleware(reducer);

registerScreens(store, Provider);

sagaMiddleware.run(rootSaga);
moment.locale('ru');

Text.defaultProps = { ...(Text.defaultProps || {}), allowFontScaling: false };
TextInput.defaultProps = { ...(TextInput.defaultProps || {}), allowFontScaling: false };

setUiColor(BankTheme.color1);

Navigation.setDefaultOptions({
  topBar: {
    background: {
      color: BankTheme.navigationBackgroundColor,
    },
    title: {
      alignment: 'center',
      color: 'white',
    },
    backButton: {
      color: 'white',
    },
  },
  statusBar: Platform.OS === 'ios' ? {
    style: BankTheme.statusBarTheme,
    backgroundColor: 'transparent',
    drawBehind: true,
    visible: true,
  } : undefined,
  navigationBar: {
    backgroundColor: 'black',
  },
  animations: {
    setRoot: {
      alpha: {
        from: 0,
        to: 1,
        duration: 500
      }
    }
  },
  bottomTabs: {
    animate: false,
    titleDisplayMode: 'alwaysShow',
  },
  bottomTab: {
    iconColor: 'rgba(255,255,255,.5)',
    selectedIconColor: '#fff',
    textColor: 'rgba(255,255,255,.5)',
    selectedTextColor: '#fff',
  },
  layout: {
    orientation: ['portrait'],
    backgroundColor: 'white',
  },
});

async function init() {
  try {
    await requestUserPermission();
    await store.dispatch(getServiceBranch());
    global.hasGms = await DeviceInfo.hasGms();
    let route = await AsyncStorage.getItem('apiRoute');
    const AppDelegate = NativeModules.AppDelegate;
    const pushURL = route + 'deliveredPush';
    if (AppDelegate) {
      AppDelegate.setURL(pushURL);
    }
    if (route) {
      store.dispatch({
        type: types.GetServiceBranch.SET_API_ROUTE,
        route
      });
    }
    await store.dispatch(settingsFront());
    store.dispatch(routingActions.appInitialized());
    // Коллбек сработает, если приложение уже было открыто, и его пытаются открыть по ссылке
    Linking.addListener('url',async (param) => {
      if (store.getState().routing.root === 'after-login') return;
      store.dispatch(setInitialUrl(param.url));
    });

    // getInitialUrl вернет не null если приложение было закрыто, и его открыли по ссылке
    const onAppStartup =  async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        store.dispatch(setInitialUrl(initialUrl));
      }
    }
    onAppStartup();
  } catch (e) {
    console.error(e);
    failStartApp('Ошибка при выполнении запросов. Пожалуйста, обратитесь в банк и перезапустите приложение!');
  }
}

const EventEmitter = Platform.select({
  ios: () => NativeAppEventEmitter,
  android: () => DeviceEventEmitter
})();

let timer = null;
let goToLogin = false;

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
}

export default class App {

  isModalNetInfo = false;

  constructor() {
    console.disableYellowBox = true;

    NetInfo.addEventListener((state) => {
      if (!state.isConnected && !this.isModalNetInfo) {
        Navigation.showOverlay(
          {
            component: {
              name: 'unisab/BlankScreen',
            },
          });
        this.isModalNetInfo = true;
      } else {
        Navigation.dismissAllOverlays();
        this.isModalNetInfo = false;
      }
    });

    this.waitForInternet()
      .then(() => init())
      .then(() => {
        store.subscribe(this.onStoreUpdate.bind(this));
        AppState.addEventListener('change', this.handleAppStateChange.bind(this));
      });
  }

  waitForInternet = async () => {
    const internetState = await NetInfo.fetch();
    let waitForInternetPromise = null;

    // Перед запросом settingsFront нужно убедиться, что есть соединение с интернетом. А если нет, то подождать его
    if (internetState.isConnected) {
      waitForInternetPromise = new Promise(resolve => resolve());
    } else {
      waitForInternetPromise = new Promise((resolve) => {
        NetInfo.addEventListener((state) => {
          if (state.isConnected) resolve();
        });
      });
    }
    return waitForInternetPromise;
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      timer = BackgroundTimer.setTimeout(() => {
        goToLogin = true;
      }, 1000 * 60 * 3);
    }

    if (nextAppState === 'active' && BankTheme.pushNotificationsUsed) {
        let fetchingPromise = Platform.OS === 'ios' ? messaging().getInitialNotification() : notifee.getInitialNotification();
        fetchingPromise.then((res) => {
          if (res) {
            if (store.getState().routing.root === 'after-login' && !goToLogin) {
              showModal({
                screenName: 'unisab/NotificationsScreen',
                title: 'Уведомления',
              });
            } else {
                store.dispatch(setInitialUrl('OPEN_NOTIFICATIONS'));
              }
        }});
    }

    if (nextAppState === 'active' && timer) {
      if (goToLogin) {
        goToLogin = false;
        store.dispatch({ type: types.LoginPage.EXIT_SUC });
        store.dispatch(changeAppRoot('login'));
      }
      BackgroundTimer.clearTimeout(timer);
    }
  };

  onStoreUpdate() {
    const { root } = store.getState().routing;
    const { apiRoute } = store.getState().api;
    const { hasError, title = 'Ошибка!', error, code, cancelable, toLogin } = store.getState().error;
    const { credentials, wrongTimes } = store.getState().login;

    if (apiRoute && !this.apiRoute) {
      this.initRequests(apiRoute);
    }

    if (apiRoute && apiRoute !== this.apiRoute) {
      this.initRequests(apiRoute);
    }

    if (this.currentRoot !== root) {
      this.currentRoot = root;
      this.startApp(root);
    }

    if (hasError && code && (!this.hasError || code === 255)) {
      this.hasError = true;

      if (code === 255) {
        if (credentials) {
          store.dispatch({ type: types.Errors.GLOBAL_ERROR_HIDE });
          store.dispatch(changeAppRoot('login'));
        }

        this.hasError = false;
      } else {
        Alert.alert(title, error, [
          {
            text: 'Закрыть',
            onPress: () => {
              store.dispatch({ type: types.Errors.GLOBAL_ERROR_HIDE });
              this.hasError = false;
              if (code === 3 || code === 4 || wrongTimes >= 2 || toLogin) {
                store.dispatch(changeAppRoot('login'));
              }
            }
          }
        ]);
      }
    }
  }

  initRequests(apiRoute) {
    this.apiRoute = apiRoute;
    setBaseUrl(apiRoute);
    store.dispatch(versionApp());
    store.dispatch(serviceNotification());
    store.dispatch(news());
    store.dispatch(advertising());
    store.dispatch(getRates());
    store.dispatch(getMapPoints());
  }

  startApp(root) {

    switch (root) {
      case 'login':
        Navigation.setRoot({
          root: {
            bottomTabs: {
              id: 'BOTTOM_TABS_LAYOUT',
              children: [
                {
                  stack: {
                    id: 'HOME_TAB',
                    children: [
                      {
                        component: {
                          name: 'unisab/LoginTabScreen'
                        },
                      }
                    ],
                    options: {
                      bottomTab: {
                        icon: require('./assets/icons/buttons/home.png'),
                        text: 'Вход',
                      },
                    }
                  }
                },
                {
                  stack: {
                    id: 'NEWS_TAB',
                    children: [
                      {
                        component: {
                          name: 'unisab/NewsTabScreen'
                        }
                      }
                    ],
                    options: {
                      bottomTab: {
                        icon: require('./assets/icons/buttons/news.png'),
                        text: 'Новости',
                      }
                    }
                  }
                },
                {
                  stack: {
                    id: 'MAP_TAB',
                    children: [
                      {
                        component: {
                          name: 'unisab/MapTabScreen'
                        }
                      }
                    ],
                    options: {
                      bottomTab: {
                        icon: require('./assets/icons/buttons/map.png'),
                        text: 'На карте',
                      }
                    }
                  }
                },
              ],
              options: {
                bottomTabs: {
                  barStyle: 'black',
                  backgroundColor: '#262626',
                },
              }
            },


          }
        });
        break;
      case 'loginConfirmation':
        Navigation.setRoot({
          root: {
            stack: {
              id: 'LOGIN_PROCEED',
              children: [
                {
                  component: {
                    name: 'unisab/ConfirmationScreen'
                  }
                }
              ],
            }
          }
        });
        break;
      case 'loading':
        Navigation.setRoot({
          root: {
            stack: {
              id: 'LOADING_SCREEN',
              children: [
                {
                  component: {
                    name: 'unisab/LoadingScreen',
                    options: {
                      topBar: {
                        background: {
                          color: BankTheme.color1,
                        },
                        visible: false,
                      },
                      navigationBar: {
                        visible: false,
                      },
                      layout: {
                        backgroundColor: BankTheme.color1,
                      },
                    }
                  }
                }
              ],
            }
          }
        });
        break;
      case 'changePassword':
        Navigation.setRoot({
          root: {
            stack: {
              id: 'CHANGE_PASSWORD_SCREEN',
              children: [
                {
                  component: {
                    name: 'unisab/ChangePasswordScreen',
                  }
                }]
              }
            }
        });
    break;

    case 'after-login':
      const afterLoginLayouts =
        [
        {
          stack: {
            id: 'MY_BANK',
            children: [
              {
                component: {
                  id: 'MY_BANK_SCREEN',
                  name: 'unisab/MyBankTabScreen'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./assets/icons/buttons/MyBank/1.png'),
                text: 'Мой банк',
              }
            }
          }
        },
        {
          stack: {
            id: 'HISTORY_PAGE',
            children: [
              {
                component: {
                  id: 'HISTORY_SCREEN',
                  name: 'unisab/HistoryTabScreen'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./assets/icons/buttons/MyBank/2.png'),
                text: 'История',
              }
            }
          }
        },
        {
          stack: {
            id: 'PAYMENT_TAB_PAGE',
            children: [
              {
                component: {
                  id: 'PAYMENT_TAB_SCREEN',
                  name: 'unisab/PaymentsTabScreen'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./assets/icons/buttons/MyBank/3.png'),
                text: 'Оплатить',
              }
            }
          }
        },
        {
          stack: {
            id: 'FINANCE_TAB_PAGE',
            children: [
              {
                component: {
                  id: 'FINANCE_TAB_SCREEN',
                  name: 'unisab/MyFinancesTabScreen'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./assets/icons/buttons/MyBank/4.png'),
                text: 'Финансы',
              }
            }
          }
        },
      ];

      if (BankTheme.showBonusesPage) afterLoginLayouts.push(
        {
          stack: {
            id: 'BONUCE_TAB_PAGE',
            children: [
              {
                component: {
                  name: 'unisab/BonusesScreen'
                }
              }
            ],
            options: {
              bottomTab: {
                icon: require('./assets/icons/buttons/MyBank/5.png'),
                text: 'Бонусы',
              }
            }
          }
        },
      );

      Navigation.setRoot({
        root: {
          bottomTabs: {
            id: 'BOTTOM_TABS_LAYOUT_MY_BANK',
            children: afterLoginLayouts,
            options: {
              bottomTabs: {
                barStyle: 'black',
                backgroundColor: '#262626',
              },
            }
          },
        }
      });
      break;
    }
  }
}

function failStartApp(errorText) {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'unisab/ErrorScreen',
              passProps: {
                errorText,
              }
            }
          }
        ]
      }
    }
  });
}
