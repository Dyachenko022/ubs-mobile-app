import { Alert, BackHandler } from 'react-native';

export default function androidBeforeExit() {
  Alert.alert('Выход из приложения', 'Вы уверены, что хотите выйти из приложения?', [{
    text: 'Нет',
    onPress: () => {}
  },
    {
      text: 'Да',
      onPress: () => {BackHandler.exitApp();}
    },
  ]);
  return true;
}
