import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableHighlight, View, StyleSheet } from 'react-native';
import { openFileByUrlAndName } from '../../utils/download';
import PdfIcon from '../../../assets/icons/files/pdf.png';
import { TextRenderer as Text } from '../TextRenderer';
import DocIcon from '../../../assets/icons/files/doc.png';
import XlsIcon from '../../../assets/icons/files/xls.png';
import TxtIcon from '../../../assets/icons/files/txt.png';
import JpgIcon from '../../../assets/icons/files/jpg.png';

const mime = require('mime');

function getFileByExtension(extension = '') {
  switch (extension.toLowerCase()) {
    case '.pdf':
      return PdfIcon;
    case '.doc':
    case '.docx':
      return DocIcon;
    case '.xlsx':
    case ".xls":
      return XlsIcon;
    case '.jpeg':
    case ".png":
    case ".jpg":
      return JpgIcon;
    default:
      return TxtIcon;
  }
}

export default function FileAttachment(props) {
  const { fileName, fileUrl } = props;
  const extension = fileName.match(/\.[^.]*$/)[0];
  const mimeType = mime.getType(extension);

  return (
    <TouchableHighlight style={styles.fileButton} underlayColor={'rgba(0,0,0,.05)'} key={fileName}
                        onPress={() => openFileByUrlAndName(fileUrl, fileName, mimeType)}
    >
      <View style={styles.fileWrapper}>
        <Image style={styles.fileImage} source={getFileByExtension(extension)}/>
        <Text style={styles.fileName}>{fileName}</Text>
      </View>
    </TouchableHighlight>
  );
}

FileAttachment.propTypes = {
  fileName: PropTypes.string,
  fileUrl: PropTypes.string,
}

const styles = StyleSheet.create({
  fileButton: {
    marginTop: 10,
    maxWidth: 110
  },
  fileWrapper: {

    padding: 5,

    justifyContent: 'center',
    alignItems: 'center'
  },
  fileImage: {
    resizeMode: 'contain',
    width: 35,
    height: 45
  },
  fileName: {
    fontSize: 12,
    color: "#999",
    textAlign: 'center'
  }
});
