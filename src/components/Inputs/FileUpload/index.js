import React from 'react';
import PropTypes from 'prop-types';
import ScriptFile from '../../../../assets/icons/scriptFile.png';
import {
  View, Text, Image, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SvgUri from 'react-native-svg-uri';
import DocumentIcon from '../../../../assets/icons/document.svg';
import styles from './styles';

export default class FileUpload extends React.Component {

  state = {
    allowNewFiles: true,
  }

  focus() {
    this.props.onFocus && this.props.onFocus();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const allowNewFiles = !this.props.readOnly && (this.props.maxSize === 0 || this.props.files.length < this.props.maxSize);
    if (allowNewFiles !== prevState.allowNewFiles) this.setState({allowNewFiles});
  }

  getFileIconByName = (fileName) => {
    switch (fileName.match(/\.[^.]*$/)[0]) {
      case '.pdf': return require('../../../../assets/icons/files/pdf.png');
      case '.docx':
      case '.doc': return require('../../../../assets/icons/files/doc.png');
      case '.xlsx':
      case '.xls': return require('../../../../assets/icons/files/xls.png');
      case '.jpg':
      case '.jpeg': return require('../../../../assets/icons/files/jpg.png');
      default: return require('../../../../assets/icons/files/txt.png');
    }
  }

  addFile = () => {
    this.focus();
    this.props.addFile();
  }

  renderFiles = () => {
    return this.props.files.map((file, idx) => {
      return (
        <View key={file} style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={this.getFileIconByName(file.name)} style={{width: 32, height: 32,}}/>
            <Text>
              {file.name}
            </Text>
          </View>
          {!this.props.readOnly &&
            <TouchableOpacity onPress={() => this.props.removeFile(idx)}>
              <Icon name="ios-close" size={45} color="#f27c2d" />
            </TouchableOpacity>
          }
        </View>
      );
    })
  }

  render() {

    const containerStyle = {...styles.container, ...(!this.props.isValid && styles.containerNotValid) };

    return (
      <View style={containerStyle}>
        <View style={styles.header}>
          <Image source={ScriptFile} style={{width: 20, height: 20,}}/>
          <Text style={styles.headerText}>
            {this.props.name}
          </Text>
        </View>

        {this.props.files.length > 0 && this.renderFiles()}

        {this.state.allowNewFiles &&
          <TouchableOpacity onPress={this.addFile} style={styles.uploadFile}>
            <Text style={styles.uploadFileText}>
              Загрузить файл
            </Text>
            <SvgUri
              width={41}
              height={32}
              source={require('../../../../assets/icons/fileUpload.svg')}
            />
            {this.props.minSize &&
              <Text style={styles.fileCountText}>
                {`Загружено ${this.props.files.length} из ${this.props.minSize}`}
              </Text>
            }
          </TouchableOpacity>
        }
      </View>
    )
  }
}

FileUpload.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.string,
    data: PropTypes.string,
  })),
  onFocus: PropTypes.func,
  name: PropTypes.string,
  addFile: PropTypes.func,
  removeFile: PropTypes.func,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  isValid: PropTypes.bool,
  readOnly: PropTypes.bool,
}

FileUpload.defaultProps = {
  files: [],
  maxSize: 0,
  isValid: true,
  readOnly: false,
}
