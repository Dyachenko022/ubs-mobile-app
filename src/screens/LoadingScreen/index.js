import {connect} from 'react-redux';
import {changeAppRoot} from '../../reducers/routing/actions';
import {advertising, getBonuses, listDocuments, listServicePayment, operationsProduct, sync, sendRequestServicePayment} from "../../api/actions";
import {Alert} from 'react-native';
import LoadingScreen from './LoadingScreen'
import moment from "moment";

const listDocumentsParams = {
  "dateFrom": "01.01.2222",
  "dateTo": "01.01.2222",
  "source": "",
  "amount": 0,
  "currency": "",
  "recipient": "",
  "showFavorite": 0,
  "stateCode": [],//gri-
  "sidDoc": "",
  "pageRows": 20,
  "pageNum": 1
};


const mapDispatchTopProps = (dispatch) => ({
  initialize: () => {

  },
  login: () => {
    dispatch(changeAppRoot('after-login'));
  }
});

const mapStateToProps = (state) => ({
  cardsLoading: state.myBankPage.cardsLoading,
  depositsLoading: state.myBankPage.depositsLoading,
  accountsLoading: state.myBankPage.accountsLoading,
  creditsLoading: state.myBankPage.creditsLoading,
ABC: state.paymentsPage.ABC,
uidRequestSend: state.paymentsPage.uidRequestSend,
  loading: //state.myBankPage.sync
    // || state.paymentsPage.loadingServicePayment
    /*|| */state.historyPage.refreshing
    || state.bonusesPage.loading
});

export default connect(mapStateToProps, mapDispatchTopProps)(LoadingScreen);
