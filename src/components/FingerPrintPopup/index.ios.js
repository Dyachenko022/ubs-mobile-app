import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertIOS } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';

import { isIphoneX } from '../../utils/platform';

class FingerprintPopup extends Component {

  componentDidMount() {
    FingerprintScanner
      .authenticate({ description: `${isIphoneX() ? 'Используйте FaceID' : 'Приложите палец'}, чтобы продолжить` })
      .then(() => {
        this.props.access();
        this.props.handlePopupDismissed();
      })
      .catch((error) => {
        switch (error.name) {
          case 'UserCancel':
            this.props.handlePopupDismissed();
          case 'AuthenticationFailed':
            this.props.onFailed && this.props.onFailed();

          default:
            this.setState({ errorMessage: error.message });
        }
      });
  }

  render() {
    return false;
  }
}

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;
