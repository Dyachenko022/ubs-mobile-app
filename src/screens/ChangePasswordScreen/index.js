import React from 'react';
import {View, Text, StyleSheet, Platform, SafeAreaView} from 'react-native';
import {IconInput} from '../../components/Inputs';
import FilledButton from '../../components/buttons/FilledButton';
import { changeAppRoot } from '../../reducers/routing/actions';
import { connect } from 'react-redux';
import {changePassword} from '../../api/actions';
import { authContractAfterChangePassword } from '../../actions/onAuthContract';
import { checkPassword } from '../../utils/utils';
import {Navigation} from 'react-native-navigation';
import {makeLeftBackButton} from '../../utils/navigationUtils';
import Icon from 'react-native-vector-icons/FontAwesome';

class ChangePasswordScreen extends React.Component {

  static options = (props) => ({
    topBar: {
      title: {
        text: 'Смена пароля',
      },
      leftButtons: [
        makeLeftBackButton('changepasswordbackbtn')
      ],
    },
    bottomTabs: {
      visible: false,
    }
  })

  constructor(props) {
    super(props);
    this.state = {
      newPass1: '',
      newPass2: '',
    }
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'changepasswordbackbtn') {
      Navigation.popToRoot(this.props.componentId);
      this.props.returnToLogin();
    }
  }

  onSuccessConfirmSms = () => {
    if (this.props.isRegistration) {
    }
  }

  renderPasswordStrength() {
    const passwordStrength = checkPassword(this.state.newPass1);

    const color = passwordStrength === 'Простой' ? 'red'
      : passwordStrength === 'Средний' ? 'yellow'
      : 'green';

    return (
      <Text style={{color}}>
        {passwordStrength}
      </Text>
    )
  }

  render() {
    return (
      <SafeAreaView style={{width: '100%', height: '100%'}}>
        <View style={{width: '100%', flex:1, backgroundColor: 'white', alignItems: 'center',}}>
          <Text style={{width: '80%', textAlign: 'center', paddingTop: 30,}}>
            Задайте постоянный пароль абонента, который будет использоваться для входа
            на web-сайт и при повторной регистрации приложения
          </Text>


          <Text style={{paddingTop: 20, paddingBottom: 20, width: '80%', textAlign: 'left', color: '#CDCDCD', fontSize: 12,}}>
            Используйте знаки верхнего и нижнего регистра (A-z), специальные символы (!-*) и цифры (0-9)
          </Text>

          <View style={{width: '85%'}}>

            <IconInput
              styles={{marginBottom: 5}}
              placeholder="Новый пароль"
              inputProps={{
                value: this.state.newPass1,
                onChangeText: (text) => this.setState({newPass1: text}),
                secureTextEntry: true,
              }}
              iconLeft={(iconProps) => <Icon active name='lock' size={20} color='#CDCDCD' {...iconProps}/>}
            />

            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
              <Text>Степень надежности</Text>
              {this.renderPasswordStrength()}
            </View>

            <IconInput
              styles={{marginTop: 15}}
              placeholder="Повторите ввод нового пароля"
              inputProps={{
                value: this.state.newPass2,
                onChangeText: (text) => this.setState({newPass2: text}),
                secureTextEntry: true,
              }}

              iconLeft={(iconProps) => <Icon active name='lock' size={20} color='#CDCDCD' {...iconProps}/>}
            />

            { this.state.newPass1 !== this.state.newPass2 && this.state.newPass1 !== '' &&
              <View style={{flexDirection: 'row', justifyContent: 'flex-end',}}>
                <Text style={{color: 'red'}}>Пароли не совпадают</Text>
              </View>
            }

          </View>

        </View>
        <View>
          <FilledButton
            onPress={() => this.props.changePassword(this.state.newPass1)}
            disabled={this.state.newPass1 !== this.state.newPass2 || this.state.newPass2 === ''}
            title="Установить пароль"
          />
        </View>
      </SafeAreaView>
    )
  }
}


const mapStateToProps = (state) => ({
  root: state.routing.root,
});


const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  return {
    ...stateProps,
    ...ownProps,
    returnToLogin: () => {
      dispatch( changeAppRoot('login'))
    },
    changePassword: (password) => {
      dispatch(changePassword(password, () => {
        // proceedLoginFunction передается когда смена пароля осуществяет уже зарегестрированный пользователь (пользователь ввел код)
        if (ownProps.proceedLoginFunction) {
         ownProps.proceedLoginFunction();
        } else {
          // А это - во время регистрации МП (т.е. пользователь ввел логин/пароль)
          authContractAfterChangePassword(dispatch);
        }
      }));
    }
  }
}

export default connect(mapStateToProps, null, mergeProps)(ChangePasswordScreen);
