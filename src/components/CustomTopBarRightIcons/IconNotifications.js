import TopBarIcon from './TopBarIcon';
import {connect} from 'react-redux';
import {pushScreen, showModal} from '../../utils/navigationUtils';
import AlarmIcon from '../../../assets/icons/alarm.png';

const mapStateToProps = (state) => {
  return {
    count: state.notifications.unreadMessages,
    icon: AlarmIcon,
  }
}

const mapDispatchToProps = (dispatchProps, ownProps) => {
  return {
    openOffersList: () => {
      showModal({
        title: 'Уведомления',
        showBackButtonTitle: false,
        screenName: 'unisab/NotificationsScreen',
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBarIcon);
