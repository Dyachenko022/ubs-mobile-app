import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, TextInput, TouchableWithoutFeedback} from 'react-native';
import CustomStyleSheet from '../../resources/customStyleSheet';
import TextInputMask from './TextInputMask';
import BankTheme from '../../utils/bankTheme';

const isValidPositiveNumber = (num) => Boolean(num) && num < 1000;

export const MASK_SYMBOLS = ['0', '9', 'Z', 'A'];

const translation = {
  '0': function (val) {
    if (/[0-9]/.test(val)) {
      return val;
    }
    return null;
  },
  '9': function (val) {
    if (/[0-9]/.test(val)) {
      return val;
    }
    return null;
  },
  'Z': function (val) {
    if (/[A-Za-z]/.test(val)) {
      return val;
    }
    return null;
  },
  'A': function (val) {
    if (/[0-9A-Za-zА-Яа-я]/.test(val)) {
      return val;
    }
    return null;
  },
};

export default class TextBoxInput extends React.Component {
  static propTypes = {
    mask: PropTypes.string,
    placeholder: PropTypes.symbol,
    withMask: PropTypes.bool,
    onChangeText: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    isValid: PropTypes.bool,
    isFocused: PropTypes.bool,
    autoFocus: PropTypes.bool,
    keyboardType: PropTypes.oneOf(['default', 'numeric', 'phone-pad']),
  };

  static get defaultProps() {
    return {
      onChangeText: () => {
      },
      onSelectionChange: () => {
      },
      onFocus: () => {
      },
      onBlur: () => {
      },
      mask: '',
      placeholder: ' ',
      withMask: false,
      value: '',
      name: 'some name',
      description: 'some description',
      isValid: true,
      isFocused: false,
      autoFocus: false,
      keyboardType: 'default',
      maxLength: 100,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    this.props.onFocus();
  }

  onBlur() {
    this.props.onBlur();
  }

  get element() {
    if (this.isMasked) {
      return this.maskedInput;
    }
    else {
      return this.textinput;
    }
  }

  get isMasked() {
    return Boolean(this.props.mask);
  }

  focus() {
    this.element.focus();
  }

  blur() {
    this.element.blur();
  }

  static getRawValue(mask, value) {
    let rawValue = '';
    let j = 0;
    for (let i = 0; i < mask.length && j < value.length; i++) {
      if (MASK_SYMBOLS.indexOf(mask[i]) !== -1) {
        rawValue = rawValue + value[j];
        ++j;
      } else {
        if (mask[i] === value[j]) {
          ++j;
        }
      }
    }
    return rawValue;
  }

  onChangeText(text) {
    this.props.onChangeText(text);
  }

  render() {
    let textStyle, containerStyle;

    if (this.props.isFocused) {
      textStyle = styles.selected;
      containerStyle = styles.selectedContainer;
    }
    else {
      textStyle = styles.blured;
    }
    if (!this.props.isValid) {
      textStyle = styles.error;
      containerStyle = styles.errorContainer;
    }

    let input = this.props.mask ? (
      <TextInputMask
        ref={ref => this.textinput = ref}
        refInput={ref => this.maskedInput = ref}
        type={'custom'}
        onChangeText={this.onChangeText}
        multiline={false}
        style={[styles.input, {color: !this.props.isValid ? '#EF3A51' : '#000000'}]}
        numberOfLines={1}
        autoFocus={this.props.autoFocus}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        textAlign={'left'}
        autoCorrect={false}
        maxLength={this.props.mask.length}
        underlineColorAndroid={'transparent'}
        placeholderTextColor={'#ACACAC'}
        placeholder={this.props.mask || this.props.placeholder}
        keyboardType={this.props.keyboardType}
        value={this.props.value}
        options={{
          mask: this.props.mask,
          translation: translation,
          getRawValue: (value) => {
            if (this.props.withMask) {
              return value;
            }

            let v = '';
            for (let i = 0; i < value.length; ++i) {
              if (value[i] !== this.props.mask[i] || /[0-9A-Z]/.test(value[i])) {
                v += value[i];
              }
            }
            return v;
          },
        }}
      />
    ) : (
                  <TextInput
                    ref={ref => this.textinput = ref}
                    refInput={ref => this.maskedInput = ref}
                    style={[styles.input, {color: !this.props.isValid ? '#EF3A51' : '#000000'}]}
                    placeholderStyle={styles.input}
                    multiline={this.props.maxLength > 39}
                    autoFocus={this.props.autoFocus}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    maxLength={isValidPositiveNumber(this.props.maxLength) ? this.props.maxLength : undefined}
                    textAlign={'left'}
                    autoCorrect={false}
                    underlineColorAndroid={'transparent'}
                    placeholderTextColor={'#ACACAC'}
                    placeholder={this.props.placeholder}
                    keyboardType={this.props.keyboardType}
                    value={this.props.value}
                    onChangeText={this.onChangeText}
                  />
                );

    return (
      <TouchableWithoutFeedback onPress={() => {
        this.element.focus();
      }}>
        <View style={[styles.container, containerStyle]}>
          {this.props.name ? (
            <Text style={[styles.textInputTitle, textStyle]}>
              {this.props.name}
              {/*Введите номер Абонентского договора или номер ID*/}
            </Text>
          ) : null }
          {input}
          {/*<View style={[styles.inputBottomBorder, lineStyle]}/>*/}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = CustomStyleSheet({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
    // height: 56,
    padding: 6,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    borderRadius: 8,
  },
  selectedContainer: {
    borderColor: BankTheme.color1,
  },
  errorContainer: {
    borderColor: '#aa3333',
  },
  textInputTitle: {
    fontSize: 14,
    lineHeight: 14,
  },
  input: {
    padding: 0,
    fontSize: 15,
    minHeight: 16,
    flex: 1,
  },
  selected: {
    color: BankTheme.color1,
  },
  blured: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  error: {
    color: '#EF3A51'
  },
});
