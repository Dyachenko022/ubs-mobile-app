import React from "react";
import { View, TouchableOpacity, Platform } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'
import BankTheme from "../../utils/bankTheme";

import { pushScreen } from "../../utils/navigationUtils";

const IconQRCode = (props) => {
  return (
    <TouchableOpacity
      style={{
        paddingRight: Platform.OS === 'ios' ? 0 : 10,
      }} 
      onPress={() => {
       pushScreen({
                    componentId: props.parentComponentId,
                    screenName: 'unisab/Document',
                    passProps: {
                      sid: 'UBS_PAYMENT_QR'
                    },
                });
    }}>
      <View style={{
        backgroundColor: '#fff',
        width: 30,
        height: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon name='qrcode' 
              size={20} 
              color={BankTheme.color1} />
      </View>
    </TouchableOpacity>
  )
}

export default IconQRCode;
