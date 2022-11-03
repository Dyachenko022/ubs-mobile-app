import {personalOffers as apiActions} from "../../api/actionTypes";
import {CLEAR_OFFER_DESCRIPTION} from './actions';


const initialState = {
  personalOffers: [],
  unreadOffers: 0,
  offerDescription: {},
  wasOfferDescriptionFetched: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case apiActions.SUC:
      const offers = action.payload.offers;
      const unreadOffers = offers.filter(offer => offer.status === 1).length;
      return {
        ...state,
        unreadOffers,
        personalOffers: offers,
      }
    case CLEAR_OFFER_DESCRIPTION:
      return {
        ...state,
        wasOfferDescriptionFetched: false,
        offerDescription: {},
      }
    case apiActions.OFFER_DESCRIPTION_SUC: {
      return {
        ...state,
        wasOfferDescriptionFetched: true,
        offerDescription: {
          id: action.payload.id,
          title: action.payload.title,
          logo: action.payload.logo,
          dateEnd: action.payload.dateEnd,
          description: action.payload.description,
          category: action.payload.category,
          actionType: action.payload.actionType,
          actionParam: action.payload.actionParam,
          linkInfo: action.payload.linkInfo,
          nameButtonInfo: action.payload.nameButtonInfo,
          nameButtonAction: action.payload.nameButtonAction,
          state: action.payload.state,
          stateName: action.payload.stateName,
          appeal: action.payload.appeal,
        }
      }
    }
  }
  return state;
}
