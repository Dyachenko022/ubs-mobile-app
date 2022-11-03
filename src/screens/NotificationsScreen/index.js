import { connect } from 'react-redux';
import NotificationsScreen from './NotificationsScreen'
import {getNotifications, readMessage, getUnreadNotifications } from '../../api/actions';
import { deleteNotification, setMessageRead } from '../../reducers/notifications/actions';
import { setFilter } from '../../reducers/notifications/actions';
import { pushScreen } from '../../utils/navigationUtils';

const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
  isLoading: state.notifications.isLoading,
  filter: state.notifications.filter,
  unreadMessages: state.notifications.unreadMessages,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  getNotifications: (filterObj) => dispatch(getNotifications(filterObj)),
  setFilter: (filterObj) => dispatch(setFilter(filterObj)),
  getUnreadNotifications: () => dispatch(getUnreadNotifications()),
  writeToBank: () => {
    pushScreen({
      componentId: ownProps.componentId,
      screenName: 'unisab/Document',
      passProps: {
        sid: 'UBS_MESSAGE',
      },
      title: 'Документ',
    });
  },
  getAttachments: async (guid) => {
    const response = await dispatch(readMessage(guid));
    if (response.files) {
      return response.files.map((item) => ({
        fileName: item[1],
        fileUrl: item[0],
      }))
    }
    return [];
  },
  setMessageRead: (guid) => dispatch(setMessageRead(guid)),
  deleteNotification: (guid) => dispatch(deleteNotification(guid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
