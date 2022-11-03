import React from 'react';
import { connect } from 'react-redux';
import { pushScreen } from '../../utils/navigationUtils';
import { getMessages, getOutcomeMessages } from '../../api/actions'

import {
  FlatList,
  View, SafeAreaView,
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import { TextRenderer as Text } from '../../components/TextRenderer';

import MessagesScreenHeader from './Header'
import Message from './Message'
import styles from './styles';
import { CHANGE_TAB } from "../../reducers/messagesPage/actionTypes";


class MessagesScreen extends React.Component {

  static options =  {
    bottomTabs: {
      visible: false,
    },
    topBar: {
      title: {
        component: {
          name: 'unisab/CustomTopBar',
          passProps: {
            innerComponent:
              <MessagesScreenHeader
              />
          }
        }
      }
    }
  }

  constructor(props) {
    super(props);
    this._getMessages = this._getMessages.bind(this);
    this._getOutMessages = this._getOutMessages.bind(this);

    this._renderItem = this._renderItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);

    this._onRefresh = this._onRefresh.bind(this);

    this.state = {
      loading: true,//false,

      outPageRows: 20,
      outPageNum: 1,
    }
  }


  componentDidMount() {
    this.props.dispatch({ type: CHANGE_TAB, activeTab: 'inbox' });
    this._getMessages();
  }

  componentDidUpdate(prevProps) {
    const isTabChanged = prevProps.activeTab !== this.props.activeTab;
    if (isTabChanged) {
      switch (this.props.activeTab) {
        case 'inbox':
          this._getMessages();
          break;
        case 'outbox':
          this._getOutMessages();
          break;
        default:
          break;
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f5f7' }}>
        <FlatList style={styles.list}
          data={this.props.messages}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}

          refreshing={this.props.loading}
          onRefresh={this._onRefresh}
        />
        <TouchableOpacity
          onPress={() =>
            pushScreen({
              componentId: this.props.componentId,
              screenName: 'unisab/Document',
              passProps: {
                sid: 'UBS_MESSAGE',
              },
              title: 'Документ',
            })
          }
          style={styles.write}
          activeOpacity={.8}
        >
          <Text style={styles.writeText}>
            Написать в банк
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    )
  }

  _getMessages() {
    this.props.dispatch(getMessages());
  }

  _getOutMessages() {
    let params = {
      "sidDoc": "UBS_MESSAGE",
      'stateCode': [],
      "pageRows": this.state.outPageRows,
      "pageNum": this.state.outPageNum,
      "dateFrom": "01.01.2222",
      "dateTo": "01.01.2222"
    };

    this.props.dispatch(getOutcomeMessages(params));
  }

  _renderItem({ item }) {
    return (
      <Message
        item={item}
        isOutMsg={this.props.activeTab}
      />
    )
  }

  _keyExtractor = (item) => item.id && item.id + '' || item.guid;

  _onRefresh() {
    this.setState({
      loading: true
    }, () => {
      this.props.activeTab === 'inbox' ?
        this._getMessages()
        :
        this._getOutMessages()
    });
  }
}


// which props do we want to inject, given the global state?
const mapStateToProps = (state) => ({
  activeTab: state.messagesPage.activeTab,
  messages: state.messagesPage.activeTab === 'inbox' ? state.messagesPage.inMessages : state.messagesPage.outMessages,
  unreadMessages: state.messagesPage.unreadMessages,
  loading: state.messagesPage.loading
});

export default connect(mapStateToProps)(MessagesScreen);
