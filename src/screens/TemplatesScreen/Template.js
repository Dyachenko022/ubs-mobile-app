import React from 'react';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  View,
  Image,
  TouchableHighlight, Platform,
} from "react-native";
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from '../../components/TextRenderer';
import SwipeOut from '../../components/SwipeOut';
import ModalInput from '../../components/Inputs/ModalInput';

import {parseMoney} from '../../utils/text'
import {appColors} from '../../utils/colors'

import {deleteTemplate, renameTemplate} from '../../api/actions'

import styles from "./styles";
import {pushScreen} from '../../utils/navigationUtils';
import {pre} from 'react-native-render-html/src/HTMLRenderers';
import {openReceipt} from '../../containers/Document/utils';


class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTemplateModalVisible: false,
      isTemplateLoading: false,
      templateName: props.item.kindDoc,
    };

    this._getSwipeButtons = this._getSwipeButtons.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.item.kindDoc !== this.props.item.kindDoc) {
      this.setState({templateName: this.props.item.kindDoc});
    }
  }

  render() {
    let {item} = this.props;
    const onSwipeButtonPress = () => {
      this.props.onButtonPress()
    }
    console.warn(this.props);
    return (
      <SwipeOut rightButtons={this._getSwipeButtons(item, onSwipeButtonPress)}
                key={item.id}
                style={styles.listItem}
                onRef={this.props.onSwiperRef}
                onSwipeStart={this.props.onSwipeStart}
          >
        <TouchableOpacity style={styles.itemBtn} onPress={() => {
          this.props.onButtonPress();
          if (!this.props.confAccess[item.sidDoc]) {
            //  Открываем квитанцию? если нет доступа
            openReceipt({
              componentId: this.props.parentComponentId,
              id: item.id,
            })
          } else pushScreen({
            componentId: this.props.parentComponentId,
            screenName: 'unisab/Document',
            showBackButtonTitle: false,
            passProps: {
              sid: 'getDocument',
              defaultValues: {
                'Идентификатор документа': item.id
              }
            }
          })
        }}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexBasis: '70%', flexDirection: 'row', alignItems: 'center', flexGrow: 1, marginRight: 15}}>
              <Image
                source={{uri: item.logo}}
                style={{width: 30, height: 30, borderRadius: 15, marginRight: 15}}
              />
              <View style={{flex: 1}}>
                <Text style={styles.title}>{item.kindDoc}</Text>
                <View><Text style={styles.date}>{item.recipient}</Text></View>
              </View>
            </View>

            <View>
              <Text>{parseMoney(item.amount, item.currency)}</Text>
            </View>
          </View>

          <ModalInput
            visible={this.state.isTemplateModalVisible}
            isLoading={this.state.isTemplateLoading}
            title={'Название шаблона'}

            inputValue={this.state.templateName }
            onChangeInput={(text) => {
              this.setState({templateName: text});
            }}

            close={this.closeTemplateModal}
            onDone={this.onDoneTemplateModal}
          />
        </TouchableOpacity>
      </SwipeOut>
    )
  }

  _getSwipeButtons(item, onSwipeButtonPress) {
    if (this.props.confAccess[item.sidDoc] === 0) return Platform.OS === 'ios' ? [] : null;
    const { id } = item;

    return [

      <TouchableOpacity
        onPress={() => {
          onSwipeButtonPress();
          this.editTemplate(id);
        }}
        style={{backgroundColor: appColors.green}}
      >
        <View style={styles.swipeOut}>
          <Text style={styles.swipeOutText}>
             Изменить шаблон
          </Text>
        </View>
      </TouchableOpacity>,

      <TouchableOpacity
        onPress={() => {
          onSwipeButtonPress();
          this.openTemplateModal();
        }}
        style={{backgroundColor: appColors.yellow}}
      >
        <View style={styles.swipeOut}>
          <Text style={styles.swipeOutText}>Изменить название</Text>
        </View>
      </TouchableOpacity>,

      <TouchableOpacity
        onPress={() => {
          onSwipeButtonPress();
          this.props.dispatch(deleteTemplate(id));
        }}
        style={{backgroundColor: appColors.red}}
      >
        <View style={styles.swipeOut}>
          <Text style={styles.swipeOutText}>Удалить</Text>
        </View>
      </TouchableOpacity>
    ]
  }

  openTemplateModal = (id) => {
    this.setState({
      isTemplateModalVisible: true,
    });
  };

  closeTemplateModal = () => {
    this.setState({
      templateName: this.props.item.kindDoc,
      isTemplateModalVisible: false,
    });
  };

  onDoneTemplateModal = async () => {
    this.props.dispatch(renameTemplate({
      id: this.props.item.id,
      name: this.state.templateName
    }));
    this.closeTemplateModal();
  };

  editTemplate = (id) => {
    pushScreen({
      componentId: this.props.parentComponentId,
      screenName: 'unisab/Document',
      showBackButtonTitle: false,
      passProps: {
        sid: 'getDocument',
        type: 'template',
        defaultValues: {
          'Идентификатор документа': id,
          type: 'template',
        }
      }
    })
  }
}

const mapStateToProps = (state) => ({
  confAccess: state.paymentsPage.configuration,
});

export default connect(mapStateToProps)(Template);
