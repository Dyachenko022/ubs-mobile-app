import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {
  ActivityIndicator, Alert, Animated, DeviceEventEmitter, Dimensions, Image, Modal, Picker, Platform,
  TouchableWithoutFeedback, View, AppState,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Interactable from 'react-native-interactable';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import {
  addPassWallet, changeAdditionalCardState,
  getCardWallets, getOperationAccess,
  getProductInfo,
  sendRequisitesCard,
  setDescriptionProduct
} from '../../api/actions';
import AndroidTabView from '../../components/AndroidTabView';
import ModalInput from '../../components/Inputs/ModalInput';
import { TextRenderer as Text } from '../../components/TextRenderer';
import TouchableOpacity from '../../components/Touchable';
import Carousel from '../../containers/Carousel';
import Wallet from '../../modules/Wallet';
import WalletButton from '../../modules/WalletButton';
import AttorneyTab from './AttorneyTab';
import InfoTab from './InfoTab';
import OperationsTab from './OperationsHistoryTab';
import ScheduleTab from './ScheduleTab';
import styles, { itemWidth } from './styles';
import {getInquiriesOptions, getProductOptions} from './productOptions';
import {Dialog} from 'react-native-ui-lib';
import {Navigation} from 'react-native-navigation';
import {pushScreen} from '../../utils/navigationUtils';
import AdditionalCards from './AdditionalCards';
import BankTheme from '../../utils/bankTheme';
import { getTabsByProductType } from './getTabsByProductType';

const { width: viewportWidth } = Dimensions.get('window');
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

const qstyles = {
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    maxHeight: '100%',
    height: '100%',
    width: '100%',
  },
  dialog: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height:500,

  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  }
};

const PRODUCT_INFO_DISPATCHER_TIMEOUT = 1000;

const getCodeByType = (type) => {
  switch (type) {
    case 'cards':
      return 'PLCARD';
    case 'deposits':
      return 'FDEP';
    case 'credits':
      return 'LOAN';
    case 'accounts':
      return 'OD';
    default:
      return '';
  }
};

class OperationsPopupMenuClass extends React.Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onPress: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this._onPressItem = this._onPressItem.bind(this);
    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.props.getOperationAccess();

    this.state = {
      icon: null,
      options: [{ label: ' ', value: ' ' }],
      visible: false,
      modalVisible: false,
      isDialogVisible: false,
      productType: '',
      inputValue: ''//this.props.activeProduct.description
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.activeProduct) return null;

    if (prevState.id !== nextProps.activeProduct.id && prevState.productType !== nextProps.activeProduct.productType) {
      let newState = {
        inputValue: nextProps.activeProduct.description,
        id: nextProps.activeProduct.id,
        productType: nextProps.activeProduct.productType
      };

      return ({ ...newState })
    }

    return null;
  }

  render() {
    let { id } = this.props.activeProduct;
    let code = getCodeByType(this.props.productType);

    const {parentComponentId} = this.props;

    const options = getProductOptions({
      productType: getCodeByType(this.props.activeProduct.productType),
      activeProduct: this.props.activeProduct,
      parentComponentId: this.props.parentComponentId,
      operations: this.props.allowedOperations,
      sendCardRequisites: this.props.sendCardRequisites,
    });

    options.splice(options.length , 0, {
      label: 'Справки и выписки',
      action: () => this.setState({isDialogVisible: true}),
    });
    const height = (this.props.inquiries.length + 1) * 40 +  30;

    return (
      <View style={{
        flex: -1,
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: 'transparent',
        width: 43,
        height: 43
      }}>
        <TouchableOpacity onPress={() => this.setState({modalVisible: true})} style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name={'md-more'} size={30} color={"#fff"} />
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          transparent
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false})}>
            <View style={{width: '100%', height: '100%', alignItems: 'flex-end',}}>
              <View style={{ marginTop: 5, elevation: 4, backgroundColor: 'white', maxWidth: '76%'}}>
                <Text style={{fontSize: 18, padding: 10}}>
                  Операции:
                </Text>
                {
                  options.map(option => (
                    <TouchableOpacity key={option} onPress={() => this._onPressItem(option)}>
                      <Text style={{fontSize: 18, padding: 10}}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Dialog
          migrate
          bottom
          visible={this.state.isDialogVisible}
          onDismiss={() => this.setState({isDialogVisible: false})}
          width="100%"
          containerStyle={{...qstyles.dialog, height}}
          panDirection={'down'}
          supportedOrientations={['portrait']} // iOS only
        >
          {getInquiriesOptions(this.props.inquiries, this.props.activeProduct.id, this.closeDialog, parentComponentId)}
        </Dialog>

        <ModalInput
          visible={this.state.visible}
          title={'Название'}

          inputValue={this.state.inputValue}
          onChangeInput={(text) => {
            this.setState(() => ({ inputValue: text }))
          }}

          close={this._closeModal}
          onDone={() => {
            this.props.setDescriptionProduct(id, code, this.state.inputValue);
            this._closeModal();
          }}
        />
      </View>
    )
  }

  closeDialog = () => this.setState({isDialogVisible: false})

  _onPressItem(itemValue) {
    this.setState({ modalVisible: false});
    switch (itemValue.sid) {
      case 'changeDescr':
        this._openModal();
        break;
      default:
        itemValue.action && itemValue.action();
        break;
    }
  }

  _openModal() {
    this.setState({ visible: true })
  }

  _closeModal() {
    this.setState({ visible: false })
  }
}

