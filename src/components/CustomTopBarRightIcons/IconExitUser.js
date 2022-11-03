import React from 'react';
import {TouchableOpacity, View, Platform, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function IconExitUser(props) {

  const onPress = () => {
    Alert.alert(
      '',
      'Вы действительно хотите сменить пользователя?',
      [
        {
          text: 'Нет', onPress: () => {
          }, style: 'cancel'
        },
        {
          text: 'Да', onPress: props.changeCredentials,
        }
      ],
      {cancelable: true}
    );
  }


  return (
    <TouchableOpacity
      style={{ marginRight: 7, height:'100%', justifyContent:'center',alignItems: 'center',
        zIndex: 200, left: Platform.OS === 'ios' ? 15 : 0,
        paddingRight: Platform.OS === 'ios' ? 0 : 10,
      }} //Я не знаю зачем здесь З-индекс, но кнопка будет скрываться на Андроиде без него
      onPress={onPress}
    >
      <View
        style={{width: 30, height: 30,borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}
      >
        <Icon name={'md-log-out'} size={28} color={'#fff'}/>
      </View>
    </TouchableOpacity>
  );
}
