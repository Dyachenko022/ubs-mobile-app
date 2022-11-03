import PersonalOffersListScreen from './PersonalOffersListScreen';
import * as personalOffersActions from '../../reducers/personalOffers/actions';
import { connect } from 'react-redux';
import React from "react";
import {pushScreen} from '../../utils/navigationUtils';

const mapStateToProps = (state) => {
  return {
    personalOffers: state.personalOffers.personalOffers,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {componentId} = ownProps;
  return {
    selectPersonalOffer: (id) => {
      dispatch(personalOffersActions.setStatusOfferRead(id));
      dispatch(personalOffersActions.getOfferDescription(id));

      pushScreen({
        componentId,
        screenName: 'unisab/PersonalOfferScreen',
        title: 'Персональное предложение',
        passProps: {
          offerId: id,
        },
      });
    },
    updatePersonalOffers: () => dispatch(personalOffersActions.updatePersonalOffers()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalOffersListScreen);
