import React from 'react';
import PropTypes from 'prop-types';
import DropdownIcon from "../../../../assets/icons/buttons/arrow_down.png";
import {Text, View, Picker, Image} from "react-native-ui-lib";
import styles from './styles';


export default class ComboBox extends React.Component {

  renderPicker = (v) => {
      let label = '';
      if (this.props.mode === 'MULTI' && v) {
        label = v.map(item => item.label).join(',');
      }
      else label = v ? v.label : '';
      return (
        <View style={styles.comboBox}>
          <Text style={{marginLeft: 15,}}>
            {label}
          </Text>
          <Image style={{marginRight: 1, height: 28, resizeMode: 'contain'}} source={DropdownIcon}/>
        </View>
      );
  };

  render() {
    const {options, value, mode} = this.props;
    return (
      <Picker
        mode={mode}
        renderPicker={this.renderPicker}
        rightIconSource={DropdownIcon}
        topBarProps={{doneLabel: 'Выбрать', doneButtonProps:{style:{width: 80, }}}}
        value={value}
        onChange={(itemValue, itemIndex) =>  this.props.onChange(itemValue, itemIndex)}
      >

        {options.map(item => <Picker.Item label={item.label} value={item.value} key={item}/>)}

      </Picker>
    );
  }
}

ComboBox.propTypes = {
  mode: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,  //Пустой значние
    PropTypes.array,   //[{label;value}] - если выбирается несколько значений
    PropTypes.object,  //{label;value} - если выбирается одно значение
  ]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
};

ComboBox.defaultProps = {
  mode: 'SINGLE',
};

