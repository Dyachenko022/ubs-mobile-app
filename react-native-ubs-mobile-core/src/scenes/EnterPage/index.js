import React from 'react';

import DeviceInfo from 'react-native-device-info';
import { authCode, authContract } from '../../coreApi';

import {
  Text, View, AsyncStorage, Alert, Dimensions, StyleSheet, Modal, ActivityIndicator, Platform, Button,
} from 'react-native';

import TouchableOpacity from '../../components/Touchable';

import CodeKeyboard from '../../components/CodeKeyboard';
import FingerprintPopup from '../../components/FingerPrintPopup'
import FingerprintScanner from "react-native-fingerprint-scanner-with-key";

import styles from './styles';
import BankTheme from '../../bankTheme';


const NUMBER = 5;
export class Indicators extends React.Component {
  constructor(props) {
    super(props);

    this.renderIndicator = this.renderIndicator.bind(this)
  }
  render() {
    return (
      <View style={styles.indicatorsWrapper}>
        {this.renderIndicator()}
      </View>
    )
  }

  renderIndicator() {
    const arrayElements = [];

    for (let i = 0; i < NUMBER; i++) {
      arrayElements.push(<View key={i} style={
        StyleSheet.flatten([
          i < this.props.selected ? styles.indicatorFull : styles.indicator,
          {
            borderColor: global.coreUiColor,
            shadowColor: global.coreUiColor,
            backgroundColor: i < this.props.selected ? '#FFF' : global.coreUiColor,
          }])
        }
      />)
    }

    return arrayElements;
  }
}

