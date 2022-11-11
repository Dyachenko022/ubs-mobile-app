import {Navigation, ScreenVisibilityListener} from 'react-native-navigation';
import React from 'react';
import {store} from '../../App';

import LoginDrawer from '../containers/Drawer/Login';
import MyBankDrawer from '../containers/Drawer/MyBank';
import { RNNDrawer } from 'react-native-navigation-drawer-extension';

import LoadingScreen from './LoadingScreen';

import BadgeMenu from '../components/BadgeMenu';
import CustomTopBar from '../containers/CustomTopBar';
import SearchTopBar from '../containers/SearchTopBar';

import {OperationsButton} from './ProductScreen/index.ios';
import {OperationsPopupMenu} from './ProductScreen/index.android.js';

import BlankScreen from './BlankScreen';
import ErrorScreen from './ErrorScreen';
import AboutScreen from './AboutScreen';

import LoginTabScreen from './LoginTabScreen';

import NewsTabScreen from './NewsTabScreen';

import MapTabScreen from './MapTabScreen';
import PersonalOffersListScreen from './PersonalOffersListScreen';
import PersonalOfferScreen from './PersonalOfferScreen';
import MapListModal, {CloseModalButton as MapListModalCloseModalButton} from './MapTabScreen/List';

import RegistrationScreen, {CloseModalButton as RegistrationCloseModalButton} from './RegistrationScreen';
import ConfirmationScreen from './ConfirmationScreen';
import ContractsSelectScreen, {CloseModalButton as ContractsSelectScreenCloseModalButton} from './ContractsSelectScreen';
import BankInquiriesScreen from './BankInquiriesScreen';

import CodeSettingsScreen from './CodeSettingScreen';
import IdentifySelectScreen from './IdentifySelectScreen';

import MyBankTabScreen from './MyBankTabScreen';
import HistoryTabScreen from './HistoryTabScreen';
import PaymentsTabScreen from './PaymentsTabScreen';
import MyFinancesTabScreen from './MyFinancesTabScreen';

import Document from './DocumentScreen';
import DocumentReceiptScreen from './DocumentReceiptScreen';

import ModalProvider from './PaymentsTabScreen/ModalProviders';

import NewProductScreen from './NewProductScreen__old';

import ProductScreen from './ProductScreen';
import ProductAccountDetailsScreen from './ProductAccountDetailsScreen';
import AndroidDatePicker from '../components/BottomActionSheet/AndroidDatePicker';

import MessagesScreen from './MessagesScreen';
import NotificationsSettingsScreen from './NotificationsSettingsScreen';
import SettingsScreen from './SettingsScreen';

import TemplatesScreen from './TemplatesScreen';

import BonusesScreen from './BonusesScreen';
import NewProductsScreen from './NewProductsScreen';
import NewProductsFilterScreen from './NewProductsFilterScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import NotificationsScreen from './NotificationsScreen';

import WebViewModalConfirmation from '../components/WebViewModalConfirmation';
import TextBoxFind from "../components/Inputs/TextBoxFind";
import IconPersonalOffers from '../components/CustomTopBarRightIcons/IconPersonalOffers';
import IconNotifications from '../components/CustomTopBarRightIcons/IconNotifications';
import ModalSetLimit from './LimitsScreen/components/ModalSetLimit';
import LimitsScreen from './LimitsScreen';
import SbpAcceptancesScreen from './SbpAcceptancesScreen';
import ContractDataErrorModal from './MyBankTabScreen/ContractDataErrorModal';
import IconExitUser from '../components/CustomTopBarRightIcons/IconExitUser';
import SBPayScreen from './SBPayScreen';
import SpbSubscriptionsScreen from './SpbSubscriptionsScreen/SpbSubscriptionsScreen';

function reduxStoreWrapper (MyComponent, store, Provider) {
  return  (props = {}) => {
    return (
      <Provider store={store}>
        <MyComponent {...props} />
      </Provider>
    );
  }
}


