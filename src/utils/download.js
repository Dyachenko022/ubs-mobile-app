import {Platform, Share as RNShare, PermissionsAndroid, Alert} from 'react-native';

import FileViewer from "react-native-file-viewer";
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import moment from 'moment';

export const downloadFile = (src) => (
  RNFetchBlob.fetch('GET', src, {})
    .then((res) => {
      let base64Str = res.base64();
      return base64Str;
    })
    .catch((errorMessage, statusCode) => {
    })
);

export const shareMessage = (message = '') => {
  RNShare.share({message})
};

export async function openFileByUrlAndName(url, name, mimeType) {
  let filePath = null;
  const configOptions = {
    fileCache: true,
    path:
      RNFetchBlob.fs.dirs.CacheDir + `/_${moment().format('DD.MM.YYYY')}_${name}` // no difference when using jpeg / jpg / png /
  };

  const resp = await RNFetchBlob.config(configOptions).fetch('GET', url);

  if (Platform.OS === 'ios') {
    const options = {
      url: resp.path(),
    };
    await Share.open(options);
    await RNFS.unlink(filePath);
  } else {
    try {
      await FileViewer.open(resp.path());
    } catch (e) {
      console.error('SFBUAN', e);
      await shareFile(resp, '', mimeType);
    }
  }
}

export async function sharePdf(url) {
  const configOptions = {
    fileCache: true,
    path:
      RNFetchBlob.fs.dirs.CacheDir + `/_${moment().format('DD.MM.YYYY')}.pdf`, // no difference when using jpeg / jpg / png /
  };
  const resp = await RNFetchBlob.config(configOptions).fetch('GET', url);
  try {
    await shareFile(resp, '');
  } finally {
    await RNFS.unlink(resp.path());
  }
}

const shareFile = async (resp, message = '', mime = 'application/pdf') => {

  if (Platform.OS === 'android') {
    try {
      const allowedStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (allowedStorage) {
        const base64 = await resp.readFile('base64');
        return Share.open({
          url: `data:${mime};base64,${base64}`,
          message
        })
      }
    } catch (e) {

    }
  } else {
    const options = {
      url: resp.path(),
    };
    await Share.open(options);
  }
};
