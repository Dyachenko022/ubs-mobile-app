import React from 'react';
import { connect } from 'react-redux';
import {
  Alert, Platform,
} from 'react-native';
import { changeAppRoot } from '../../reducers/routing/actions';
import { ConfirmationPage } from 'react-native-ubs-mobile-core';
import {Navigation} from 'react-native-navigation';
import { makeLeftBackButton } from '../../utils/navigationUtils';

class ConfirmationScreen extends React.Component {
  static options = (props) => {
    let leftButtons = (props.isRegistration || props.isForgot) ? null : [ makeLeftBackButton('confirmationScreenBackButton') ];
    if (!leftButtons && Platform.OS === 'ios') leftButtons = [];
    return {
      topBar: {
        title: {
          text: 'Подтвержение',
          color: 'white',
          alignment: 'center',
        },
        //При регистрации просто возвращаемя, при регистрации приложения, если нажат логин\пароль, нужно вернуться на форму логин\пароль
        leftButtons,
      }
    }
  }

  state = {
    didAppear: false,
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  componentDidAppear() {
    this.setState({ didAppear: true });
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'confirmationScreenBackButton') this.props.dispatch(changeAppRoot('login'));
  }

  onSuccessConfirmSms = () => {
    if (this.props.isRegistration) {
      Navigation.popToRoot(this.props.componentId);
      Alert.alert('Регистрация', 'Регистрация завершена успешно!')
    }
    else if (this.props.isForgot) {
      Navigation.popToRoot(this.props.componentId);
      Alert.alert('Восстановление пароля', 'Доступ успешно восстановлен!\r\nВременный пароль был выслан вам в СМС. После входа в систему, обязательно смените его.')
    }
    else {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'unisab/CodeSettingsScreen',
          options: {
            topBar: {
              title: {
                text: 'Подтверждение',
                color: 'white',
                alignment: 'center',
              },
              backButton: {
                color: 'white',
                title: 'Назад',
                showTitle: 'true',
              }
            }
          }
        }
      });
    }
  }

  render() {
    // На всякий случай, не будем ничего рендерить до события didAppear
    if (!this.state.didAppear) return null;
    return (
    <ConfirmationPage
        componentId={this.props.componentId}
        isRegistration={this.props.isRegistration}
        isForgot={this.props.isForgot}
        data={this.props.data}
        initialTimer={this.props.initialTimer}
        onSuccessConfirmSms={this.onSuccessConfirmSms}
      />
    );
  }
}


const mapStateToProps = (state) => ({
  root: state.routing.root,
});

export default connect(mapStateToProps)(ConfirmationScreen);
