import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertIOS } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';

import { isIphoneX } from '../../utils/platform';

class FingerprintPopup extends Component {

  componentDidMount() {
      FingerprintScanner.authenticate({ description: `${isIphoneX() ? 'Используйте FaceID' : 'Приложите палец'}, чтобы продолжить`,
        useKey: true,
        keyName: 'DBO_KEY',
      })
      .then(() => {
        this.props.access();
        this.props.handlePopupDismissed();
      })
      .catch((error) => {
        console.error(error);
        if (error.keyWasInvalidated) {
          this.props.onFailed && this.props.onFailed(true);
          this.props.handlePopupDismissed();
          return;
        }
        switch (error.name) {
          case 'UserCancel':
            this.props.handlePopupDismissed();
            break;
          case 'AuthenticationFailed':
            this.props.onFailed && this.props.onFailed();
            this.props.handlePopupDismissed();
            break;
          default:
            this.props.handlePopupDismissed();
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
