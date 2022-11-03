import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import CustomStyleSheet from "../../resources/customStyleSheet";
import BankTheme from '../../utils/bankTheme';

export default class CardBoxInput extends React.Component {
  static propTypes = {
    mask: PropTypes.string,
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
      mask: "",
      placeholder: " ",
      withMask: false,
      value: '',
      name: 'some name',
      description: 'some description',
      isValid: true,
      isFocused: true,
      autoFocus: false,
      keyboardType: 'default',
      maxLength: 100,
    };
  }

  constructor(props) {
    super(props);

    this.focus = this.focus.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  onFocus() {
    this.props.onFocus()
  }

  onBlur() {
    this.props.onBlur();
  }

  focus() {
    this.props.onFocus(this.props.renderFuncName, this.props.options);
  }

  blur() {
    this.onBlur();
  }

  onChangeText(event) {
    this.props.onChangeText(event);
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

    return (
      <TouchableOpacity style={[styles.container, containerStyle]}
                        onPress={this.focus}>
        <Text style={[styles.textInputTitle, textStyle]}>
          {this.props.name}
        </Text>
        {this.props.children
          ? this.props.children
          : (
            <View
              style={[styles.input, {color: !this.props.isValid ? '#EF3A51' : '#000000'}]}
              placeholderStyle={styles.input}
              multiline={false}
              maxLength={this.props.maxLength}
              autoFocus={this.props.autoFocus}

              textAlign={'left'}
            >
              <Text numberOfLines={1}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
              >
                {this.props.value}
              </Text>
            </View>
          )
        }
      </TouchableOpacity>
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
    lineHeight: 16,
    height: 18
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
