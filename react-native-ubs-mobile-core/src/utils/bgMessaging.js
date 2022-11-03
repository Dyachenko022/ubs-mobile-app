import firebase from 'react-native-firebase';
import moment from "moment/moment";

import DeviceInfo from "react-native-device-info/deviceinfo";

import { deliveredPush } from '../../src/api/actions';

export default async (message) => {
  const {
    data,
    data: {
      icon,
      channel_id,
      notId,

      sdInfo,
      sdUuid,

      message: body,
      title
    }
  } = message;

  //console.warn(body)
  // const channel = new firebase.notifications.Android.Channel('test-channel', '1Test Channel', firebase.notifications.Android.Importance.Max)
  //   .setDescription('1y apps test channel');

// Create the channel

  const newNotification = new firebase.notifications.Notification()
    .android.setSmallIcon('ic_launcher')
    .android.setChannelId('common')
    // .setNotificationId(message.messageId)
    .setNotificationId(notId)
    .setTitle(title)
    .setBody(body);
    // .setData({
    //   key1: 'value1',
    //   key2: 'value2',
    // });
  firebase.notifications().displayNotification(newNotification);
  //console.warn(firebase.notifications().displayNotification)
  deliveredPush(moment().format('DD.MM.YYYYTHH:mm:ss'), sdUuid, DeviceInfo.getUniqueId());
  // firebase.notifications().android.createChannel(channel);
  // newNotification
  //   .android.setChannelId('test-channel')
  //   .android.setSmallIcon('ic_launcher');

  return Promise.resolve();
}
