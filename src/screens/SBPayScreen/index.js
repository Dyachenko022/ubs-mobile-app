import SBPayScreen from './SBPayScreen';
import { connect } from 'react-redux';
import {getSBPayTokens} from '../../api/actions';
import {pushScreen} from '../../utils/navigationUtils';

const mapStateToProps = (state) => ({
  isLoading: state.sbpay.isLoading,
  tokens: state.sbpay.tokens,
  /*
  tokens: [
    {
      id: 1,
      account: '30101810400000000225',
      state: 2,
      stateNote: 'Активен',
      timeCreate: '2020.10.10',
      note: '',
    }
  ],
  */
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getSBPayTokens: () => {
    dispatch(getSBPayTokens());
  },
  openTokenOperation: (id, action) => {
    pushScreen({
      componentId: ownProps.componentId,
      screenName: 'unisab/Document',
      passProps: {
        sid: 'UBS_SBP_M_APP_CHANGE',
        defaultValues: {
          'Идентификатор токена': id,
          'Действие': action,
        }
      }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SBPayScreen);
