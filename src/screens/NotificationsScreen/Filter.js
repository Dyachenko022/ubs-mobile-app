import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Dialog } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Ionicons';
import InboxIcon from '../../../assets/icons/inbox.svg';
import BankTheme from '../../utils/bankTheme';

export default function Filter(props) {
  return (
    <Dialog
      migrate
      bottom
      visible={props.isVisible}
      containerStyle={styles.dialog}
      width="100%"
      panDirection={'down'}
      onDismiss={props.onClose}
      supportedOrientations={['portrait']} // iOS only
    >
      <View>
        <TouchableOpacity onPress={props.onIncomingButtonPressed} style={styles.row}>
          <View style={styles.textAndIcon}>
            <InboxIcon width={25} height={25} fill={BankTheme.color1}/>
            <Text style={styles.text}>Входящие</Text>
          </View>
          {props.isIncomingSelected &&
            <Icon name={'md-checkmark'} size={25}/>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onSentButtonPressed} style={styles.row}>
          <View style={styles.textAndIcon}>
            <InboxIcon width={25} height={25} fill={BankTheme.color1}/>
            <Text style={styles.text}>Исходящие</Text>
          </View>
          {props.isSentSelected &&
            <Icon name={'md-checkmark'} size={25}/>
          }
        </TouchableOpacity>
      </View>
    </Dialog>
  )
}

Filter.propTypes = {
  isIncomingSelected: PropTypes.bool,
  isSentSelected: PropTypes.bool,
  isVisible: PropTypes.bool,
  onIncomingButtonPressed: PropTypes.func,
  onSentButtonPressed: PropTypes.func,
  onClose: PropTypes.func,
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 200,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 15,
    height: 45,
  },
  textAndIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    paddingLeft: 5,
    paddingTop: 2,
  }
});