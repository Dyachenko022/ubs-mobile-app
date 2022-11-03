import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, TouchableOpacity, Text, Linking, } from 'react-native-ui-lib';
import Icon from "react-native-vector-icons/Ionicons";
import {Alert, Platform} from "react-native";
import Collapsible from '../../../components/Collapsible';
import SvgUri from 'react-native-svg-uri';
import DocumentIcon from '../../../../assets/icons/document.svg';
import {showModal} from '../../../utils/navigationUtils';
import BankTheme from '../../../utils/bankTheme';

export default class ListDocs extends React.Component {

  state = {
    opened: false,
    documentsShown: {},
    documentIndex: 0,
    collapsed: true,
  };

  documentSelected = (documentIndex) => {
    const document = this.props.documents[documentIndex];
    const { documentLink, documentName, isRequired }  = document;
    const extension = documentLink.split('.').pop();
    this.setState({documentIndex});
    showModal({
      screenName: 'WebViewModalConfirmation',
      title: documentName,
      passProps: {
        url: documentLink,
        buttonLabel: isRequired ? 'Ознакомлен и согласен' : 'Закрыть',
        onButtonPress: this.modalCloseAccepted,
        isPdf: extension === 'pdf',
      }
    });
  };

  modalCloseAccepted = () => {
    const documentsShown =this.state.documentsShown;
    documentsShown[this.state.documentIndex] = true;
    this.props.onDocumentShown && !this.props.readOnly && this.props.onDocumentShown(this.state.documentIndex);
  };

  onDocumentCollapsePress = () => {
    this.setState({collapsed: !this.state.collapsed});
    this.props.onFocus && this.props.onFocus();
  }

  render() {

    return (
      <View style={{width: '100%',  flexDirection: 'column', borderColor: !this.props.isCorrect ? 'red' : '#9e9e9e', borderWidth: 2, borderRadius: 5, padding: 5}}>

          <TouchableOpacity onPress={this.onDocumentCollapsePress}>
            <Text style={{fontSize: 18, paddingBottom: 10,}}>
              {this.props.title}
            </Text>
          </TouchableOpacity>

          <Collapsible collapsed={this.state.collapsed}>
            {
              this.props.documents.map((item, index) => {
                return (
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => this.documentSelected(index)}
                  >
                    <SvgUri
                      width={41}
                      height={32}
                      source={DocumentIcon}
                      color={BankTheme.color1}
                    />
                    <View style={{flexDirection: 'column'}}>
                      <Text>
                        {item.documentName}
                      </Text>
                      <Text>
                        {!this.props.readOnly && (item.isRequired ?
                            this.state.documentsShown[index] ?
                              <Text style={{color: 'green', fontSize: 12,}}>С документом ознакомлен</Text> :
                              <Text style={{color: 'red', fontSize: 12,}}>Обязателен для ознакомления</Text>
                            :
                            <Text style={{color: 'gray', fontSize: 12,}}>Для информации</Text>
                        )
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </Collapsible>
      </View>
    )
  }
}

ListDocs.propTypes = {
  documents: PropTypes.shape({
    documentName: PropTypes.string,
    documentLink: PropTypes.string,
    isRequired: PropTypes.bool,
  }),
  onFocus: PropTypes.func,
  title: PropTypes.string,
  readOnly: PropTypes.bool,
  onDocumentShown: PropTypes.func,
  isCorrect: PropTypes.bool,
};

ListDocs.defaultProps = {
  readOnly: false,
  title: 'Комплект документов',
  isCorrect: true,
}
