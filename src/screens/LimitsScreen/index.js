import LimitsScreen from './LimitsScreen';
import { connect } from 'react-redux';
import { Navigation} from 'react-native-navigation';
import { getLimits, saveLimits, confirmLimits } from '../../reducers/limitsPage/actions';
import {Alert} from 'react-native';

const mapStateToProps = (state) => {
  const limits = state.limitsPage.limits || {};
  return {
    isLoading: state.limitsPage.isLoading,
    cashLimits: limits.cashLimits,
    cashlessLimits: limits.cashlessLimits,
    internetLimits: limits.internetLimits,
    needConfirm: state.limitsPage.needConfirm,
    idDocument: state.limitsPage.idDocument,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getLimits: (idObject) => dispatch(getLimits(idObject)),
    saveLimits: async (cashLimits, cashlessLimits, internetLimits) => {
      await dispatch(saveLimits({cashLimits, cashlessLimits, internetLimits}));
      await Navigation.dismissModal(ownProps.componentId);
      Alert.alert('Установка лимитов карты', 'Лимиты карты были успешно сохранены');
    },
    confirm: (codeSms) => dispatch(confirmLimits(codeSms)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LimitsScreen);
