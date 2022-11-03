import React from 'react'
import Contacts from 'react-native-contacts'
import {
  Text, View, Alert,
  Platform
} from 'react-native'
import TouchableOpacity from '../../Touchable';
import TextBoxFind from '../TextBoxFind'
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

export default class ContactsInput extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      value: prevState.derivedValue === nextProps.value ? prevState.value : nextProps.value,
      derivedValue: nextProps.value,
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      value: ''
    }
  }

  componentDidMount() {
    this.getContacts();
  }

  render() {
    return (
      <TextBoxFind
        focusEditableTextInput={this.props.autoFocus}
        autoFocus={this.props.autoFocus}
        ref={e => this.input = e}
        isValid={this.props.isCorrect}
        value={this.state.value}
        data={this.state.contacts.sort((a, b) => `${a.familyName || ''} ${a.givenName || ''}`.localeCompare(`${b.familyName || ''} ${b.givenName || ''}`))}
        name={this.props.name}
        modalName="Номер телефона или имя"
        maxLength={this.props.mask ? this.props.mask.length : undefined}
        placeholder={this.props.mask}

        itemRenderer={(value, idx) => (
          <TouchableOpacity key={`${idx}`} onPress={() => {
            this.onSubmit(value.phoneNumber);
            this.input.blur();
          }}>
            <Text style={{
              fontSize: 16,
              marginBottom: 5
            }}>{`${value.familyName || ''} ${value.givenName || ''} ${value.phoneNumber}`}</Text>
          </TouchableOpacity>
        )}

        filter={(el, cond) => {
          if (!cond) return false;

          const name = `${el.familyName || ''} ${el.givenName || ''}`;

          try {
            return name.toUpperCase().includes(cond.toUpperCase())
              || (
                el.phoneNumbers.length
                && cond.replace(/[^\d]/g, '').length
                && (new RegExp(cond.replace(/[^\d]/g, ''))).test(el.phoneNumber.replace(/[^\d]/g, '')));
          } catch (e) {
            return true;
          }
        }}
        onChange={(value) => {
          this.setState({ value })
        }}
        onSubmit={this.onSubmit}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        isFocused={this.props.isFocused}

        editable={true}
      />
    )
  }

  onSubmit = (value) => {
    const { mask }  = this.props;
    if (mask) {
      const valueParts = [];
      let maskIdx = 0, valueIdx = 0;

      // Если маска задана вида 0000000000 (без +7 или 8), а телефон с +7 или 8, то обрезаем телефон
      if (value.length > mask.length) {
        value = value.substring(value.length - mask.length);
      }

      if (mask[0] === '8' && /\+7/.test(value)) {
        value = value.replace('+7', '8');
      }
      if (mask[0] ==='+' && mask[1] === '7' && value[0] === '8') {
        value = '+7' + value.substring(1);
      }
      value = value.replace(/[^\d]/g, '');

      // TODO change for mask core?
      for (; maskIdx < mask.length && valueIdx < value.length; maskIdx++) {
        if (value[valueIdx] === mask[maskIdx]
          || (mask[maskIdx] === '0' && /\d/.test(value[valueIdx]))
        ) {
          valueParts.push(value[valueIdx]);
          valueIdx++;
        } else {
          valueParts.push(mask[maskIdx]);
        }
      }

      this.props.onChange(valueParts.join(''));
    } else {
      this.props.onChange(value)
    }
  };

  getContacts = async () => {
    const get = () => {
      Contacts.getAll().then((contacts) => {
        const mergedContacts = [];
        const uniquePhoneNumbers = new Set();
        contacts.forEach(contact => {
          if (contact.phoneNumbers && contact.phoneNumbers.length) {
            contact.phoneNumbers.forEach(phone => {
              if (!uniquePhoneNumbers.has('7' + phone.number.replace(/[^\d]/g, '').substring(1))) {
                uniquePhoneNumbers.add('7' + phone.number.replace(/[^\d]/g, '').substring(1));
                mergedContacts.push({
                  ...contact,
                  phoneNumber: phone.number
                });
              }
            });
          }
        });
        this.setState({
          contacts: mergedContacts
        })
      });
    }

    try {
      if (Platform.OS === 'android') {
        let checkPermContract = await check(PERMISSIONS.ANDROID.READ_CONTACTS);
        if (checkPermContract === RESULTS.DENIED) {
          checkPermContract = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
        }

        if (checkPermContract === RESULTS.GRANTED) {
          get();
        } else {
          Alert.alert('Нет доступа к контактам', 'Доступ к контактам запрещен! Разрешите доступ к контрактам в системных настройках');
        }
      } else {
        let checkPermContract = await check(PERMISSIONS.IOS.CONTACTS);
        if (checkPermContract === RESULTS.DENIED) {
          checkPermContract = await request(PERMISSIONS.IOS.CONTACTS);
        }
        if (checkPermContract === RESULTS.GRANTED) {
          get();
        } else {
          Alert.alert('Нет доступа к контактам', checkPermContract + 'Доступ к контактам запрещен! Разрешите доступ к контрактам в системных настройках');
        }
      }
    }
    catch (e) {
      console.error(e);
    }
  };

  focus() {
    this.input.focus();
  }

}
