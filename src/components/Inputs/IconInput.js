import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TextInput
} from 'react-native';
import BankTheme from '../../utils/bankTheme';


let styles = StyleSheet.create({
  container: {
    flex: -1,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: "#fff",
    width: "100%",
    height: 56,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 10
  },
  input: {
    flex: 1,
    color: '#000'
  }
});

export default class IconInput extends React.Component {
  static propTypes = {
    iconLeft: PropTypes.func,
    iconRight: PropTypes.func,

    placeholder: PropTypes.string,

    customInput: PropTypes.func,
    isValid: PropTypes.bool
  };
  static defaultProps = {
    styles: {},
    inputProps: {},
    placeholder: '',
    coloredOnFocus: true,
    isValid: true
  };

  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      textInputFocused: false
    }
  }

  componentDidMount() {
    if (this.input && this.props.focusEditableTextInput && !this.state.textInputFocused) {
      this.input.focus()
      this.setState({ textInputFocused: true })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused && !this.props.isFocused) {
      this.input.blur();
    }
  }

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    let inputProps = {
      selectionColor: "#3070d9",
      autoCorrect: false,
      underlineColorAndroid: 'rgba(0,0,0,0)',
      placeholder: this.props.placeholder,
      isFocused: this.props.isFocused,
      onFocus:
        () => {
          this.setState({
            isFocused: true
          }, () => {
            this.props.onFocus && this.props.onFocus();
          })
        },
      onBlur:
        () => {
          this.setState({
            isFocused: false
          }, () => {
            this.props.onBlur && this.props.onBlur();
          })
        },

      style: [styles.input, {
        height: 36,
        marginLeft: this.props.iconLeft ? 10 : 0,
        marginRight: this.props.iconRight ? 10 : 0
      }]
    };

    let { iconLeft, customInput, iconRight } = this.props;
    let borderColor = '#e7e7e7';
    if (!this.props.isValid) {
      borderColor = 'red';
    } else if (this.state.isFocused) {
      borderColor = BankTheme.color1;
    }

    return (
      <View
        style={
          [
            styles.container,
            this.props.styles,
            { borderColor }
          ]
        }
      >
        {
          iconLeft &&
          iconLeft({
            color: this.state.isFocused && this.props.coloredOnFocus ? BankTheme.color1: "#bbb"
          })
        }

        {
          customInput ?
            customInput({
              ...inputProps
            })
            :
            <TextInput
              ref={(e) => this.input = e}
              {...inputProps}
              {...this.props.inputProps}
            />
        }

        {
          iconRight &&
          iconRight({
            color: this.state.isFocused && this.props.coloredOnFocus ? BankTheme.color1 : "#bbb"
          })
        }
      </View>
    )
  }
}
