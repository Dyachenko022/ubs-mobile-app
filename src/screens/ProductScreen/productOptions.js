import {Navigation} from 'react-native-navigation';
import {Platform, View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {pushScreen, showModal} from '../../utils/navigationUtils';
import operation from 'react-native-extended-stylesheet/src/replacers/operation';

const openModal = ({ passProps, parentComponentId, screen, title }) => {
  pushScreen({
    componentId: parentComponentId,
    screenName: screen || 'unisab/Document',
    title,
    passProps,
  });
};

const openAccountDetails = ( idObject, code, parentComponentId, ) => {
  openModal({
    parentComponentId,
    screen: 'unisab/ProductAccountDetailsScreen',
    title: 'Реквизиты счета',
    passProps: {
      idObject,
      code
    },
  });
};

export const getProductOptions = ({operations, productType, activeProduct, sendCardRequisites, parentComponentId}) => {
  const operationsButtons = [{ label: 'Переименовать', sid: 'changeDescr' }];
  operationsButtons.push({
    label: 'Реквизиты счета',
    sid: 'accountDetails',
    action: () => {
      openAccountDetails(activeProduct.id, productType, parentComponentId);
    }
  });
  if (productType === 'PLCARD' && activeProduct.isVirtualCard) {
    operationsButtons.push({
      label: 'Отправить реквизиты карты',
      sid: 'sendCardReq',
      action: sendCardRequisites,
      }
    );
  }
  operations.forEach((item) => {
    if (item.name === 'Оплатить' || item.name === 'Перевести' || item.name === 'Пополнить') return;
    if (item.sid === 'UBS_CARD_SETLIMIT') {
      addActionSetCardLimit(item, activeProduct, operationsButtons);
      return;
    }
    const defaultValues = {};
    item.params.forEach((param) => defaultValues[param.name] = param.value);
    operationsButtons.push({
        label: item.name,
        sid: item.sid,
        action: () => {
          openModal({
            parentComponentId,
            passProps: {
              sid: item.sid,
              defaultValues,
            }
          });
        }
      });
    }
  );

  if (productType === 'LOAN') {
    operationsButtons.push({
      label: 'Где оплатить',
      sid: 'WHERE_TO_PAY',
      action: () => {
        pushScreen({
          screenName: 'unisab/MapTabScreen',
          componentId: parentComponentId,
          passProps: {
            hideBottomTabs: true,
          }
        })
      }
    });
  }
  if (Platform.OS === 'ios') {
    operationsButtons.push({ label: 'Отмена' });
  }
  return operationsButtons;
}

export const getInquiriesOptions = (inquiries = [], productId, closeDialog, parentComponentId) => {
  return (
    <View>
      {
        inquiries.map(item =>
          <TouchableOpacity
            style={{width: '100%', paddingTop: 15, paddingLeft: 15, paddingRight: 25, flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              closeDialog();
              setTimeout(() =>
              openModal({
                parentComponentId,
                passProps: {
                  sid: 'UBS_REQUEST_INFO',
                  defaultValues: {
                    'Код вида документа': 'UBS_REQUEST_INFO',
                    'Документ.Тип документа': item.sidRequest,
                    'Документ.Идентификатор договора': productId,
                  },
                }
              }), 500);
            }
            }
          >
            <Image style={{width: 32, height: 32}} source={require('../../../assets/icons/inquiry.png')}/>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
}

function addActionSetCardLimit(item, activeProduct, operationsButtons) {
  operationsButtons.push({
    label: item.name,
    sid: item.sid,
    action: () => {
      showModal({
        screenName: 'unisab/LimitsScreen',
        title: 'Установка лимитов карты',
        passProps: {
          idObject: activeProduct.id,
        }
      });
    }
  });
}
