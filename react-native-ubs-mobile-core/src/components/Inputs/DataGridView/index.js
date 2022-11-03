import React from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import _ from 'lodash';
import BankTheme from '../../../bankTheme';

const HEIGHT = 65;

export default class DataGridView extends React.Component {
  static defaultProps = {
    options: [],
    values: [],
    onChange: () => {}
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.options.map(item => (
          <TouchableWithoutFeedback onPress={() => this._onPressItem(item)}>
            <View
              style={[
                styles.item,
                this.isItemSelected(item) && styles.itemSelected
              ]}
            >
              <Text style={{color: this.isItemSelected(item) ? 'white' : 'black'}}>{item.label}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    )
  }

  isItemSelected = (item) => {
    return this.props.values.indexOf(item.value) > -1;
  }

  _onPressItem = (item) => {
    const newValues = [...this.props.values];
    if (this.isItemSelected(item)) {
      _.remove(newValues, (el) => el === item.value);
    } else {
      newValues.push(item.value);
    }

    this.props.onChange(newValues);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderColor: '#fefefe',
    borderWidth: 1
  },
  itemSelected: {
    backgroundColor: BankTheme.color1,
  }
});
