import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import ArrowRight from '../../../../../assets/icons/arrowRight.svg';

export default function LimitCategoryHeader(props) {

  // Анимация для вращения стрелочки
  const rotateAnim = useRef(new Animated.Value(props.isLimitsShown ? 90 : 0)).current;

  const onHeaderPress = () => {
    Animated.timing(rotateAnim, {
      toValue: props.isLimitsShown ? 0 : 1,
      duration: 250,
      useNativeDriver: true
    }).start();
    props.onPress();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '90deg']
  })

  return (
    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}
                      onPress={onHeaderPress}
    >
      <Text style={{fontSize: 14, paddingBottom: 10, width: '70%'}} numberOfLines={1} ellipsizeMode="tail">
        {props.limitsName}
      </Text>

      <View style={{flexDirection: 'row', width: '30%', justifyContent: 'flex-end'}}>
        <Text style={{fontSize: 10, paddingBottom: 10, paddingRight: 5, color: props.isLimitsSet ? 'green' : 'gray'}}>
          {props.isLimitsSet ? 'Установлен' : 'Не установлен'}
        </Text>

        <Animated.View
          style={{
            width: 16,
            height: 16,
            paddingRight: 5,
            transform: [
              { rotate: spin },
            ]
          }}>
          <ArrowRight width={16} height={16} fill={"gray"}/>
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
}

LimitCategoryHeader.propTypes ={
  limitsName: PropTypes.string,
  isLimitsShown: PropTypes.bool,
  isLimitsSet: PropTypes.bool,
  onPress: PropTypes.func,
}