export function registerScreens(store, Provider) {
  Navigation.registerComponentWithRedux('unisab/LoadingScreen', () => LoadingScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/LoginTabScreen', () => LoginTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/NewsTabScreen', () => NewsTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/MapTabScreen', () => MapTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/CustomTopBar', () => CustomTopBar, Provider, store);

  Navigation.registerComponent('unisab/Drawer/Login', () => RNNDrawer.create(reduxStoreWrapper(LoginDrawer, store, Provider)));
  Navigation.registerComponent('unisab/Drawer/MyBank', () => RNNDrawer.create(reduxStoreWrapper(MyBankDrawer, store, Provider)));

  Navigation.registerComponent('unisab/BadgeMenu', () => BadgeMenu, store, Provider);
  Navigation.registerComponentWithRedux('unisab/SearchTopBar', () => SearchTopBar, Provider, store);

  Navigation.registerComponentWithRedux('unisab/OperationsButton', () => OperationsButton, Provider, store);
  Navigation.registerComponentWithRedux('unisab/OperationsPopupMenu', () => OperationsPopupMenu, Provider, store);

  Navigation.registerComponentWithRedux('unisab/BlankScreen', () => BlankScreen, Provider, store);
  Navigation.registerComponent('unisab/ErrorScreen', () => ErrorScreen);
  Navigation.registerComponent('unisab/AboutScreen', () => reduxStoreWrapper(AboutScreen, store, Provider), () => AboutScreen);

  Navigation.registerComponentWithRedux('unisab/NewProductsScreen', () => NewProductsScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/NewProductsFilterScreen', () => NewProductsFilterScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/MapListModal', () => MapListModal, Provider, store);
  Navigation.registerComponentWithRedux('unisab/RegistrationScreen', () => RegistrationScreen, Provider, store);
  Navigation.registerComponent('unisab/ConfirmationScreen', () => reduxStoreWrapper(ConfirmationScreen, store, Provider), () => ConfirmationScreen);


  Navigation.registerComponentWithRedux('unisab/ContractsSelectScreen', () => ContractsSelectScreen, Provider, store);
  Navigation.registerComponentWithRedux('ContractsSelectScreen/CloseModalButton', () => ContractsSelectScreenCloseModalButton, Provider, store);

  Navigation.registerComponent('unisab/CodeSettingsScreen', () => reduxStoreWrapper(CodeSettingsScreen, store, Provider), () => CodeSettingsScreen);
  Navigation.registerComponent('unisab/IdentifySelectScreen', () => reduxStoreWrapper(IdentifySelectScreen, store, Provider), () => IdentifySelectScreen);

  Navigation.registerComponent('unisab/MyBankTabScreen', () => reduxStoreWrapper(MyBankTabScreen, store, Provider), () => MyBankTabScreen);
  Navigation.registerComponentWithRedux('unisab/HistoryTabScreen', () => HistoryTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/PaymentsTabScreen', () => PaymentsTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/MyFinancesTabScreen', () => MyFinancesTabScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/PersonalOffersListScreen', () => PersonalOffersListScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/PersonalOfferScreen', () => PersonalOfferScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/ModalProvider', () => ModalProvider, Provider, store);

  Navigation.registerComponentWithRedux('unisab/NewProductScreen', () => NewProductScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/ProductScreen', () => ProductScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/ProductAccountDetailsScreen', () => ProductAccountDetailsScreen, Provider, store);
  Navigation.registerComponent('unisab/AndroidDatePicker', () => AndroidDatePicker);

  Navigation.registerComponentWithRedux('unisab/Document', () => Document, Provider, store);
  Navigation.registerComponentWithRedux('unisab/DocumentReceiptScreen', () => DocumentReceiptScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/MessagesScreen', () => MessagesScreen, Provider, store);
  Navigation.registerComponent('unisab/NotificationsSettingsScreen', () => reduxStoreWrapper(NotificationsSettingsScreen, store, Provider), () => NotificationsSettingsScreen);
  Navigation.registerComponentWithRedux('unisab/SettingsScreen', () => SettingsScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/TemplatesScreen', () => TemplatesScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/ChangePasswordScreen', () => ChangePasswordScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/BonusesScreen', () => BonusesScreen, Provider, store);
  Navigation.registerComponentWithRedux('unisab/BankInquiriesScreen', () => BankInquiriesScreen, Provider, store);
  Navigation.registerComponent('unisab/SbpAcceptancesScreen', () => reduxStoreWrapper(SbpAcceptancesScreen, store, Provider), () => SbpAcceptancesScreen);
  Navigation.registerComponent('unisab/NotificationsScreen', () => reduxStoreWrapper(NotificationsScreen, store, Provider), () => NotificationsScreen);
  Navigation.registerComponent('unisab/SBPayScreen', () => reduxStoreWrapper(SBPayScreen, store, Provider), () => SBPayScreen);

  //Components
  Navigation.registerComponentWithRedux('TextBoxFind', () => TextBoxFind, Provider, store);
  Navigation.registerComponent('IconPersonalOffers', () => reduxStoreWrapper(IconPersonalOffers, store, Provider), () => IconPersonalOffers);
  Navigation.registerComponent('IconNotifications', () => reduxStoreWrapper(IconNotifications, store, Provider), () => IconNotifications);
  Navigation.registerComponent('IconExitUser', () => reduxStoreWrapper(IconExitUser, store, Provider), () => IconNotifications);
  Navigation.registerComponent('WebViewModalConfirmation', () => WebViewModalConfirmation);
  Navigation.registerComponent('unisab/ModalSetLimit', () => ModalSetLimit);
  Navigation.registerComponent('unisab/contractDataErrorModal', () => reduxStoreWrapper(ContractDataErrorModal, store, Provider), () => ContractDataErrorModal);
  //Navigation.registerComponent('unisab/LimitsScreen', () => reduxStoreWrapper(LimitsScreen, store, Provider));
  Navigation.registerComponentWithRedux('unisab/LimitsScreen', () => LimitsScreen, Provider, store);

  Navigation.registerComponentWithRedux('unisab/SpbSubscriptionsScreen', () => SpbSubscriptionsScreen, Provider, store)
}
