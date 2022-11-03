import React from 'react';
import PropTypes from 'prop-types';
import {Platform, View, Text, AsyncStorage, Alert, StyleSheet} from 'react-native';
import CodeKeyboard from '../../components/CodeKeyboard';
import FingerprintScanner from "react-native-fingerprint-scanner-with-key";
import { registrationApp } from '../../coreApi';

import styles from './styles';

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
      arrayElements.push(<View key={i}
                               style={i < this.props.selected ? {...styles.indicatorFull,
                                  borderColor: this.props.theme.indicatorBorderColor,
                                  backgroundColor: this.props.theme.indicatorFullBackgroundColor,
                                 }
                               :
                                 {...styles.indicator,
                                   borderColor: this.props.theme.indicatorBorderColor,
                                   backgroundColor: this.props.theme.indicatorEmptyBackgroundColor,
                                 }
      }/>)
    }

    return arrayElements;
  }
}

export default class CodeSettingPage extends React.Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
    this._onDel = this._onDel.bind(this);

    this._onKeyboard = this._onKeyboard.bind(this);
    this._onCodeEntered = this._onCodeEntered.bind(this);

    this.state = {
      title: 'Задайте код доступа для \n входа в систему',
      code: '',
      codeConfirm: '',

      confirm: 0,
      touchId: true
    }
  }

  componentDidMount() {
    FingerprintScanner
      .isSensorAvailable()
      .then((isSuccess) => {
        this.setState({ touchId: isSuccess });
      })
      .catch(error => {
        this.setState({touchId: false})
      });
  }

  render() {
    return (
      <View style={StyleSheet.flatten([styles.background, {backgroundColor: this.props.theme.backgroundColor}])}>
        <Text style={[styles.headerText, {color: this.props.theme.textColor,}]}>
          {this.state.title}
        </Text>

        <Indicators
          selected={!this.state.confirm ? this.state.code.length : this.state.codeConfirm.length}
          theme={this.props.theme}
        />

        <CodeKeyboard
          maxLenght={NUMBER}
          btnMargin={12}
          theme={this.props.theme}

          value={!this.state.confirm ? this.state.code : this.state.codeConfirm}
          onValueChange={this._onKeyboard}

          onPress={this._onPress}
          onDel={this._onDel}
        />
      </View>
    )
  }

  _onPress(val) {

    if (!this.state.confirm) {
      if (this.state.code.length < NUMBER) {
        this.setState((state) => {
          let code = state.code;
          code = code + val;

          return {code}
        }, () => {
          if (this.state.code.length === NUMBER) {
            this._onCodeEntered()
          }
        })
      }
    } else {
      this.setState((state) => {
        let codeConfirm = state.codeConfirm;
        codeConfirm = codeConfirm + val;

        return {codeConfirm}
      }, () => {
        if (this.state.codeConfirm.length === NUMBER) {
          this._onCodeEntered()
        }
      })
    }


  }

  _onDel() {
    if (!this.state.confirm) {
      this.setState((state) => {
        let code = state;
        code = code.code.slice(0, code.code.length - 1);

        return {code};
      })
    } else {
      this.setState((state) => {
        let codeConfirm = state;
        codeConfirm = codeConfirm.codeConfirm.slice(0, codeConfirm.codeConfirm.length - 1);

        return {codeConfirm};
      })
    }
  }

  _onKeyboard(val) {
    this.setState({
      code: val
    },)
  }

  async _onCodeEntered() {
    let isCodesSame = this.state.code === this.state.codeConfirm;

    if (!this.state.confirm) {
      this.setState({
        title: 'Повторите ранее введенный \n код доступа',
        confirm: 1
      })
    } else if (isCodesSame) {
      await AsyncStorage.setItem('code', this.state.code);
      let contractId = await AsyncStorage.getItem('contractId');
      let response;
      try {
        response = await registrationApp(this.state.code, contractId, this.props.username);
      } catch (e) {
        await AsyncStorage.setItem('code', '');
        console.error(e);
        return;
      }
      this.props.registrationAppSuccess(response, this.state.code, contractId);

      if (this.state.touchId) {
        this.props.openIdentityScreen();
      } else {
        await AsyncStorage.setItem('touchId', '');
        this.props.setCredentials(true);
        this.props.returnToLogin();
      }
    } else {
      Alert.alert(
        'Пароли не совпадают',
        'Попробуйте еще раз'
      );
      this.setState({
        title: 'Задайте код доступа для \n входа в систему',
        code: '',
        codeConfirm: '',

        confirm: 0
      })
    }
  }
}

CodeSettingPage.propTypes = {
  setCredentials: PropTypes.func,
  returnToLogin: PropTypes.func,
  registrationAppSuccess: PropTypes.func,
  openIdentityScreen: PropTypes.func,
  theme: PropTypes.object,
}

CodeSettingPage.defaultProps = {
  theme: {},
  username: PropTypes.string,
}
