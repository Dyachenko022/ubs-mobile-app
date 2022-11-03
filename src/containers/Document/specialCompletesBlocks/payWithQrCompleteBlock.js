import React from 'react';
import {Image, Text, View} from 'react-native';
import LogoSbp from '../../../../assets/icons/logo-sbp.png';
import styles from '../styles';
import {parseMoney} from '../../../utils/text';
import {getCurrentCurrency} from '../utils';

export default function payWithQrCompleteBlock(props, state, isError = false) {
  const receiver = state.values['Получатель.Наименование']?.value; //Получатель.Наименование
  const description = state.values['Документ.Назначение платежа']?.value;
  const sumFieldValue = state.values['Документ.Сумма'];

  return (
    <View style={{width: '100%'}}>

      {isError && (
        <View style={{ ...styles.statusSum, alignItems: 'center'}}>
          <Text style={styles.statusSumLabel}>Сумма:</Text>
          <Text style={styles.statusSumValue}>
            {parseMoney(
              sumFieldValue.value,
              getCurrentCurrency(state),
            )}
          </Text>
        </View>
      )}

      <Text style={{marginTop: 16, fontSize: 16, width: '100%', textAlign: 'center'}}>
        {description}
      </Text>

      <Text style={{marginTop: 16, fontSize: 16, width: '100%', textAlign: 'center'}}>
        {receiver}
      </Text>

      <View style={{ alignItems: 'center'}}>
        <Image source={LogoSbp} style={{width: 140, marginTop: 5, marginBottom: 5}} resizeMode="contain"/>
      </View>
    </View>
  )
}
