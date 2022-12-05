import React from "react";
import { View, TouchableOpacity } from 'react-native';

import { pushScreen } from "../../utils/navigationUtils";

import BankTheme from "../../utils/bankTheme";

const IconQRCode = (props) => {
  return (
    <TouchableOpacity onPress={() => {
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
        <View style={{
                      backgroundColor: BankTheme.color1, 
                      width: 20, 
                      height: 20, 
                      borderRadius: 5
                    }} />
      </View>
    </TouchableOpacity>
  )
}

export default IconQRCode;
