import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {parseMoney} from '../../../utils/text';
import {getCurrentCurrency, } from '../utils';
import TouchableOpacity from '../../../components/Touchable';
import styles from '../styles';

export default function sbpSettingsCompleteBlock(props, state, onClickCancel) {

  const documentSids = {
    sum: 'Документ.Сумма',
    source: 'Документ.Источник списания',
  };

  const sumFieldValue = state.values[documentSids.sum];
  const nameTemplate = state.values['Шаблон.Название'];

  return (
    <View style={{
      flex: 1,
      backgroundColor: 'white',
    }}>
      <ScrollView style={{ flex: 1 }}>

        <View style={{width: '100%'}}>
          <Text style={{textAlign: 'center', fontSize: 24, color: '#999', paddingTop: 15,}}>Шаблон сохранен</Text>
        </View>

        <View style={styles.statusContainer}>
          <Image
            source={require('../assets/obrabotan.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />

          <View style={styles.statusSum}>
            <Text style={styles.statusSumLabel}>{nameTemplate.value}</Text>
          </View>

          {sumFieldValue && (
            <View style={styles.statusSum}>
              <Text style={styles.statusSumLabel}>Сумма: </Text>
              <Text style={styles.statusSumValue}>
                {parseMoney(
                  sumFieldValue.value,
                  getCurrentCurrency(state),
                )}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={onClickCancel}>
        <View style={[styles.next, { backgroundColor: '#fefefe' }]}>
          <Text>Завершить</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
