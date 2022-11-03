import React from 'react';
import styles from "./styles";

import {View} from 'react-native';
import TouchableOpacity from '../Touchable';
import {TextRenderer as Text} from '../TextRenderer';
import Icon from 'react-native-vector-icons/Ionicons';

export default class OperationButton extends React.Component {
  render(){
    return(
      <View style={styles.operationButton}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={'ios-pizza-outline'} size={20}/>
          <Text style={styles.operationButtonText}>{this.props.text}</Text>
        </TouchableOpacity>

        <View style={styles.operationButtonLine}/>
      </View>
    )
  }
}
