import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-ui-lib/modal';
import BankTheme from '../../utils/bankTheme';

export default function ComboBoxDropdownModal(props) {

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={{ padding: 10, flexDirection: 'row', justifyContent: 'center',}}
      onPress={() => props.onSelect(item.value)}
    >
      <Text style={{width: 15, color: BankTheme.color1, left: -5}}>
        {index === props.selectedIndex && '✓'}
      </Text>
      <Text style={{fontSize: 16, left: -5, color: props.selectedIndex === index ? BankTheme.color1 : 'unset' }}>
        {item.label}
      </Text>
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
    >
      <View style={{flex: 1}}>
        <Modal.TopBar
          title={props.fieldName}
          titleStyle={{fontSize: 18}}
          onCancel={props.onCancel}
        />
        <FlatList
          style={{flex: 1}}
          data={props.options}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
    </Modal>
  )
}

ComboBoxDropdownModal.propTypes = {
  selectedIndex: PropTypes.number,
  fieldName: PropTypes.string,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
  visible: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

ComboBoxDropdownModal.defaultProps = {
  selectedIndex: -1,
}

