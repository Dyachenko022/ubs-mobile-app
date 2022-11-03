import React from 'react';
import {View,  StyleSheet, Dimensions, SafeAreaView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Button} from 'react-native-ui-lib';
import {WebView} from 'react-native-webview';
import PropTypes from 'prop-types';
import Pdf from 'react-native-pdf';
import { useEffect } from 'react';
import {makeLeftBackButton} from '../../utils/navigationUtils';
import BankTheme from '../../utils/bankTheme';


export default function WebViewModalConfirmation(props) {

  const onButtonPress = () => {
    Navigation.dismissModal(props.componentId);
    props.onButtonPress && props.onButtonPress();
  }

  // Реакт-Хук для подписи на нажатие кнопки Назад
  useEffect(() => {
    const unsubscribe = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if (buttonId === 'webviewmodalButtonBack') Navigation.dismissModal(props.componentId);
    });
    return () => {
      unsubscribe?.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{height: '100%', width: '100%', flexDirection: 'column', backgroundColor: '#EEE'}}>
      {props.isPdf ? (
        <Pdf style={styles.pdf}
             source={{uri: props.url}}
        />)
        :
        (<WebView tyle={{height: '94%'}}
          source={{uri: props.url}}
        />)
      }
      <Button
        style={{height: '6%', backgroundColor: BankTheme.color1, borderRadius: 0,}}
        label={props.buttonLabel}
        onPress={onButtonPress}
      />
    </SafeAreaView>
  );
}

WebViewModalConfirmation.options = (props) => ({
  topBar: {
    leftButtons: [
      makeLeftBackButton('webviewmodalButtonBack')
    ],
  }
});

WebViewModalConfirmation.propTypes = {
  url: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  onButtonPress: PropTypes.func,
  isPdf: PropTypes.bool,
}

WebViewModalConfirmation.defaultProps = {
  buttonLabel: 'Закрыть',
  isPdf: false,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
    height: '95%',
  },
  pdf: {
    flex: 1,
  }
});

