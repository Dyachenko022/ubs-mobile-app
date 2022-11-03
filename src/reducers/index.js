import routing from './routing/reducer';
import api from './api/reducer';

import userInfo from './userInfo/reducer';
import login from './login/reducer';

import messagesPage from './messagesPage/reducer';
import templatesPage from './templatesPage/reducer';

import loginPage from './loginPage/reducer';
import newsPage from './newsPage/reducer';
import mapPage from './mapPage/reducer';

import myBankPage from './myBankPage/reducer';
import historyPage from './historyPage/reducer';
import paymentsPage from './paymentsPage/reducer';
import myFinancesPage from './myFinancesPage/reducer';
import documentPage from './documentPage/reducer';

import productPage from './productPage/reducer';
import newProductPage from './newProduct/reducer';

import bonusesPage from './bonuses/reducer';
import newProductsPage from './newProductsPage/reducer';
import limitsPage from './limitsPage/reducer';

import notificationsSettings from './notificationsSettings/reducer';
import notifications from './notifications/reducer';
import settingsFront from './settingsFront/reducer';
import personalOffers from './personalOffers/reducer';
import bankInquiries from './bankInquiries/reducer';
import error from './error/reducer';
import sbpAcceptancesPage from './sbpAcceptancesScreen/reducer';
import sbpay from './SBPayScreen/reducer';

export {
  routing,
  api,
  settingsFront,
  userInfo,
  login,

  messagesPage,
  templatesPage,

  loginPage,
  newsPage,
  mapPage,
  personalOffers,

  myBankPage,
  historyPage,
  paymentsPage,
  myFinancesPage,
  documentPage,
  notificationsSettings,
  newProductsPage,
  notifications,
  productPage,
  newProductPage,
  bankInquiries,
  bonusesPage,
  limitsPage,
  sbpAcceptancesPage,
  sbpay,
  error,
};
