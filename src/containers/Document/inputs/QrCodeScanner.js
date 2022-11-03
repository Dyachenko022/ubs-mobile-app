import React from 'react';
import {  StyleSheet, SafeAreaView, Alert, Text , Button, Dimensions, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

//Сканирует только один раз. Для повторного сканирование нужно вызывать
//this.scanner.reactivate() или перемонтировать компонент
export default class ScanScreen extends React.PureComponent {

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  onSuccess = (e) => {
    try {
      this.props.onScanSuccess(e.data);
    }
    catch (e) {
      Alert.alert('Ошибка', 'Не удалось считать QR-код');
      console.error(e);
    }
  };

  render() {
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', alignItems: 'center'}}
        pointerEvents="none"
      >
          <QRCodeScanner
            reactivateTimeout={5000}
            reactivate={true}
            topViewStyle={{
              display: 'none',
            }}
            bottomViewStyle={{
              display: 'none',
            }}
            cameraStyle={{
              backgroundColor: 'transparent',
              height: Dimensions.get('window').height,
            }}
            onRead={this.onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
          />
        { /* Чтобы кнопка работала, нужно убрать pointerEvents=none */ }
        {__DEV__ &&
          <Button title="DEBUG SUCCESS"
                  onPress={() => this.onSuccess({data: 'https://qr.nspk.ru/AS10001J4R0RO37Q8EF8GVM3VI7LVBEF'})}
          />
        }

          <Text style={{textAlign:'center', top: '85%', zIndex: 200, position: 'absolute', fontSize: 18, color: '#f5f5f0'}}>
            {'Наведите камеру на QR-код с квитанции\r\nПриложение автоматически отсканирует код'}
          </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
