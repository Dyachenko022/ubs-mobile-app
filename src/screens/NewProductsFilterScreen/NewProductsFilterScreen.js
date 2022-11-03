import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import {View, Text, Card, Button,} from 'react-native-ui-lib';
import DynamicField from './DynamicInput';
import checkCondition from './CheckFilterCondition';
import styles from './styles';

export default class NewProductsFilterScreen extends React.Component {

  static options = {
    bottomTabs: {
      visible: false,
    }
  }

  state = {
    filter: {},
  };

  componentDidMount() {
    this.setState({filter: this.props.filter});
  }

  clearFilter = () => {
    this.setState({filter: {}});
    this.props.clearFilter();
  };

  onChangeFilterValue = (field, value) => {
    const {filter} = this.state;
    filter[field.sid] = {value, comparisionType: field.comparisionType};
    this.props.category.filterParam.forEach(field => {
      if(!checkCondition(field, filter)) delete filter[field.sid]
    });
    this.setState({filter});
  };

  acceptFilter = () => {
    this.props.applyFilter(this.state.filter);
  };

  render() {
    return(
      <ScrollView style={styles.scrollView}
        contentContainerStyle={styles.backgroundScrollView}
      >
        <View style={styles.fieldBlock}>
          {
            this.props.category.filterParam
              .filter(item => checkCondition(item, this.state.filter))
              .map(item => {
            const value = this.state.filter[item.sid] ? this.state.filter[item.sid].value : null;
            return (
              <View style={styles.fieldRow} key={item.sid}>
                <DynamicField
                  value={value}
                  onChange={this.onChangeFilterValue}
                  field={item}
                />
              </View>
          )
          })}

          <Button
            color={'#9fa2a4'}
            style={styles.buttonClear}
            label="Очистить"
            onPress={this.clearFilter}
          />

          <Button
            style={styles.buttonAccept}
            label="Подоборать"
            onPress={this.acceptFilter}
          />

          </View>
      </ScrollView>
    )
  }
}

NewProductsFilterScreen.propTypes = {
  applyFilter: PropTypes.func,
  clearFilter: PropTypes.func,
  filter: PropTypes.object,
  category: PropTypes.shape({
      sid: PropTypes.string,
      name: PropTypes.string,
      filterParam: PropTypes.arrayOf(PropTypes.shape({
          sid: PropTypes.string,
          name: PropTypes.string,
          inputType: PropTypes.string,
          condition: PropTypes.string,
          listValues: PropTypes.array,
        }
      ))
    }
  )
};
