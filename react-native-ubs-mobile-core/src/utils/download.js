import {Platform, Share as RNShare, PermissionsAndroid} from 'react-native';

// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import moment from 'moment';

const utf8 = require('utf8');

export const downloadFile = (src) => (
  /*Share.open({
    url: src
  })*/
  RNFetchBlob.fetch('GET', src, {})
  // when response status code is 200
    .then((res) => {
      // the conversion is done in native code
      // console.log(res, res.info())
      let base64Str = res.base64();

      return base64Str;
    })
    .catch((errorMessage, statusCode) => {
    })
);

export const shareMessage = (message = '') => {
  RNShare.share({message})
};

export const shareFileByUrl = (url = '') => {
  const par = Platform.OS === 'ios' ? {} : { 'RNFB-Response' : 'base64' }
  RNFetchBlob.fetch('GET', url, par)
  // when response status code is 200
    .then((res) => {
      // the conversion is done in native code
      // console.log(res, res.info())
      // console.log(res)

      // let result = res;
      // result.data = utf8.encode(res.data);
      // console.log(result)

      let base64Str = res.base64();


      return shareFile(base64Str, ``, 'text/richtext');
    })
    .catch((errorMessage, statusCode) => {
      console.error(errorMessage, statusCode)
    })
}

export const shareFile = async (base64, message = '', mime = 'application/pdf') => {

  if (Platform.OS === 'android') {
    try {
      const allowedStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (allowedStorage) {
        Share.open({
          url: `data:${mime};base64,${base64}`,
          message
        })
      }
    } catch (e) {

    }
  } else {
    Share.open({
      url: `data:${mime};base64,${base64}`,
      message
    })
  }
};

export const sharePDF = async (fileUrl, type = 'application/pdf', message = '') => {
  if (Platform.OS === 'android') {
    sharePDFWithAndroid(fileUrl, type)
  } else {
    sharePDFWithIOS(fileUrl, type)
  }

  // console.log(fileUrl)
  //
  // let filePath = null;
  // let file_url_length = fileUrl.length;
  // const configOptions = {
  //   fileCache: true,
  //   path: RNFetchBlob.fs.dirs.DocumentDir + `/IPB_${moment().format('DD.MM.YYYY')}.pdf`
  // };
  // RNFetchBlob.config(configOptions)
  //   .fetch('GET', fileUrl)
  //   .then(async resp => {
  //     filePath = resp.path();
  //
  //     // if (Platform.OS === 'android') {
  //     //   const base64 = await resp.readFile('base64');
  //     //   const base64Data = `data:${type};base64,` + base64;
  //     //   console.log(base64)
  //     //   await Share.open({url: base64Data});
  //     //   // remove the image or pdf from device's storage
  //     // } else {
  //       let options = {
  //         type,
  //         url: Platform.OS === 'android' ? 'file://'+filePath : filePath, // (Platform.OS === 'android' ? 'file://' + filePath)
  //         message
  //       };
  //       await Share.open(options);
  //       // remove the image or pdf from device's storage
  //     // }
  //
  //     await RNFS.unlink(filePath);
  //   })

}

export const shareTXT = async (fileUrl, type = 'text/plain', message = '') => {
  if (Platform.OS === 'android') {
    shareTXTWithAndroid(fileUrl, type)
  } else {
    shareTXTWithIOS(fileUrl, type)
  }
}

const shareTXTWithIOS = (fileUrl, type) => {
  let filePath = null;
  let file_url_length = fileUrl.length;
  const configOptions = {
    fileCache: true,
    path:
      RNFetchBlob.fs.dirs.DocumentDir + `/IPB_${moment().format('DD.MM.YYYY')}.txt` // no difference when using jpeg / jpg / png /
  };
  RNFetchBlob.config(configOptions)
    .fetch('GET', fileUrl)
    .then(async resp => {
      filePath = resp.path();
      let options = {
        type: type,
        url: filePath // (Platform.OS === 'android' ? 'file://' + filePath)
      };
      await Share.open(options);
      // remove the image or pdf from device's storage
      await RNFS.unlink(filePath);
    });
}

const shareTXTWithAndroid = (fileUrl, type) => {
  let filePath = null;
  let file_url_length = fileUrl.length;
  const configOptions = { fileCache: true };
  RNFetchBlob.config(configOptions)
    .fetch('GET', fileUrl)
    .then(resp => {
      filePath = resp.path();
      return resp.readFile('base64');
    })
    .then(async base64Data => {
      base64Data = `data:${type};base64,` + base64Data;

      const allowedStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (allowedStorage) {
        await Share.open({ url: base64Data });
        // Share.open({
        //   url: `data:${mime};base64,${base64}`,
        //   message
        // })
      }
      // remove the image or pdf from device's storage
      await RNFS.unlink(filePath);
    });
}

const sharePDFWithIOS = (fileUrl, type) => {
  let filePath = null;
  let file_url_length = fileUrl.length;
  const configOptions = {
    fileCache: true,
    path:
      RNFetchBlob.fs.dirs.DocumentDir + `/IPB_${moment().format('DD.MM.YYYY')}.pdf` // no difference when using jpeg / jpg / png /
  };
  RNFetchBlob.config(configOptions)
    .fetch('GET', fileUrl)
    .then(async resp => {
      filePath = resp.path();
      let options = {
        type: type,
        url: filePath // (Platform.OS === 'android' ? 'file://' + filePath)
      };
      await Share.open(options);
      // remove the image or pdf from device's storage
      await RNFS.unlink(filePath);
    });
}

const sharePDFWithAndroid = (fileUrl, type) => {
  let filePath = null;
  let file_url_length = fileUrl.length;
  const configOptions = { fileCache: true };
  RNFetchBlob.config(configOptions)
    .fetch('GET', fileUrl)
    .then(resp => {
      filePath = resp.path();
      return resp.readFile('base64');
    })
    .then(async base64Data => {
      base64Data = `data:${type};base64,` + base64Data;

      const allowedStorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );

      if (allowedStorage) {
        await Share.open({ url: base64Data });
        // Share.open({
        //   url: `data:${mime};base64,${base64}`,
        //   message
        // })
      }
      // remove the image or pdf from device's storage
      await RNFS.unlink(filePath);
    });
}