export default class EnterPage extends React.Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onDel = this._onDel.bind(this);
    this._onCodeEntered = this._onCodeEntered.bind(this);

    this.handleFingerprintShowed = this.handleFingerprintShowed.bind(this)
    this.handleFingerprintDismissed = this.handleFingerprintDismissed.bind(this)
    this.fingerprintAccess = this.fingerprintAccess.bind(this)


    this.initTouchId = this.initTouchId.bind(this)


    this.state = {
      try: 0,
      title: 'Введите код',
      code: '',
      popupShowed: false,
      isTouchId: false,
      loading: false,
      keyInvalidatedModal: false,
    };
  }

  componentDidMount() {
    this.initTouchId().then(touchId => {
      this.setState({
        isTouchId: touchId,
        title: touchId ? 'Введите код или \n приложите палец' : this.state.title
      });
    });
  }

  async initTouchId() {
    const touchId = await AsyncStorage.getItem('touchId');
    if (touchId && this.props.autoenrollFaceid) {
        FingerprintScanner.authenticate({
          description: 'Приложите палец, чтобы войти',
          onAttempt: this.handleAuthenticationAttempted,
          useKey: true,
          keyName: 'DBO_KEY',
        })
        .then(() => {
          this.fingerprintAccess();
        })
        .catch((error) => {
          if (error.keyWasInvalidated) {
            this._onFingerprintPopupFailed(true);
          }
        });
    }
    return touchId;
  }

  render() {
    const { popupShowed } = this.state;
    return (
      <View style={{height: '100%'}}>

        <View style={{...styles.background ,}}>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.loading}>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(100,100,100,0.2)'
          }}>
            <ActivityIndicator size="large" color={global.coreUiColor} />
          </View>
        </Modal>

        {this.state.keyInvalidatedModal &&
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}>

            <Text style={{textAlign: 'center', fontSize: 20, padding: 10,}}>
              Биометрические параметры системы были изменены. Необходимо войти при помощи кода!
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => this.setState({keyInvalidatedModal: false,})}>
              <Text style={StyleSheet.flatten([styles.btnText, {color: global.coreUiColor, fontSize: 18,}])}>
                ОК
              </Text>
            </TouchableOpacity>
          </View>
        }

        <Text style={StyleSheet.flatten([styles.headerText, {color: global.coreUiColor}])}>
          {this.state.title}
        </Text>

        <Indicators selected={!this.state.confirm ? this.state.code.length : this.state.codeConfirm.length} />

        <CodeKeyboard
          maxLenght={NUMBER}
          btnMargin={Dimensions.get('window').width <= 320 ? 7 : 8}

          value={!this.state.confirm ? this.state.code : this.state.codeConfirm}

          onPress={this._onPress}
          onDel={this._onDel}

          touchId={this.state.isTouchId}
          onPressTouchId={this.handleFingerprintShowed}
          theme={BankTheme.codeSettingPageTheme}

        />
        </View>

        <TouchableOpacity style={{...styles.btn, height: 80}} onPress={() => {
          AsyncStorage.clear();
          this.props.setCredentials(false);
        }}>
          <Text style={StyleSheet.flatten([styles.btnText, {color: global.coreUiColor}])}>
            Забыли код доступа?
          </Text>
        </TouchableOpacity>


        {popupShowed && (
          <FingerprintPopup
            handlePopupDismissed={this.handleFingerprintDismissed}
            onFailed={this._onFingerprintPopupFailed}
            access={this.fingerprintAccess}
          />
        )}
      </View>
    )
  }

  _onFingerprintPopupFailed = (keyWasInvalidated) => {
    if (keyWasInvalidated) {
      this.setState({isTouchId: false, keyInvalidatedModal: true,});
    }
  }

  _onPress(val) {
    if (this.state.code.length < NUMBER) {
      this.setState((state) => {
        let code = state;
        code = code.code + val;

        return { code }
      }, () => {
        if (this.state.code.length === NUMBER) {
          this._onCodeEntered()
        }
      })
    }
  }

  _onDel() {
    this.setState((state) => {
      let code = state;
      code = code.code.slice(0, code.code.length - 1);

      return { code };
    })
  }

  async _onCodeEntered() {

    let savedCode = await AsyncStorage.getItem('code');

    if (savedCode === this.state.code) {

      let contractId = await AsyncStorage.getItem('contractId');

      let authKey = await AsyncStorage.getItem('code');
      const hashedUsername = await AsyncStorage.getItem('hashedUsername');
      let uidDevice = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
      let deviceId = DeviceInfo.getDeviceId() === 'Unknown' ? '' : DeviceInfo.getDeviceId();
      let uid = uidDevice + '##' + deviceId + '##' + contractId;
      if (hashedUsername) {
        uid += '##' + hashedUsername;
      }

      if (__DEV__) {
        const devSuffix = await AsyncStorage.getItem('devSuffix');
        uid = uid + devSuffix;
      }

      authCode(uid, authKey, true)
        .then(async (response) => {
          await AsyncStorage.setItem('jwt', response.jwt);
          const touchId = await AsyncStorage.getItem('touchId');
          if (touchId) FingerprintScanner.clearKey('DBO_KEY');
          return authContract(contractId, true);
        })
        .then((response) => {
          this.props.onContractLogin(response, contractId);
        })
        .catch((ex)=> {
          if (ex.codeResult === 254 || ex.codeResult === 255) {
            setTimeout(() => {
              Alert.alert('Ошибка', ex.textResult);
              this.props.setCredentials(false)
            }, 750);
          } else {
            this.setState({
              loading: false
            }, () => Alert.alert('Ошибка', ex.textResult));
          }
        })
    } else {
      const fail = this.state.try >= 4;
      Alert.alert(
        'Введенный код неверен',
        fail ? 'Вам необходимо заново войти в систему' : "Попробуйте еще раз",
        [
          {
            text: 'ОК', onPress: () => {
              if (fail) {
                AsyncStorage.clear();
                this.props.setCredentials(false);
              }
            }
          },
        ],
        { cancelable: false }
      );
      this.setState((state) => ({
        try: state.try + 1,
        code: ''
      }))
      // }
    }
  }

  handleFingerprintShowed() {
    Platform.OS === 'android' && FingerprintScanner.release();
    this.setState({ popupShowed: true });
  };

  handleFingerprintDismissed() {
    this.setState({ popupShowed: false });
  };

  async fingerprintAccess() {
    this.setState({
      loading: true
    });

    const contractId = await AsyncStorage.getItem('contractId');
    const hashedUsername = await AsyncStorage.getItem('hashedUsername');
    const authKey = await AsyncStorage.getItem('code');
    const uidDevice = DeviceInfo.getUniqueId() === 'Unknown' ? '' : DeviceInfo.getUniqueId();
    const deviceId = DeviceInfo.getDeviceId() === 'Unknown' ? '' : DeviceInfo.getDeviceId();
    let uid = uidDevice + '##' + deviceId + '##' + contractId;
    if (hashedUsername) {
      uid += '##' + hashedUsername;
    }

    if (__DEV__) {
      const devSuffix = await AsyncStorage.getItem('devSuffix');
      uid = uid + devSuffix;
    }

    authCode(uid, authKey, true)
      .then(async (response) => {
        await AsyncStorage.setItem('jwt', response.jwt);
        return authContract(contractId, true);
      })
      .then((response) => {
        this.props.onContractLogin(response, contractId);
        this.setState({
          loading: false
        });
      })
      .catch((ex)=> {
        if (ex.codeResult === 254 || ex.codeResult === 255) {
          setTimeout(() => {
            Alert.alert('Ошибка', ex.textResult);
            this.props.setCredentials(false)
          }, 750);
          this.setState({loading: false});
        } else {
          this.setState({
            loading: false
          },() => setTimeout(() => Alert.alert('Ошибка', ex.textResult)), 750);
        }
      })
  }
}
