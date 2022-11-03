import React from 'react';
import {connect} from 'react-redux';
import JailMonkey from 'jail-monkey'
import {Navigation} from 'react-native-navigation';
import {
  Alert,
  AsyncStorage, BackHandler,
  DeviceEventEmitter,
  Linking, NativeModules,
  Platform,
  View,
} from 'react-native'
import {TextRenderer as Text} from "../../components/TextRenderer";
import NotificationPage from './NotificationPage';
import {pushScreen, showModal} from '../../utils/navigationUtils';
import {LoginPage, EnterPage} from 'react-native-ubs-mobile-core';
import {setCredentials} from "../../reducers/login/actions";
import * as types from "../../api/actionTypes";

import {
  deliveredPush,
  authContract,
  serviceNotification,
} from "../../api/actions";
import moment from "moment";

const rn = require('react-native');
const JailMonkeyNative = rn.NativeModules.JailMonkey

import {onAuthContract} from "../../actions/onAuthContract";
import BankTheme from '../../utils/bankTheme';
import androidBeforeExit from '../../utils/androidBeforeExit';

import {setInitialUrl} from '../../reducers/routing/actions';
import messaging from '@react-native-firebase/messaging';

const QuickActions = require('react-native-quick-actions');

class LoginTabScreen extends React.Component {

  static options = (props) => {
    return {
    topBar: {
      title: {
        component: {
          name: 'unisab/CustomTopBar',
          alignment: 'fill',
          passProps: {
            loginPage: true,
          }
        }
      },
    }
  }}

  constructor(props) {
    super(props);
    this.state = {
      isNotificationClosed: false,
      wasNotificationFetched: false,
      isVersionAppNotificationClosed: false,
      isDebugMode: false,
    }
  }

