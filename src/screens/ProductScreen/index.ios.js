import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import Interactable from 'react-native-interactable';

import { getCardWallets, getProductInfo, setDescriptionProduct, sendRequisitesCard } from '../../api/actions';

import {
  ActivityIndicator,
  Platform,
  Dimensions,
  View,
  Image,
  ActionSheetIOS,
  Animated,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  Linking
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import { Navigation } from 'react-native-navigation';

import { TextRenderer as Text } from '../../components/TextRenderer';
import ModalInput from '../../components/Inputs/ModalInput';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../../containers/Carousel';

import PassKit, { AddPassButton } from 'react-native-passkit-wallet';
import Wallet from '../../modules/Wallet';

import { TabViewAnimated, TabBar } from 'react-native-tab-view';

import InfoTab from './InfoTab';
import OperationsTab from './OperationsHistoryTab';
import AttorneyTab from './AttorneyTab';
import ScheduleTab from './ScheduleTab';

import styles, { itemWidth } from './styles';
import {getProductOptions, getInquiriesOptions,} from './productOptions';
import {Dialog} from 'react-native-ui-lib';
import {pushScreen} from '../../utils/navigationUtils';
import AdditionalCards from './AdditionalCards';
import { getTabsByProductType } from './getTabsByProductType';
import { changeAdditionalCardState , getOperationAccess } from '../../api/actions';
import BankTheme from '../../utils/bankTheme';
import AddToAppleWalletPanel from "./AddToAppleWalletPanel";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

const PRODUCT_INFO_DISPATCHER_TIMEOUT = 1000;

const getCodeByType = type => {
  switch (type) {
    case 'cards':
      return 'PLCARD';
      break;
    case 'deposits':
      return 'FDEP';
      break;
    case 'credits':
      return 'LOAN';
      break;
    case 'accounts':
      return 'OD';
    default:
      return '';
  }
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

class OperationsButtonClass extends React.Component {
  constructor(props) {
    super(props);

    this._openModal = this._openModal.bind(this);
    this._closeModal = this._closeModal.bind(this);
    this.props.getOperationAccess();
    this.state = {
      options: [],
      isDialogVisible: false,
      visible: false,
      inputValue: this.props.activeProduct.description
    };
  }

  closeDialog = () => this.setState({isDialogVisible:false});

  render() {
    const { id } = this.props.activeProduct;
    const code = getCodeByType(this.props.productType);

    const options = getProductOptions({
      parentComponentId: this.props.parentComponentId,
      productType: getCodeByType(this.props.activeProduct.productType),
      activeProduct: this.props.activeProduct,
      sendCardRequisites: this.props.sendCardRequisites,
      operations: this.props.allowedOperations,
    });

    options.splice(options.length -1, 0, {
      label: 'Справки и выписки',
      action: () => this.setState({isDialogVisible: true}),
    });
    const height = (this.props.inquiries.length + 1) * 40 +  30;
    return (
      <TouchableOpacity
        disabled={!this.props.activeProduct.productType}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: options.map(e => e.label),
              cancelButtonIndex: options.length - 1 //7,
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                this._openModal();
              } else {
                if (options[buttonIndex] && options[buttonIndex].action) {
                  options[buttonIndex].action();
                }
              }
            }
          );
        }}
        style={{
          width: 43,
          height: 43,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 5,
          marginRight: -5
        }}
      >
        <Icon name={'ios-more'} size={30} color={'#fff'} />

        <ModalInput
          visible={this.state.visible}
          title={'Название'}
          inputValue={this.state.inputValue}
          onChangeInput={text => {
            this.setState(() => ({ inputValue: text }));
          }}
          close={this._closeModal}
          onDone={() => {
            this.props.setDescriptionProduct(id, code, this.state.inputValue);
            this._closeModal();
          }}
        />
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
          {getInquiriesOptions(this.props.inquiries, this.props.activeProduct.id, this.closeDialog, this.props.parentComponentId)}
        </Dialog>
      </TouchableOpacity>
    );
  }

  _openModal() {
    this.setState(() => ({ visible: true }));
  }

  _closeModal() {
    this.setState(() => ({ visible: false }));
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
    });
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
}}

export const OperationsButton = connect(mapStateToPropsOBC, null, mergePropOBC)(OperationsButtonClass);

class ProductScreen extends React.Component {

