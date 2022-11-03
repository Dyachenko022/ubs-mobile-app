// TODO move to actions

import { AsyncStorage, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info'

import {EnterPage} from '../../api/routes';
import {myFetch} from '../../api/actions';



export const execute = async (basePath, data = {}) => {

  const method = 'POST';
  //data['jwt'] = await AsyncStorage.getItem('jwt');

  let idDocument = null;
  let sidDocument = null;

  if(data.parameters) {
    idDocument = data.parameters.find(p => p.name === 'Идентификатор документа')
    sidDocument = data.parameters.find(p => p.name === 'Код вида документа');
  }

  let headers = {
    'Content-Type': 'application/json',
    'UbsJWT': await AsyncStorage.getItem('jwt'), //new API
    'sidRequest': 'execute/' + data['sidRequest'], //new API
  };

  data['parameters'] = [
    ...(data['parameters'] || []),
    {value: DeviceInfo.getUniqueId(), type: 'string', name: 'Источник создания'}
  ];

  if(idDocument && idDocument !== 'undefined')
    data.idDocument = idDocument.value;
  else if(sidDocument && sidDocument !== 'undefined')
    data.sidDocument = sidDocument.value;

  // TODO: myFetch
  //return myFetch(basePath + EnterPage.execute, {body: JSON.stringify(data), headers, method}) //new API -
  return myFetch(basePath + 'execute', {body: JSON.stringify(data), headers, method}) //new API +
};

export const listContractForDocs = async (basePath, type = 7) => {
  const data = {};
  const method = 'POST';
  data['jwt'] = await AsyncStorage.getItem('jwt');
  data['type'] = type;
  const headers = {
    'Content-Type': 'application/json',
    'UbsJWT': data['jwt'], //new API +
    'sidRequest': 'listContractForDocs' //new API +
  };
  // TODO: myFetch
  //return myFetch(basePath + EnterPage.listContractForDocs, {body: JSON.stringify(data), headers, method}) //new API -
  return myFetch(basePath + 'execute', {body: JSON.stringify(data), headers, method}) //new API +
};

const getFilesForFormData = (files = []) => {

  return files.map(file => ({
    uri: file.uri,
    name: file.fileName,
    type: file.type
  }));
};

export const addDocumentFiles = async (basePath, data = {}) => {
  const path = basePath + 'execute';
  const files = getFilesForFormData(data.files);
  const jwt = await AsyncStorage.getItem('jwt');
  const method = 'POST';

  const headers = {
    'UbsJWT': jwt,//new API +
    'sidRequest': 'addDocumentFiles'//new API +
  };

  const body = new FormData();
  body.append('id', data.id); //new API +
  files.forEach(file => {
    body.append('files[]', file);
  });

  return myFetch(path, {body, headers, method}); //new API +
};
