import React from 'react';
import {
  Alert, Platform, Text,
  ScrollView, RefreshControl, AsyncStorage, DeviceEventEmitter, View, YellowBox, LogBox, BackHandler, Linking
} from 'react-native';
import _ from 'lodash';
import {
  advertising,
  sync,
  listServicePayment,
} from '../../api/actions';
import CollapseProducts from './CollapseProducts'
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import { Navigation } from "react-native-navigation";

import {Button } from 'react-native-ui-lib';

import CategoriesPanel from './CategoriesPanel';
import CarouselPersonalOffers from './CarouselPersonalOffers';
import CarouselAdvertisement from "./CarouselAdvertesiment";
import BankTheme from '../../utils/bankTheme';
import androidBeforeExit from '../../utils/androidBeforeExit';
import {navigateByQuickAction} from '../../utils/navigationUtils';
import ContractDataErrorModal from './ContractDataErrorModal';

const QuickActions = require('react-native-quick-actions');

const REQUEST_MESSAGES_PERIOD = 60000 * 3;
const REQUEST_PERSONAL_OFFERS_PERIOD = 30000 * 3;
const REQUEST_LIST_PAYMENT_PERIOD = 30000 * 3;

const qstyles = {
  mainContainer: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    maxHeight: '100%',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default class MyBankScreen extends React.Component {
  static defaultProps = {
    carouselAds: []
  };

  static options = (props) => {
    let rightButtons = [];
    if (BankTheme.showPersonalOffersOnMyBankPage) {
      rightButtons.push(
        {
          id: 'mybank_personalOfferList',
          component: {
            name: 'IconPersonalOffers',
            passProps: {
              parentComponentId: props.componentId,
            }
          }
        });
    }

    if (BankTheme.showHeaderQrButton) { 
      rightButtons.push(
        {
          id: 'mybank_QRCode',
          component: {
            name: 'IconQRCode',
            passProps: {
              parentComponentId: props.componentId,
            }
          }
        });
    }
    if (BankTheme.pushNotificationsUsed) {
      rightButtons.push(
        {
          id: 'mybank_iconNotificaions',
          component:{
            name: 'IconNotifications',
            passProps: {
              parentComponentId: props.componentId,
            }
          }
        });
    }
    return {
        topBar: {
          title: {
            component: {
              name: 'unisab/CustomTopBar',
              passProps: {
                title: 'Мой банк',
                badgeMenu: true,
                parentComponentId: props.componentId,
              }
            }
          },
          rightButtons,
        }
      };
  }

  _onRefresh = () => {
    this.props.dispatch(advertising());
    this.props.dispatch(sync());
  };

  constructor(props) {
    super(props);
    // Здесь это нужно, чтобы в промежутке между отображением загрузки и didAppear нельзя было нажать назад
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
    this._onCollapse = this._onCollapse.bind(this);
    this._getListServicePayment = this._getListServicePayment.bind(this); //ubs
    this.swipes = {};
    this.onSwipeRef = this.onSwipeRef.bind(this);
    this.recenter = this.recenter.bind(this);
    this.state = {
      selected: (new Map([['cards', true]]) : Map<string, boolean>),
      screenVisibility: false,
      input: '',
      loading: true,
      isLoaded: false,
      showb: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const isLoading = nextProps.cardsLoading
      || nextProps.depositsLoading
      || nextProps.creditsLoading
      || nextProps.accountsLoading;

    const isLoaded = prevState.isLoaded || !isLoading;

    return {
      isLoaded,
      loading: isLoading
    }
  }

  onSwipeRef(ref, type) {
    if (!this.swipes[type]) {
      this.swipes[type] = [];
    }
    this.swipes[type].push(ref);
  }

  recenter({ index, all = false, type }) {
    if (all) {
      _.concat([], _.values(this.swipes)).forEach(swipeable => {
        if (Array.isArray(swipeable)) {
          swipeable.map(s => {
            s.recenter && s.recenter()
          })
        }
        swipeable.recenter && swipeable.recenter()
      })
    } else {
      this.swipes[type][index] && this.swipes[type].forEach((swipeable, idx) => {
        if (index !== idx) {

          swipeable.recenter();
          let sw = _.values(_.omit(this.swipes, [type]));
          let b = [];
          sw.map(e => b = [...b, ...e]);
          b.forEach(swipeable => {
            swipeable.recenter && swipeable.recenter()
          })
        }
      })
    }
  }

  componentDidAppear() {
    if (this.props.contractDataErrorModalVisible) {
      Navigation.showOverlay({
        component: {
          name: 'unisab/contractDataErrorModal',
          options: {
            layout: {
              componentBackgroundColor: 'transparent',
            },
            overlay: {
              interceptTouchOutside: true
            }
          }
        }
      });
    }
    this.props.setLogonRootTabId();
    if (!this.androidBackButtonListener) {
      this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
    }
    AsyncStorage.getItem('initialAction', async (err, title) => {
      if (title) {
        navigateByQuickAction(this.props.componentId, title);
        await AsyncStorage.setItem('initialAction', '');
      }
    });
    QuickActions.popInitialAction()
      .then((action) => {
        if (action !== null) {
          navigateByQuickAction(this.props.componentId, title);
        }
      })
      .catch(() => {
      });

    DeviceEventEmitter.addListener(
      'quickActionShortcut', function (data) {
        if (data !== null) {
          navigateByQuickAction(this.props.componentId, data.title);
        }
      });

    if (this.props.initialUrl) {
      this.props.handleOpenWithUrl();
    }
  }

  componentDidDisappear() {
    if (this.androidBackButtonListener) {
      this.androidBackButtonListener?.remove();
      this.androidBackButtonListener = null;
    }
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  };

  componentDidMount() {
    this.getMessagesTimer = setInterval(this.props.getMessages, REQUEST_MESSAGES_PERIOD);
    this.getPersonalOffersTimer = setInterval(this.props.getPersonalOffers, REQUEST_PERSONAL_OFFERS_PERIOD)
    this.getListServicePaymentTimer = setInterval(this._getListServicePayment, REQUEST_LIST_PAYMENT_PERIOD); //ubs
    this.navigationEvents = Navigation.events().bindComponent(this);
    this.urlListener = Linking.addListener('url',async (param) => {
      this.props.handleOpenWithUrl(param.url);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.initialUrl && (this.props.initialUrl !== prevProps.initialUrl) && !this.props.contractDataWarningVisible) {
      this.props.handleOpenWithUrl();
    }
  }

  componentWillUnmount() {
    clearInterval(this.getMessagesTimer);
    clearInterval(this.getPersonalOffersTimer);
    this.navigationEvents?.remove();
    this.urlListener?.remove();
  }

  render() {
    return (
      <View style={qstyles.container}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this._onRefresh}
            />
          }
        >
          {BankTheme.showPersonalOffersOnMyBankPage && (
            <CarouselPersonalOffers
              personalOffers={this.props.personalOffers}
              selectPersonalOffer={this.props.selectPersonalOffer}
            />
          )}

          <CollapseProducts
            update={this.props.update}
            loading={this.props.cardsLoading || this.props.loading}
            parentComponentId={this.props.componentId}
            confAccess={this.props.confAccess}
            type={'cards'}
            products={this.props.cards}
            collapsed={!this.state.selected.get('cards')}
            onCollapse={this._onCollapse}
            headerTitle={'Карты'}
            headerIcon={<Icon name={'ios-card'} color={'#9fa2a4'} size={25}/>}
            onSwipeRef={this.onSwipeRef}
            recenter={this.recenter}
          />

          {(this.props.deposits.length > 0 || this.props.accounts.length > 0) && (
            <CollapseProducts
              update={this.props.update}
              loading={this.props.depositsLoading || this.props.accountsLoading || this.props.loading}
              parentComponentId={this.props.componentId}
              confAccess={this.props.confAccess}
              type={'deposits'}
              products={[...this.props.deposits, ...this.props.accounts]}
              collapsed={!this.state.selected.get('deposits')}
              onCollapse={this._onCollapse}
              headerTitle={'Вклады и счета'}
              headerIcon={<Icon name={'ios-briefcase-outline'} color={'#9fa2a4'} size={25} />}
              onSwipeRef={this.onSwipeRef}
              recenter={this.recenter}
            />)
          }

          {this.props.credits.length > 0 && (
            <CollapseProducts
              update={this.props.update}
              loading={this.props.creditsLoading || this.props.loading}
              parentComponentId={this.props.componentId}
              confAccess={this.props.confAccess}
              type={'credits'}
              products={this.props.credits}
              collapsed={!this.state.selected.get('credits')}
              onCollapse={this._onCollapse}
              headerTitle={'Кредиты'}
              headerIcon={<Icon name={'ios-cash-outline'} color={'#9fa2a4'} size={25} />}
              onSwipeRef={this.onSwipeRef}
              recenter={this.recenter}
            />
          )}

          <View style={{flex: 1, alignItems: 'center',}}>
            <Button label='Оформить новый продукт'
                    style={{width: '80%', marginTop: 15, borderRadius: 1, fontSize: 16, backgroundColor: BankTheme.color1}}
                    onPress={() => this._panel.show()} />
          </View>

          <View style={{width: '100%', paddingTop: 40,}}>
            <CarouselAdvertisement
              advertisement={this.props.advertisement}
            />
          </View>

        </ScrollView>

        <CategoriesPanel ref={c => this._panel = c}
          categories={this.props.categories}
          selectCategory={this.props.selectCategory}
        />

      </View>

    );
  }

  _onCollapse(key) {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(key, !selected.get(key)); // toggle
      return { selected };
    });
  }


 _getListServicePayment() {
   if(!this.props.ABC && this.props.uidRequestSend && this.props.uidRequestSend !== '') {
     this.props.dispatch(listServicePayment(this.props.uidRequestSend));
   } else {
     clearInterval(this.getListServicePaymentTimer);
   }
 }

}
