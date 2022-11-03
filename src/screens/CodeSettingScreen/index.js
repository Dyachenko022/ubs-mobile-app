import React from 'react';
import {connect} from 'react-redux';
import { AsyncStorage } from 'react-native';
import {setCredentials} from "../../reducers/login/actions";
import {changeAppRoot} from "../../reducers/routing/actions";
import { CodeSettingPage } from 'react-native-ubs-mobile-core';
import * as types from "../../api/actionTypes";
import {makeLeftBackButton, pushScreen} from '../../utils/navigationUtils';
import BankTheme from '../../utils/bankTheme';
import {Navigation} from 'react-native-navigation';


class CodeSettingScreen extends React.Component {
  static options = () => {
    let leftButtons = [ makeLeftBackButton('codeSettingScreenBackButton') ];
    return {
      topBar: {
        title: {
          text: 'Подтвержение',
          color: 'white',
          alignment: 'center',
        },
        leftButtons,
      }
    }
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'codeSettingScreenBackButton') this.props.dispatch(changeAppRoot('login'));
  }

  registrationAppSuccess = (response) => {
    AsyncStorage.setItem('registeredName', response.deviceName);
    this.props.dispatch({
      type: types.RegistrationAppNew.SUC,
      response
    });
  };

  openIdentityScreen = () => {
    pushScreen({
      componentId: this.props.componentId,
      screenName: 'unisab/IdentifySelectScreen',
      title: 'Режим индефикации',
    });
  }

  render() {
    return (
      <CodeSettingPage
        returnToLogin={() => this.props.dispatch(changeAppRoot('login'))}
        setCredentials={() => this.props.dispatch(setCredentials(true))}
        registrationAppSuccess={ this.registrationAppSuccess }
        openIdentityScreen={this.openIdentityScreen}
        username={this.props.username}
        theme={BankTheme.codeSettingPageTheme}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  username: state.login.username,
});
export default connect(mapStateToProps)(CodeSettingScreen);
