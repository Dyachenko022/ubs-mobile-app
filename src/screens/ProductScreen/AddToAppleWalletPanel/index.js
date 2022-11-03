import React from 'react';
import PropTypes from 'prop-types';
import {Image, Linking, View, Dimensions} from "react-native";
import {TextRenderer as Text} from "../../../components/TextRenderer";
import PassKit, {AddPassButton} from "react-native-passkit-wallet";
import Wallet from "../../../modules/Wallet";
import TouchableOpacity from "../../../components/Touchable";
import styles from "../styles";
import { Dialog } from "react-native-ui-lib";

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

export default function AddToAppleWalletPanel(props) {
  const url = props.apiRoute + 'execute';
  return (
    <Dialog
      migrate
      bottom
      visible={props.isVisible}
      onDismiss={props.onHide}
      width="100%"
      containerStyle={{ height: 600 }}
      panDirection={'down'}
      supportedOrientations={['portrait']} // iOS only
    >
      <View
        style={{
          backgroundColor: '#fff',
          height: Screen.height,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,

          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          paddingBottom: 100,
          paddingTop: 0
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 40,
            width: Screen.width - 80,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image
            source={require('../../../../assets/images/common/payid.png')}
            style={{ height: Screen.height * 0.25, width: 80, resizeMode: 'contain' }}
          />
        </View>

        <Text style={{ textAlign: 'center', color: '#959595' }}>
          Теперь вы можете пользоваться всеми {'\n'}
          преимуществами своей карты ИПБ{'\n'}
          Visa с Apple Pay на iPhone и iPad.
        </Text>

        <View style={{ width: 200, height: 50, marginTop: 10 }}>
          <AddPassButton
            style={{ height: 36 }}
            addPassButtonStyle={PassKit.AddPassButtonStyle.black}
            onPress={() => {
              props.onHide();
              setTimeout(() => {
              Wallet.click(
                props.jwt,
                '' + props.activeProduct.id,
                props.activeProduct.description,
                props.activeProduct.clientName,
                props.activeProduct.number.slice(-4),
                url
              )}, 700);
            }}
          />
        </View>

        <View style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
          <Text>Подробное описание на сайте</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://ipb.ru/applepay')}>
            <Text style={styles.btn}>ipb.ru/applepay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Dialog>
  );
}

AddToAppleWalletPanel.propTypes = {
  isVisible: PropTypes.bool,
  onHide: PropTypes.func,
  jwt: PropTypes.string,
  activeProduct: PropTypes.object,
  apiRoute: PropTypes.string,
}