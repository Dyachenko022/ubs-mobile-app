import React from 'react';
import {connect} from 'react-redux';
import FingerprintScanner from 'react-native-fingerprint-scanner-with-key';
import {changeAppRoot} from '../../reducers/routing/actions';
import {setCredentials} from '../../reducers/login/actions';
import {IdentitySelectPage} from 'react-native-ubs-mobile-core';
import {makeLeftBackButton} from '../../utils/navigationUtils';
import {Navigation} from 'react-native-navigation';
import {dispatch} from 'react-native-navigation-drawer-extension/lib/events';
import {AsyncStorage, BackHandler} from 'react-native';

class IdentifySelectScreen extends React.Component {

  static options = (props) => ({
    topBar: {
      leftButtons: [
        makeLeftBackButton('identyBack')
      ],
    }
  });

  componentDidMount() {
    this.navigationEvents = Navigation.events().bindComponent(this);
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.navigationButtonPressed);
  }

  async navigationButtonPressed() {
    await AsyncStorage.setItem('code', '');
    await AsyncStorage.setItem('contractId', '');

    this.props.dispatch(changeAppRoot('login'))
    await Navigation.dismissModal(this.props.componentId);
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
    this.androidBackButtonListener?.remove();
  }


  render() {
    return(
      <IdentitySelectPage
        setCredentials={() => this.props.dispatch(setCredentials(true))}
        returnToLoginScreen={() => this.props.dispatch(changeAppRoot('login'))}
        FingerprintScanner={FingerprintScanner}
        />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  }
}

export default connect(null, mapDispatchToProps)(IdentifySelectScreen);
