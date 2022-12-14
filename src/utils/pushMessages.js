import {NativeModules} from 'react-native';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  AndroidVisibility,
  EventType,
  AuthorizationStatus
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {store} from '../../App';
import {deliveredPush} from '../api/actions';
const nativeRequests = NativeModules.NativeRequests;


export async function setPushMessagesAndroid() {
  const channelId = 'high_pr';
  let channelData = await notifee.getChannel('default');
  if (channelData) {
    await notifee.deleteChannel('default');
  }
  await notifee.createChannel({
    id: channelId,
    name: 'По умолчанию',
    sound: 'default',
    vibration: true,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });

  const processNotification = async (remoteMessage) => {
    // Проверить сеть
    await nativeRequests.testConnection();
    // Локальное уведомление
    const settings = await notifee.requestPermission();
    const text = remoteMessage.data.body;
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      const notificationId = await notifee.displayNotification({
        title: remoteMessage.data.title,
        body: text,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_stat_name',
          sound: 'default',
          style: { type: AndroidStyle.BIGTEXT, text, },
        }
      });
      await notifee.displayNotification({
        title: remoteMessage.data.title,
        body: text,
        android: {
          channelId: 'N_TEST',
          pressAction: {
            id: 'default',
          },
          smallIcon: 'ic_stat_name',
          sound: 'default',
          style: { type: AndroidStyle.BIGTEXT, text, },
        }
      });

      // В настройках Андроида можно запретить показ уведомлений. Проверим, отобразилось ли уведомление
      const notifications = await notifee.getDisplayedNotifications();
      const isDisplayed = notifications.find((item) => item.id === notificationId);
      if (!isDisplayed) {
        return;
      }

    } else {
      return;
    }

    return await nativeRequests.deliveredPush(
      moment().format('DD.MM.YYYYTHH:mm:ss'),
      remoteMessage.data?.sdUuid,
      DeviceInfo.getUniqueId(),
      remoteMessage.data?.body
    );
  }
  messaging().setBackgroundMessageHandler(processNotification);
  messaging().onMessage(processNotification);
}

export function setPushMessagesIos() {
  // У IOS только приложение в ForeGround. В Background обрабатывает сервис
  messaging().onMessage(async (remoteMessage) => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= IOSAuthorizationStatus.AUTHORIZED) {
      const badgeCount = await notifee.getBadgeCount();
      await notifee.displayNotification({
        title: remoteMessage.data.title,
        body: remoteMessage.data.body,
        ios: {
          sound: 'default',
          badgeCount: badgeCount + 1,
        },
      });
    } else {
      return;
    }

    return await store.dispatch(
      deliveredPush(moment().format('DD.MM.YYYYTHH:mm:ss'),
        remoteMessage.data?.sdUuid,
        DeviceInfo.getDeviceId(),
        remoteMessage.data?.body
      )
    );
  });
}

export function setPushMessagesHuawei() {
  // Удалено. Бывшая версия в ветке huawei
}
