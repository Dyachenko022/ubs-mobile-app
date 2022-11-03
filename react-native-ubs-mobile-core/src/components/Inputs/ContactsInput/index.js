import React from 'react'
import Contacts from 'react-native-contacts'
import {
  Text, View,
  PermissionsAndroid, Platform
} from 'react-native'
import TouchableOpacity from '../../Touchable';
import TextBoxFind from '../TextBoxFind'


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
      formattedPhones: [],
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
        data={this.state.contacts}
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
          const givenName = el.givenName || '';
          const familyName = el.familyName || '';

          if(this.state.formattedPhones.indexOf(el.phoneNumber.replace(/[^\d]/g, '').replace(/^\8/, "7")) >  0) {
            return false;
          } else {
            this.setState({ formattedPhones: [...this.state.formattedPhones, el.phoneNumber.replace(/[^\d]/g, '').replace(/^\8/, "7")] });
          }

          try {
            return givenName.slice(0, cond.length) === cond || familyName.slice(0, cond.length) === cond
              || (
                el.phoneNumbers.length
                && cond.replace(/[^\d]/g, '').length
                && (new RegExp(cond.replace(/[^\d]/g, '').replace(/^\8/, "7"))).test(el.phoneNumber.replace(/[^\d]/g, '').replace(/^\8/, "7")));
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
    const { mask } = this.props;

    if (mask) {
      const valueParts = [];
      let maskIdx = 0, valueIdx = 0;

      if (mask[0] === '8' && /\+7/.test(value)) {
        value = value.replace('+7', '8');
      }
      value = value.replace(/[^\d]/g, '');
      if (value.length > 10) {
        value = value.slice(-10);
      }

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
      Contacts.getAll((err, contacts) => {
        if (err) throw err;
        const mergedContacts = [];

        contacts.forEach(contact => {
          if (contact.phoneNumbers && contact.phoneNumbers.length) {
            contact.phoneNumbers.forEach(phone => {
              mergedContacts.push({
                ...contact,
                phoneNumber: phone.number
              })
            });
          }
        });
        this.setState({
          contacts: mergedContacts
        })
      })
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            'title': 'Доступ к контактам',
            'message': 'Для доступа контактам требуется разрешение'
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          get();
        } else {
          return;
        }
      } catch (err) {
        return;
      }
    } else {
      Contacts.checkPermission((err, permission) => {
        if (err) throw err;

        // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
        if (permission === Contacts.PERMISSION_UNDEFINED || permission === Contacts.PERMISSION_DENIED) {
          Contacts.requestPermission((err, permission) => {
            if (permission === Contacts.PERMISSION_AUTHORIZED) {
              get();
            }
          })
        }
        if (permission === 'authorized') {
          get();
        }
      })
    }
  };

  focus() {
    this.input.focus();
  }

}
