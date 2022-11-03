export const parseFormData = function(formData, oldStateValues = {}) {
  const state = {
    groups : [],
    valuesGroups: {},
    fields : {},
    values : {},
    listValues : {},
    currentGroupName : '',
    nextSidRequest: null
  };

  // ETL for form data
  formData.inputFields && formData.inputFields.forEach((group) => {
    const {group : groupName, fields} = group;

    state.groups.push(groupName);
    state.valuesGroups[groupName] = [];

    fields.forEach((field) => {
      state.valuesGroups[groupName].push(field.sid);
      state.fields[field.sid] = field;

      let type, value, typeColumns;
      switch (field.inputType) {
        case 'TextBoxMoney':
          type = 'decimal';
          value = '';
          break;
        case 'TextBoxNote':
          type = 'string';
          value = '^0';
          break;
        case 'Grid':
          type = 'array'; value = [];
          break;
        case 'ComboBoxMultiSelect':
        case 'DataGridView':
          type  = 'array'; value = [];
          typeColumns = ['string'];
          break;
        case 'Date':
          type = 'date'; value = '';
          break;
        default:
          type = 'string';
          value = '';
      }

      if (!state.values[field.sid] && !oldStateValues[field.sid]) {
        state.values[field.sid] = {
          type,
          value,
          isCorrect: true,
          typeColumns: field.typeColumns || typeColumns || null
        };

        if (field.sid === 'Документ.Список файлов') {
          state.values[field.sid].typeColumns = ['string', 'string'];
        }
      }
      if (!state.listValues[field.sid]) {
        state.listValues[field.sid] = null;
      }
    });
  });


  formData.values && formData.values.forEach((fieldValue) => {
    state.values[fieldValue.name]  = Object.assign({}, state.values[fieldValue.name], fieldValue);
    if (state.values[fieldValue.name].isCorrect === undefined) {
      state.values[fieldValue.name].isCorrect = true;
    }

    if (state.fields[fieldValue.name] && state.fields[fieldValue.name].inputType === 'TextBoxNote') {
      let [message, value] = state.values[fieldValue.name].value.split('^');

      if (value) {
        const parts = value.split('-');
        if (parts.length === 2) {
          const res = /[^\d]*(\d+)%/.exec(parts[0])
          if (res) {
            value = res[1];
          } else {
            value = 0;
          }
        } else {
          value = 0;
        }
      }

      state.values[fieldValue.name].value = `${message}^${value}`;
    }

  });

  formData.listValues && formData.listValues.forEach((fieldListValue) => {
    state.listValues[fieldListValue.name] = fieldListValue;
  });

  if ((state.values['Документ.Источник списания'] || oldStateValues['Документ.Источник списания']) &&
    !oldStateValues['Плательщик.Счет'] && !state.values['Плательщик.Счет']
  ) {
    state.values['Плательщик.Счет'] = {
      isCorrect: true,
      type: 'string',
      typeColumns: null,
      value: ''
    }
  }
  if ((state.values['Документ.Источник зачисления'] || oldStateValues['Документ.Источник зачисления']) &&
    !oldStateValues['Получатель.Счет'] && !state.values['Получатель.Счет']
  ) {
    state.values['Получатель.Счет'] = {
      isCorrect: true,
      type: 'string',
      typeColumns: null,
      value: ''
    }
  }

  state.currentGroupName = formData.groupInput;
  state.nextSidRequest = formData.sidRequest;

  return state;
};
