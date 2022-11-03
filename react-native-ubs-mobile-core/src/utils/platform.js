import { Dimensions, Platform } from 'react-native';

export const isIphoneX = () => {
  const { width, height } = Dimensions.get('window');
  return Platform.OS === 'ios' && width / height < 0.52;
};
