import _ from 'lodash';
import TextBoxInput from '../../../components/TextBoxInput';
import * as documentUtils from './';

const defaultFieldSids = ['id', 'Идентификатор документа', 'Документ.Идентификатор провайдера', 'Идентификатор банка получателя',
  'Код вида документа', 'Документ.Идентификатор поставщика', 'Идентификатор продукта', 'Плательщик.Счет', 'Получатель.Счет',
  'Документ.Идентификатор договора', 'Код бизнеса', 'Идентификатор бизнес-договора', 'Идентификатор договора SMS-Банка',
  'Вид операции', 'Идентификатор депозитного договора', 'Идентификатор предложения', 'Идентификатор доверенности', 'Документ.УИН', 'Документ.Тип документа',
  'Согласен с условиями', 'Признак шаблона', 'Идентификатор акцепта', 'Идентификатор токена',
  'Действие', 'Идентификатор входящего запроса', 'Идентификатор намерения', 'Данные QR-кода'];


export function getDocumentParameters(state = {}) {
  const idx = state.currentGroupIndex;
  let i = 0, sidGroupsIdx = 0;
  const parameters = state.baseParameters ? [...state.baseParameters] : [];

  defaultFieldSids.forEach(sid => {
    const field = state.values[sid];
    if (field) {
      let value = field.value;

      parameters.push({
        name: sid,
        value: value,
        type: field.type,
        typeColumns: field.typeColumns || null
      })
    }
  });

  _.each(state.values, (fieldValue, key) => {
    if (/^Скрытые поля\..*$/.test(key)) {
      parameters.push({
        name: key,
        value: fieldValue.value,
        type: fieldValue.type,
        typeColumns: fieldValue.typeColumns || null
      })
    }
  });

  if (!state.groups.length) return parameters;

  while (i <= idx) {
    const currentSidGroups = state.groups[sidGroupsIdx];

    for (let groupIdx = 0; groupIdx < currentSidGroups.length; ++groupIdx) {
      const groupName = currentSidGroups[groupIdx];
      const groupFields = state.valuesGroups[groupName];
      parameters.push(...groupFields
        .filter(sid => state.fields[sid].inputType !== 'LinkLabel')
        .map(sid => {
        const fieldValue = state.values[sid];
        const field = state.fields[sid];
        let inputType = field.inputType;
        let value = fieldValue.value;

        if (documentUtils.checkPhoneInputType(field)) {
          inputType = 'Contacts';
        }
        // switch by input type
        if (inputType === 'TextBoxNote') {
          const [message, text] = fieldValue.value.split('^');
          const amount = state.values['Документ.Сумма'] ? state.values['Документ.Сумма'].value : 0;
          value = message + '^' + documentUtils.getTextBoxNoteText(text, amount);
        } else if (inputType === 'TextBoxFind' && !field.action && state.listValues[field.sid]) {
          value = _.find(state.listValues[field.sid].value, e => e[1] === value)[0];
        } else if (inputType === 'DataGridView') {
          value = value ? value.map(e => [e]) : value;
        } else if (inputType === 'Contacts' && field.mask) {
          value = documentUtils.getRawMaskedValue({value, mask: field.mask})
        }
        // switch by input type END

        if (inputType === 'TextBox' && field.mask) {
          value = TextBoxInput.getRawValue(field.mask, value);
        }
        if (fieldValue.type === 'date') {
          // value = dateUtils.getFullDate(value);
        }

        return {
          name: sid,
          value: value,
          type: fieldValue.type,
          typeColumns: fieldValue.typeColumns || null
        }
      }));

      i++;
      if (i > idx) {
        return parameters;
      }
    }

    sidGroupsIdx++;
  }

  return parameters;
}

function catchable(f) {
  return function catchableInner(...params) {
    try {
      return f(...params);
    } catch (e) {
      return [];
    }
  }
}

export default catchable(getDocumentParameters);
