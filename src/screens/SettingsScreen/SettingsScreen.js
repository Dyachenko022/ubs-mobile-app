import React from 'react';
import {isIphoneX} from "../../utils/platform";
import {
  Platform,
  View,
  Switch,
  AsyncStorage,
  Linking,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import {IconInput} from '../../components/Inputs';
import {TextRenderer as Text} from '../../components/TextRenderer';
import styles from './styles';
import FingerprintScanner from "react-native-fingerprint-scanner-with-key";
import FingerprintPopup from '../../components/FingerPrintPopup'
import {UPDATE} from "../../reducers/myBankPage/reducer";
import BankTheme, {requestAutostartPermission} from '../../utils/bankTheme';
import messaging from '@react-native-firebase/messaging';
import PressableWithArrow from './components/PressableWithArrow';
import bankTheme from '../../utils/bankTheme';
import DeviceInfo from 'react-native-device-info';

export default class SettingsScreen extends React.Component {
  static options = {
    bottomTabs: {
      visible: false,
    }
  }

  constructor(props) {
    super(props);

    this.getHiddenProducts = this.getHiddenProducts.bind(this);
    this.getGreeting = this.getGreeting.bind(this);
    this.initTouchId = this.initTouchId.bind(this);
    this.toggleTouchId = this.toggleTouchId.bind(this);
    this.isPushOn = this.isPushOn.bind(this);
    this.handleFingerprintDismissed = this.handleFingerprintDismissed.bind(this);
    this.pushChange = this.pushChange.bind(this);
    this.state = {
      touchId: false,
      touchIdAvailable: false,
      hiddenProducts: false,
      push: false,
      greeting: '',
      popupShowed: false
    }
  }

  componentDidMount() {
    this.isPushOn();
    this.getGreeting();
    this.getHiddenProducts();
    FingerprintScanner
      .isSensorAvailable()
      .then(() => {
        this.setState(() => ({touchIdAvailable: true}));
        this.initTouchId()
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.greeting !== this.state.greeting) {
      // this.getGreeting()
    }
    if (prevState.hiddenProducts !== this.state.hiddenProducts) {
      this.getHiddenProducts()
    }
  }

  async getGreeting() {
    try {
      let greeting = await AsyncStorage.getItem('greeting');
      this.setState(() => ({greeting}));
    } catch (e) {
    }
  }

  async getHiddenProducts() {
    try {
      let hiddenProducts = await AsyncStorage.getItem('hiddenProducts') === 'true';
      this.setState(() => ({hiddenProducts}));
    } catch (e) {
    }
  }

  async initTouchId() {
    let touchId = await AsyncStorage.getItem('touchId');

    this.setState(() => ({
      touchId: Boolean(touchId).valueOf()
    }))
  }

  async isPushOn() {
    let push = await AsyncStorage.getItem('push');
    this.setState({push: push === '1'});
  }

  toggleTouchId() {
    this.setState(() => ({
      touchId: !this.state.touchId
    }), () => {
      if (this.state.touchId) {
        this.setState(() => ({
          popupShowed: true
        }))
      } else {
        AsyncStorage.setItem('touchId', '')
      }
    })
  }

  handleFingerprintDismissed() {
    this.setState(() => ({popupShowed: false}));
  };

  handleFingerprintFailed() {
    this.setState(() => ({popupShowed: false, touchId: false}));
  };

  pushChange() {
    this.setState({push: !this.state.push, isLoadingPush: true},
      async () => {
        if (this.state.push) {
          const res = await messaging().requestPermission();
          if (res) {
            this.props.pushON();
            if (DeviceInfo.getManufacturerSync().toUpperCase() === 'XIAOMI') {
              Alert.alert('Внимание', 'Для корректной работы пуш-уведомлений на устройстве' +
                ' Xiaomi, пожалуйста, включите автозапуск приложения!',
                [{
                  text: 'Перейти в настройки',
                  onPress: () => {
                    requestAutostartPermission();
                  }
                }, {
                  text: 'Продолжить',
                }]
              );
            }
          } else {
            Alert.alert(
              'Push-уведомления запрещены',
              'Пожалуйста, разрешите отправку уведомлений в настройках для приложения',
              [
                {
                  text: 'Отмена', onPress: () => {
                  }, style: 'cancel'
                },
                {
                  text: 'Настройки', onPress: () => {
                    if (Platform.OS === 'ios') {
                      Linking.canOpenURL('app-settings:').then(() => {
                        Linking.openURL('app-settings:')
                      }).catch(() => {
                      })
                    } else {
                    }
                  }
                },
              ],
              {cancelable: true}
            );
            this.setState({push: false});
          }
        } else {
          this.props.pushOFF();
        }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeader}>Приветствие</Text>
          </View>
          <View style={styles.sectionContentWrapper}>
            <IconInput inputProps={{
              value: this.state.greeting,
              placeholder: 'Приветствие',
              onChangeText: (text) => {
                this.setState(
                  () => ({greeting: text}),
                  () => {
                    AsyncStorage.setItem('greeting', text)
                  }
                )
              }
            }}
            />
          </View>
        </View>

        {
          this.state.touchIdAvailable &&
          <View style={styles.section}>
            <View style={styles.sectionHeaderWrapper}>
              <Text style={styles.sectionHeader}>
                Безопасность
              </Text>
            </View>


            <View style={styles.sectionContentWrapper}>
              <Text style={styles.sectionContentLabel}>{`Вход по ${isIphoneX() ? 'FaceID' : 'отпечатку пальца'}`}</Text>
              <Switch
                value={this.state.touchId}
                onValueChange={this.toggleTouchId}
              />
            </View>

          </View>
        }

        <View style={styles.section}>
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeader}>
              Главный экран
            </Text>
          </View>

          <View style={styles.sectionContentWrapper}>
            <Text style={styles.sectionContentLabel}>Показывать скрытые продукты</Text>

            <Switch
              value={this.state.hiddenProducts}
              onValueChange={() => {
                this.setState((prevState) => ({
                  hiddenProducts: !prevState.hiddenProducts
                }), () => {
                  AsyncStorage.setItem('hiddenProducts', `${this.state.hiddenProducts}`);
                  this.props.dispatch({type: UPDATE})
                })
              }}
            />
          </View>
        </View>

        {this.props.confAccess['UBS_TRANSFER_SBP_SETUP'] !== 0 &&
          <PressableWithArrow
            onPress={this.props.openSettingsSBP}
            text="Переводы по номеру телефона СБП"
          />
        }

        {this.props.confAccess['UBS_SBP_ACCEPT'] > 0 &&
          <PressableWithArrow
            onPress={this.props.openSbpAcceptancesScreen}
            text="Акцепты на списание средств"
            description="Списание средств по запросам из других банков"
          />
        }

        {this.props.confAccess['UBS_SBP_M_APP_CONFIRM'] > 0 &&
          <PressableWithArrow
            onPress={this.props.openSBPayScreen}
            text="СБПэй"
            description="Управления счетами, подключенными к мобильному приложению СБП"
          />
        }

        {this.props.confAccess['UBS_SBP_SUBSCR_CHANGE'] !== undefined &&
          <PressableWithArrow 
            onPress={this.props.openSBPSubscriptionsScreen}
            text='Подписки СБП'
            description='Управление подписками СБП'
          />
        }

      {BankTheme.pushNotificationsUsed && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderWrapper}>
            <Text style={styles.sectionHeader}>
              Канал уведомлений
            </Text>
          </View>

            <View style={styles.sectionContentWrapper}>
              <Text style={styles.sectionContentLabel}>Push-уведомления</Text>
              <Switch
                value={this.state.push}
                onValueChange={this.pushChange}
              />
            </View>

            <View style={styles.sectionSubContentWrapper}>
              <Text style={styles.sectionSubContentLabel}>
                Все следующие уведомления о входе в систему,{'\n'}
                выполненных операциях будут приходить в виде push-{'\n'}уведомлений,
                отправляемых через сеть интернет.
              </Text>
            </View>
          </View>
        )}

        {this.state.popupShowed && (
          <FingerprintPopup
            handlePopupDismissed={this.handleFingerprintDismissed}
            access={() => {
              this.setState(
                () => ({touchId: true}),
                () => {
                  FingerprintScanner.clearKey('DBO_KEY');
                  AsyncStorage.setItem('touchId', 'true')
                }
              )
            }}
            onFailed={this.handleFingerprintFailed}
          />
        )}
      </View>
    )
  }
}
