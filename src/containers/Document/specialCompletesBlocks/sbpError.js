import React from 'react';
import PropTypes from 'prop-types';
import {Image, SafeAreaView, Text, View, StyleSheet, ScrollView} from 'react-native';
import {parseMoney} from '../../../utils/text';
import LogoSbp from '../../../../assets/icons/logo-sbp.png';
import TouchableOpacity from '../../../components/Touchable';

export default function SbpError(props) {
  const { hideSumAndBank, phoneNumber, bankReceiverName, receiver, bankSenderName, sum, sumCommiss } = props;

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ScrollView>
        <View style={{    alignItems: 'center',
          padding: 10,
          backgroundColor: 'white',}}>
          <Image
            source={require('../../../../assets/icons/error.png')}
            style={{
              width: 70,
              height: 70,
              marginTop: 15,
            }}
          />
          <Text style={{
            fontSize: 28,
            marginBottom: 20,
            marginTop: 30,
          }}>Операция неуспешна!</Text>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 2, }}>
          {!hideSumAndBank && (
            <>
              {!!phoneNumber && (
                <View style={styles.viewKeyValue}>
                  <Text style={styles.textLabel}>Номер телефона получателя</Text>
                  <Text style={styles.textSum}>
                    {phoneNumber}
                  </Text>
                </View>
              )}

              {!!receiver && (
                <View style={styles.viewKeyValue}>
                  <Text style={styles.textLabel}>Получатель</Text>
                  <Text style={styles.textSum}>
                    {receiver}
                  </Text>
                </View>
              )}

              {!!bankReceiverName && (
              <View style={styles.viewKeyValue}>
                <Text style={styles.textLabel}>Банк получателя</Text>
                <Text style={styles.textSum}>
                  {bankReceiverName}
                </Text>
              </View>
              )}

              {!!bankSenderName && (
                <View style={styles.viewKeyValue}>
                  <Text style={styles.textLabel}>Банк отправителя</Text>
                  <Text style={styles.textSum}>
                    {bankSenderName}
                  </Text>
                </View>
              )}

              <View style={styles.viewKeyValue}>
                <Text style={styles.textLabel}>Сумма операции</Text>
                <Text style={styles.textSum}>
                  {parseMoney(sum, 'RUB')}
                </Text>
              </View>

              {sumCommiss ? (
              <View style={styles.viewKeyValue}>
                <Text style={styles.textLabel}>Комиссия</Text>
                <Text style={styles.textSum}>
                  {parseMoney(sumCommiss, 'RUB')}
                </Text>
              </View>
                ) : (
                  <Text style={{...styles.textSum, marginTop: 15}}>Комиссия не взимается</Text>
                )}
            </>
          )}

        </View>

        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={LogoSbp} style={{width: 80, marginTop: 5, marginBottom: 5}} resizeMode="contain" />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={props.onClickFinish}>
        <View style={[styles.next, { backgroundColor: '#fefefe', paddingBottom: 10,}]}>
          <Text>Завершить</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

SbpError.propTypes = {
  hideSumAndBank: PropTypes.bool,
  phoneNumber: PropTypes.string,
  bankReceiverName: PropTypes.string,
  receiver: PropTypes.string,
  bankSenderName: PropTypes.string,
  sum: PropTypes.number,
  sumCommiss: PropTypes.number,
}

SbpError.defaultProps = {
  hideSumAndBank: false,
  phoneNumber: '',
  bankReceiverName: '',
  receiver: '',
  bankSenderName: '',
}

const styles = StyleSheet.create({
  viewKeyValue: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  textLabel: {
    fontSize: 16,
    color: '#9e9e9e',
  },
  textSum: {
    fontSize: 20,
  }
});
