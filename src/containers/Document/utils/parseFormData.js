import moment from 'moment';


const momentTemplates = ['YYYY-MM-DDThh:mm:ss', 'YYYY-MM-DD hh:mm:ss', 'YYYY-MM-DD', 'YYYY-MM-DDThh:mm:ss.fff',
  'YYYY-MM-DDThh:mm:ss.ffff', 'YYYY-MM-DDThh:mm:ss.fffff',
  'MM.YYYY', 'DD.MM.YYYY', 'DD.MM.YYYYTHH:mm:ss'];

const getDefaultValueByField = (field, value = '') => {
  switch (field.inputType) {
    case 'TextBoxMoney': return {type: 'decimal', value: ''};
    case 'TextBoxNote': return {type: 'string', value: '^0'};
    case 'AttachFile':
    case 'Grid': return {type: 'array', value: []};
    case 'ComboBoxMultiSelect':
    case 'DataGridView':  return {type: 'array', value: [], typeColumns: ['string']};
    case 'Date': return {type: 'date', value: moment().format('DD.MM.YYYY')};
    case 'ListDocs': return {type: 'array', value:[], typeColumns: ['string','string','string', 'string']};

    default: return {type: 'string', value: ''};
  }
};

export const parseFormData = (formData, oldStateValues = {}) => {
  // default state
  const state = {
    groups: [],
    valuesGroups: {},
    fields: {},
    values: {},
    listValues: {},
    currentGroupName: '',
    nextSidRequest: null
  };

  // ETL for form data
  Array.isArray(formData.inputFields) && formData.inputFields.forEach((group) => {
    const {group: groupName, fields} = group;

    state.groups.push(groupName);
    state.valuesGroups[groupName] = [];

    fields.forEach((field) => {
      if (/Account/.test(field.inputType)) {
        const [baseSid, subSid] = field.sid.split('#');
        // const [,inputType, options, accountsType] = /^([^:#]*):?([^#]*)#?(\d*)$/.exec(field.inputType);

        const setFieldDefault = (sid) => {
          if (oldStateValues[sid]) return;

          state.values[sid] = {
            name: sid,
            type: 'string',
            value: '',
            isCorrect: true,
            typeColumns: field.typeColumns || null
          };
        };

        setFieldDefault(baseSid);
        setFieldDefault(subSid);

        state.fields[baseSid] = field;
        state.fields[baseSid].sid = baseSid;
        state.fields[baseSid].subSid = subSid;
        state.fields[baseSid].inputType = 'Account';

        state.valuesGroups[groupName].push(baseSid);

        return;
      }

      const {type, value, typeColumns} = getDefaultValueByField(field);
      if (!state.values[field.sid] && !oldStateValues[field.sid]) {
        state.values[field.sid] = {
          name: field.sid,
          type,
          value,
          isCorrect: true,
          mobileInputKeyboard: field.mobileInputKeyboard,
          typeColumns: field.typeColumns || typeColumns || null
        };

        if (field.sid === 'Документ.Список файлов') {
          state.values[field.sid].typeColumns = ['string', 'string'];
        }
      }

      if (!state.listValues[field.sid]) {
        state.listValues[field.sid] = null;
      }

      state.fields[field.sid] = field;
      state.valuesGroups[groupName].push(field.sid);
    }); // END fields.forEach
  }); // END inputData.forEach


  formData.values && formData.values.forEach((fieldValue) => {
    state.values[fieldValue.name] = Object.assign({}, state.values[fieldValue.name], fieldValue);

    if (state.values[fieldValue.name].isCorrect === undefined) {
      state.values[fieldValue.name].isCorrect = true;
    }

    // Switch by type
    if (state.values[fieldValue.name].type === 'decimal') {
      if (state.values[fieldValue.name].value && /,/.test(state.values[fieldValue.name].value)) {
        state.values[fieldValue.name].value = state.values[fieldValue.name].value.replace(',', '.');
      }
    } else if (state.values[fieldValue.name].type === 'date') {
      state.values[fieldValue.name].value = moment(fieldValue.value, momentTemplates).format('DD.MM.YYYY');
    }
    // END Switch by type

    if (state.fields[fieldValue.name] && state.fields[fieldValue.name].inputType === 'TextBoxNote') {
      let [message, value] = state.values[fieldValue.name].value.split('^');

      if (value) {
        const parts = value.split(' - ');
        if (parts.length === 2) {
          // const res = /[^\d]*(\d+)%/.exec(parts[0])
          const commis = Number(parts[1]);
          const sum = Number(state.values['Документ.Сумма'].value);
          value = Number(commis*100/sum).toFixed(2);
          if (parts[1] === '00') value = parts[1];
        } else {
          value = 0;
        }
      }

      state.values[fieldValue.name].value = `${message}^${value}`;
    }
  }); // END values.forEach

  formData.listValues && formData.listValues.forEach((fieldListValue) => {
    const [name] = fieldListValue.name.split('#');
    if (state.fields[name] && state.fields[name].inputType === 'Account') {
      state.listValues[name] = fieldListValue;
    } else {
      state.listValues[fieldListValue.name] = fieldListValue;
    }
  });

  state.currentGroupName = formData.groupInput;
  state.nextSidRequest = formData.sidRequest;

  return state;
};


export default parseFormData;