  constructor(props) {
    super(props);

    this.onPressViewAllHistory = this.onPressViewAllHistory.bind(this);
    this.addToWallet = this.addToWallet.bind(this);

    this.state = {
      id: props.activeProduct.id,
      type: props.productType,
      code: getCodeByType(props.productType),
      activeProduct: props.activeProduct,

      index: 0,
      isBottomPanelVisible: false,
      isProductAddedToWallet: false,
      gPayErrorModalVisible: false,
      productWalletTokenTemp: '',
      canAddPaymentPass: false,
      isDialogVisible: false,
      isAddToWalletVisible: false,
      productInfoRunner: null,
      popupMessage: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.activeProduct &&
      nextProps.activeProduct.id &&
      !_.isEqual(nextProps.activeProduct, prevState.activeProduct)
    ) {
      return {
        activeProduct: nextProps.activeProduct,
        id: nextProps.activeProduct.id,
        type: nextProps.activeProduct.productType,
        code: getCodeByType(nextProps.activeProduct.productType),
      };
    }
    return null;
  }

  componentDidMount() {
    this.getWalletState();
    DeviceEventEmitter.addListener('executeWallet', function ({ result }) {
      // handle event.
      const { codeResult, values } = JSON.parse(result);
      if (codeResult === 0) {
        const opc = values.find(({ name }) => name === 'Данные аутентификации').value;

        Wallet.pushProvisioning(opc, 'Visa', '0123');
      }
    });

    this.props.dispatch(getProductInfo(this.state.id, this.state.type, getCodeByType(this.state.type)));
    if (this.state.type === 'cards') {
      this.props.dispatch(getCardWallets({ id: this.state.id, uid: DeviceInfo.getInstanceId() }));
    }
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons: [
          {
            component: {
              name: Platform.OS === 'ios' ? 'unisab/OperationsButton' : 'unisab/OperationsPopupMenu',
              passProps: {
                parentComponentId: this.props.componentId,
              }
            },
            id: 'product_operations',
          }
        ],
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.activeProduct.description &&
      prevProps.activeProduct.description !== this.props.activeProduct.description
    ) {
      Navigation.mergeOptions(this.props.componentId, {
        topBar: {
          title: {
            text: this.props.activeProduct.description,
            color: 'white',
            alignment: 'center',
          }
        }
      });
    }

