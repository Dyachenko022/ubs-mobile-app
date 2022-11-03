import {getPersonalOffers, changePersonalOfferState, getPersonalOfferDescription} from "../../api/actions";

export const CLEAR_OFFER_DESCRIPTION = 'personaloffers/cleaofferdescription';

export function setStatusOfferRead(offerId) {
  return (dispatch) => {
    return dispatch(changePersonalOfferState(offerId, 4))
      .then(() => dispatch(getPersonalOffers()));
  }
}

export function setStatusOfferDeclined(offerId) {
  return (dispatch) =>
    dispatch(changePersonalOfferState(offerId, 3))
      .then(() => dispatch(getPersonalOffers()));

}

export function getOfferDescription(offerId) {
  return async (dispatch) => {
    await dispatch({type:CLEAR_OFFER_DESCRIPTION });
    await dispatch(getPersonalOfferDescription(offerId));
  }
}

export function updatePersonalOffers() {
  return (dispatch) => dispatch(getPersonalOffers());
}
