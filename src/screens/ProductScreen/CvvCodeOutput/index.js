import CvvCodeOutput from './CvvCodeOutput';
import { connect } from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import {getCardCvvCode} from '../../../api/actions';
import {clearCvvCode} from '../../../reducers/productPage/actions';

const mapStateToProps = (state) => ({
  cvvCode: state.productPage.cvvCode,
  cvvCodeShown: state.productPage.cvvCodeShown,
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { idCard } = ownProps;
  const { dispatch } = dispatchProps;
  const { cvvCode } = stateProps;

  return {
    ...stateProps,
    getUnmaskedCode: () => dispatch(getCardCvvCode(idCard)),
    clearCvvCode: () => dispatch(clearCvvCode()),
    copyCode: () => {
      Clipboard.setString(cvvCode);
      ownProps.showMessagePopup('CVV код скопирован');
    }
  }
};

export default connect(mapStateToProps, null, mergeProps)(CvvCodeOutput);
