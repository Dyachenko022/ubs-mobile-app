import React from 'react';
import { ActionSheetIOS } from 'react-native';
import Clipboard from '@react-native-community/clipboard';

export default class NotificationActions extends React.Component {

  show = (notification) => {

    const options = ['Отмена', 'Копировать', 'Поделиться'];
    if (notification.typeOfNotification !== 'sms') {
      options.push('Удалить');
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          Clipboard.setString(notification.text);
        }
        if (buttonIndex === 3) {
          this.props.deleteNotification(notification.guid);
        }
        if (buttonIndex === 2) {
          ActionSheetIOS.showShareActionSheetWithOptions({ message: notification.text, subject: notification.title }, (s) => {}, () => {});
        }
      }
    );
  }

  render() {
    return null;
  }
}