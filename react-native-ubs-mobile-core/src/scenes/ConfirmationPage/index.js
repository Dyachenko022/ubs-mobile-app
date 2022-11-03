import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard, AsyncStorage,
} from 'react-native';
import { TextRenderer as Text } from '../../components/TextRenderer';
import moment from 'moment';
import {getCodeSms, confirmSms, registration, registrationConfirm, forgot, forgotConfirm} from '../../coreApi';
import styles from './styles';

class CodeInput extends React.Component {
  constructor(props) {
    super(props);
    this.timerStart = this.timerStart.bind(this);
    this.timerStop = this.timerStop.bind(this);
    this.tick = this.tick.bind(this);
    this.state = {
      value: '',
      timer: -1,
    };
    this.timeHide = null;
    this.timeShow = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.timer === -1 && nextProps.time) {
      return { timer: nextProps.time * 60 }
    }
    return {};
  }

  componentDidUpdate(prevProps, prevState) {
    this.timerStart();
    if (prevState.timer === 0) {
      this.setState(() => ({ value: '' }))
    }
  }

  requestNewCode = () => {
    this.props.getNewCode();
    this.setState({ timer: -1 });
  };

  render() {
    let inputs = [];
    for (let i = 0; i < this.props.codeLength; i++) {
      inputs.push(
        <View
          style={[styles.codeInput, {
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            // borderWidth: 1,
            height: '100%',
            borderRadius: 3,
            backgroundColor: '#fff'
          }]}
        >
          <Text style={{ fontSize: 30, color: global.coreUiColor }}>
            {this.state.value[i] || '–'}
          </Text>
        </View>
      )
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={styles.inputWrapper}>
          {
            this.state.timer > 0 ?
              [
                ...inputs,
                <TextInput
                  key={'input'}
                  ref={ref => this.input = ref}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, opacity: 0 }}

                  underlineColorAndroid={'transparent'}
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}

                  autoFocus
                  maxLength={this.props.codeLength}
                  textContentType={'oneTimeCode'}
                  value={this.state.value}
                  onChangeText={text => {
                    if (text.length === this.props.codeLength) {
                      this.props.onDone(text)
                    }
                    this.setState(() => ({ value: text }))
                  }}
                  onEndEditing={() => {
                  }}
                />,

              ]
              :
              <TouchableOpacity style={styles.newCodeBtn} onPress={this.requestNewCode}>
                <Text style={styles.newCodeBtnText}>выслать новый код</Text>
              </TouchableOpacity>
          }
        </View>
        {
          this.state.timer > 0 ?
            <Text style={{ color: "#888", marginTop: 10 }}>{`срок действия: ${this.state.timer} сек`}</Text>
            :
            <Text style={{ color: "#888", marginTop: 10 }}>срок действия кода <Text
              style={{ color: global.coreUiColor }}>истек</Text></Text>
        }
      </View>
    )
  }

  timerStart() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(
      () => {
        this.tick()
      },
      __DEV__ ? 100000 : 1000
    );
  }

  timerStop() {
    clearInterval(this.timerId)
  }

  tick() {
    if (this.state.timer === 0) {
      this.timerStop();
    } else {
      this.setState({
        timer: this.state.timer - 1
      })
    }
  }
}

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.getNewCode = this.getNewCode.bind(this);
    this._onCodeEntered = this._onCodeEntered.bind(this);
    this.state = {
      screenVisible: true,
      liveTime: 5,
      initialTimerSet: !!props.initialTimer,
      phoneSending: props.initialTimer ? props.initialTimer.phoneSending : '',
      dateGenerate: props.initialTimer ? props.initialTimer.dateGenerate : '',
    }
  }

  regFunc() {
    if (this.props.isRegistration){
      const {dateBirth, numCard, numDoc, numPhone, fio, login } = this.props.data;
      registration(dateBirth, numCard, numDoc, numPhone, fio, login,).
        then(async (response) => {
          await AsyncStorage.setItem('jwt', response.jwt);
          this.setState({
            liveTime: 5,
            phoneSending: response.phoneSending,
            dateGenerate: response.dateGenerate,
          })
        });
    }
    else if (this.props.isForgot){
      const {dateBirth, numCard, numDoc, numPhone, fio, login} = this.props.data;
      forgot(dateBirth, numCard, numDoc, numPhone, fio, login).
      then(async (response) => {
        await AsyncStorage.setItem('jwt', response.jwt);
        this.setState({
          liveTime: 5,
          phoneSending: response.phoneSending,
          dateGenerate: response.dateGenerate,
        })
      });
    }
    else {
      getCodeSms().
        then(response => {
          this.setState({
            liveTime: 5,
            phoneSending: response.phoneSending,
            dateGenerate: response.dateGenerate,
          })
      })
    }
  }

  componentDidMount() {
    if (this.state.initialTimerSet) {
      this.setState({ initialTimerSet: false });
    } else {
      this.regFunc();
    }
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
        <View style={styles.background}>
          {
            this.state.screenVisible &&
              <View style={{marginTop: 16}}>
                <CodeInput
                  time={this.state.liveTime}
                  codeLength={5}
                  dateGenerate={this.state.dateGenerate}
                  onDone={(code) => {
                    this._onCodeEntered(code)
                  }}
                  getNewCode={this.getNewCode}
                />
              </View>
          }
          <Text style={{ textAlign: "center", color: "#888", fontSize: 16, paddingTop: '10%' }}>
            Для завершения входа введите {'\n'}
            код подтверждения, {'\n'}
            отправленный в SMS-сообщении {'\n'}
            на Ваш телефон {'\n'}
            {this.state.phoneSending} {'\n'}
            Время отправки {moment(this.state.dateGenerate, 'DD.MM.YYYYThh:mm:ss').format('DD.MM.YYYY HH:mm')} {'\n'}
          </Text>
          <Text style={{ textAlign: "center", color: "#888", fontSize: 12, marginTop: 40 }}>
            *Если Вам пришло SMS-сообщение об операции, {'\n'}
            которую Вы не совершали, категорически {'\n'}
            запрещается вводить куда-либо или сообщать кому- {'\n'}
            либо полученный одноразовый пароль!
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  getNewCode() {
    this.regFunc();
  }

  _onCodeEntered(code) {
    if (this.props.isRegistration) {
      registrationConfirm(code).then(response => {
        this.props.onSuccessConfirmSms();
      });
    }
    else if (this.props.isForgot){
      forgotConfirm(code).then(() => this.props.onSuccessConfirmSms());
    }
    else confirmSms(code).
      then(response => {
        this.props.onSuccessConfirmSms();
    })
  }
}

ConfirmationPage.propTypes = {
  onSuccessConfirmSms: PropTypes.func,
};

