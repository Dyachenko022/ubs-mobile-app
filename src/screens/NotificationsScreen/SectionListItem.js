import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import BankTheme from '../../utils/bankTheme';
import ClipIcon from '../../../assets/icons/clip.svg';
import MsiInIcon from '../../../assets/icons/msgIn.png';
import MsgOutIcon from '../../../assets/icons/msgOut.png';

export default function SectionListItem(props) {
  return (
    <TouchableOpacity style={styles.container}
                      onLongPress={props.onLongPress}
                      onPress={props.onPress}
    >
      {props.notification.type === 'notification' ? notificationView(props) : messageView(props)}
    </TouchableOpacity>
  )
}

function messageView(props) {
  const time = moment(props.notification.time).format('HH:mm');
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center', }}>
          <View style={{width: 24, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={props.notification.type === 'messageIn' ? MsiInIcon : MsgOutIcon}
                   resizeMode="cover"
                   style={styles.image}/>
          </View>
          <Text>
            {time}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 24, alignItems: 'center', justifyContent: 'center'}}>
            {props.notification.unread && (
              <View style={{width: 6, height: 6, borderRadius: 4, backgroundColor: BankTheme.color1}} />
            )}
          </View>
          <Text style={props.notification.unread ? styles.textUnread : styles.text}>
            {props.notification.title}
          </Text>
        </View>
      </View>
      <View style={{width: 20,  justifyContent: 'center'}}>
        {props.notification.hasAttachments && (
          <ClipIcon fill="black" height={16} width={16} color={BankTheme.color1}/>
        )}
      </View>
    </View>
  )
}

function notificationView(props) {
  const time = moment(props.notification.time).format('HH:mm');
  return (
    <>
      <Text style={styles.typeOfNotification}>{props.notification.typeOfNotification}</Text>
      <Text style={styles.textOfNotification}>{props.notification.text}</Text>
      <Text style={styles.notificationTime}>{time}</Text>
    </>
  )
}

SectionListItem.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  notification: PropTypes.shape({
    guid: PropTypes.string,
    type: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    unread: PropTypes.bool,
    time: PropTypes.string,
    typeOfNotification: PropTypes.string,
    hasAttachments: PropTypes.bool,
  }),
}

const styles = {
  container: {
    marginBottom: 5,
    padding: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    width: '100%',
    borderBottomColor: 'lightgray',
  },
  textOfNotification: {
    paddingLeft: 15,
  },
  image: {
    width: 18,
    height: 18,
  },
  notificationTime: {
    width: '100%',
    paddingRight: 15,
    textAlign: 'right',
  },
  text: {
    flex: 1,
    paddingBottom: 7,
  },
  textUnread: {
    flex: 1,
    fontWeight: 'bold',
    paddingBottom: 7,
  },
  typeOfNotification: {
    fontSize: 11,
    paddingBottom: 5,
  }
}
