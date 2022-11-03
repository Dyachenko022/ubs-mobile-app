import React from 'react';
import {connect} from 'react-redux';
import {
  Platform,
  View,
  TouchableHighlight
} from "react-native";
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from '../../components/TextRenderer/index';
import Icon from 'react-native-vector-icons/Ionicons';

import {CHANGE_TAB} from '../../reducers/messagesPage/actionTypes'
import {getMessages} from '../../api/actions'

import styles from "./styles";
import {Navigation} from 'react-native-navigation';


class MessagesScreenHeader extends React.Component {
  render() {
    let {
      dispatch,
      activeInbox,
      unreadMessagesCount
    } = this.props;

    return (
      <View style={styles.header}>

        <View style={styles.headerButtonsWrapper}>
          <TouchableHighlight
            underlayColor={'rgba(255,255,255,.8)'}
            onPress={() => {
              dispatch({type: CHANGE_TAB, activeTab: 'inbox'})
            }}
            style={[activeInbox ? styles.headerButtonActive : styles.headerButton, {
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5
            }]}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={activeInbox ? styles.headerButtonTextActive : styles.headerButtonText}>Входящие</Text>

              {unreadMessagesCount > 0 && <Text
                style={activeInbox ? styles.headerButtonTextActive : styles.headerButtonText}>
                ({unreadMessagesCount})</Text>}
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            underlayColor={'rgba(255,255,255,.8)'}
            onPress={() => {
              dispatch({type: CHANGE_TAB, activeTab: 'outbox'})
            }}
            style={[!activeInbox ? styles.headerButtonActive : styles.headerButton, {
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              borderLeftWidth: 0
            }]}>

            <Text style={!activeInbox ? styles.headerButtonTextActive : styles.headerButtonText}>Отправленные</Text>

          </TouchableHighlight>
        </View>

        <View style={{width: 50}}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  unreadMessagesCount: state.messagesPage.unreadMessagesCount,
  activeInbox: state.messagesPage.activeTab === 'inbox'
});
export default connect(mapStateToProps)(MessagesScreenHeader);
