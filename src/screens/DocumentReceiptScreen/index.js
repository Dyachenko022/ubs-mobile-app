import React, {Component} from 'react';
import {connect} from 'react-redux'
import { View, ActivityIndicator } from 'react-native';
import { printDocument } from '../../api/actions'
import { sharePdf } from '../../utils/download'
import {Navigation} from 'react-native-navigation';
import Pdf from 'react-native-pdf';
import BankTheme from '../../utils/bankTheme';


class DocumentReceiptScreen extends Component {
  static defaultProps = {
    accountNumber: '',
    email: '',
    format: 'HTML',
    isLoading: false,
    documentFile: ''
  };

  static options = {
    topBar: {
      title: {
        text: 'Квитанция',
        color: 'white',
        alignment: 'center',
      },
      rightButtons: [{
        id: 'documentReceipt_send',
        icon: require('../../../assets/icons/buttons/share.png'),
      }],
    },
    bottomTabs: {
      visible: false,
    }
  }

  componentDidMount() {
    this.props.dispatch(printDocument({
      id: this.props.id,
      format: 'PDF'
    }));
    this.navigationEvents = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'documentReceipt_send' && this.props.base64) {
      sharePdf(this.props.src)
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        {
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
    return (
      <Pdf style={{
        flex:1,
        width:'100%',
        height: '100%',
      }}
           source={{uri: this.props.src}}
      />
    )
  };
}

const mapStateToProps = (state) => {
  return {
    documentFile: state.documentPage.documentFile,
    htmlFile: state.documentPage.htmlFile,
    base64: state.documentPage.base64,
    src: state.documentPage.src,
    isLoading: state.documentPage.loading,
  }
};
export default connect(mapStateToProps)(DocumentReceiptScreen);