  componentDidMount() {
    this.setNavigatorStyle(this.props.credentials);
    //Без разницы получили мы уведомления или нет, после того как прищел какой-нибудь ответ, отрисовываем форму.
    this.props.serviceNotification();
    this.navigationEvents = Navigation.events().bindComponent(this);
    if (Platform.OS === 'ios') {
      // jailMonkey криво работала. isDebuggedMode на iOS был константой. Надо будет исправить если библиотеку починят
      if (JailMonkeyNative.isDebuggedMode) this.setState({isDebugMode : true});
    } else {
      JailMonkey.isDebuggedMode().then(res => {
        if (res) this.setState({isDebugMode : true});
      });
    }

      QuickActions.popInitialAction()
        .then(async (action) => {
          if (action !== null) {
            if (action.title === 'Позвонить') {
              Linking.openURL('tel:'+ BankTheme.bankPhoneNumber);
              await AsyncStorage.setItem('initialAction', '');
            } else {
              await AsyncStorage.setItem('initialAction', action.title);
            }
          }
        })
        .catch(() => {
        });

      DeviceEventEmitter.addListener(
        'quickActionShortcut', async function (data) {
          if (data.title === 'Позвонить') {
            Linking.openURL('tel:'+ BankTheme.bankPhoneNumber);
            await AsyncStorage.setItem('initialAction', '');
          } else {
            await AsyncStorage.setItem('initialAction', data.title);
          }
        });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.credentials !== prevProps.credentials) {
      this.setNavigatorStyle(this.props.credentials);
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  setNavigatorStyle(showChangeUserButton) {
    const rightButtons = [];
    if (showChangeUserButton) {
      rightButtons.push(
        {
          id: 'mybank_exitUser',
          component: {
            name: 'IconExitUser',
            passProps: {
              parentComponentId: this.props.componentId,
              changeCredentials: () => this.props.setCredentials(false),
            }
          }
        });
    }
    Navigation.mergeOptions(this.props.componentId,{
      topBar: {
        rightButtons,
        title: {
          component: {
            name: 'unisab/CustomTopBar',
            alignment: 'fill',
            passProps: {
              loginPage: true,
            }
          }
        },
      }
    });
  }

  componentDidAppear() {
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  }


  renderError(text) {
    return <View style={{
      flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BankTheme.color1,
    }}>
      <View style={{paddingHorizontal: 20}}>
        <Text style={{fontWeight: '600', fontSize: 20, textAlign: 'center', color: '#fff', marginBottom: 25}}>Уважаемый
          клиент!</Text>

        <Text style={{color: '#fff', fontSize: 16, textAlign: 'center'}}>
          {text}
        </Text>
      </View>
    </View>
  }



  render() {

    if (this.state.isDebugMode) {
      //return this.renderError('Приложение запущено в режиме отладки. Основной функционал приложения ограничен!');
    }

    if (1!=1 && !__DEV__ && JailMonkey.isJailBroken()) {
      return this.renderError('На телефоне обнаружен root-доступ. Основной функционал приложения ограничен!')
    }

    if (!this.props.versionAppWasReceived || !this.props.notificationWasReceived) return null;

    if (this.props.versionNotification.action >0 && !this.state.isVersionAppNotificationClosed)
      return (
        <NotificationPage
          {...this.props.versionNotification}
          typeNotification={this.props.versionNotification.action}
          onButtonPress={() => {
            this.setState({isVersionAppNotificationClosed: true})
          }
          }
        />
      );

    if (this.props.notification.typeNotification > 0 && !this.state.isNotificationClosed)
    return (
      <NotificationPage
        {...this.props.notification}
        onButtonPress={() => {
          this.setState({isNotificationClosed: true})
        }
        }
      />
    );

    if (!this.props.notificationWasReceived || !this.props.versionAppWasReceived) {
      return  null;
    }

    if (this.props.credentials) {
      return <EnterPage
                onContractLogin={this.props.onContractLogin}
                setCredentials={this.props.setCredentials}
                autoenrollFaceid={this.props.autoenrollFaceid}
      />
    }

    return <LoginPage
               loginImageBackground={{uri: BankTheme.images.loginBackgroundImage}}
               onAuthBaseSuccess={this.props.onAuthBaseSuccess}
               openInformationAboutSecurity={this.props.openInformationAboutSecurity}
               openRegistration={(isForgot) =>
                 pushScreen({
                   componentId: this.props.componentId,
                   screenName: 'unisab/RegistrationScreen',
                   title: isForgot ? 'Восстановление доступа' : 'Регистрация',
                   passProps: {
                     isForgot,
                   }
                 })
               }
    />
  }

  onAuthBaseSuccess = (response) => {
    this.props.onAuthBaseSuccess(response);

  }
}

const mapStateToProps = (state) => ({
  apiRoute: state.api.apiRoute,
  credentials: state.login.credentials,
  changeRegion: state.api.changeRegion,
  informationAboutSecurity: state.settingsFront.informationAboutSecurity,
  notification: state.login.notification,
  versionNotification: state.login.versionApp,
  versionAppWasReceived: state.login.versionAppWasReceived,
  notificationWasReceived: state.login.notificationWasReceived,
  autoenrollFaceid: state.login.autoenrollFaceid,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps;
  const { componentId } = ownProps;

    return {
    ...ownProps,
    ...stateProps,

    setCredentials: (data) => {
      if (data === false && (global.hasGms || Platform.OS === 'ios')) {
        messaging().unregisterDeviceForRemoteMessages();
        messaging().deleteToken();
      }
      AsyncStorage.setItem('contractId', '');
      AsyncStorage.setItem('code', '');
      dispatch(setCredentials(data));
    },

    deliveredPush: (date, guid, uid, text) => dispatch(deliveredPush(date, guid, uid, text)),

    setInitialUrl: (url) => {
      dispatch(setInitialUrl(url));
    },

    onAuthBaseSuccess: (response) => {
      const jwt = response['jwt'];

      if (jwt)
        AsyncStorage.setItem('jwt', jwt);

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
        dispatch(authContract(response.contracts[0].id), componentId);
      }
      else{
        showModal({
          screenName: 'unisab/ContractsSelectScreen',
          title: 'Выбор договора',
        });
      }
    },

    onContractLogin: (response, id) => onAuthContract(id, response, dispatch, componentId),

    serviceNotification: () => dispatch(serviceNotification()),
    openInformationAboutSecurity: () => {
      const url = stateProps.informationAboutSecurity || '';
      const extension = stateProps.informationAboutSecurity.split('.').pop() || '';
      const isPdf = extension.toUpperCase() === 'PDF';
      showModal({screenName: 'WebViewModalConfirmation', title: 'Информация о безопасности', passProps: {url, isPdf, title: 'Информация о безопасности'}});
    }

  };
}

export default connect(mapStateToProps, null, mergeProps)(LoginTabScreen);
