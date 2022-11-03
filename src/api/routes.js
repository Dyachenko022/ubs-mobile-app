import BankTheme from '../utils/bankTheme';

const baseUrl = '';
export const firstRequestBase =  BankTheme.serverUrl;
console.error(firstRequestBase);
export const staticPathToApi = firstRequestBase + '/';

export const EnterPage = {
  deliveredPush: 'deliveredPush',

  registration: 'registration',
  registrationApp: 'users/getCodeSms',
  registrationAppNew: 'registrationApp', //logincode
  registrationConfirm : 'registration/confirm',
  disconnectApp: 'disconnectApp',
  settingsFrontUsr: 'public/settingsFrontUsr.json',
  settingsFrontSys: 'public/settingsFrontSys.json',

  //getServiceBranch: firstRequestBase+'/GetServiceBranch',//new API
  getServiceBranch: firstRequestBase+'/public/MobileServiceBranch.json',//new API

  //getRates: baseUrl+'rates',//new API
  getRates: baseUrl+'/execute',
  // EnterPage
  //news: baseUrl + 'news', //new API
  news: baseUrl + '/public/news.json',
  //advertising: baseUrl + 'advertising',
  advertising: baseUrl + '/public/advertising.json',
  secureRecommendations: baseUrl + '/public/securerecommendations.json',
  serviceNotification: baseUrl + '/public/ServiceNotification.json',
  getNotifications: baseUrl + 'getNotifications',
  versionApp: baseUrl + '/public/VersionApp.json',
  exit: baseUrl + 'exit',
  authBase: baseUrl + 'users/auth/base',
  authCode: baseUrl + 'users/auth/code',
  changePassword: baseUrl + 'users/changePassword',
  authContract: baseUrl + 'users/auth/contract',
  authSign: baseUrl + 'users/sign',
  getPersonalOffers: baseUrl + 'offers',
  changeOfferStatus: baseUrl + 'stateOffer',
  getPersonalOfferDescription: baseUrl + 'paramOffer',

  getCodeSms: baseUrl + 'users/getCodeSMS',
  confirm: baseUrl + 'users/confirm',

  // userInfo
  getFotoAbonent: baseUrl + 'users/getFotoAbonent',
  saveFotoAbonent: baseUrl + 'saveFotoAbonent',
  getUserInfo: baseUrl + 'users/info',
  // userInfo END

  // messagesPage
  getUnreadMessages: baseUrl + 'messages',
  readMessage: baseUrl + 'readMessage',
  stateMessage: baseUrl + 'stateMessage',
  stateNotification: baseUrl + 'stateNotification',
  getUnreadNotifications: baseUrl + 'getUnreadNotifications',
  // messagesPage END

  //getMapPoints: baseUrl + 'listPointsService', //new API
  getMapPoints: baseUrl + '/public/MobileListPointService.json', //new API

  sync: baseUrl + 'sync',
  getCards: baseUrl + 'cards',
  getCardLimits: baseUrl + 'getCardLimits',
  getDeposits: baseUrl + 'deposits',
  getAccounts: baseUrl + 'accounts',
  getCredits: baseUrl + 'credits',
  getAttachments: baseUrl + 'getAttachments',

  getCardInfo: baseUrl + 'getCardInfo',
  getCardOperations: baseUrl + 'cards/operations',

  getDepositInfo: baseUrl + 'getDepositInfo',
  getDepositOperations: baseUrl + 'deposits/operations',
  getDepositProxy: baseUrl + 'listProxyDeposit',

  getCreditInfo: baseUrl + 'getCreditInfo',
  getCreditOperations: baseUrl + 'credits/operations',
  getCreditSchedules: baseUrl + 'getSchedulesCredit',

  getAccountInfo: baseUrl + 'getAccountInfo',
  getAccountOperations: baseUrl + 'accounts/operations',

  paramProductCard: baseUrl + 'paramProductCard',
  paramProductCredit: baseUrl + 'paramProductCredit',
  paramProductDeposit: baseUrl + 'paramProductDeposit',
  getpart2card: baseUrl + 'getpart2card',
  sendrequsitescard: baseUrl + 'sendrequsitescard',

  setDescriptionProduct: baseUrl + 'setDescriptionProduct',
  changeAdditionalCardAccess: baseUrl + 'changeAdditionalCardAccess',
  getOperationAccess: baseUrl + 'getOperationAccess',
  checkContractData: baseUrl+ 'checkContractData',

  // HistoryPage
  listDocuments: baseUrl + 'listDocuments',
  listKindDocs: baseUrl + 'listKindDocs',
  listStateDocs: baseUrl + 'listStateDocs',
  listCurrency: baseUrl + 'listCurrency',
  listContractForDocs: baseUrl + 'listContractForDocs',

  //Payments Page
  getConfiguguration: baseUrl + 'configuration',
  getProviders: baseUrl + 'providers',
  getProducts: baseUrl+ 'paramProduct',
  getSystemsTransferMoney: baseUrl + 'systemsTransferMoney',

  listServicePayment: baseUrl + 'listServicePayment',
  sendRequestServicePayment: baseUrl + 'sendRequestAsync',


  //MyFinances Page
  operationsProduct: baseUrl + 'operationsProduct',


  // Execute
  execute: baseUrl + 'execute',
  extract: baseUrl + 'extract',

  // Bonuses
  //bonuses: baseUrl + 'bonuses', //new API
  bonuses: baseUrl + '/public/bonuses.json', //new API
  inquiries: baseUrl + '/public/inquiries.json',
  saveParamContract: '/saveParamContract',

  getAcceptances: '/acceptances',
};

