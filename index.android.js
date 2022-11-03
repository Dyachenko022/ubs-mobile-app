import { Navigation } from "react-native-navigation";
import QuickActions from "react-native-quick-actions";
import App, {store} from './App';
import DeviceInfo from 'react-native-device-info';

import {setPushMessagesAndroid, setPushMessagesHuawei} from './src/utils/pushMessages';

QuickActions.setShortcutItems([{
    type: 'pay',
    title: 'Оплатить и перевести',
    icon: "dot",
    userInfo: {
      url: '',
    },
  }, {
    type: 'finances',
    title: 'Мои финансы',
    icon: "dot",
    userInfo: {
      url: '',
    },
  }, {
    type: "call",
    title: "Позвонить",
    icon: "call",
    userInfo: {
      url: '',
    },
  },
]);

async function setNotificationProcessing() {
  if (await DeviceInfo.hasGms()) {
    setPushMessagesAndroid();
  } else if (await DeviceInfo.hasHms()) {
    setPushMessagesHuawei();
  }
}

setNotificationProcessing();

Navigation.events().registerAppLaunchedListener(() => {
  new App();
});
