import React from 'react';
import PropTypes from 'prop-types';
import {Picker} from 'react-native-ui-lib';
import {
  Text,
  View,
  TextInput, Platform,
} from 'react-native';
import TouchableOpacity from '../../Touchable';
import moment from 'moment';
import CustomStyleSheet from '../../../resources/customStyleSheet';
import {TextInputMask} from 'react-native-masked-text'
import BankTheme from '../../../utils/bankTheme';

export default class TaxablePeriod extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    onFocus: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    value: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    isValid: PropTypes.bool,
    isFocused: PropTypes.bool,
    autoFocus: PropTypes.bool,
    accountsFts: PropTypes.array,
    account: PropTypes.string,
    bic: PropTypes.string,
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
      options: [],
      value: '',
      name: 'some name',
      description: 'some description',
      isValid: true,
      isFocused: true,
      autoFocus: false,
      keyboardType: 'default',
      accountsFts: [],
      account: '',
      bic: '',
      maxLength: 100,
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.accountsFts.length > 0 && props.account && props.bic) {
      if (props.accountsFts.find((item) => item[0] === props.bic && item[1] === props.account)) {
        return {
          isFts: true,
        }
      }
    }
    return {
      isFts: false,
    }

  }

  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      text: '',
      pickerValue: '0',
      isFts: false,
    }
  }

  componentDidMount() {
    this.parseValueFromProps(this.props.value);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevState.isFts !== this.state.isFts && this.props.onChange) {
      this.props.onChange('0');
    }
  }

  getDefaultDate = () => {
    if (this.state.pickerValue === '00') return moment().format('DD.MM.YYYY');
    else return moment().format('MM.YYYY');
  }

  parseValueFromProps(newValue) {
    if (!newValue) {
      this.setState({text: this.getDefaultDate(), pickerValue: '0'});
    }
    else if (newValue.indexOf('.') === -1) {
      this.setState({text: this.getDefaultDate(), pickerValue: '0'});
    }
    else {
      const pickerValue = newValue.substring(0, newValue.indexOf('.'));
      const pickerItem = this.props.options.find(item => item.value === pickerValue);
      if (pickerItem)
        this.setState({text :newValue.substring(newValue.indexOf('.')), pickerValue});
      else
        this.setState({text :newValue, pickerValue: '00'});
    }
  }

  onFocus() {
    this.props.onFocus && this.props.onFocus();
  }

  getValue() {
    if (this.state.isFts) return this.state.text;
    if (this.state.pickerValue === '0') return '0';
    else if (this.state.pickerValue === '00') return this.state.text;
    else return this.state.pickerValue + '.'+this.state.text;
  }

  onBlur() {
    this.props.onChange && this.props.onChange(this.getValue());
    this.props.onBlur();
  }

  focus() {
    this.props.onFocus(this.props.renderFuncName, this.props.options);
  }

  blur() {
    this.onBlur();
  }

  onChangePickerValue = (value) => {
    const {text} = this.state;
    this.setState({
      pickerValue: value.value,
      text: '',
    }, () => this.props.onChange && this.props.onChange(this.getValue())
    );
  }

  onChangeText = (text) => {
    this.setState({text}, () => this.props.onChange && this.props.onChange(this.getValue()));
  }

  renderCustomPicker = (selectedItem) => {
    const item = this.props.options.find(item => item.value === selectedItem);
    const label = item ? item.label : '';

    return (
      <View style={{width: 95,
        height: 30,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEE',
        borderRadius: 15,
        paddingLeft:10,
        paddingRight: 10,
      }}>
        <Text style={{width: 60, marginRight: 5,}}>
          {label}
        </Text>
        {/* Треугольник при помощи стилей */}
        <View style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderTopWidth: 10,
          borderRightWidth: 7,
          borderBottomWidth: 0,
          borderLeftWidth: 7,
          borderTopColor: 'gray',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
        }}/>
      </View>
    );
  }

  render() {
    let textStyle, containerStyle;
    if (this.props.isFocused) {
      textStyle = styles.selected;
      containerStyle = styles.selectedContainer;
    } else {
      textStyle = styles.blured;
    }
    if (!this.props.isValid) {
      textStyle = styles.error;
      containerStyle = styles.errorContainer;
    }

    const mask = this.state.pickerValue === '00' ? '99.99.9999' : '99.9999';
    const placeholder = this.state.pickerValue === '00' ? '01.01.2000' : '01.2000';

    if (this.state.isFts) {
      return (
        <View style={[styles.container, containerStyle]}>
          <Text style={[styles.textInputTitle, textStyle]}>
             {this.props.name}
          </Text>
          <TextInput
            ref={ref => this.taxDate = ref}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            type={'custom'}
            placeholder={placeholder}
            maxLength={8}
            value={this.state.text}
            onFocus={this.onFocus}
            onChangeText={this.onChangeText}
          />
        </View>
      );
    }

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={[styles.textInputTitle, textStyle]}>
          {this.props.name}
        </Text>
          <View
            style={[styles.input, {color: !this.props.isValid ? '#EF3A51' : '#000000', flexDirection: 'row',}]}
            placeholderStyle={styles.input}
            multiline={false}
            maxLength={this.props.maxLength}
            autoFocus={this.props.autoFocus}
            textAlign={'left'}
          >
            <Picker
              style={{ height: 25}}
              hideUnderline
              onPress={this.onFocus}
              value={this.state.pickerValue}
              onChange={this.onChangePickerValue}
              renderPicker={this.renderCustomPicker}
            >
              {this.props.options.map(item => <Picker.Item key={item.value} value={item.value} label={item.label} />)}
            </Picker>
            {this.state.pickerValue !== '0' &&
              <TextInputMask
                ref={ref => this.taxDate = ref}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                type={'custom'}
                placeholder={placeholder}
                options={{
                  mask,
                }}
                maxLength={mask.length}
                value={this.state.text}
                onFocus={this.onFocus}
                onChangeText={this.onChangeText}
                style={{padding: 0,
                  fontSize: 15,
                  minHeight: 16,
                  marginLeft: 5,
                  minWidth: 150,
                  }}
              />
            }
          </View>
      </View>
    )
  }
}

const styles = CustomStyleSheet({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    minHeight: 56,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 3
  },
  selectedContainer: {
    borderColor: BankTheme.color1,
  },
  errorContainer: {
    borderColor: '#cc4444'
  },

  textInputTitle: {
    fontSize: 14,
    lineHeight: 14,
  },
  input: {
    padding: 0,
    lineHeight: 15,
  },
  selected: {
    color: BankTheme.color1,
  },
  blured: {
    color: 'rgba(0, 0, 0, 0.5)'
  },
  error: {
    color: '#EF3A51'
  },
  errorLine: {
    backgroundColor: '#EF3A51'
  },
  selectedLine: {
    backgroundColor: '#2196F3'
  },
  bluredLine: {
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
})
