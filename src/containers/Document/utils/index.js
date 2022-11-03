// import textUtils from '../../../utils/text';
import React from 'react';
import {Platform, View} from 'react-native';
import _ from 'lodash';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import {getCards, getDeposits, getCredits, getAccounts, getPathImageProduct, getPathDescr} from '../../../api/actions';
import {MASK_SYMBOLS} from '../../../components/TextBoxInput';
import {formEval} from './eval';
import {pushScreen} from '../../../utils/navigationUtils';
import {isValidURL} from '../../../utils/utils';

export function getGroupNameByIndex(groups, idx) {
  for (let i = 0; i < groups.length; ++i) {
    let groupArray = groups[i];

    if (!Array.isArray(groupArray)) {
      groupArray = [groupArray];
    }

    if (idx < groupArray.length) {
      return groupArray[idx];
    }
    idx -= groupArray.length;
  }

  return undefined;
}

export function getGroupIdxByName(groups, name) {
  let offset = 0;

  for (let i = 0; i < groups.length; ++i) {
    let groupArray = groups[i];
    if (groupArray.indexOf(name) > -1) {
      return offset + groupArray.indexOf(name);
    }
    offset += groupArray.length;
  }

  return -1;
}

export function checkPhoneInputType(field) {
  return field.inputType !== 'ToogleSwitch' &&  /телефон/i.test(field.name);
}

export function parseResponseAccounts(contracts = []) {
  const pathToImage = getPathImageProduct();

  return contracts.map((el, idx) => {
    let path = (pathToImage + '' + el.logo);
    return {
      label: el.description,
      contractNumber: el.contractNumber,
      accountNumber: el.accountNumber,
      balance: el.balance,
      currency: el.currency,
      logo: path,
      type: 'item',
      value: el
    };
  });
}

export const getRawMaskedValue = ({value, mask}) => {
  const valueLength = value.length;
  const maskLength = mask.length;
  const rawValueArray = [];
  let valueIdx = 0, maskIdx = 0;


  while (valueIdx < valueLength && maskIdx < maskLength) {
    if (mask[maskIdx] == 0 && /\d/.test(value[valueIdx])) {
      rawValueArray.push(value[valueIdx]);
      valueIdx++;
      maskIdx++;
      continue;
    }

    if (mask[maskIdx] == value[valueIdx]) {
      valueIdx++;
      maskIdx++;
      continue;
    }

    maskIdx++;
  }

  return rawValueArray.join('');
};

export const checkCondition = (field, values) => {
  if (!field.condition) return true;

  return formEval(field.condition, values);
};


export const checkValueCorrectness = (field, values, _value, _listValues) => {
  let value = _value || values[field.sid].value;
  if ((!value && value !== '' && value !== 0) || !checkCondition(field, values)) return true;

  if (field.inputType === 'ListDocs') {
    if (!value || !Array.isArray(value)) value = [];

    const listValues = _listValues[field.sid].value;
    if(!listValues.some(item => item[2])) return true; // Если нет обязательных документов, то все ок

    return value.length > 0 && value.every((item, index) => !listValues[index][2] || (listValues[index][2] && item[2])); //Все элементы массива -> (Необязательный ИЛИ обязательный и просмотрен)
  }

  if (field.inputType === 'AttachFile') {
    if (!value || !Array.isArray(value)) value = [];
    const isInvalid = (field.maxSize && value.length > field.maxSize) || (field.minSize && value.length < field.minSize);
    return !isInvalid;
  }

  if (checkPhoneInputType(field) && field.mask) {
    value = getRawMaskedValue({value, mask: field.mask});
  }

  const isDateInvalid = field.inputType === 'Date' && (!/\d{2}\.\d{2}\.\d{4}/.test(value) || (value === '01.01.2222' && field.minSize > 0) || !value || value === 'Invalid date');
  const isSizeInvalid = (field.maxSize && value.length > field.maxSize) || (field.minSize && value.length < field.minSize);
  const isRegExpInvalid = !(new RegExp(field.regularExpression || '')).test(value);

  let rawValue = '';
  if (field.mask && field.mask.length === value.length) {
    for (let i = 0; i < field.mask.length; i++) {
      if (MASK_SYMBOLS.indexOf(field.mask[i]) !== -1) {
        rawValue = rawValue + value[i];
      }
    }
  }
  const isRegExpInvalidRaw = !(new RegExp(field.regularExpression || '')).test(rawValue);
  const isSizeInvalidRaw = (field.maxSize && rawValue.length > field.maxSize) || (field.minSize && rawValue.length < field.minSize);

  return !(isDateInvalid || ((isRegExpInvalid || isSizeInvalid) && (isRegExpInvalidRaw || isSizeInvalidRaw)));
};

const roundNds = (nds = 0) => {
  return (Math.round((nds + Number.EPSILON) * 100) / 100).toFixed(2);
}

export const getTextBoxNoteText = function (value, amount) {
  if (value === '0' || value === 'НДС не облагается') return 'НДС не облагается';
  let numValue = Number(value);
  numValue = numValue / (100.0 + numValue);
  return `В том числе НДС - ${roundNds(Number(amount || 0) * (numValue || 0))} `;
};

// export const getTextBoxNoteText = function (nds, sum) {
//
//   return nds === '0' ?
//     'НДС не облагается' :
//     `В том числе НДС - ${(( Number(nds||0)*100)/sum||0).toFixed(2)} `;
// };
// export const parseDefaultValues =

export function addDescrPathIfNeed(url) {
  if (isValidURL(url)) {
    return url;
  } else {
    return getPathDescr() + url;
  }
}

export const processEndingAction = ({sid, dispatch}) => {
  if (!sid || !dispatch) {
    return;
  }

  switch (sid) {
    case 'UBS_CARD_ISSUE':
      dispatch(getCards());
      break;
    case 'UBS_ACCOUNT_CLOSE':
      dispatch(getAccounts());
      break;
    case 'UBS_DEPOSIT_OPEN':
    case 'UBS_DEPOSIT_CLOSE':
      dispatch(getDeposits());
      break;
    case 'UBS_FO_CREATE_CLAIM':
      dispatch(getCredits());
      break;
    default:
      dispatch(getCards());
      dispatch(getDeposits());
      dispatch(getAccounts());
      dispatch(getCredits());
  }
};


export const openReceipt = ({componentId, id}) => {
  pushScreen({
    componentId,
    screenName: 'unisab/DocumentReceiptScreen',
    title: 'Квитанция',
    passProps: {
      id,
    }
  });
};


export const getCurrentCurrency = (formData) => {
  const sumFieldValue = formData.values['Документ.Валюта'];
  const sumField = formData.fields['Документ.Валюта'];
  const accountFieldValue = formData.values['Документ.Источник списания'];

  let value, accountNumberFieldValue, account;

  if (accountFieldValue) {
    value = accountFieldValue.value;
    accountNumberFieldValue = formData.values['Плательщик.Счет'];
    account = _.find(formData.accounts, (el) =>
      el.value.code === 'PLCARD' ? (el.contractNumber === value && (!accountNumberFieldValue.value
        || accountNumberFieldValue.value === el.accountNumber)) : el.accountNumber === value);

  }

  if (sumFieldValue) {
    if (sumField && sumField.inputType === 'ComboBoxDropDownList' && formData.listValues[sumField.sid] && sumFieldValue.value) {
      const result = formData.listValues[sumField.sid].value.find(el => el[0] === sumFieldValue.value || el[1] === sumFieldValue.value);
      return result[1];
    } else {
      return sumFieldValue.value;
    }
  }

  return account ? account.value['currency'] : 'RUB';
};
