import React from 'react';
import PropTypes from 'prop-types';
import {
  RefreshControl, SectionList, View, Text,
  SafeAreaView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import RadioButtonWidthBadge from '../../components/buttons/RadioButtonWithBadge';
import moment from 'moment';
import BankTheme from '../../utils/bankTheme';
import FunnelIcon from '../../../assets/icons/funnel.png';
import Filter from './Filter';
import { Navigation } from 'react-native-navigation';
import SectionListItem from './SectionListItem';
import NotificationExtended from './NotificationExtended';
import NotificationActions from './NotificationActions';
import {makeLeftBackButton} from '../../utils/navigationUtils';

export default class NotificationsScreen extends React.Component {

  static options = ({
    bottomTabs: {
      visible: false,
    },
    topBar: {
      title: {
        text: 'Уведомления',
      }
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      isNotificationsSelected: true,
      isFilterVisible: false,
      isIncomingSelected: true,
      isSentSelected: true,
      selectedNotification: null,
      isNotificationExtendedVisible: false,
      blockOnEndReached: true,
    }
  }

  componentDidMount() {
    this.navigationEvents = Navigation.events().bindComponent(this);
    this.setFilterButton();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.filter.type !== this.props.filter.type) {
      this.setFilterButton();
    }
  }

  setFilterButton = () => {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        leftButtons: [
          makeLeftBackButton('notification_back_pressed')
        ],
        rightButtons: this.props.filter.type === 'messages' ? [{
          id: 'notificationsScreen_filter',
          icon: FunnelIcon,
        }
        ] : [],
      },
    });
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  componentDidAppear() {
    this.props.getNotifications();
    this.setState({blockOnEndReached: false});
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'notificationsScreen_filter') {
      this.setState({ isFilterVisible: true});
    } else if (buttonId === 'notification_back_pressed') {
      Navigation.dismissModal(this.props.componentId);
    }
  }

  setFilterAndFetch = (objFilter) => {
    this.setState({blockOnEndReached: true});
    this.props.setFilter(objFilter);
    this.props.getNotifications();
    setTimeout(() => this.setState({blockOnEndReached: false}), 1000);
  }

  onLongPress = (item) => {
    this.ActionSheet.show(item);
  }

  onRefresh = () => {
    const filter = { ...this.props.filter, numPages: 1, pageRows: 20 * this.props.filter.numPages};
    this.props.getNotifications(filter);
  }

  renderData = ({ item }) => {
    return (
      <SectionListItem
        notification={item}
        onPress={() => item.type !== 'notification' && this.setState({ isNotificationExtendedVisible: true, selectedNotification: item})}
        onLongPress={() => this.onLongPress(item)}
      />
    );
  }

  renderSectionHeader = ({ section }) => {
    return (
      <View style={{width: '100%', padding: 5, alignItems: 'center', backgroundColor: 'white',}}>
        <Text style={{ color: BankTheme.color1, fontSize: 18, }}>
          {moment(section.title).calendar(null, {
            sameDay: '[Сегодня]',
            lastDay: '[Вчера]',
            lastWeek: 'DD MMM YYYY',
            sameElse: 'DD MMM YYYY'
          })}
        </Text>
      </View>
    );
  }

  onFilterClose = () => {
    this.setState({ isFilterVisible: false});
    let filter = '';
    if (this.state.isSentSelected && this.state.isIncomingSelected) filter = 'all';
    else if (this.state.isSentSelected) filter = 'sent';
    else filter = 'incoming';
    this.setFilterAndFetch({filter,});
  }

  render() {
    const isNotificationsSelected = this.props.filter.type === 'notifications';
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', padding: 15,}}>
          <RadioButtonWidthBadge title="Уведомления"
                       isPressed={isNotificationsSelected}
                       onPress={() => {
                         if (this.props.isLoading) return;
                         this.setFilterAndFetch({ type: 'notifications', numPages: 1, pageRows: 20 });
                       }}
                       containerStyle={{marginRight: 15}}
          />
          <RadioButtonWidthBadge title="Сообщения"
                       isPressed={!isNotificationsSelected}
                       onPress={() =>{
                         if (this.props.isLoading) return;
                         this.setFilterAndFetch({ type: 'messages', numPages: 1, pageRows: 20 });
                       }}
                       badgeLabel={this.props.unreadMessages > 0 ? this.props.unreadMessages : ''}
          />
        </View>

        {this.props.notifications.length > 0 ? (
          <>
            <SectionList
              sections={this.props.notifications}
              keyExtractor={(item, index) => item.title + index}
              renderItem={this.renderData}
              renderSectionHeader={this.renderSectionHeader}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (this.props.isLoading || this.state.blockOnEndReached) return;
                const z = this.props.notifications.reduce((accum, current) => accum + current.data.length, 0);
                if (z > 10) {
                  this.setFilterAndFetch({numPages: this.props.filter.numPages + 1});
                }
              }}
              refreshing={this.props.isLoading}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.isLoading}
                  onRefresh={this.onRefresh}
                />
              }
              ListFooterComponent={() => {
                if (this.props.isLoading) return null;
                return (
                  <Text style={styles.noMoreMessages}>
                    {isNotificationsSelected ? 'Уведомлений' : 'Сообщений'} больше нет
                  </Text>
                );
              }
              }
            />
            {this.props.filter.type === 'messages' && (
              <TouchableOpacity style={styles.buttonWriteToBank} onPress={this.props.writeToBank}>
                <Text style={{color: 'white'}}>Написать в банк</Text>
              </TouchableOpacity>
            )}
            <NotificationExtended
              notification={this.state.selectedNotification}
              isVisible={this.state.isNotificationExtendedVisible}
              getAttachments={this.props.getAttachments}
              setMessageRead={this.props.setMessageRead}
              onClose={() => {
                this.setState({selectedNotification: null, isNotificationExtendedVisible: false});
              }}
            />
            <NotificationActions
              ref={o => this.ActionSheet = o}
              deleteNotification={this.props.deleteNotification}
            />
          </>
        ) :
          <>{this.props.isLoading ?
              <ActivityIndicator size="large" />
              :
              <Text style={styles.textNoNotifications}>
                {`${isNotificationsSelected ? 'Уведомлений' : 'Сообщений'} пока нет`}
              </Text>
          }</>
        }
        <Filter
          isVisible={this.state.isFilterVisible}
          isSentSelected={this.state.isSentSelected}
          isIncomingSelected={this.state.isIncomingSelected}
          onSentButtonPressed={() => this.setState({isSentSelected: !this.state.isSentSelected})}
          onIncomingButtonPressed={() => this.setState({isIncomingSelected: !this.state.isIncomingSelected})}
          onClose={this.onFilterClose}
        />
      </SafeAreaView>
    );
  }
}

NotificationsScreen.propTypes = {
  isLoading: PropTypes.bool,
  getNotifications: PropTypes.func,
  setFilter: PropTypes.func,
  getUnreadNotifications: PropTypes.func,
  unreadMessages: PropTypes.number,
  writeToBank: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.shape({
      guid: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string,
      unread: PropTypes.bool,
      time: PropTypes.string,
      typeOfNotification: PropTypes.string,
      hasAttachments: PropTypes.bool,
    })),
  })),
  filter: PropTypes.shape({
    type: PropTypes.string,
    filter: PropTypes.string,
    showSent: PropTypes.bool,
    pageRows: PropTypes.number,
    numPages: PropTypes.number,
  }),
}

const styles = StyleSheet.create({
  buttonWriteToBank: {
    width: '100%',
    height: 45,
    backgroundColor: BankTheme.color1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNoNotifications: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    width:'100%',
    paddingTop: 40,
  },
  noMoreMessages: {
    width: '100%', marginTop: 10, textAlign: 'center', fontSize: 18,
  }
});
