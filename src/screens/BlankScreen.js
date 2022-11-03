import React, {Component} from 'react';
import {StyleSheet, View, Image, Text, Animated, Dimensions, Slider, ActivityIndicator, Platform} from 'react-native';

export default class BlankScreen extends Component {
  render () {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 999, backgroundColor: Platform.OS !== 'ios' ? 'rgba(255,255,255,.85)' : 'transparent'}}>
        <Text style={{fontWeight: '500', fontSize: 20, marginBottom: 20}}>Интернет соединение недоступно..</Text>
        <ActivityIndicator size={'large'}/>
      </View>
    );
  }

}
