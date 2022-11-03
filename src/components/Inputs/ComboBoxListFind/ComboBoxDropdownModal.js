import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {FlatList, Text, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import Input from '../IconInput';
import Modal from 'react-native-ui-lib/modal';
import BankTheme from '../../../utils/bankTheme';
import LogoSbp from '../../../../assets/icons/logo-sbp.png';

export default function ComboBoxDropdownModal(props) {

  const [searchText, setSearchText] = useState('');

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
  );

  let options = props.options;
  if (searchText) {
    options = options.filter(item => item.label.match(new RegExp(searchText, 'i')));
  }

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
    >
      <SafeAreaView style={{flex: 1}}>
        <Modal.TopBar
          title={props.fieldName}
          titleStyle={{fontSize: 18}}
          onCancel={props.onCancel}
        />
        <Input
          styles={{width: '95%', alignSelf: 'center', height: 35, marginBottom: 10}}
          inputProps={{
            blurOnSubmit: false,
            clearButtonMode: 'while-editing',
            onChangeText: (searchText) => setSearchText(searchText),
            value: searchText,
            returnKeyType: 'go',
            returnKeyLabel: 'Выбрать',
          }}
        />
        <FlatList
          style={{flex: 1}}
          data={options}
          keyboardShouldPersistTaps="handled"
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />

        {props.isSbp && (
          <Image source={LogoSbp} style={{height: 40, alignSelf: 'center', marginTop: 10,}} resizeMode="contain" />
        )}
      </SafeAreaView>
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

