import React, {Component} from 'react';
import WebView from 'react-native-webview';
import {downloadFile, sharePdf } from '../utils/download'
import {extract, getPathFile} from '../api/actions';
import {
  View,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: '#fff'
  },
  webview: {
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

const INJECTED_JAVASCRIPT = '';

class WebViewScreen extends Component {

  static options = {
    bottomTabs: {
      visible: false,
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      uri: '',
      file: '',
      html: '',
      fileSrc: ''
    };
    this.fileLoaded = this.fileLoaded.bind(this);
  }


  componentDidMount() {
    this.props.dispatch(
      extract(
        {
          code: this.props.params.code,
          id: this.props.params.id,
          dateFrom: this.props.params.dateFrom,
          dateTo: this.props.params.dateTo,
          format: 'pdf'
        },
        (d, g, r) => this.fileLoaded(r)
      )
    );

    this.props.dispatch(
      extract(
        {
          code: this.props.params.code,
          id: this.props.params.id,
          dateFrom: this.props.params.dateFrom,
          dateTo: this.props.params.dateTo,
          format: 'html'
        },
        (d, g, r) => {
          this.setState({
            html: getPathFile() + r.file,
            loading: false
          })
        }
      )
    );
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        sharePdf(this.state.fileSrc, 'application/pdf', `#ИПБ Выписка с ${this.props.params.dateFrom} по ${this.props.params.dateTo}`);
      }
    }
  }

  fileLoaded(r) {
    let fileRsp = getPathFile() + r.file
    downloadFile(fileRsp)
      .then((file) => this.setState(() => ({fileSrc: fileRsp, file/*, loading: false*/})))
  }

  render() {
    return this.state.loading ?
      <View style={styles.container}>
        <ActivityIndicator size={'large'}/>
      </View> :
      <WebView
        key={Math.random()}
        textZoom={100}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        style={styles.webview}
        scalesPageToFit
        source={{uri: this.state.html}}
      />;
  }
}

WebViewScreen.propTypes = {};

export default WebViewScreen;
