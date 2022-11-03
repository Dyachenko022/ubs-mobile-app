import React, {PureComponent} from 'react';
import {
  View,
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';

import {TextRenderer as Text} from "../../components/TextRenderer";
import BankTheme from '../../bankTheme';

class RadioButton extends PureComponent {
  render() {
    return (
      <View>
        {this.props.name && (
          <Text>{this.props.name}</Text>
        )}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',

          borderWidth: 2,
          borderColor: this.props.isValid ? BankTheme.color1 : 'red',
          backgroundColor: 'white',
          borderRadius: 5,

          height: 35
        }}>
          {
            this.props.options.map((el, idx) => (
              <View key={el.value} style={{
                flex: 1,
                borderRightWidth: 1,
                borderColor: idx === this.props.options.length - 1 && this.props.value !== el.value ? '#fff' : BankTheme.color1
              }}>
                <TouchableOpacity
                  onPress={() => this.props.onPress(el)}
                  style={
                    [
                      {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                      },

                      this.props.value === el.value ? {backgroundColor: BankTheme.color1} : {}
                    ]}>
                  <Text
                    style={{
                      color: this.props.isValid ? this.props.value === el.value ? "#fff" : '#000' : 'red'
                    }}
                  >
                    {el.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          }
        </View>
      </View>
    )
  }

  focus() {
    this.props.onFocus && this.props.onFocus();
  }
}
export default RadioButton;
