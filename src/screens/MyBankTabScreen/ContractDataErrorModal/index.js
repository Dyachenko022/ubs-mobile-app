import ContractDataErrorModal from './ContractDataErrorModal';
import { connect } from 'react-redux';
import { setContractDataWarning } from '../../../reducers/userInfo/actions';
import { exit } from '../../../api/actions';
import {Navigation} from 'react-native-navigation';

const mapStateToProps = (state) => ({
  visible: state.userInfo.checkContractData.visible,
  shouldLogout: state.userInfo.checkContractData.shouldLogout,
  text: state.userInfo.checkContractData.text,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { shouldLogout, text } = stateProps;
  const { dispatch } = dispatchProps;

  const onCloseModal = () => {
    Navigation.dismissOverlay(ownProps.componentId);
    if (shouldLogout) {
      dispatch(exit());
    } else {
      dispatch(setContractDataWarning(text, false));
    }
  };

  return {
    ...stateProps,
    ...ownProps,
    onCloseModal,
  };
};

export default connect(mapStateToProps, null, mergeProps)(ContractDataErrorModal);
