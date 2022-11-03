import React from 'react';
import {connect} from 'react-redux';
import moment from "moment/moment";

import {
  Linking,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image,
  Platform
} from "react-native";
import TouchableOpacity from '../../components/Touchable';
import HTML from 'react-native-render-html';
import {TextRenderer as Text} from '../../components/TextRenderer';
import Collapsible from '../../components/Collapsible';

import styles from "./styles";
import {readMessage, readOutMessage, stateMessage} from "../../api/actions";
import {SET_UNREAD_MESSAGES_COUNT} from "../../reducers/messagesPage/actionTypes";
import BankTheme from '../../utils/bankTheme';
import FileAttachment from '../../components/FileAttachment';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this._onPressMsg = this._onPressMsg.bind(this);

    this._collapsibleRenderer = this._collapsibleRenderer.bind(this);
    this._filesRenderer = this._filesRenderer.bind(this);

    this.state = {
      collapsed: true,
      readState: this.props.item.state,
      startLoading: false,
      isOutMsg: this.props.isOutMsg
    }

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.startLoading && !nextProps.loading && prevState.collapsed) {return {collapsed: false}}
    if (nextProps.isOutMsg !== prevState.isOutMsg) { return {collapsed: true}}
    return null;
  }

  render() {
    let {
      globLoading,
      isOutMsg,
      item,
      loading
    } = this.props;
    let {readState, collapsed} = this.state;

    return(
      <View style={styles.listItem}>
        <TouchableOpacity style={styles.itemBtn} onPress={this._onPressMsg}>
          <View>
            <Text style={styles.title}>{item.title || item.kindDoc}</Text>
            {item.stateName && <Text style={styles.state}>{item.stateName}</Text>}
            <Text style={styles.date}>{item.date}</Text>
          </View>
          {
            readState === '0' && <View style={{width: 12, height: 12, borderRadius: 6, backgroundColor: BankTheme.color1}}/>
          }
          {
            loading && <ActivityIndicator size={'small'} color={BankTheme.color1} style={{marginLeft: 10}}/>
          }
        </TouchableOpacity>

        <Collapsible
          collapsed={collapsed}
          style={{
            flex: 1,
            justifyContent: 'space-between'
          }}
        >
          {
            this._collapsibleRenderer()
          }
        </Collapsible>
      </View>
    )
  }

  _onPressMsg() {
    let {
      dispatch,
      isOutMsg,
      item
    } = this.props;

    let readFunc =
      isOutMsg !== "inbox" ?
        () => dispatch(readOutMessage(item))
        :
        () => dispatch(readMessage(item.guid));

    if (this.state.collapsed) {
      this.setState({
        startLoading: true
      }, readFunc)
    } else {
      this.setState({
        collapsed: true,
        startLoading: false
      })
    }

    if (isOutMsg === "inbox" && item.state === '0' && this.state.readState === '0') {
      this.setState({
        readState: '1'
      }, () => {
        dispatch(stateMessage(item.guid, 1));
        dispatch({type: SET_UNREAD_MESSAGES_COUNT, unreadMessagesCount: this.props.unreadMessagesCount - 1});
      })
    }
  }

  _collapsibleRenderer() {
    let {isOutMsg, item, msgInfo} = this.props;

    if (isOutMsg === "inbox") {
      return (
        <View style={styles.fullTextContainer}>
          <>

            <Text style={{fontWeight: 'bold', paddingBottom: 5}}>
              Сообщение:
            </Text>

            {!!item.description &&
              <HTML
                classesStyles={{
                  in_container: {
                    color: 'gray',
                    paddingLeft: 5,
                  }
                }}
                key={'msg-html-description'}
                containerStyle={{backgroundColor: 'transparent', flex: 1, color: 'green'}}
                html={`<div class="in_container">${item.description}</div>`}
                onLinkPress={(e, url) => Linking.openURL(url)}
              />
            }

            {!!msgInfo && !!msgInfo.files && !!msgInfo.files.length &&
              msgInfo.files.map((file) => this._filesRenderer(file[1], file[0]))}
          </>
        </View>
      )
    } else if (!!msgInfo) {
      return (
        <View style={styles.fullTextContainer}>
          {[
            !!msgInfo.message &&
            <HTML
              key={'msg-html-description'}
              containerStyle={{backgroundColor: 'transparent', flex: 1}}
              html={msgInfo.message}
              onLinkPress={(e, url) => Linking.openURL(url)}
            />,

            !!msgInfo.files && !!msgInfo.files.length &&
            msgInfo.files.map((file) => this._filesRenderer(file.name, file.file))
          ]}
        </View>
      )
    }

  }

  _filesRenderer(fileName, fileUrl) {
    if (fileName) {
      return <FileAttachment
        fileName={fileName}
        fileUrl={fileUrl}
        />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  let id = ownProps.item.guid || String(ownProps.item.id);
  let loading = String(state.messagesPage.loadingMessage) === id;

  return {
    unreadMessagesCount: state.messagesPage.unreadMessagesCount,
    loading: loading,
    globLoading: state.messagesPage.loading,
    msgInfo: state.messagesPage.msgInfo[id]
  }
};
export default connect(mapStateToProps)(Message);