const mapStateToPropsOBC = state => {
  const activeProduct = state.productPage.product;
  const productType = activeProduct.productType;
  const code = getCodeByType(productType);
  const inquiries = state.bankInquiries.inquiriesToOrder
    .filter(item => {
      if (!item.types.includes(code)) return false;
      if (code === 'PLCARD' &&  (item.cardTypes === 'credit' && activeProduct.type === 0 || item.cardTypes === 'debet' && !activeProduct.type === 1 )) return false;
      return true;
    })

  return {
    productType,
    activeProduct,
    inquiries,
    allowedOperations: state.productPage.allowedOperations,
    confAccess: state.paymentsPage.configuration,
  }
};

const mergePropOBC = (stateProps, dispatchProps, ownProps) => {
  const { id, } = stateProps.activeProduct ;
  const { dispatch } = dispatchProps;
  return {
  ...stateProps,
  ...ownProps,
  sendCardRequisites: () => dispatchProps.dispatch(sendRequisitesCard(stateProps.activeProduct.id)),
  getOperationAccess: () => dispatch(getOperationAccess(id, getCodeByType(stateProps.productType))),
  setDescriptionProduct: (id, code, inputValue) => dispatch(setDescriptionProduct(id, code, inputValue)),
  }
}

export const OperationsPopupMenu = connect(mapStateToPropsOBC, null, mergePropOBC)(OperationsPopupMenuClass);


class ProductScreen extends React.Component {

  static options = (props) => ({
    bottomTabs: {
      visible: false,
    },
    topBar: {
      rightButtons: [
        {
          component: {
            name: 'unisab/OperationsPopupMenu',
            passProps: {
              parentComponentId: props.componentId,
            }
          },
          id: 'product_operations',
        }
      ],
    }
  });

