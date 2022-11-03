import React from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { listDocuments } from '../../api/actions'
import { HistoryPage } from '../../api/actionTypes'
import { isIphoneX } from '../../utils/platform';
import { parseMoney } from '../../utils/text';
import { execute } from '../../containers/Document/api';
import { openReceipt } from '../../containers/Document/utils';
import {setLogonRootTabId} from '../../reducers/routing/actions';

import BottomActionSheet from "../../components/BottomActionSheet";
import ModalInput from '../../components/Inputs/ModalInput';

import {
  Dimensions,
  View,
  ScrollView,
  FlatList,
  BackHandler,
  SectionList,
  RefreshControl,
  ActivityIndicator,

  Platform,

  TouchableHighlight,
  Alert, Image
} from 'react-native'

import TouchableOpacity from '../../components/Touchable';
import { TextRenderer as Text } from "../../components/TextRenderer";
import SwipeOut from '../../components/SwipeOut'
import Icon from 'react-native-vector-icons/Ionicons';

import styles from './styles'
import { appColors } from '../../utils/colors'
import moment from "moment/moment";
import {pushScreen} from '../../utils/navigationUtils';
import BankTheme from '../../utils/bankTheme';
import androidBeforeExit from '../../utils/androidBeforeExit';
import LeftSwipeIcon from '../../../assets/icons/leftSwipe.png';

const listDocumentsParams = {
  "dateFrom": "01.01.2222",
  "dateTo": "01.01.2222",
  "source": "",
  "amount": 0,
  "currency": "",
  "recipient": "",
  "showFavorite": 0,
  "stateCode": [],
  "sidDoc": "",
  "pageRows": 20,
  "pageNum": 1
};

const getColorByCode = (code) => {
  switch (code) {
    case 101:
      return 'green';
    case 199:
      return 'red';
    default:
      return '#9e9e9e';
  }
}



class HistoryTabScreen extends React.Component {
  static defaultProps = {
    order: [],
    operations: [],
    count: 0
  };

  isCreateTemplate = (sid) => {
    return !this.props.forbidSaveAsTemplate.includes(sid);
  };

  _onRefresh = () => {
    const {
      dateFrom,
      dateTo,
    } = this.state;
    this.props.dispatch(listDocuments({ ...listDocumentsParams, dateFrom, dateTo, pageRows: this.props.count, }, true))
  };

  _onLoadMore = () => {
    const {
      dateFrom,
      dateTo,
      source,
      amount,
      currency,
      recipient,
      showFavorite,
      stateCode,
      sidDoc,
      pageRows,
      pageNum
    } = this.state;

    if (this.props.isRefreshing) {
      return;
    }
    this.setState({ blockOnEndReached: true })

    this.props.dispatch({ type: "REQUEST/HistoryPage.get_operations" })

    this.props.dispatch(listDocuments({
      dateFrom,
      dateTo,
      source,
      amount,
      currency,
      recipient,
      showFavorite,
      stateCode,
      sidDoc,
      pageRows,
      pageNum
    }, false, () => {
      setTimeout(() => {
        this.setState({ blockOnEndReached: false })
      }, 1000)

    }))
  };
  onDoneTemplateModal = async () => {
    if (!this.state.templateId || this.isTemplateExecute) return;

    this.setState({ isTemplateLoading: true }, async () => {
      this.isTemplateExecute = true;

      const data = {
        sidRequest: 'getDocument',
        parameters: [{
          value: this.state.templateId,
          type: 'int',
          name: 'Идентификатор документа',
          typeColumns: null
        }, {
          value: 'Просмотр',
          type: 'string',
          name: 'Вид операции',
          typeColumns: null
        }, {
          value: 'getDocument',
          type: 'string',
          name: 'Код вида документа',
          typeColumns: null
        }]
      };
      const response = await execute(this.props.basePath, data);

      data.parameters = response.values;
      data.parameters.push({
        name: 'Шаблон.Название',
        type: 'string',
        value: this.state.templateName
      });
      data.parameters.push({
        name: 'Признак шаблона',
        type: 'boolean',
        value: true
      });
      delete data.idDocument;
      data.parameters = data.parameters.filter(item => item.name !== 'Идентификатор документа');
      data.sidRequest = 'create';

      await execute(this.props.basePath, data);

      this.closeTemplateModal();
      this.isTemplateExecute = false;

      this.setState({ isTemplateLoading: false });
    });
  };
  openTemplateModal = (id) => {
    this.setState({
      templateId: id,
      isTemplateModalVisible: true
    });
  };
  closeTemplateModal = () => {
    this.setState({
      templateId: null,
      templateName: '',
      isTemplateModalVisible: false
    });
  };

