import {GetNotifications, GetUnreadNotifications, LoginPage} from '../../api/actionTypes';
import { SET_FILTER, DELETE_NOTIFICATION, SET_MESSAGE_READ } from './actions';
import moment from 'moment';

const initialState = {
  isLoading: true,
  filter: {
    type: 'notifications',
    filter: 'all',
    pageRows: 20,
    numPages: 1,
  },
  unreadMessages: 0,
  notifications: [],
}

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER:
      let newFilter = {
        ...state.filter,
        ...action.payload,
      }
      return {
        ...state,
       notifications: ((newFilter.type !== state.filter.type) || (newFilter.filter !== state.filter.filter)) ? [] : state.notifications,
       filter: newFilter,
      };
    case GetNotifications.REQ:
      return {
        ...state,
        isLoading: true,
      }
    case GetNotifications.FAI:
      return {
        ...state,
        isLoading: false,
      }
    case GetNotifications.SUC: {
      const fetchedNotifications = action.payload.notifications;
      let mergedNotification = [...state.notifications];

      // Здесь идет объединение, для того, чтобы уведомления с разными pageNum отображались в списке
      for (const notification of fetchedNotifications) {
        const dateOfNotification = Number(moment(notification.time).startOf('day').format('x'));
        let section = mergedNotification.find((item) => item.title === dateOfNotification);
        if (section) {
           const existingNotificationIndex = section.data.findIndex(item => item.guid === notification.guid);
           if (existingNotificationIndex > -1) {
             section.data[existingNotificationIndex] = notification;
           } else {
             section.data.push(notification);
           }
        } else {
          section = {
            title: dateOfNotification,
            data: [notification]
          };
          mergedNotification.push(section);
        }
      }

      mergedNotification.forEach((section) => {
        section.data.sort((not1, not2) => moment(not2.time).isAfter(moment(not1.time)) ? 1 : -1);
      })
      mergedNotification.sort((section1, section2) => section2.title - section1.title);

      return {
        ...state,
        isLoading: false,
        notifications: mergedNotification,
        unreadMessages: action.payload.countUnreadMessages,
      }
    }
    case DELETE_NOTIFICATION: {
      const guid = action.payload;
      let oldNotifications = [...state.notifications];
      for (let i = 0; i< oldNotifications.length; i++) {
        const section = oldNotifications[i];
        const foundNotificationIndex = section.data.findIndex((item) => item.guid === guid);
        if (foundNotificationIndex > -1) {
          section.data.splice(foundNotificationIndex, 1);
          if (section.data.length === 0) {
            oldNotifications.splice(i, 1);
          }
          break;
        }
      }
      return {
        ...state,
        notifications: oldNotifications,
      }
    }
    case SET_MESSAGE_READ: {
      const guid = action.payload;
      let unreadMessages = state.unreadMessages;
      for (const section of state.notifications) {
        const notification = section.data.find(item => item.guid === guid);
        if (notification) {
          notification.unread = false;
          if (unreadMessages > 0 ) unreadMessages = unreadMessages - 1;
          break;
        }
      }
      return {
        ...state,
        unreadMessages,
      }
    }
    case GetUnreadNotifications.SUC:
      return {
        ...state,
        unreadMessages: action.payload,
      }
    case LoginPage.EXIT_REQ:
      return {
        ...initialState
      }
    default:
      return state;
  }
}