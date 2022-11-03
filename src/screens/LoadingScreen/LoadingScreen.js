import React, { Component } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import { TextRenderer as Text } from '../../components/TextRenderer';
import BankTheme from '../../utils/bankTheme';

const getCurrentHour = () => {
  return /(\d{1,2}):\d{1,2}:\d{1,2}/.exec(Date().toLocaleString())[1];
};

export default class LoadingScreen extends Component {
  static options = {
    navigationBar: {
      visible: false,
    },
    layout: {
      backgroundColor: BankTheme.color1,
    },
  };

  get greeting() {
    let currentHour = getCurrentHour();
    if (currentHour >= 6 && currentHour < 12) {
      return 'Доброе утро';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Добрый день';
    } else if (currentHour >= 18 && currentHour < 23) {
      return  'Добрый вечер';
    } else {
      return 'Доброй ночи';
    }
  }

  render() {
    return (
        <View
          style={{ paddingTop: 44, justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%', zIndex: 1, backgroundColor: BankTheme.color1 }}
        >
          <Image source={{uri: BankTheme.images.loginPageLogo}}
                 style={{ width: 250, height: 49, zIndex: 5 }} />

          <View style={{ flex: 2, alignItems: 'center', justifyContent: 'space-around', zIndex: 5 }}>
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100, fontSize: 22 }}>
              {this.greeting}
            </Text>
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        </View>

    );
  }
}
