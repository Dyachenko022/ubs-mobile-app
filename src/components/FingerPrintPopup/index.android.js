import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Image, Platform,
  View,
  ViewPropTypes
} from 'react-native';
import TouchableOpacity from '../Touchable';
import Icon from 'react-native-vector-icons/Ionicons';
import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';
import {TextRenderer as Text} from '../TextRenderer/index';
import BankTheme from '../../utils/bankTheme';

class FingerprintPopup extends Component {

  constructor(props) {
    super(props);
    this.state = {errorMessage: undefined};
  }

  componentDidMount() {
    FingerprintScanner
      .authenticate({onAttempt: this.handleAuthenticationAttempted})
      .then(() => {
        this.props.handlePopupDismissed();
        this.props.access();
      })
      .catch((error) => {
        switch(error.name) {
          case 'AuthenticationFailed':
            this.props.onFailed && this.props.onFailed();
          default:
            this.setState({errorMessage: error.message});
        }

      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = (error) => {
    this.setState({errorMessage: error.message});
  };

  render() {
    const {errorMessage} = this.state;
    const {style, handlePopupDismissed} = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>


          <Text style={styles.heading}>
            Вход по{'\n'}отпечатку пальца
          </Text>
          {/*<Text
            style={styles.description(!!errorMessage)}>
            {errorMessage || 'Используйте отпечаток пальца\nдля быстрого и удобного\nдоступа к Вашему аккаунту'}
          </Text>*/}

          <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
            <View style={{backgroundColor: 'gray', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10}}>
              <Icon name={Platform.OS === 'ios' ? "ios-finger-print" : 'md-finger-print'} size={30} color={'#fff'}/>
            </View>
            <Text
              style={[styles.description(!!errorMessage), {fontSize: 15}]}>
              {'' || 'Прикоснитесь к сенсору '}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handlePopupDismissed}
          >
            <Text style={styles.buttonText}>
              Отменить
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

FingerprintPopup.propTypes = {
  style: ViewPropTypes.style,
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

let styles = {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15
  },
  logo: {
    marginVertical: 45,
  },
  heading: {
    color: BankTheme.color1,
    fontSize: 22,
  },
  description: (error) => ({
    color: error ? '#ea3d13' : '#a5a5a5',
    fontSize: 16,
    marginVertical: 15,
  }),
  buttonContainer: {
    alignSelf: 'flex-end'
  },
  buttonText: {
    color: '#8fbc5a',
    fontSize: 16,
    fontWeight: 'bold',
  },
};
