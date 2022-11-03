import React from 'react';
import {TouchableOpacity, View, Platform} from 'react-native';
import {Image, Badge,} from 'react-native-ui-lib';

export default function TopBarIcon(props) {
  return (
      <TouchableOpacity
        style={{ marginRight: 7, height:'100%', justifyContent:'center',alignItems: 'center',
          zIndex: 200, left: Platform.OS === 'ios' ? 15 : 0,
          paddingRight: Platform.OS === 'ios' ? 0 : 10,
        }} //Я не знаю зачем здесь З-индекс, но кнопка будет скрываться на Андроиде без него
        onPress={props.openOffersList}
      >
        <View
          style={{width: 30, height: 30, backgroundColor: props.backgroundColor ? props.backgroundColor : 'white',borderRadius: 30, alignItems: 'center', justifyContent: 'center'}}
        >
        {props.count ?
          <Badge
            label={props.count}
            size={"small"}
            backgroundColor={"red"}
            style={{position: 'absolute', left: '65%', top: -4, zIndex: 200}}
          /> : null
        }
        <Image
          style={{width: 24, height:24,margin: 0,}}
          source={props.icon}
        />
        </View>
      </TouchableOpacity>
  );
}
