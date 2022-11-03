import React from 'react';
import PropTypes from 'prop-types';
import {Text, View, TextInput, TouchableWithoutFeedback} from 'react-native';
import CustomStyleSheet from '../../../resources/customStyleSheet';
import BankTheme from '../../../utils/bankTheme';

export default class TextBoxMoney extends React.Component {
  static propTypes = {
    placeholder: PropTypes.symbol,
    onChangeText: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    isValid: PropTypes.bool,
    isFocused: PropTypes.bool,
    autoFocus: PropTypes.bool,
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
      name: '',
      description: '',
      isValid: true,
      isFocused: false,
      autoFocus: false,
      maxLength: 100,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      maxLength: 30,
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.selectionStart = 1;
  }

  onFocus() {
    this.props.onFocus();
  }

  onBlur() {
    this.props.onBlur();
  }

  get element() {
    return this.textinput;
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

  onChangeText(text) {
    text = text.replace(/^[,.]+/g, '0.').replace(/,/g, '.');
    if (!/^\d+\.?\d{0,2}$|^$/.test(text)) return;
    this.props.onChangeText(text);
  }

  onSelectionChange = (e) => {
    this.selectionStart = e.nativeEvent.selection.start;
    this.setState({maxLength: this.maxLength})
  }

  get maxLength() {
    //  maxLength здесь исполльзуется как ограничение на ввод более 2 символов после точки. НО из-за этого нельзя редактировать
    //  при изменении позиции курсора. Для этого добавлена проверка на позицию курсора относительно точки

    if (/^\d+\.\d{2}$/.test(this.props.value)) {
      const pointPosition = this.props.value.indexOf('.');
      if (this.selectionStart > pointPosition) return this.props.value.length;
    }
    return 30;
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

    return (
      <TouchableWithoutFeedback onPress={() => {
        this.element.focus();
      }}>
        <View style={[styles.container, containerStyle]}>
          {this.props.name ? (
            <Text style={[styles.textInputTitle, textStyle]}>
              {this.props.name}
            </Text>
          ) : null }
          <TextInput
            ref={ref => this.textinput = ref}
            refInput={ref => this.maskedInput = ref}
            style={[styles.input, {color: !this.props.isValid ? '#EF3A51' : '#000000'}]}
            placeholderStyle={styles.input}
            autoFocus={this.props.autoFocus}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            maxLength={this.state.maxLength}
            textAlign={this.props.textAlign || 'left'}
            autoCorrect={false}
            underlineColorAndroid={'transparent'}
            placeholderTextColor={'#ACACAC'}
            placeholder={this.props.placeholder}
            keyboardType={'numeric'}
            value={this.props.value}
            onSelectionChange={this.onSelectionChange}
            onChangeText={this.onChangeText}
          />
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
