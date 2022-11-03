import React from 'react';
import {View, Text, Image} from 'react-native';
import LogoSbp from '../../../../assets/icons/logo-sbp.png';

export default function sbpSettingsCompleteBlock(props, state) {
  const allowTransfers = state.values['Разрешить переводы по номеру'].value;
  const account = state.values['Получатель.Счет'].value;
  const defaultBankSet = state.values['Банк по умолчанию'].value;

  const registrationOfAccept = state.values['Регистрация согласия']?.value || false;

  return (
      <View style={{paddingTop: 15}}>

        {allowTransfers ?
          <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{textAlign: 'center', }}>
              Дано разрешение на получение и отправку переводов по номеру телефона
            </Text>
            <Text style={{paddingTop: 15, textAlign: 'center'}}>
               Счет зачисления: {account}
            </Text>

            {defaultBankSet &&
              <Text style={{paddingTop: 15, textAlign: 'center'}}>
                Установлен банк по умолчанию
              </Text>
            }

            {registrationOfAccept &&
              <Text style={{paddingTop: 15, textAlign: 'center'}}>
                Зарегистрирован акцепт на списание средств для будущих переводов со счета: {account}
              </Text>
            }
          </View>
          :
          <Text style={{textAlign: 'center', }}>
            Отозвано разрешение на получение и отправку переводов по номеру телефона
          </Text>
        }

        <View style={{ alignItems: 'center'}}>
          <Image source={LogoSbp} style={{width: 140, marginTop: 5, marginBottom: 5}} resizeMode="contain"/>
        </View>
      </View>
  );
}
