import { connect } from 'react-redux';
import AboutScreen from './AboutScreen';
import { showModal } from '../../utils/navigationUtils';

const mapStateToProps = (state) => ({
  aboutFormLinks: state.settingsFront.aboutFormLinks,
  bankInfo: state.settingsFront.bankInfo,
});

const mapDispatchToProps = (dispatch) => ({
  onPressOnLink: (title, url) => {
    const extension = url.split('.').pop() || '';
    const isPdf = extension.toUpperCase() === 'PDF';
    showModal({screenName: 'WebViewModalConfirmation', title, passProps: {url, isPdf}});
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutScreen);