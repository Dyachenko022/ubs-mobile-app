import TopBarIcon from './TopBarIcon';
import {connect} from 'react-redux';
import { pushScreen } from '../../utils/navigationUtils';

const mapStateToProps = (state) => {
  return {
    count: state.personalOffers.unreadOffers,
    icon: require('../../../assets/icons/gift.png'),
  }
}

const mapDispatchToProps = (dispatchProps, ownProps) => {
  return {
    openOffersList: () => {
      pushScreen({
        componentId: ownProps.parentComponentId,
        title: 'Персональные предложения',
        showBackButtonTitle: false,
        screenName: 'unisab/PersonalOffersListScreen',
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBarIcon);