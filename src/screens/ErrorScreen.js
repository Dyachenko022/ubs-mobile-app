import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Dimensions, StyleSheet, View, ScrollView, Text,  SafeAreaView } from 'react-native';

import {Errors as types} from '../api/actionTypes'


export default class ErrorScreen extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <View style={{height: 300, borderWidth: 1, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', }}>
        <Text style={{fontWeight: '500', fontSize: 18, textAlign: 'center'}}>
          { this.props.errorText }
        </Text>
      </View>
    );
  }
}
