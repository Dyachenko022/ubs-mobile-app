import React from 'react';
import {connect} from 'react-redux';
import {TextInputMask} from 'react-native-masked-text'
import moment from 'moment';
import {
  Platform,
  Text,
  Image,
  ImageBackground,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
  AsyncStorage
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import {IconInput} from '../../components/Inputs';
import { registration, forgot } from 'react-native-ubs-mobile-core';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import {pushScreen} from '../../utils/navigationUtils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import BankTheme from '../../utils/bankTheme';

class RegistrationScreen extends React.Component {

  options = {
    bottomTabs: {
      visible: false,
    }
  }

  constructor(props) {
    super(props);

    this.scanCard = this.scanCard.bind(this);

    this.state = {
      dateBirth: '', //'14.04.1961',
      numPhone: '', //'9152677788',
      numCard: '', //'4215897811101111',
      numDoc: '', //'4607 131758',
      fio: '',
      login: '',
      validationState: {
        dateBirth: true,
        numPhone: true,
        numCard: true,
        numDoc: true,
        fio: true,
      },
      isAgreed: false
    }
  }

  validate = (fieldName) => {
    let {validationState} = this.state;
    let result = true;
    if (!fieldName || fieldName === 'numCard')  validationState.numCard = this.creditCardInput.getRawValue().length >= 16;
    if (!fieldName || fieldName === 'numPhone') validationState.numPhone = this.numPhoneInput.getRawValue().length === 10;
    if (this.props.requireBirthday && (!fieldName || fieldName === 'dateBirth')) validationState.dateBirth = moment(this.state.dateBirth, 'DD.MM.YYYY').isValid();
    if (!fieldName || fieldName === 'numDoc') validationState.numDoc = this.numDocInput.getRawValue().length > 3  && (new RegExp(/^(\d|\s)*$/g)).test(this.numDocInput.getRawValue());
    if (this.props.requireFio && (!fieldName || fieldName === 'fio')) validationState.fio = this.state.fio.length > 1;
    this.setState({validationState});
    Object.keys(validationState).forEach(key => result = result && validationState[key]);
    return result;
  }

  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.background} style={{backgroundColor: '#f2f5f7'}}>
        <View style={styles.formWrapper}>
          <IconInput
            styles={{marginBottom: 15}}
            placeholder={'Номер карты'}
            isValid={this.state.validationState.numCard}
            onBlur={() => this.validate('numCard')}

            iconLeft={(iconProps) =>
              <TouchableOpacity onPress={() => {
              }}>
                <Icon name={'md-card'} size={23} {...iconProps}/>
              </TouchableOpacity>
            }

            customInput={(props) =>
              <TextInputMask
                ref={ref => this.creditCardInput = ref}
                type={'custom'}
                maxLength={'9999 9999 9999 9999 99'.length}
                options={{
                  mask: '9999 9999 9999 9999 99',
                  getRawValue: function(value) {
                    return value.replace(/\s/g, '');
                  },
                  validator: function (value, settings) {
                    let strLength = value.replace(/\s/g, "").length;
                    return strLength === 16 || strLength === 18
                  }
                }}

                onChangeText={ numCard => this.setState(() => ({numCard})) }
                value={this.state.numCard}
                {...props}
              />
            }
          />

          <IconInput
            styles={{marginBottom: 15}}
            placeholder={'Номер телефона'}
            inputProps={{
              returnKeyType: 'go'
            }}
            isValid={this.state.validationState.numPhone}
            onBlur={() => this.validate('numPhone')}

            iconLeft={(iconProps) => <Icon name={'ios-call'} size={23} {...iconProps}/>}

            customInput={(props) =>
              <TextInputMask
                ref={ref => this.numPhoneInput = ref}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                type={'custom'}
                options={{
                  mask: '+7(999) 999 99-99',
                  getRawValue: function(value) {
                    return value.replace(/[\s,\+,\-,\(,\)]/g, '').slice(1);
                  }
                }}

                maxLength={'+7(999) 999 99-99'.length}
                onChangeText={ (numPhone) => {
                  this.setState(() => ({numPhone}))
                }}
                value={this.state.numPhone}
                {...props}
              />
            }
          />

          {this.props.requireBirthday &&
            <IconInput
              styles={{marginBottom: 15}}
              placeholder={'Дата рождения'}
              isValid={this.state.validationState.dateBirth}
              onBlur={() => this.validate('dateBirth')}
              iconLeft={(iconProps) => <Icon name={'ios-calendar'} size={23} {...iconProps}/>}

              customInput={(props) =>
                <TextInputMask
                  ref={ref => this.dateBirthInput = ref}
                  type={'datetime'}

                  options={{
                    format: 'DD.MM.YYYY'
                  }}

                  onChangeText={(text) => {
                    this.setState({dateBirth: text})
                  }}
                  value={this.state.dateBirth}
                  maxLength={'DD.MM.YYYY'.length}
                  {...props}
                />
              }
            />
          }

          <IconInput
            styles={{marginBottom: 15}}
            placeholder={'Серия и номер паспорта'}
            isValid={this.state.validationState.numDoc}
            onBlur={() => this.validate('numDoc')}
            iconLeft={(iconProps) => <Icon name={'md-person'} color={'#bbb'} size={23} {...iconProps}/>}

            customInput={(props) =>
              <TextInputMask
                ref={ref => this.numDocInput = ref}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                type={'custom'}
                options={{
                  mask: '** ** 999999',
                }}

                maxLength={12}

                onChangeText={ numDoc => this.setState(() => ({numDoc})) }
                value={this.state.numDoc}
                {...props}
              />
            }
          />

          {this.props.requireLogin &&
            <IconInput
              styles={{marginBottom: 15}}
              placeholder={'Логин'}
              iconLeft={(iconProps) => <Icon name={'md-person'} color={'#bbb'} size={23} {...iconProps}/>}
              customInput={(props) =>
                <TextInput
                  onChangeText={login => this.setState(() => ({login}))}
                  value={this.state.login}
                  {...props}
                />
              }
            />
          }

          {this.props.requireFio &&
            <IconInput
              styles={{marginBottom: 15}}
              placeholder={'ФИО'}
              isValid={this.state.validationState.fio}
              onBlur={() => this.validate('fio')}
              iconLeft={(iconProps) => <Icon name={'md-person'} color={'#bbb'} size={23} {...iconProps}/>}

              customInput={(props) =>
                <TextInput
                  onChangeText={fio => this.setState(() => ({fio}))}
                  value={this.state.fio}
                  {...props}
                />
              }
            />
          }
        </View>

        <View style={styles.agreeContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({isAgreed: !this.state.isAgreed});
            }}
          >
            <View style={styles.agreeCheckboxContainer}>
              <View style={[styles.agreeCheckbox, this.state.isAgreed && styles.agreeCheckboxActive]}></View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <Text style={styles.agreeText}>С</Text>
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL(this.props.linkSpecification)}
            >
              <View><Text style={styles.agreeTextLink}> правилами </Text></View>
            </TouchableWithoutFeedback>
            <Text style={styles.agreeText}>и</Text>
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL(this.props.linkTariffs)}
            >
              <View style={{alignItems: 'center'}}><Text style={styles.agreeTextLink}> тарифами </Text></View>
            </TouchableWithoutFeedback>
            <Text style={styles.agreeText}>ознакомлен</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, !this.state.isAgreed && styles.btnDisabled]}
          onPress={() => {
            if (!this.state.isAgreed) return;

            if (!this.validate()) return;

            const data = {
              numPhone: this.numPhoneInput.getRawValue(),
              numCard: this.creditCardInput.getRawValue(),
              numDoc: this.numDocInput.getRawValue(),
            };
            if (this.state.dateBirth) data.dateBirth = this.state.dateBirth;
            if (this.state.fio) data.fio = this.state.fio;
            if (this.state.login) data.login = this.state.login;

            let promise = null;
            if (!this.props.isForgot) {
              promise = registration(data.dateBirth, data.numCard, data.numDoc, data.numPhone, data.fio, data.login);
            } else {
              promise = forgot(data.dateBirth, data.numCard, data.numDoc, data.numPhone, data.fio, data.login);
            }

              promise.then(async (response) => {
                await AsyncStorage.setItem('jwt', response.jwt);
                pushScreen({
                  componentId: this.props.componentId,
                  screenName: 'unisab/ConfirmationScreen',
                  title: 'Подтверждение',
                  passProps: {
                    isRegistration: !this.props.isForgot,
                    isForgot: this.props.isForgot,
                    data,
                    initialTimer: {
                      phoneSending: response.phoneSending,
                      dateGenerate: response.dateGenerate,
                    }
                  },
                })
              });
          }}>
          <Text style={{fontSize: 16, color: this.state.isAgreed ? BankTheme.color1 : '#aaa'}}>ДАЛЕЕ</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    )
  }

  scanCard() {
  }
}

function mapStateToProps(state) {
  return {
    counter: state.counter,
    linkSpecification: state.settingsFront.linkSpecification || '',
    linkTariffs: state.settingsFront.linkTariffs || '',
    requireLogin: state.settingsFront.registrationPage.requireLogin,
    requireFio: state.settingsFront.registrationPage.requireFio,
    requireBirthday: state.settingsFront.registrationPage.requireBirthday,
  };
}

export default connect(mapStateToProps)(RegistrationScreen);
