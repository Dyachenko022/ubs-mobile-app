import React, {Component} from 'react';
import {connect} from 'react-redux'
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import { Navigation } from 'react-native-navigation';
import {getAccountDetails, printDocumentRb} from '../../api/actions'
import { downloadFile, sharePdf } from '../../utils/download'
import Pdf from 'react-native-pdf';
import BankTheme from '../../utils/bankTheme';

class ProductAccountDetailsScreen extends Component {
  static defaultProps = {
    idObject: 0,
    code: '',
    email: '',
    format: 'pdf',//'HTML',
    isLoading: false,
    file: null,
    accountDetailsFile: ''
  };

  static options = {
    topBar: {
      title: {
        text: 'Реквизиты',
        color: 'white',
        alignment: 'center',
      },
      rightButtons: [{
        id: 'productaccountdetails_send',
        icon: require('../../../assets/icons/buttons/share.png'),
      }]
    }
  }

  state = {
    file: null,
    fileName: '',
  }

  componentDidMount() {
    if (this.props.code === 'SBP') {
      this.props.dispatch(printDocumentRb({
        ids: [this.props.idObject],
        code: this.props.code,
        format: this.props.format
      }, this.fileLoaded));
    }
    else {
      this.props.dispatch(getAccountDetails({
        idObject: this.props.idObject,
        code: this.props.code,
        format: this.props.format
      }, this.fileLoaded));
    }
    this.navigationEvents = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'productaccountdetails_send') {
      sharePdf(this.state.fileSrc);
    }
  }

  fileLoaded = (r) => {
    downloadFile(r.file)
      .then((file) => this.setState(() => ({file , fileName:r.fileName, fileSrc: r.file})))
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {
          this.state.fileSrc ? this.renderContent()  :

          this.props.isLoading ?
            this.renderLoader() :
            this.renderContent()
        }
      </View>
    );
  }

  renderLoader = () => {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(100,100,100,0.2)'
      }}>
        <ActivityIndicator size="large" color={BankTheme.color1}/>
      </View>
    )
  };

  renderContent = () => {
    const extension = this.state.fileName.split('.').pop() || '';
    if (extension.toUpperCase() === 'PDF') {
      return (
        <Pdf style={{
          flex:1,
          width:'100%',
          height: '100%',
        }}
             source={{uri: this.state.fileSrc}}
        />
      );
    }
    else return (
      <WebView
        style={{flex: 1}}
        source={{uri: this.props.accountDetailsFile}}
        injectedJavaScript={`
              var head = document.querySelector('head');
              var headContent = head.innerHTML;
              var newHeadContent = '<meta name="viewport" content="initial-scale=0.65">' + headContent;
              head.innerHTML = newHeadContent;
            `}
      />
    )
  };
}

const mapStateToProps = (state) => {

  return {
    accountDetailsFile: state.productPage.accountDetailsFile,
    accountDetailsData: state.productPage.accountDetailsData,
    isLoading: state.productPage.loading,
  }
};
export default connect(mapStateToProps)(ProductAccountDetailsScreen);
