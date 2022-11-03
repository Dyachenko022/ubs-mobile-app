import React from 'react';
import { StyleSheet, View, Image, Button, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

export default class Currency extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.header}>{this.props.title}</Text>
        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <Text style={styles.currencyText}>{this.props.buy}₽</Text>
            <Text style={styles.text}>покупка</Text>
          </View>
        </View>

        <View style={styles.rowWrapper}>
          <View style={styles.row}>
            <Text style={styles.currencyText}>{this.props.sell}₽</Text>
            <Text style={styles.text}>продажа</Text>
          </View>
        </View>
      </View>
    )
  }
}