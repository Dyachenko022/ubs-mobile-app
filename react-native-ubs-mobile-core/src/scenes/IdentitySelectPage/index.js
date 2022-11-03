import React from 'react';
import PropTypes from 'prop-types';
import {Platform, View, Text, AsyncStorage, Image, StyleSheet} from 'react-native';
import {default as TouchableOpacity} from '../../components/Touchable'

import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';
import FingerprintPopup from '../../components/FingerPrintPopup';

import {isIphoneX} from '../../utils/platform';

import styles from './styles';

import Icon from 'react-native-vector-icons/Ionicons'

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
      arrayElements.push(<View key={i} style={i < this.props.selected ? styles.indicatorFull : styles.indicator}/>)
    }

    return arrayElements;
  }
}

export default class IdentifySelectPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleFingerprintShowed = this.handleFingerprintShowed.bind(this);
    this.handleFingerprintDismissed = this.handleFingerprintDismissed.bind(this);

    this.codeAccess = this.codeAccess.bind(this);
    this.fingerprintAccess = this.fingerprintAccess.bind(this);

    this.state = {
      title: `Использовать ${isIphoneX() ? 'FaceID' : 'отпечаток пальца'} \n для входа в приложение?`,
      code: '',
      codeConfirm: '',

      confirm: 0
    }
  }

  componentDidMount() {
    FingerprintScanner
      .isSensorAvailable()
      .catch(async (error) => {
        await AsyncStorage.setItem('touchId', '');
        this.props.setCredentials();
        this.props.returnToLoginScreen();
      });
  }

  render() {
    const {errorMessage, popupShowed} = this.state;
    return (
      <View style={StyleSheet.flatten([styles.background, {backgroundColor: global.coreUiColor}])}>
        <Text style={styles.headerText}>
          {this.state.title}
        </Text>

        {
          isIphoneX() ?
            <Image source={require('../../assets/faceId.png')} style={{ width: 90, height: 90 }}/>
            :
            <Icon name={Platform.OS === 'ios' ? "ios-finger-print" : 'md-finger-print'} size={120} color={'#fff'}/>
        }

        <View sltye={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={styles.useCode}
            onPress={this.codeAccess}>
            <Text style={styles.useCodeText}>Использовать только код доступа</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.useTouchId}
            onPress={this.handleFingerprintShowed}
            disabled={!!errorMessage}
          >
            <Text style={StyleSheet.flatten([styles.useTouchIdText, {color: global.coreUiColor}])}>ИСПОЛЬЗОВАТЬ {Platform.OS === 'ios' ? isIphoneX() ? 'FACE ID' : 'TOUCH ID' : 'ОТПЕЧАТОК'}</Text>
          </TouchableOpacity>
        </View>

        {Boolean(errorMessage) && (
          <Text>
            {errorMessage}
          </Text>
        )}

        {popupShowed && (
          <FingerprintPopup
            handlePopupDismissed={this.handleFingerprintDismissed}
            access={this.fingerprintAccess}
            onFailed={this.codeAccess}
          />
        )}
      </View>
    )
  }

  handleFingerprintShowed() {
    FingerprintScanner.clearKey('DBO_KEY');
    this.setState({popupShowed: true});
  };

  handleFingerprintDismissed() {
    this.setState({popupShowed: false});
  };

  async codeAccess() {
    await AsyncStorage.setItem('touchId', '');
    this.props.setCredentials(true);
    this.props.returnToLoginScreen()
  }

  async fingerprintAccess() {
    await AsyncStorage.setItem('touchId', 'true');
    this.props.setCredentials(true);
    this.props.returnToLoginScreen();
  }
}

IdentifySelectPage.propTypes = {
  setCredentials: PropTypes.func,
  returnToLoginScreen: PropTypes.func,
};
