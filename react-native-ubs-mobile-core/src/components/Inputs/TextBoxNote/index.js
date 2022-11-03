import React, {Component} from 'react'
import {View} from 'react-native'
import PickerSelect from 'react-native-picker-select'

import TextInput from '../../TextBoxInput'


const styles = {
  subInput: {
    height: 40,
    paddingLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#e7e7e7',
    borderWidth: 1
  }
};

export default class TextBoxNote extends Component {
  static defaultProps = {
    value: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      isFocus: false
    }
  }

  render() {
    const [text, number] = this.props.value.split('^');

    return (
      <View>
        <TextInput
          ref={e => this.input = e}
          onBlur={this.props.onBlur}
          onFocus={this.props.onFocus}
          onChangeText={(changedText) => {
            this.props.onChangeText(`${changedText}^${number || 0}`)
          }}
          mask={this.props.mask}
          name={this.props.name}
          placeholder={this.props.placeholder}
          isValid={this.props.isValid}
          autoFocus={this.props.autoFocus}
          isFocused={this.props.isFocused}
          maxLength={this.props.maxLength}
          value={text || ''}
        />
        <PickerSelect
          onValueChange={(value, index) => {
            this.props.onChangeText(`${text}^${value}`);
          }}
          style={{
            inputIOS: [styles.subInput],
            inputAndroid: [styles.subInput]
          }}
          value={number || 0}
          placeholder={{}}
          hideDoneBar={true}
          items={this.props.options}
          mode="dropdown"
        />
      </View>
    )
  }

  focus = () => {
    if (this.input && this.input.focus) {
      this.input.focus();
      this.setState({isFocus: true});
    }
  }

  blur = () => {
    if (this.input && this.input.blur) {
      this.input.blur();
      this.setState({isFocus: false});
    }
  }
}
