import { NativeModules } from 'react-native';
import {Platform} from 'react-native';

const nativeBankTheme = NativeModules.BankTheme;

const images = {
  loginPageLogo: Platform.OS === 'ios' ? 'login_page_logo' : 'asset:/login_page_logo.png',
  loginBackgroundImage: Platform.OS === 'ios' ? 'login_background_image' : 'asset:/login_background_image.jpg',
  aboutScreenLogo: Platform.OS === 'ios' ? 'about_screen_logo' : 'asset:/about_screen_logo.png',
  faceIdColored: Platform.OS === 'ios' ? 'faceid-colored' : '',
  mapPage: {
    mapIconType1: Platform.OS === 'ios' ? 'mapType1' : 'asset:/mapPage/mapType1.png',
    mapIconType2: Platform.OS === 'ios' ? 'mapType3' : 'asset:/mapPage/mapType2.png',
    mapIconType3: Platform.OS === 'ios' ? 'mapType3' : 'asset:/mapPage/mapType3.png',
  },
  productPage: {
    income: Platform.OS === 'ios' ? 'productPage_income' : 'asset:/productPage/productPage_income.png',
    pay: Platform.OS === 'ios' ? 'productPage_pay' : 'asset:/productPage/productPage_pay.png',
  }
}

const nativeCodeSettingPageTheme = nativeBankTheme.codeSettingPageTheme || {};

const codeSettingPageTheme = {
  backgroundColor: nativeCodeSettingPageTheme.backgroundColor || nativeBankTheme.color1,
  buttonBackgroundColor: nativeCodeSettingPageTheme.buttonBackgroundColor || 'white',
  buttonBorderColor: nativeCodeSettingPageTheme.buttonBorderColor ||nativeBankTheme.color1,
  buttonTextColor: nativeCodeSettingPageTheme.buttonTextColor || nativeBankTheme.color1,
  textColor: nativeCodeSettingPageTheme.textColor || 'white',
  indicatorBorderColor: nativeCodeSettingPageTheme.indicatorBorderColor || 'white',
  indicatorEmptyBackgroundColor: nativeCodeSettingPageTheme.indicatorEmptyBackgroundColor || 'transparent',
  indicatorFullBackgroundColor: nativeCodeSettingPageTheme.indicatorFullBackgroundColor || 'white',
}

const BankTheme = {
  navigationBackgroundColor: nativeBankTheme.navigationBackgroundColor || nativeBankTheme.color1,
  color1: nativeBankTheme.color1,

  defaultMapLocation: {
    latitude: nativeBankTheme.defaultMapLocation ? parseFloat(nativeBankTheme.defaultMapLocation.latitude) : 55.753868,
    longitude: nativeBankTheme.defaultMapLocation ? parseFloat(nativeBankTheme.defaultMapLocation.longitude) : 37.620981,
  },

  images,
  codeSettingPageTheme,
  bankPhoneNumber: nativeBankTheme.bankPhoneNumber,
  allowShowCvvCode: nativeBankTheme.allowShowCvvCode,
  showBonusesPage: nativeBankTheme.showBonusesPage || false,
  showNotificationsSetting: nativeBankTheme.showNotificationsSetting || false,
  allowAddCardsToWallet: nativeBankTheme.allowAddCardsToWallet || false,
  statusBarTheme: Platform.OS === 'android' ? undefined : (nativeBankTheme.statusBarTheme || 'dark'),
  showPersonalOffersOnMyBankPage: nativeBankTheme.showPersonalOffersOnMyBankPage || false,
  serverUrl: nativeBankTheme.serverUrl || '',
  pushNotificationsUsed: nativeBankTheme.pushNotificationsUsed ?? false,
  bankMessagesUsed: nativeBankTheme.bankMessagesUsed ?? true,
  hasEmui: Platform.OS === 'ios' ? false : nativeBankTheme.hasEmui,
}

export default BankTheme;

/**
 * Открывает настройку Автозапуск, только для Xiaomi
 */
export function requestAutostartPermission() {
  if (Platform.OS !== 'android') return;
  nativeBankTheme.requestAutostartPermission();
}
