import React from 'react';
import { StyleSheet, SafeAreaView, Alert, Text , Button, Dimensions, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from "react-native-image-picker"
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import RNQRGenerator from 'rn-qr-generator';
import { RNCamera } from 'react-native-camera';

//Сканирует только один раз. Для повторного сканирование нужно вызывать
//this.scanner.reactivate() или перемонтировать компонент
export default class ScanScreen extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      useFlash: false,
      processingQR: false,
    }
  }

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

  // Выбор фотографии из галереи
  fetchGalleryImage = async () => {
    const options = {
      title: 'Выбор QR-кода',
      cancelButtonTitle: 'Отмена',
      allowsEditing: false,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true
      },
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.25
    };

    let cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
    if (cameraPermission === RESULTS.DENIED) cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
    if (cameraPermission === RESULTS.BLOCKED) {
      Alert.alert('Доступ к камере запрещен! Разрешите доступ к камере в настройках.');
    } else {
      ImagePicker.launchImageLibrary(options, response => {
        if(!response.base64) {
          return;
        }
        this.setState({ processingQR: true})

        RNQRGenerator.detect({
          base64: response.base64,
        }).then((detectedQRCodes) => {
          const { values } = detectedQRCodes;

          if(values && values.length > 0) {
            this.onSuccess({data: values[0]})
          } else {
            Alert.alert('Не найден QR код')
          }

          this.setState({ processingQR: false})
        }).catch(error => {
          console.log(error)
          Alert.alert('Ошибка', 'Ошибка обработки QR кода')
        })
      });
    }
  }

  render() {
    return (
      <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white', alignItems: 'center'}}
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
            flashMode={this.state.useFlash 
                       ? RNCamera.Constants.FlashMode.torch
                       : RNCamera.Constants.FlashMode.off}
          />
        { /* Чтобы кнопка работала, нужно убрать pointerEvents=none */ }
        {__DEV__ &&
          <Button title="DEBUG SUCCESS"
                  onPress={() => this.onSuccess({data: 'https://qr.nspk.ru/AS10001J4R0RO37Q8EF8GVM3VI7LVBEF'})}
          />
        }

        <View style={{textAlign:'center', 
                      bottom: 30, 
                      zIndex: 200, 
                      position: 'absolute'}}>
          <Text style={{textAlign:'center', 
                        fontSize: 18, 
                        color: '#f5f5f0'}}>
            {'Наведите камеру на QR-код с квитанции\r\nПриложение автоматически отсканирует код'}
          </Text>

          <View style={{flexDirection: 'row',
                        padding: 10,
                        alignItems:'center',
                        justifyContent: 'space-between'}}>
            
            <TouchableOpacity style={styles.iconButtonStyle}
                              onPress={() => this.fetchGalleryImage()}>
              <Icon name={'image'}
                    size={25}
                    color={'#fff'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButtonStyle}
                          onPress={() => {
                            this.setState({ useFlash: !this.state.useFlash })
                          }}>
              <Icon name={this.state.useFlash ? 'flash-on' : 'flash-off'}
                    size={25}
                    color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>

        {this.state.processingQR && (
          <View style={styles.fullScreenWrapper}>
            <ActivityIndicator style={{width: 30, height: 30, color: '#000'}} />
          </View>
        )}
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
  },
  fullScreenWrapper: {
    position: 'absolute',
    alignItems:'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  iconButtonStyle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  }
});
