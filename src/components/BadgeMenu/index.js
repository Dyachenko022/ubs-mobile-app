import {connect} from 'react-redux';
import BadgeMenu from './BadgeMenu';
import BankTheme from '../../utils/bankTheme';

const mapStateToProps = (state) => ({
  unreadMessagesCount: state.messagesPage.unreadMessagesCount,
  showBadgeUnreadMessages: BankTheme.bankMessagesUsed,
});

export default connect(mapStateToProps)(BadgeMenu);
