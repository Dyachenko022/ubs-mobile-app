import React, {Children} from 'react';
import {connect} from 'react-redux';

import {
  ScrollView,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Animated,
  Dimensions,
  BackHandler,
  ImageBackground,
  Linking
} from 'react-native'
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from "../../components/TextRenderer";
import Transfer from './Transfer';
import Payment from './Payment';
import PaymentBills from './PaymentBills';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

import styles from './styles'
import {Navigation} from 'react-native-navigation';
import {setLogonRootTabId} from '../../reducers/routing/actions';
import BankTheme from '../../utils/bankTheme';
import androidBeforeExit from '../../utils/androidBeforeExit';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};
const transfer = {
  sids: [
    "UBS_TRANSFER_ACC",
    "UBS_PAYM_ORDER_TAX",
    "UBS_PAYMENT_ORDER",
    "UBS_PAYM_ORDER_CURR",
    "UBS_PAYM_ORDER_FIZ",
    'UBS_TRANSFER_CARD',
    "UBS_PAYM_ORDER_YUR",
    "UBS_BUY_CURR",
    "UBS_P2P_BEST2PAY",
    "UBS_TRANSFER_SBP",
    "UBS_SBP_REQUEST_TR",
    "UBS_PAYMENT_QR",
  ],
  rusSids: {
    "UBS_TRANSFER_ACC": "Между счетами",
    "UBS_PAYM_ORDER_TAX": "В бюджетные организации",
    "UBS_PAYMENT_ORDER": "Клиенту банка",
    "UBS_TRANSFER_CARD": "На карту другого банка",
    "UBS_PAYM_ORDER_FIZ": "В другой банк",
    "UBS_PAYM_ORDER_YUR": "Организации",
    "UBS_BUY_CURR": "Конвертация валюты",
    "UBS_PAYM_ORDER_CURR": 'Валютный перевод',
    "UBS_P2P_BEST2PAY" : "Перевод с карты на карту",
    "UBS_TRANSFER_SBP": "По номеру телефона",
    "UBS_PAYMENT_QR": "Оплата по QR-коду",
    "UBS_SBP_REQUEST_TR": "Запрос на пополнение счета",
  },
}

class PaymentsTabScreen extends React.Component {
  static defaultProps = {
    order: [],
    operations: [],
    count: 0,

    isDefaultNavBar: false,
    defaultDocumentValues: {},
    accountsToPay: 0
  };

  static options = (props) => ({
    topBar: {
      title: {
        component: {
          name: 'unisab/CustomTopBar',
          passProps: {
            title: 'Платежи и переводы',
            badgeMenu: props.burger === undefined ? true : props.burger,
            parentComponentId: props.componentId,
          }
        },
      },
    },
    bottomTabs: {
      visible: props.hideBottomTabs === undefined ? true : !props.hideBottomTabs,
    }
  });

  componentDidAppear() {
    if (!this.hideBottomTabs) this.props.setLogonRootTabId(); //Эту форму можно еще открыть со свайпов на странице МОйБанк
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  };

  constructor(props) {
    super(props);
    this._renderCarouselItem = this._renderCarouselItem.bind(this);
    Navigation.events().bindComponent(this);
  }


  componentDidMount() {
    if (this.props.accountsToPay && this.props.accountsToPay.length) {
      Navigation.mergeOptions('PAYMENT_TAB_PAGE',{
        bottomTab: {
          badge: this.props.accountsToPay.length > 0 ? this.props.accountsToPay.length.toString() : '',
          badgeColor: '#d72d18',
        },
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const prevAccountsToPay = prevProps.accountsToPay || {};
    const nextAccountsToPay = this.props.accountsToPay ||{};
    if (prevAccountsToPay.length !== nextAccountsToPay.length ) {
      Navigation.mergeOptions('PAYMENT_TAB_PAGE',{
        bottomTab: {
          badge: this.props.accountsToPay.length > 0 ? this.props.accountsToPay.length.toString() : '',
          badgeColor: '#d72d18',
        },
      });
    }
  }

  _renderCarouselItem(el, index) {
    let item = el.item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.slideInnerContainer}
        onPress={() => {
          Linking.openURL(item.link);
        }}
      >
        <ImageBackground
          source={{uri: item.imageMobile}}
          style={styles.image}
          imageStyle={styles.backgroundImage}
        >

          <View style={styles.textConteiner}>
            <Text style={styles.newsDescription}>
              {item.title}
            </Text>
          </View>

        </ImageBackground>
      </TouchableOpacity>
    );
  }

  render() {
    const showAll = !this.props.onlyPayments;
    return (
      <View style={{flex: 1, backgroundColor: '#f2f5f7'}}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>

          {showAll && (
            <>
              <Text style={styles.title}>Переводы</Text>
              <Transfer
                        parentComponentId={this.props.componentId}
                        {...transfer}
                        data={this.props.configuration}
                        defaultDocumentValues={this.props.defaultDocumentValues}
              />
            </>
          )}

          <Text style={styles.title}>Платежи</Text>
          <Payment parentComponentId={this.props.componentId}
                   data={this.props.services}
                   providers={this.props.providers}
                   defaultDocumentValues={this.props.defaultDocumentValues}
          />

          {
            this.props.accountsToPay.length ?
              Children.toArray([
                <Text style={styles.title}>Счета на оплату</Text>,
                <PaymentBills
                  parentComponentId={this.props.componentId}
                  data={this.props.accountsToPay}
                />
              ])
              :
              null
          }

          {
            this.props.loading &&
            <View style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",

              position: 'absolute',
              zIndex: 2,
              width: '100%',
              height: '100%',

              backgroundColor: 'rgba(255,255,255,.85)'
            }}>
              <ActivityIndicator size="large" color={BankTheme.color1}/>
            </View>
          }

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  configuration: state.paymentsPage.configuration,
  providers: state.paymentsPage.providers,
  services: state.paymentsPage.services,
  systems: state.paymentsPage.systems,
  accountsToPay: state.paymentsPage.accountsToPay,
  loading: state.paymentsPage.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setLogonRootTabId: () => dispatch(setLogonRootTabId(ownProps.componentId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsTabScreen);