  constructor(props) {
    super(props);

    this.onPressViewAllHistory = this.onPressViewAllHistory.bind(this);
    this.addToWallet = this.addToWallet.bind(this);
    this.removeFromWallet = this.removeFromWallet.bind(this);

    this.state = {
      isDialogVisible: false,
      appState: 'active',
      id: props.activeProduct.id,
      type: props.productType,
      code: getCodeByType(props.productType),
      activeProduct: props.activeProduct,
      silentLoading: 0,
      isBottomPanelVisible: false,
      addWalletModal: false,
      isProductAddedToWallet: false,
      gPayErrorModalVisible: false,
      productWalletTokenTemp: '',
      walletState: {},

      productInfoRunner: null,
      tabHeaderIndex: 0,
      indexSlide: -1
    };

    this.infoPanel = null;
    this._deltaY = new Animated.Value(Screen.height);
    this._deltaX = new Animated.Value(0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const silentLoadingState = {};
    if (prevState.silentLoading === 1 && nextProps.loading) {
      silentLoadingState.silentLoading = 2;
    }
    if (!nextProps.loading && prevState.silentLoading === 2) {
      silentLoadingState.silentLoading = 0;
    }
    if (
      nextProps.activeProduct
      && nextProps.activeProduct.id
      && !_.isEqual(nextProps.activeProduct, prevState.activeProduct)
    ) {
      return {
        ...silentLoadingState,
        activeProduct: nextProps.activeProduct,
        id: nextProps.activeProduct.id,
        type: nextProps.activeProduct.productType,
        code: getCodeByType(nextProps.activeProduct.productType),
      }
    }
    return silentLoadingState;
  }

  pushListener;
  executeWalletListener;
  tokenDeletedListener;
  unknownErrorListener;
  changeListener;

  componentDidMount() {
    this.refresh();
    AppState.addEventListener('change', this.handleChangeAppState);
    Wallet.init(this.props.apiRoute);
  }

  handleChangeAppState = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.refresh(true);
    }
    this.setState({ appState: nextAppState, silentLoading: 1 });
  };

  componentWillUnmount() {
    this.props.dispatch({
      type: 'CLEAR_WALLETS',
    });
    this.clearListeners();
    if (this.walletInterval) {
      clearInterval(this.walletInterval);
    }
  }

  refresh(silent = false) {
    this.clearListeners();
    const context = this;
    this.pushListener = DeviceEventEmitter.addListener('pushProvisioning', () => context.setState(() => ({ addWalletModal: false }), () => context.infoPanel.snapTo({ index: 1 })));
    this.executeWalletListener = DeviceEventEmitter.addListener('executedWallet', async ({ result }) => {
      console.log('TOKEN ADDED');
      context.setState(() => ({ addWalletModal: false, isProductAddedToWallet: true, productWalletTokenTemp: result }), () => context.infoPanel.snapTo({ index: 1 }));
      context.props.dispatch(addPassWallet({ id: this.props.activeProduct.id, walletStr: result }));
    });
    this.tokenDeletedListener = DeviceEventEmitter.addListener('tokenDeleted', async () => {
      console.log('TOKEN DELETED');
      this.props.dispatch(getCardWallets({ id: this.state.id, uid: DeviceInfo.getUniqueId() }));
      const walletState = await this.getWalletState(this.props.wallets);
      context.setState(() => ({ walletState, isProductAddedToWallet: false, productWalletTokenTemp: "" }), () => {
        Alert.alert(
          `Внимание!`,
          `Ваша карта удалена`,
          [{ text: 'OK', onPress: () => null, }],
          { cancelable: true },
        );
      });
    });
    this.unknownErrorListener = DeviceEventEmitter.addListener('unkownGpayError', () => {
      context.setState(() => ({ isProductAddedToWallet: false, productWalletTokenTemp: "", addWalletModal: false, gPayErrorModalVisible: false }));
    });

    if(this.state.indexSlide === -1) {
      this.props.dispatch(getProductInfo(this.state.id, this.state.type, getCodeByType(this.state.type)));
    }

    if (this.state.type === 'cards') {
      this.props.dispatch(getCardWallets({ id: this.state.id, uid: DeviceInfo.getUniqueId() }));
    }

    this.changeListener = DeviceEventEmitter.addListener('changeListener', () => {
      this.refresh()
    });
  }

  clearListeners() {
    if (this.pushListener) {
      this.pushListener?.remove();
    }
    if (this.executeWalletListener) {
      this.executeWalletListener?.remove();
    }
    if (this.changeListener) {
      this.changeListener.remove();
    }
    if (this.tokenDeletedListener) {
      this.tokenDeletedListener.remove();
    }
    if (this.unknownErrorListener) {
      this.unknownErrorListener.remove();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.activeProduct.description && prevProps.activeProduct.description !== this.props.activeProduct.description) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: this.props.activeProduct.description,
          }
        }
      });
    }

    if (this.props.wallets.length !== prevProps.wallets.length
        || this.props.activeProduct.id !== prevProps.activeProduct.id) {
      this.refresh();
      const { wallets } = this.props;
      const walletState = await this.getWalletState(wallets);
      this.setState({ walletState, isProductAddedToWallet: this.isCardAdded(walletState) });
    }
  }

  isCardAdded(walletState) {
    let isAdded = false;
    for (const key in walletState) {
      isAdded = isAdded || walletState[key] === 'TOKEN_STATE_ACTIVE';
    }
    return isAdded;
  }

  async getWalletState(wallets) {
    const walletState = {};
    for (let i = 0; i < wallets.length; i++) {
      const item = wallets[i];
      const id = item.passId;
      try {
        const res = await Wallet.getTokenStatus(item.passId);
        walletState[id] = res.state;
      } catch (e) {
        walletState[id] = 'ERROR';
      }
    }
    return walletState;
  }

  addToWallet() {
    if (this.infoPanel !== null) {
      this.setState({ addWalletModal: true });
      this.infoPanel.snapTo({ index: 0 })
    }
  }

  removeFromWallet() {
    const onOk = () => {
      let token = '';
      for (const key in this.state.walletState) {
        if (this.state.walletState[key] === 'TOKEN_STATE_ACTIVE') {
          token = key;
          break;
        }
      }
      if (token) {
        Wallet.removeCard(token);
      }
    };
    Alert.alert(
      'Отключить Google Pay',
      'После отключения карты от Google Pay, Вы не сможете оплачивать покупки с помощью этого устройства.',
      [
        { text: 'Закрыть', style: 'cancel' },
        { text: 'Продолжить', onPress: onOk },
      ],
    );
  }


  googlePayCardErrorModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.gPayErrorModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 0.8, marginTop: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{ width: 64, height: 64 }}
              source={require('../../../img/ic_attention.png')}
            />
            <Text style={{ fontWeight: 'bold' }}>Ошибка</Text>
            <Text style={{ marginTop: 12, marginLeft: 42, marginRight: 24 }}>Похоже, карта уже добавлена в Google Pay на этом устройстве. Если нет, обратитесь в свой банк.</Text>
          </View>
          <View style={{ flex: 0.2, justifyContent: 'flex-end', paddingBottom: 12 }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  gPayErrorModalVisible: false
                })
              }}>
              <View style={{ backgroundColor: BankTheme.color1, justifyContent: 'center', alignItems: 'center', width: 112, height: 52, borderRadius: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  };

  showMessagePopup = (message) => {
    this.setState({
      shownCardNumberPopup: true,
      popupMessage: message,
    }, () => setTimeout(()=> this.setState({shownCardNumberPopup: false,}), 5000));
  }

  render() {
    let product = this.state.activeProduct;
    const { cards } = this.props;
    let isWallet = false;
    if (BankTheme.allowAddCardsToWallet) {
      const productIndexInCards = cards.findIndex(card => card.id === product.id);
      if (productIndexInCards > -1) {
        isWallet = cards[productIndexInCards].isWallet;
      }
    }
    const { index } = this.state;
    const routes = getTabsByProductType(this.props.productType, this.props.activeProduct);
    const height = (this.props.inquiries.length + 1) * 40 +  30;
    const snapPoints = [{ y: Screen.height * 0.25 }, { y: Screen.height + 75 }];
    return (
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={this.props.productsArr}
            firstItem={this.props.index}
            renderItem={this._renderCarouselItem}
            sliderWidth={viewportWidth}
            itemWidth={itemWidth}
            style={{ height: '100%' }}
            inactiveSlideOpacity={0.35}
            inactiveDotColor={"#c9c9c9"}
            paginationDotStyle={{ width: 8, height: 8, borderRadius: 4 }}
            dotContainerStyle={{ marginHorizontal: 3, paddingBottom: 10 }}
            onSlideChange={(index) => {
              this.setState({ indexSlide: index })
              const { productsArr, productType } = this.props;
              const { productInfoRunner } = this.state;

              const product = productsArr[index];
              if (productInfoRunner) {
                clearTimeout(productInfoRunner)
                this.setState({ productInfoRunner: null })
              }

              const timeoutRunner = setTimeout(() => {
                this.props.dispatch(
                  getProductInfo(
                    product.id,
                    product.productType || productType,
                    product.code
                  )
                );
              }, PRODUCT_INFO_DISPATCHER_TIMEOUT);
              this.setState({ productInfoRunner: timeoutRunner })
            }}
          />
        </View>
        <View style={styles.infoContainer}>
          {
            (this.props.loading) &&
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={BankTheme.color1} />
            </View>
          }
          <AndroidTabView
            navigationState={{ index, routes }}
            onSlideChange={(index) => {
              this.setState({
                tabHeaderIndex: index
              })
            }}
            renderScene={({ route }) => {
              switch (route.key) {
                case '1':
                  return (
                    <InfoTab
                      parentComponentId={this.props.componentId}
                      canAddPaymentPass={global.hasGms}
                      wallets={this.state.walletState}
                      isProductAddedToWallet={this.state.isProductAddedToWallet}
                      isWallet={isWallet}
                      wallet={this.props.wallet}
                      showMessagePopup={this.showMessagePopup}
                      confAccess={this.props.confAccess}
                      type={this.state.type || product.productType || this.props.productType}
                      product={product}
                      addToWallet={this.addToWallet}
                      removeFromWallet={this.removeFromWallet}
                      reissueCard={this.reissueCard}
                    />
                  );
                case '2':
                  return (
                    <OperationsTab
                      onPressAll={() => this.setState({isDialogVisible: true})}
                      type={this.state.type}//this.state.productType || product.productType || this.props.productType}
                      dispatch={this.props.dispatch}
                      id={this.state.id}
                      code={this.state.code}
                      currency={product.currency}
                      isActiveTab={this.state.tabHeaderIndex === 1}
                    />
                  );
                case '3':
                  return (
                    <AttorneyTab
                      proxy={this.props.activeProduct.proxy}
                    />
                  );
                case '4':
                  return (
                    <ScheduleTab
                      type={this.state.productType || product.productType || this.props.productType}
                      dispatch={this.props.dispatch}
                      id={this.state.id}
                      code={this.state.code}
                      currency={product.currency}
                    />
                  );
                case '5':
                  return (
                    <AdditionalCards
                      additionalCards={this.props.activeProduct.additionalCards}
                      changeAdditionalCardAccess={this.props.changeAdditionalCardAccess}
                    />
                  )
                default:
                  return <View style={{ flex: 1 }} />;
              }
            }}
            indicatorStyle={{ backgroundColor: BankTheme.color1 }}
          />
        </View>

        <View style={[styles.panelContainer]} pointerEvents={'box-none'}>
          {
            !this.state.addWalletModal ?
              null
              :
              <TouchableWithoutFeedback
                onPressIn={() => {
                  this.setState(() => ({ addWalletModal: false }), () => {
                    this.infoPanel.snapTo({ index: 1 })
                  })
                }}
              >
                <Animated.View
                  style={[styles.panelContainer, {
                    backgroundColor: 'black',
                    opacity: this._deltaY.interpolate({
                      inputRange: [0, Screen.height - 100],
                      outputRange: [0.5, 0],
                      extrapolateRight: 'clamp'
                    })
                  }]} />
              </TouchableWithoutFeedback>
          }
          <Interactable.View
            ref={ref => this.infoPanel = ref}
            verticalOnly={true}
            snapPoints={snapPoints}
            boundaries={{ top: -300 }}
            initialPosition={{ y: Screen.height + 75 }}
            animatedValueY={this._deltaY}
            animatedValueX={this._deltaX}
            dragEnabled={false}
          >
            <View style={{
              backgroundColor: '#fff',
              height: Screen.height,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              paddingBottom: 100,
              paddingTop: 0
            }}>
              <View style={{ flexDirection: 'row', marginBottom: 40, width: Screen.width - 80, alignItems: 'center', justifyContent: 'center' }}>
                {Platform.OS === 'ios' && <Image source={require('../../../assets/icons/google-pay.png')} style={{ height: 35, width: 50, marginRight: 40, resizeMode: 'contain' }} />}
                <Image source={require('../../../assets/images/common/payid.png')} style={{ height: Screen.height * 0.25, width: 80, resizeMode: 'contain' }} />
              </View>
              {Platform.OS === 'android' &&
                <Text style={{ fontWeight: 'bold', fontSize: 21, marginBottom: 10 }}>
                  Платите удобно с Google Pay
              </Text>}
              <Text style={{ textAlign: 'center', color: "#959595" }}>
                Поднесите Ваш телефон к терминалу {'\n'}
                на кассе и оплатите покупку в одно{'\n'}
                касание, не доставая карту.
              </Text>
              <TouchableWithoutFeedback onPress={() => {
                this.infoPanel.snapTo({ index: 1 });
                Wallet.getOPC(this.props.jwt, "" + this.props.activeProduct.id, this.props.activeProduct.description, this.props.activeProduct.clientName, this.props.activeProduct.number.slice(-4))
              }}>
                <View style={{ height: 56, width: 300, marginTop: 20 }}>
                  <WalletButton
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Interactable.View>
          {this.googlePayCardErrorModal()}
        </View>
        <Dialog
          migrate
          bottom
          visible={this.state.isDialogVisible}
          onDismiss={() => this.setState({isDialogVisible: false})}
          width="100%"
          containerStyle={{...qstyles.dialog, height}}
          panDirection={'down'}
          supportedOrientations={['portrait']} // iOS only
        >
          {getInquiriesOptions(this.props.inquiries, this.props.activeProduct.id, this.closeDialog, this.props.componentId)}
        </Dialog>

        {this.state.shownCardNumberPopup &&
          <View style={{
            backgroundColor: 'green',
            position: 'absolute',
            top: 0,
            width: '100%',
            height: 30,
            justifyContent: 'center'
          }}>
            <Text style={{color: 'white', textAlign: 'center'}}>
              Номер карты скопирован
            </Text>
          </View>
        }

      </View>
    )
  }

  reissueCard = () => {
    pushScreen({
      componentId: this.props.componentId,
      screenName: 'unisab/Document',
      sid: 'UBS_CARD_REISSUE',
      passProps: {
        sid: 'UBS_CARD_REISSUE',
        defaultValues: {
          'Документ.Идентификатор договора': this.props.activeProduct.id,
        }
      }
    });
  }

  closeDialog = () => this.setState({isDialogVisible: false})

  _renderCarouselItem = (el) => {
    let item = el.item;
    return (
      <View
        key={item.number}
        style={[styles.slideInnerContainer, { transform: [{ scale: 0.9 }] }]}
      >
        <View style={styles.imageContainer}>
          {item.logo && <Image source={{ uri: item.logo }} style={styles.image} />}
          <View style={styles.radiusMask} />
        </View>
      </View>
    );
  };

  onPressViewAllHistory(idx) {
    this.setState((prevState) => ({
      isBottomPanelVisible: !prevState.isBottomPanelVisible
    }), () => {
      this.bottomPanel.snapTo({ index: idx })
    })
  }
}

const mapStateToProps = (state) => {
  const activeProduct = state.productPage.product;
  const productType = activeProduct.productType;
  const code = getCodeByType(productType);
  const inquiries = state.bankInquiries.inquiriesToOrder
    .filter(item => {
      if (!item.types.includes(code)) return false;
      if (code === 'PLCARD' &&  (item.cardTypes === 'credit' && activeProduct.type === 0 || item.cardTypes === 'debet' && !activeProduct.type === 1 )) return false;
      return true;
    });
  return {
    inquiries,
    loading: state.productPage.loading || state.productPage.loadingOp,
    activeProduct: state.productPage.product,
    productType: state.productPage.product.productType,
    wallet: state.productPage.product.wallet,
    cards: state.myBankPage.cards,
    wallets: state.productPage.wallet ? state.productPage.wallet.wallets : [],
    apiRoute: state.api.apiRoute,
    confAccess: state.paymentsPage.configuration,
};}

const mapDispatchToProps = (dispatch) => ({
  changeAdditionalCardAccess: (cardId, access) => {
    dispatch(changeAdditionalCardState(cardId, access));
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);
