import React from 'react';
import {TextInput} from 'react-native';

export default class TextInputMask extends React.Component {
  onChangeText(text) {
    const {translation, mask} = this.props.options;
    const getRawValue = (value) => {
      let v = '';
      for (let i = 0; i < value.length; ++i) {
        const checkFunc = translation[mask[v.length]];
        if (checkFunc) {
          const val =checkFunc(value[i]);
          if (val) {
            v += val;
          }
        } else {
          v += mask[v.length];
          --i;
        }
      }
      return v;
    };
    const raw = getRawValue(text);
    if (this.props.onChangeText) {
      this.props.onChangeText(raw);
    }
  }

  render() {
    return (
      <TextInput
        {...this.props}
        ref={this.props.refInput}
        onChangeText={text => this.onChangeText(text)}
      />
    );
  }
}
