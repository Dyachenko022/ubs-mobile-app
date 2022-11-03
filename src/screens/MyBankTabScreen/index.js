import { connect } from 'react-redux';
import MyBankScreen from './MyBankTabScreen';
import * as newProductsPageActions from '../../reducers/newProductsPage/actions';
import * as personalOffersActions from "../../reducers/personalOffers/actions";
import { pushScreen, showModal } from '../../utils/navigationUtils';
import {setInitialUrl, setLogonRootTabId} from '../../reducers/routing/actions';
import {getMessages, getPersonalOffers, getUnreadNotifications} from '../../api/actions';
import ParseCustomUrlScheme from '../../utils/ParseCustomUrlScheme';
import BankTheme from '../../utils/bankTheme';
import {Navigation} from 'react-native-navigation';

const mapStateToProps = (state) => ({
  contractDataErrorModalVisible: state.userInfo.checkContractData.visible,
  push: state.userInfo.push,
  cards: state.myBankPage.cards,
  deposits: state.myBankPage.deposits,
  accounts: state.myBankPage.accounts,
  credits: state.myBankPage.credits,
  cardsLoading: state.myBankPage.cardsLoading,
  depositsLoading: state.myBankPage.depositsLoading,
  accountsLoading: state.myBankPage.accountsLoading,
  creditsLoading: state.myBankPage.creditsLoading,
  loadingServicePayment: state.paymentsPage.loadingServicePayment, //ubs
  ABC: state.paymentsPage.ABC,
  uidRequestSend: state.paymentsPage.uidRequestSend,
  productCategories: state.newProductsPage.categories,
  loading: state.myBankPage.cardsLoading
    || state.myBankPage.depositsLoading
    || state.myBankPage.accountsLoading
    || state.myBankPage.creditsLoading
    || state.myBankPage.sync,
  update: state.myBankPage.update,
  categories: state.newProductsPage.categories,
  advertisement: state.loginPage.ad,
  initialUrl: state.routing.initialUrl,
  contractDataWarningVisible: state.userInfo.checkContractData.visible,
  personalOffers: state.personalOffers.personalOffers.filter(offer => offer.status === 1),
  confAccess: state.paymentsPage.configuration,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {dispatch} = dispatchProps;
  const {componentId} = ownProps;
  const {initialUrl} = stateProps;
  return {
    ...stateProps,
    ...ownProps,
    dispatch,
    setLogonRootTabId: () => dispatch(setLogonRootTabId(componentId)),
    getPersonalOffers: () => dispatch(getPersonalOffers()),
    selectCategory: (categoryIndex, categoryName) => {
      dispatch(newProductsPageActions.selectCategory(categoryIndex));
      const showFilterButton = stateProps.productCategories[categoryIndex].filterParam.length > 0;
      pushScreen({
        componentId,
        showBackButtonTitle: false,
        screenName: 'unisab/NewProductsScreen',
        title: categoryName,
        rightButtons: showFilterButton ? [
          {
            icon: require('../../../assets/icons/buttons/settings-icon_7.png'),
            id: 'buttonnewproductssettings',
          }
        ] : [],
      });
    },
    updateLogonComponentId: () => dispatch(setLogonRootTabId(ownProps.componentId)),
    selectPersonalOffer: (id) => {
      dispatch(personalOffersActions.setStatusOfferRead(id));
      dispatch(personalOffersActions.getOfferDescription(id));
      pushScreen({
        componentId,
        showBackButtonTitle: false,
        screenName: 'unisab/PersonalOfferScreen',
        title: 'Персональное предложение',
        passProps: {
          offerId: id,
        }
      })
    },
    getMessages: () => {
      if (BankTheme.pushNotificationsUsed) {
        dispatch(getUnreadNotifications());
      }
      if (BankTheme.bankMessagesUsed) {
        dispatch(getMessages());
      }
    },
    handleOpenWithUrl: async (urlParam) => {
      await Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabId: componentId
        }
      });
      await Navigation.popToRoot(componentId);

      if (initialUrl === 'OPEN_NOTIFICATIONS') {
        showModal({
          screenName: 'unisab/NotificationsScreen',
          title: 'Уведомления',
        });
        dispatch(setInitialUrl(''));
        return;
      }

      const parsedUrl = new ParseCustomUrlScheme(decodeURI(urlParam || initialUrl));
      const defaultValues = {};
      let sid = '';
      let openForm = false;
      let initialSidRequest = undefined;

      if (parsedUrl.pathname.toUpperCase() === '/OPEN_MP_DOCUMENT') {
        parsedUrl.getSearchParameters().forEach((item) => {
          if (item.key === 'sid') {
            sid = item.value;
          } else {
            defaultValues[item.key] = item.value;
          }
        });
        openForm = true;
      } else if (/^\/TOKENINTENT\/.+$/.test(parsedUrl.pathname.toUpperCase())) {
        const paths = parsedUrl.pathname.split('/');
        sid = 'UBS_SBP_M_APP_CONFIRM';
        openForm = true;
        defaultValues['Идентификатор намерения'] = paths[2];
      } else if (parsedUrl.hostname.toLowerCase() === 'qr.nspk.ru') {
        sid = 'UBS_PAYMENT_QR';
        defaultValues['Данные QR-кода'] = `https://${parsedUrl.hostname}${parsedUrl.pathname}${parsedUrl.search}`;
        initialSidRequest = 'ReadParamQR';
        openForm = true;
      } else if (parsedUrl.pathname.toUpperCase() === '/SBP') {
        const p = new URLSearchParams(parsedUrl.search);
        const id = p.get('id');
        if (id) {
          defaultValues['id'] = id;
          sid = 'UBS_TRANSFER_SBP';
        } else {
          sid = 'UBS_TRANSFER_SBP_SETUP';
        }
        openForm = true;
      } else if (parsedUrl.hostname === 'sbp.nspk.ru' && parsedUrl.pathname === '/agreement')  {
        sid = 'UBS_TRANSFER_SBP_SETUP';
        openForm = true;
      } else if (parsedUrl.hostname === 'me2mepull.nspk.ru' && parsedUrl.pathname === '/confirmation') {
        sid = 'UBS_TRANSFER_SBP_SETUP';
        const params = new URLSearchParams(parsedUrl.search);
        defaultValues['Идентификатор банка получателя'] = params.get('id');
        openForm = true;
      }

      if (openForm) {
        pushScreen({
          componentId,
          screenName: 'unisab/Document',
          passProps: {
            sid,
            initialSidRequest,
            defaultValues,
          }
        });
      }
      dispatch(setInitialUrl(''));
    },
  };
}

export default connect(mapStateToProps, null, mergeProps)(MyBankScreen);
