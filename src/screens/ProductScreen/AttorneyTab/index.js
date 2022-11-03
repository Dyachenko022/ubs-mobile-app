import React from 'react';
import {ScrollView, View, ActivityIndicator, TouchableHighlight, TouchableNativeFeedback, Platform} from 'react-native';
import {TextRenderer as Text} from '../../../components/TextRenderer';
import styles from "./styles";
import SwipeOut from '../../../components/SwipeOut'

export default class AttorneyTab extends React.Component {

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        {
          this.props.proxy
            ?
            this.props.proxy.map(el => this._renderProxy(el))
            :
            <Text style={{marginTop: 30, textAlign: 'center', fontWeight: '300'}}>Доверенностей не найдено</Text>
        }
      </ScrollView>
    )
  }

  _renderProxy(data) {
    let swipeButtons = [
      <TouchableHighlight
        onPress={() => {
        }}
        style={{backgroundColor: '#d33f61'}}>
        <View style={styles.swipeOut}>
          <Text style={styles.swipeOutText}>Отозвать</Text>
        </View>
      </TouchableHighlight>
    ];

    return (
      <SwipeOut key={data.number} rightButtons={swipeButtons}>
        <View style={styles.rowWrapper}>
          <Text style={{fontSize: 16}}>{`Доверенность №${data.number} от ${data.dateStart}`}</Text>
          <Text>{`${data.fio}`}</Text>
          <Text>{`Срок действия с ${data.dateStart} до ${data.dateEnd}`}</Text>

          <View style={styles.line}/>
        </View>
      </SwipeOut>
    )
  }
}
