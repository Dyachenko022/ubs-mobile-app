import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, View, Text } from 'react-native';

export default function CvvCodeOutput(props) {
  const [timeoutId, setTimeoutId] = useState(null);

  const onShowCodePressed = () => {
    clearTimeout(timeoutId);
    if (!props.cvvCodeShown)  {
      props.getUnmaskedCode();
      const timoutId = setTimeout(() => props.clearCvvCode(), 10000);
      setTimeoutId(timoutId);
    }
    else props.clearCvvCode();
  }

  return (
    <View style={{flexDirection: 'row', alignItems: 'center',}}>
      <TouchableOpacity style={{paddingRight: 10,}} onPress={onShowCodePressed}>
        <Image source={props.cvvCodeShown ? require('../../../../assets/icons/eye.png') : require('../../../../assets/icons/crossedEye.png')}
               style={{width:25, height: 25}}
        />
      </TouchableOpacity>
      <TouchableOpacity onLongPress={props.copyCode} disabled={!props.cvvCodeShown}>
        <Text>
          {props.cvvCode || '***'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

CvvCodeOutput.propTypes = {
  copyCode: PropTypes.func,
  getUnmaskedCode: PropTypes.func,
  clearCvvCode: PropTypes.func,
  cvvCode: PropTypes.string,
  cvvCodeShown: PropTypes.bool,
};

CvvCodeOutput.defaultProps = {
  cvvCode: '***',
  cvvCodeShown: PropTypes.bool,
}
