import {ActionSheetIOS, Alert, PermissionsAndroid, Platform} from 'react-native';
import {transliterate} from '../../../utils/text';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Выбор аватара',
  cancelButtonTitle: 'Отмена',
  takePhotoButtonTitle: 'Сделать фото...',
  chooseFromLibraryButtonTitle: 'Выбрать из библиотеки...',
  allowsEditing: false,
  storageOptions: {
    skipBackup: true,
    waitUntilSaved: true
  },
  mediaType: 'photo',
  // cameraType: 'front',
  quality: 0.25
};

export default async function selectAvatar(cb) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions({
        options: ["Сделать фото", "Выбрать из библиотеки", "Отмена"],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 2
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          let cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
          if (cameraPermission === RESULTS.DENIED) cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
          if (cameraPermission === RESULTS.BLOCKED) {
            Alert.alert('Доступ к камере запрещен! Разрешите доступ к камере в настройках.');
          }
          if (cameraPermission === RESULTS.GRANTED) {
            setTimeout(() => {
              ImagePicker.launchCamera(options, response => {
                if (response.didCancel) {
                  return cb();
                } else if (response.error) {
                  return cb();
                }
                cb(parseFile(response.fileSize, response.uri));
              });
            }, 600);
          }
        } else if (buttonIndex === 1) {
          let cameraPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (cameraPermission === RESULTS.DENIED) cameraPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (cameraPermission === RESULTS.BLOCKED) {
            Alert.alert('Доступ к фотографиям запрещен! Разрешите доступ к фотографиям в настройках.');
          }
          if (cameraPermission === RESULTS.GRANTED) {
            setTimeout(() => {
              ImagePicker.launchImageLibrary(options, response => {
                cb(parseFile(response.fileSize, response.uri));
              });
            }, 600);
          }
        }
      },
    );
  }
  else {
    await requestFilePermission();
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        return cb();
      } else if (response.error) {
        return cb();
      } else if (response.customButton) {
        return cb();
      } else {
        const { fileName, fileSize, uri } = response;
        cb(parseFile(fileSize, uri));
      }
    });
  }
};

const parseFile = (fileSize, uri) => {
  if (fileSize > 2 * 1000 * 1000) {
    Alert.alert('Размер файла слишком большой!', 'Максимальный размер файла – 2 мегабайта', [
      {
        text: 'Закрыть',
        onPress: () => { }
      }
    ]);
    return null;
  }
  return {
    uri: uri,
    name: transliterate("IPBPhoto.jpg"),
    type: Platform.OS === 'ios' ? '' : 'image/jpeg',
  };
}

async function requestFilePermission() {
  if (Platform.OS === 'ios') {
  } else {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        title: 'Запрос доступа к файлам',
        message: 'Для прикрепления файлов необходимо предоставить доступ'
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) { }
  }
}
