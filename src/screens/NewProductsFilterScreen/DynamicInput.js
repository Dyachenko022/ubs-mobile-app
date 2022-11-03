import React from "react";
import TextBoxInput from '../../components/TextBoxInput';
import {Platform, View, Text, TextInput} from "react-native";
import RadioInput from "../../components/Inputs/RadioButton";
import ComboBox from '../../components/Inputs/ComboBox';

const inputWidth = 100;

export default class DynamicInput extends React.PureComponent {

  onFocus = () => this.setState({isFocused: true});

  render() {
    const {field, value, onChange} = this.props;
    const inputType = field.inputType;
    let component = null;
    switch (inputType) {
      case 'TextBoxMoney':
        component = this.renderTextBoxMoney(field, value, onChange);
        break;
      case "ComboBoxDropDownList":
        component = this.renderComboBoxDropDownList(field, value, onChange);
        break;
      case 'TextBox':
        component = this.renderTextBox(field, value, onChange);
        break;
      case 'ComboBoxMultiSelect':
        component = this.renderComboBoxMultiSelect(field, value, onChange);
        break;
    }
    if (!component) return null;
    return (
      <View>
        <Text style={{paddingBottom: 5,}}>
          {field.name}
        </Text>
        <View style={{height:40}}>
        {component}
        </View>
      </View>
    )
  }

  renderTextBoxMoney(field, value, onChange) {
    value = value || '';
    return (
        <TextBoxInput
          ref={"input" + field.sid}
          isFocused={false}
          key={field.sid}
          isValid={true}
          onFocus={this.onFocus}
          onBlur={() => this.setState({isFocused: true})}
          name={''}
          withMask={true}
          keyboardType={Platform.OS === 'ios' ? "decimal-pad" : "numeric"}
          placeholder={'9999.99'}
          value={value}
          //   onFocus={() => this.onFocus(field.sid)}
          maxLength={/^\d+\.\d{2}$/.test(value) ? value.length : undefined}
          onChangeText={(text) => {
            text = text.replace(/^[,.]+/g, '0.').replace(/,/g, '.');
            if (!/^\d+\.?\d{0,2}$|^$/.test(text)) return;

            this.props.onChange(field, text);
          }}/>
    );
  }

  renderComboBoxMultiSelect(field, value, onChange) {
    const fieldValue = value ? value.map(item => [item]) : [];
    const options = field.listValues.map(el => ({value: el[0], label: el[1]}));
    return (
      <ComboBox
        options={options}
        mode={'MULTI'}
        value={value}
        onChange={(itemValue, itemIndex) =>
          this.props.onChange(field, itemValue)
        }
      />
    );
  }


  renderTextBox(field, value, onChange) {
    return null;
  }

  renderComboBoxDropDownList(field, fieldValue, onChange) {
    const options = field.listValues.map(el => ({value: el[0], label: el[1]}));
    if (options.length < 4) {
      return (
        <RadioInput
          isValid={true}
          ref={"input" + field.sid}
          options={options}
          style={{borderColor: '#aeaeae', borderWidth: 1,}}
          value={fieldValue}
          onPress={(e) => {
            let {value} =e;
            this.props.onChange(field, value);
          }}
        />
      );
    }
    return (
        <ComboBox
          value={fieldValue}
          options={options}
          onChange={(itemValue, itemIndex) =>
            this.props.onChange(field, itemValue)
          }>
        </ComboBox>
    )
  }
};
