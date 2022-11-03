import { connect } from 'react-redux';
import {pushScreen} from '../../utils/navigationUtils';
import SbpAcceptancesScreen from './SbpAcceptancesScreen';
import { getAcceptances } from '../../api/actions';

const mapStateToProps = (state) => ({
  acceptances: state.sbpAcceptancesPage.acceptances,
  isLoading: state.sbpAcceptancesPage.isLoading,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeAcceptanceState: (idAcceptance, action) => {
    pushScreen({
      componentId: ownProps.componentId,
      screenName: 'unisab/Document',
      passProps: {
        sid: 'UBS_SBP_ACCEPT_CHANGE_STATE',
        defaultValues: {
          'Идентификатор акцепта': idAcceptance,
          'Действие': action,
        }
      }
    });
  },
  createNewAcceptance: () => {
    pushScreen({
      componentId: ownProps.componentId,
      screenName: 'unisab/Document',
      passProps: {
        sid: 'UBS_SBP_ACCEPT',
      }
    });
  },
  getAcceptances: () => {
    dispatch(getAcceptances());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SbpAcceptancesScreen);
