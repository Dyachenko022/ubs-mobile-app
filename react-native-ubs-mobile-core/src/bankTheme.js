import { NativeModules } from 'react-native';
import {Platform} from 'react-native';

const nativeBankTheme = NativeModules.BankTheme;

const images = {
  loginPageLogo: Platform.OS === 'ios' ? 'login_page_logo' : 'asset:/login_page_logo.png',
  loginBackgroundImage: Platform.OS === 'ios' ? 'login_background_image' : 'asset:/login_background_image.jpg',
  loginPageLogoFilled: Platform.OS === 'ios' ? 'login_page_logo_filled' : 'asset:/login_page_logo_filled.png',
  faceIdColored: Platform.OS === 'ios' ? 'faceid-colored' : '',
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

const CoreBankTheme = {
  color1: nativeBankTheme.color1,

  defaultMapLocation: {
    latitude: nativeBankTheme.defaultMapLocation && nativeBankTheme.defaultMapLocation.latitude,
    longitude: nativeBankTheme.defaultMapLocation && nativeBankTheme.defaultMapLocation.longitude,
  },

  images,
  codeSettingPageTheme,
}


export default CoreBankTheme;
