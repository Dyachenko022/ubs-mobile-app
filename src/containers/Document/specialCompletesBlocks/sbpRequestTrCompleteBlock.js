import React from 'react';
import {View, Text, Image} from 'react-native';
import LogoSbp from '../../../../assets/icons/logo-sbp.png';
import styles from '../styles';
import {parseMoney} from '../../../utils/text';
import {getCurrentCurrency} from '../utils';

export default function sbpRequestTrCompleteBlock(props, state) {
  const comissValueField = state.values['Документ.Комиссия'];
  const bankReceiverField = state.values['Банк плательщика.Наименование'];

  const comission = isNaN(comissValueField.value) ? comissValueField.value : parseMoney(
    comissValueField.value,
    getCurrentCurrency(state),
  );

  return (
    <>
      <View style={styles.statusSum}>
        <Text style={styles.statusSumLabel}>Комиссия: </Text>
        <Text style={styles.statusSumValue}>
          {comission}
        </Text>
      </View>
      <View style={{alignItems: 'center', flexDirection: 'column', marginTop: 20}}>
        <View style={{flexDirection: 'row', paddingBottom: 5}}>
          <Text style={{...styles.statusSumLabel, marginRight: 0}}>Из {bankReceiverField.value}</Text>
        </View>
        <Image source={LogoSbp} style={{width: 80, marginTop: 5, marginBottom: 5}} resizeMode="contain"/>
      </View>
    </>
  );
}
