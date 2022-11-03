import PersonalOfferScreen from './PersonalOfferScreen';
import {connect} from 'react-redux';
import {Navigation} from "react-native-navigation";
import {Platform, View, Linking} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import {setStatusOfferDeclined} from '../../reducers/personalOffers/actions';
import {pushScreen} from '../../utils/navigationUtils';

const mapStateToProps = (state) => {
  return {
    personalOffer: state.personalOffers.offerDescription,
    wasOfferDescriptionFetched: state.personalOffers.wasOfferDescriptionFetched,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { componentId } = ownProps;
  return {
    acceptOffer: (offer) => {
      if (offer.actionType === 'document') {
        pushScreen({
          componentId,
          screenName: 'unisab/Document',
          passProps: {
            sid: offer.actionParam,
            defaultValues: {
              'Идентификатор предложения': offer.id,
            },
          },
        });
      }else {
        Linking.openURL(offer.actionParam)
      }
    },
    refuseOffer: (offer) => {
      dispatch(setStatusOfferDeclined(offer.id)); //Запрос на изменение состояния
      Navigation.popToRoot(componentId);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalOfferScreen);