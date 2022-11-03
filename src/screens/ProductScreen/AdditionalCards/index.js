import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {Switch} from 'react-native-ui-lib';
import PropTypes from 'prop-types';
import styles from './styles';
import BankTheme from '../../../utils/bankTheme';

export default function AdditionalCards(props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={{width: '70%', ...styles.textHeader}}>Карта</Text>
        <Text style={{width: '30%', ...styles.textHeader}}>Доступ</Text>
      </View>
      {props.additionalCards.map((card) => (
        <View key={card.id} style={styles.row}>
          <View style={styles.nameAndDate}>
            <Text style={styles.text}>{`${card.number} до ${card.expireDate}`}</Text>
            <Text style={styles.text}>{card.cardholderName}</Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center', width: '30%'}}>
            <Switch
              onColor={BankTheme.color1}
              offColor={'gray'}
              value={card.access}
              onValueChange={(checked) => props.changeAdditionalCardAccess(card.id, checked ? 1 : 0)}
              />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

AdditionalCards.propTypes = {
  changeAdditionalCardAccess: PropTypes.func,
  additionalCards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    number: PropTypes.string,
    expireDate: PropTypes.string,
    cardholderName: PropTypes.string,
    access: PropTypes.number
  })),
}

AdditionalCards.defaultProps = {
 additionalCards: [],
}