  static options = (props) => ({
      topBar: {
        title: {
          component: {
            name: 'unisab/CustomTopBar',
            passProps: {
              title: 'История операций',
              badgeMenu: true,
              parentComponentId: props.componentId,
            }
          }
        },
        rightButtons: [{
          icon: require('../../../assets/icons/buttons/calendar.png'),
          color: 'white',
          id: 'historyTab_filter'
        },
        ]
      },
  });

  constructor(props) {
    super(props);
    this.onPressViewAllHistory = this.onPressViewAllHistory.bind(this);
    this._renderOperations = this._renderOperations.bind(this);
    this.recenterSw = this.recenterSw.bind(this);

    this.isTemplateExecute = false;
    this.swipes = [];
    this.state = {
      order: [],

      isBottomPanelVisible: false,
      isRefreshing: false,

      templateId: '',
      templateName: '',
      isTemplateModalVisible: false,
      isTemplateLoading: false,

      "dateFrom": "01.01.2222",
      "dateTo": "01.01.2222",
      "source": "",
      "amount": 0,
      "currency": "",
      "recipient": "",
      "showFavorite": 0,
      "stateCode": [],
      "sidDoc": "",
      "pageRows": 20,
      "pageNum": 1
    }
  }

  recenterSw(idx) {
    this.swipes.forEach((sw, id) => {
      if (id !== idx && sw) {
        sw.recenter();
      }
    })
  }

  componentDidMount() {
      this.navigaitonEvents = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigaitonEvents?.remove();
  }