    if (
      this.props.wallets.length !== prevProps.wallets.length ||
      this.props.activeProduct.id !== prevProps.activeProduct.id
    ) {
      this.getWalletState();
    }
  };

  getWalletState = async () => {
    try {
      const result = await Wallet.canAddPaymentPass();

      const { cards, activeProduct } = this.props;
      const cardsState = {};
      for (let i = 0; i < cards.length; i++) {
        const item = cards[i];
        const id = item.id;
        try {
          const suffix = item.number.substr(item.number.length - 4, item.number.length);
          const res = await Wallet.checkCardBySuffix(suffix);
          cardsState[id] = res;
        } catch (e) {
          cardsState[id] = 'ERROR';
        }
      }

      this.setState({
        canAddPaymentPass: true,
        cardsState,
        isProductAddedToWallet: this.isCardAdded(cardsState, activeProduct.id)
      });
    } catch (error) {
      //ignore
    }
  };

  isCardAdded(cardsState, id) {
    let isAdded = false;
    for (const key in cardsState) {
      if (key == id) isAdded = cardsState[key].isInWallet;
    }
    return isAdded;
  }

  addToWallet() {
    this.setState({ isAddToWalletVisible: true });
  }

  removeFromWallet() {
    Wallet.openWallet();
  }

  render() {
    const height = (this.props.inquiries.length + 1) * 40 +  30;
    let product = this.state.activeProduct;
    const { cards } = this.props;
    const { isProductAddedToWallet, canAddPaymentPass, index } = this.state;

    const routes = getTabsByProductType(this.props.productType, this.props.activeProduct);
    let isWallet = false;
    if (BankTheme.allowAddCardsToWallet) {
      const productIndexInCards = cards.findIndex(card => card.id === product.id);
      if (productIndexInCards > -1) {
        isWallet = cards[productIndexInCards].isWallet;
      }
    }

    return (
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Carousel
            data={this.props.productsArr || []}
            firstItem={this.props.index}
            renderItem={this._renderCarouselItem}
            sliderWidth={viewportWidth}
            itemWidth={itemWidth}
            style={{ height: '100%' }}
            inactiveSlideOpacity={0.35}
            inactiveDotColor={'#c9c9c9'}
            paginationDotStyle={{ width: 8, height: 8, borderRadius: 4 }}
            dotContainerStyle={{ marginHorizontal: 3, paddingBottom: 10 }}
            onSlideChange={index => {
              const { productsArr, productType } = this.props;
              const { productInfoRunner } = this.state;

              const product = productsArr[index];
              if (productInfoRunner) {
                clearTimeout(productInfoRunner)
                this.setState({ productInfoRunner: null })
              }

              const timeoutRunner = setTimeout(() => {
                this.setState({ index: 0 })
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
          {this.props.loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={BankTheme.color1} />
            </View>
          )}

          <TabViewAnimated
            style={{
              flex: 1
            }}
            navigationState={{ index, routes }}
            renderScene={({ route }) => {
              switch (route.key) {
                case '1':
                  return (
                    <InfoTab
                      parentComponentId={this.props.componentId}
                      isProductAddedToWallet={isProductAddedToWallet}
                      canAddPaymentPass={canAddPaymentPass}
                      isWallet={isWallet}
                      wallet={this.props.wallet}
                      confAccess={this.props.confAccess}
                      type={this.state.type || product.productType || this.props.productType}
                      product={product}
                      addToWallet={this.addToWallet}
                      showMessagePopup={this.showMessagePopup}
                      removeFromWallet={this.removeFromWallet}
                      reissueCard={this.reissueCard}
                    />
                  );
                case '2':
                  return (
                    <OperationsTab
                      onPressAll={() => this.setState({isDialogVisible: true})}
                      type={this.state.type} //this.state.productType || product.productType || this.props.productType}
                      dispatch={this.props.dispatch}
                      id={this.state.id}
                      code={this.state.code}
                      currency={product.currency}
                      isActiveTab={this.state.index === 1}
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
                  return null;
              }
            }}
            renderHeader={props => (
              <TabBar
                {...props}
                renderLabel={el => {
                  return <Text style={{ paddingVertical: 5, fontWeight: '300', fontSize: 14 }}>{el.route.title}</Text>;
                }}
                indicatorStyle={{ backgroundColor: BankTheme.color1 }}
                style={{ backgroundColor: '#fff' }}
                labelStyle={{ color: '#000' }}
              />
            )}
            onIndexChange={index => {
              this.setState({ index })
            }
            }
            initialLayout={{
              height: 0,
              width: Dimensions.get('window').width
            }}
          />
        </View>

        <AddToAppleWalletPanel
          isVisible={this.state.isAddToWalletVisible}
          onHide={() => this.setState({ isAddToWalletVisible: false })}
          activeProduct={this.props.activeProduct}
          apiRoute={this.props.apiRoute}
          jwt={this.props.jwt}
        />

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
              {this.state.popupMessage}
            </Text>
          </View>
        }

      </View>
    );
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

  showMessagePopup = (message) => {
    this.setState({
      shownCardNumberPopup: true,
      popupMessage: message,
    }, () => setTimeout(()=> this.setState({shownCardNumberPopup: false,}), 5000));
  }

  closeDialog = () => this.setState({isDialogVisible: false})

  _renderCarouselItem(el) {
    let item = el.item;
    return (
      <TouchableOpacity
        key={item.number}
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          // alert(`You've clicked `);
        }}
      >
        <View style={styles.imageContainer}>
          {/*style={styles.cardContainer}>*/}
          {item.logo && <Image source={{ uri: item.logo }} style={styles.image} />}
          <View style={styles.radiusMask} />
        </View>
      </TouchableOpacity>
    );
  }

  onPressViewAllHistory(idx) {
    this.setState(
      prevState => ({
        isBottomPanelVisible: !prevState.isBottomPanelVisible
      }),
      () => {
        this.bottomPanel.snapTo({ index: idx });
      }
    );
  }
}

const mapStateToProps = (state, ownProps) => {
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
}};

const mapDispatchToProps = (dispatch) => ({
  changeAdditionalCardAccess: (cardId, access) => {
    dispatch(changeAdditionalCardState(cardId, access));
  },
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);
