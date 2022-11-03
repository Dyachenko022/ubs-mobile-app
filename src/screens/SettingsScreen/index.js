import SettingsScreen from './SettingsScreen';
import {connect} from 'react-redux';
import {showModal, makeLeftBackButton, pushScreen} from '../../utils/navigationUtils';
import { pushOFF, pushON } from '../../api/actions';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

const mapDispatchToProps = (dispatch, ownProps) => {
  const { componentId} = ownProps;
  return {
    dispatch,
    openSettingsSBP: () => {
      pushScreen({
        componentId,
        screenName: 'unisab/Document',
        passProps: {
          sid: 'UBS_TRANSFER_SBP_SETUP',
        },
        showBackButtonTitle: false,
      });
    },
    openSbpAcceptancesScreen: () => {
      pushScreen({
        componentId,
        screenName: 'unisab/SbpAcceptancesScreen',
        }
      )
    },
    pushON: async () => {
      let token = '';
      let tokenType = '';
      if (Platform.OS === 'ios') {
        token = await messaging().getToken();
        tokenType = 'Apple';
      } else if (await DeviceInfo.hasGms()) {
        token = await messaging().getToken();
        tokenType = 'Android';
      }
      dispatch(pushON({ uid: DeviceInfo.getUniqueId(), token, tokenType }))
    },
    pushOFF: () => dispatch(pushOFF({ uid: DeviceInfo.getUniqueId() })),
    openSBPayScreen: () => pushScreen({
      componentId,
      screenName: 'unisab/SBPayScreen',
    }),
  }
}

const mapStateToProps = (state) => ({
  push: state.userInfo.push,
  confAccess: state.paymentsPage.configuration,
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