  componentDidAppear() {
    this.props.updateLogonComponentId();
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  };

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'historyTab_filter') {
      const idx = this.state.isBottomPanelVisible ? 1 : 0;
      this.onPressViewAllHistory(idx);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f5f7' }}>
        {this.props.sections.length !== 0 || this.props.refreshing ?
          <SectionList
            renderItem={({ item, index, section }) => this._renderOperations(item, index)}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={{ textAlign: 'center' }}>{moment(title, "DD.MM.YYYY").calendar(null, {
                  sameDay: '[Сегодня]',
                  lastDay: '[Вчера]',
                  lastWeek: 'DD MMM YYYY',
                  sameElse: 'DD MMM YYYY'
                })}</Text>
              </View>
            )}
            extraData={this.state}
            sections={this.props.sections}
            keyExtractor={(item, index) => item + index}
            onEndReached={() => {
              if (!this.props.refreshing) {
                if (!this.state.blockOnEndReached) {
                  this.setState((prevState) => ({ pageNum: prevState.pageNum + 1 }), this._onLoadMore)
                }

                return;
              }
            }}

            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this._onRefresh}
              />
            }
            ListFooterComponent={
              <View style={{width: '100%', alignItems: 'center', marginTop: 32}}>
                <Text style={styles.textFooter}>
                  Для выполнения действий над операцией
                </Text>
                <Text style={styles.textFooter}>
                  проведите пальцем
                </Text>
                <Text style={styles.textFooter}>
                  от правого края к левому
                </Text>
                <Image source={LeftSwipeIcon} style={{width: 32, height: 32, marginTop: 16}} />
              </View>
            }
          />
          :
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {this.props.refreshing ?
              <ActivityIndicator />
              :
              <Text style={{ textAlign: 'center' }}>Ни одной операции не найдено, измените условия отбора</Text>
            }
          </View>
        }

        <BottomActionSheet
          bottomOffset={isIphoneX() ? 50 : 0}
          onRef={el => this.bottomPanel = el}

          isBottomPanelVisible={this.state.isBottomPanelVisible}
          onClose={this.onPressViewAllHistory}

          onDone={({ dateFrom, dateTo }) => {
            this.props.dispatch({ type: HistoryPage.CLEAR });
            this.bottomPanel.snapTo({ index: 1 })
            this.setState({ dateFrom, dateTo, pageNum: 1, isBottomPanelVisible: false }, this._onLoadMore)
          }}
        />

        <ModalInput
          visible={this.state.isTemplateModalVisible}
          isLoading={this.state.isTemplateLoading}
          title={'Название шаблона'}

          inputValue={this.state.templateName}
          onChangeInput={(text) => {
            this.setState(() => ({ templateName: text }))
          }}

          close={this.closeTemplateModal}
          onDone={this.onDoneTemplateModal}
        />


      </View>
    )
  }

  openSBPPayment = (idObject) => {
    pushScreen({
      componentId: this.props.componentId,
      screenName: 'unisab/ProductAccountDetailsScreen',
      title: 'Квитанция',
      passProps: {
        idObject,
        code: 'SBP',
      },
    });
  }

  _renderOperations(operation, idx) {
    if (operation.end) {
      return (
        this.props.refreshing ?
          <View>
            <ActivityIndicator size={'large'} />
          </View>
          :
          null
      )
    }

    let swipeButtons = _ => [];

    if (operation.sidDoc !== 'UBS_SBP_IN' && this.props.confAccess[operation.sidDoc] !== 0) {
      if (this.isCreateTemplate(operation.sidDoc)) {
        swipeButtons = (operation) => [
          <TouchableHighlight
            onPress={() => {
              pushScreen({
                componentId: this.props.componentId,
                screenName: 'unisab/Document',
                passProps: {
                  sid: 'getDocument',
                  defaultValues: {
                    'Идентификатор документа': operation.id
                  }
                },
              });
            }} style={{backgroundColor: appColors.green}}>
            <View style={styles.swipeOut}>
              <Text style={styles.swipeOutText}>Повторить</Text>
            </View>
          </TouchableHighlight>,
          <TouchableHighlight
            onPress={() => {
              this.openTemplateModal(operation.id);
            }}
            style={{backgroundColor: appColors.yellow}}>
            <View style={styles.swipeOut}>
              <Text style={styles.swipeOutText}>Создать шаблон</Text>
            </View>
          </TouchableHighlight>
        ];
      }
      else {
        swipeButtons = (operation) => Platform.OS === 'ios' ? [] : null;
      }
    }
    else swipeButtons = (operation) => Platform.OS === 'ios' ? [] : null;

    let buttons = swipeButtons(operation);

    return (
      <View style={{ width: Dimensions.get('window').width, flex: -1 }}>
        <SwipeOut key={idx} rightButtons={buttons} onRef={(ref, index) => { this.swipes.push(ref); return this.swipes.length - 1; }} onSwipeStart={(id) => this.recenterSw(id)}>
          <TouchableOpacity onPress={() => {
            if (operation.sidDoc === 'UBS_SBP_IN') {
              this.openSBPPayment(operation.id);
            }
            else openReceipt({ componentId: this.props.componentId, id: operation.id })
          }}>
            <View style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '300' }}>{operation.recipient}</Text>
                <Text style={{ color: '#9b9b9b', fontSize: 10, marginTop: 7 }}>{operation.kindDoc}</Text>
              </View>

              <View style={{
                flex: -1,
                flexDirection: 'column',
                alignItems: 'flex-end'/*, justifyContent: 'space-between'*/
              }}>
                <Text style={{ color: operation.amount < 0 ? 'red' : 'green' }}
                >
                  {operation.amount != 0 && parseMoney(operation.amount, operation.currency)}
                </Text>

                <Text style={{
                  color: '#9b9b9b',
                  marginTop: 5,
                  fontSize: 12
                }}>

                  <Text style={{
                    color: getColorByCode(operation.stateCode),
                    marginTop: 5,
                    fontSize: 12
                  }}>{operation.stateName} </Text>

                  {moment(operation.date, "DD.MM.YYYY").format('DD.MM.YYYY')}

                </Text>
              </View>

              <View
                style={{
                  backgroundColor: "#f2f5f7",
                  height: 1,
                  position: 'absolute',
                  left: 15,
                  right: 0,
                  bottom: -1
                }} />
            </View>
          </TouchableOpacity>
        </SwipeOut>
      </View>
    )
  }




  onPressViewAllHistory(idx) {
    this.setState({ isBottomPanelVisible: !idx }, () => { this.bottomPanel.snapTo({ index: idx }) })
  }
}

const mapStateToProps = (state) => ({
  sections: state.historyPage.sections,
  count: state.historyPage.count,
  refreshing: state.historyPage.refreshing,
  confAccess: state.paymentsPage.configuration,
  forbidSaveAsTemplate: state.settingsFront.forbidSaveAsTemplate,
  basePath: state.api.apiRoute
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch,
  updateLogonComponentId: () => dispatch(setLogonRootTabId(ownProps.componentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTabScreen);
