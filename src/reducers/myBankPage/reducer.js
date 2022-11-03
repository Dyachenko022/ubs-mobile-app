import {ProductPage, LoginPage, MyBankPage as types} from "../../api/actionTypes";
export const UPDATE = 'MyBank/Update';

const initialState = {
  cards: [],
  deposits: [],
  accounts: [],
  credits: [],

  update: true,
  cardsLoading: true,
  depositsLoading: true,
  creditsLoading: true,
  accountsLoading: true,

  sync: false
};

export default function mapPage(state = initialState, action = {}) {
  switch (action.type) {
    case LoginPage.EXIT_SUC:
      return {...initialState};

    case types.GET_CARDS_SUC:

      let cards = action.response.cards;
      const additionalCards = cards.filter((card) => card.idParent > 0);
      cards = cards.filter((card) => card.idParent === 0);
      additionalCards.forEach((addCard) => {
        const indexAddCard = cards.findIndex((item) => item.id === addCard.idParent);
        if (indexAddCard > -1) {
          cards.splice(indexAddCard + 1, 0, {...addCard, isAdditionalCard: true});
        } else cards.splice(indexAddCard + 1, 0, addCard); // Если главная карта у доп.карты не принадлежит клиенту, то отображаем доп.карту как обычную
      });

      return {
        ...state,
        cards,
        cardsLoading: false
      };

    case types.GET_DEPOSITS_SUC:
      return {
        ...state,
        deposits: action.response.deposits.map(e => ({...e, productType: 'deposits'})),
        depositsLoading: false
      };
    case types.GET_ACCOUNTS_SUC:
      return {
        ...state,
        accounts: action.response.accounts.map(e => ({...e, productType: 'accounts'})),
        accountsLoading: false
      };

    case types.GET_CREDITS_SUC:
      return {
        ...state,
        credits: action.response.credits,
        creditsLoading: false
      };

    case types.GET_CARDS_REQ:
      return {
        ...state,
        cardsLoading: true,
      };
    case types.GET_DEPOSITS_REQ:
      return {
        ...state,
        depositsLoading: true,
      };
    case types.GET_CREDITS_REQ:
      return {
        ...state,
        creditsLoading: true
      };
    case types.GET_ACCOUNTS_REQ:
      return {
        ...state,
        accountsLoading: true
      };

    case ProductPage.SetDescriptionProduct_SUC:
      let type = '';
      switch (action.code) {
        case 'PLCARD':
          type = 'cards';
          break;
        case 'LOAN':
          type = 'credits';
          break;
        case 'FDEP':
          type = 'deposits';
          break;
        case 'OD':
          type = 'accounts';
          break;
        default:
          break;
      }

      let idx = 0;
      let newArr = [...state[type]];
      let newProduct = {...state[type].find( (el, index) => {if (el.id === action.id) {idx = index; return true} })};
      newProduct.description = action.description;

      newArr[idx] = newProduct;


      return {...state, [type]: newArr};


    case UPDATE:
      return {...state, update: !state.update}

    case types.SYNC_REQ:
      return {...state, sync: true}

    case types.SYNC_SUC:
    case types.SYNC_FAI:
      return {...state, sync: false}

    default:
      return state;
  }
}
