import React from 'react';
import PropTypes from 'prop-types';
import {Image, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import {TextRenderer as Text} from '../../../components/TextRenderer';

export default function PressableWithArrow(props) {
  return (
    <View style={styles.section}>
      <TouchableOpacity style={{
        ...styles.sectionHeaderWrapper,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
        onPress={props.onPress}
      >
        <View style={{width: '85%'}}>
          <Text style={styles.sectionHeader}>
            {props.text}
          </Text>
          {props.description && (
            <Text style={styles.secondRowText}>
              {props.description}
            </Text>
          )}
        </View>
        <Image source={require('../../../../assets/icons/buttons/arrow_right.png')}/>
      </TouchableOpacity>
    </View>
  )
}

PressableWithArrow.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  description: PropTypes.string,
}
