import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import AndroidIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import {Linking, Platform} from 'react-native';
import BankTheme from './bankTheme';
import {br} from 'react-native-render-html/src/HTMLRenderers';

let iosButtonBack = null;
let androidButtonBack = null;
Icon.getImageSource('ios-arrow-back', 30, 'white').then(res => iosButtonBack = res);
AndroidIcon.getImageSource('arrow-back', 24, 'white').then(res => androidButtonBack = res);

export function showModal(params = {screenName: undefined, title: undefined, passProps: {}, }) {
  return Navigation.showModal({
    stack: {
      children: [{
        component: {
          name: params.screenName,
          passProps: params.passProps,
          options: {
            topBar: {
              title: {
                text: params.title,
                color: 'white',
                alignment: 'center',
              },
            },
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
          }
        },
      }]
    }
  });
}

export function pushScreen({
                             componentId,
                             screenName,
                             passProps = {},
                             title = undefined,
                             showBackButtonTitle = false,
                             rightButtons = [],
                           }) {
  return Navigation.push(componentId, {
    component: {
      name: screenName,
      passProps,
      options: {
        topBar: {
          title: {
            text: title,
            color: 'white',
            alignment: 'center',
          },
          backButton: {
            color: 'white',
            showTitle: showBackButtonTitle,
          },
          rightButtons,
        },
      }
    }
  });
}

//Для модальных форм и форм в root
export function makeLeftBackButton(id) {
  return {
      id,
      icon: Platform.OS === 'ios' ? iosButtonBack : androidButtonBack,
      showAsAction: 'always',
  };
}

export function navigateByQuickAction(componentId, quickAction) {
  switch (quickAction) {
    case 'Оплатить и перевести':
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabId: 'PAYMENT_TAB_PAGE',
        }
      });
      break;
    case 'Мои финансы':
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabId: 'FINANCE_TAB_PAGE',
        }
      });
      break;
    case 'pushNotification':
      showModal({
        screenName: 'unisab/NotificationsScreen',
      });
      break;
    case 'Позвонить':
      if (BankTheme.bankPhoneNumber) {
        Linking.openURL('tel:' + BankTheme.bankPhoneNumber);
      }
      break;
  }
}
