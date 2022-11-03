import React from 'react';
import PropTypes from 'prop-types';
import { View, AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import Touchable from '../../../components/Touchable'
import { TextRenderer as Text } from '../../../components/TextRenderer';

import Collapse from './Collapsible';
import CollapseHeader from './Collapsible/CollapseHeader';
import ProductCard from '../../../components/ProductBlock';
import SwipeOut from '../../../components/SwipeOut'

import { setProductInfo } from '../../../api/actions';
import styles from './styles'
import { appColors } from '../../../utils/colors';
import {pushScreen} from '../../../utils/navigationUtils';

const openModal = ({ passProps, parentComponentId, screen, title }) => {
  pushScreen({
    componentId: parentComponentId,
    screenName: screen,
    title,
    showBackButtonTitle: false,
    passProps,
  });
};

class CollapseProduct extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    products: PropTypes.array.isRequired,

    collapsed: PropTypes.bool,
    onCollapse: PropTypes.func,

    headerTitle: PropTypes.string,
    headerIcon: PropTypes.element,
  };

  constructor(props) {
    super(props);

    this.state = {
      hiddenProducts: false,
      dataLength: this.props.products.length
    };

    this.swipes = [];

    this.getHiddenProducts = this.getHiddenProducts.bind(this);
  }

  componentDidMount() {
    this.getHiddenProducts()
  }

  componentDidUpdate(pP) {
    if (pP.update !== this.props.update) this.getHiddenProducts()
  }

  async getHiddenProducts() {
    try {
      let hiddenProducts = await AsyncStorage.getItem('hiddenProducts');
      this.setState(() => ({ hiddenProducts: hiddenProducts === 'true' }));
    } catch (e) {
    }
  }

  get isAddButtonShown() {
    return false; //Пока это нигде не используется, но может быть новые банки будут использовать...
    let isAccessDisable = false;
    switch (this.props.type) {
      case 'deposits':
      case 'accounts':
        isAccessDisable = this.props.confAccess['UBS_DEPOSIT_OPEN'] == 0;
        break;
      case 'cards':
        isAccessDisable = this.props.confAccess['UBS_CARD_ISSUE'] == 0;
        break;
      case 'credits':
        isAccessDisable = this.props.confAccess['UBS_FO_CREATE_CLAIM'] == 0;
        break;
    }

    return this.props.type && !isAccessDisable;
  }

  generateButtons = ({ props, data = [] }) => {
    return data.map(el => (
      <Touchable
        onPress={() => {
          this.props.recenter({ all: true });
          openModal({
            title: el.title || '',
            parentComponentId: props.parentComponentId,
            screen: el.screen || 'unisab/Document',
            passProps: el.passProps || {}
          })
        }}
        style={{ backgroundColor: el.color }}>
        <View style={styles.swipeOut}>
          <Text style={styles.swipeOutText}>{el.text}</Text>
        </View>
      </Touchable>
    ))
  };

  swipeButtons = (props) => {
    let operations = [];

    switch (props.productType) {
      case 'deposits':
        operations = [
          {
            screen: 'unisab/Document',
            color: appColors.green,
            text: 'Пополнить',
            passProps: {
              sid: 'UBS_TRANSFER_ACC',
              defaultValues: {
                'Документ.Источник зачисления': props.account
              }
            }
          },
          {
            screen: 'unisab/PaymentsTabScreen',
            color: appColors.yellow,
            text: 'Перевести',
            title: 'Выбор платежа',
            passProps: {
              sid: 'UBS_SERVICE_PAYMENT',
              burger: false,
              hideBottomTabs: true,
              defaultDocumentValues: {
                'Документ.Источник списания': props.account
              }
            }
          },
          {
            screen: 'unisab/Document',
            color: appColors.red,
            text: 'Закрыть',
            passProps: {
              sid: 'UBS_DEPOSIT_CLOSE',
              defaultValues: {
                'Документ.Идентификатор договора': props.id
              }
            }
          }
        ]
        break;
      case 'credits':
        operations = [
          {
            screen: 'unisab/Document',
            color: appColors.green,
            text: 'Пополнить',
            passProps: {
              sid: 'UBS_TRANSFER_ACC',
              defaultValues: {
                'Документ.Идентификатор договора': props.id,
                'Код бизнеса': props.code || 'LOAN'
              }
            }
          },
          {
            screen: 'unisab/Document',
            color: appColors.yellow,
            text: 'Погасить',
            passProps: {
              sid: 'UBS_LOAN_AHEAD_PAYM',
              defaultValues: {
                'Документ.Идентификатор договора': props.id,
                'Код бизнеса': props.code || 'LOAN'
              }
            }
          }
        ];
        break;
      case 'cards':
        if (props.state === 'blocked') {
          return this.generateButtons({
            props,
            data: [
              {
                screen: 'unisab/Document',
                color: appColors.red,
                text: 'Разблокировать',
                passProps: {
                  sid: 'UBS_CARD_CHANGESTATE',
                  defaultValues: {
                    'Документ.Идентификатор договора': props.id
                  }
                }
              },
            ]
          });
        } else {
          operations = [
            {
              screen: 'unisab/Document',
              color: appColors.green,
              text: 'Пополнить',
              passProps: {
                sid: 'UBS_TRANSFER_ACC',
                defaultValues: {
                  'Документ.Источник зачисления': props.number
                }
              }
            },
            {
              screen: 'unisab/PaymentsTabScreen',
              color: appColors.yellow,
              text: 'Оплатить',
              onlyPayments: true,
              title: 'Выбор платежа',
              passProps: {
                sid: 'UBS_SERVICE_PAYMENT',
                burger: false,
                hideBottomTabs: true,
                defaultDocumentValues: {
                  'Документ.Источник списания': props.number
                }
              }
            },
            {
              screen: 'unisab/Document',
              color: appColors.red,
              text: 'Блокировать',
              passProps: {
                sid: 'UBS_CARD_CHANGESTATE',
                defaultValues: {
                  'Документ.Идентификатор договора': props.id
                }
              }
            }
          ]
        }
        break;
      case 'accounts':
        operations = [
          {
            screen: 'unisab/Document',
            color: appColors.green,
            text: 'Пополнить',
            passProps: {
              sid: 'UBS_TRANSFER_ACC',
              defaultValues: {
                'Документ.Источник зачисления': props.account
              }
            }
          },
          {
            screen: 'unisab/PaymentsTabScreen',
            color: appColors.yellow,
            text: 'Оплатить',
            onlyPayments: true,
            title: 'Выбор платежа',
            passProps: {
              sid: 'UBS_SERVICE_PAYMENT',
              burger: false,
              hideBottomTabs: true,
              defaultDocumentValues: {
                'Документ.Источник списания': props.account
              }
            }
          },
          {
            screen: 'unisab/Document',
            color: appColors.red,
            text: 'Закрыть',
            passProps: {
              sid: 'UBS_ACCOUNT_CLOSE',
              defaultValues: {
                'Документ.Идентификатор договора': props.id
              }
            }
          }
        ];
        break;
      default:
        return [];
    }

    return this.generateButtons({
      props, data: operations.filter(operation => {
        if (operation && operation.passProps && operation.passProps.sid) {
          return props.confAccess[operation.passProps.sid] > 0;
        }

        return true;
      })
    })
  };

  render() {
    return (
      <Collapse
        collapsed={this.props.collapsed}
        header={
          <CollapseHeader
            loading={this.props.loading}
            title={this.props.headerTitle}
            onCollapse={this.props.onCollapse}
            rotated={Boolean(this.props.collapsed)}
            type={this.props.type}
            addLable={'Выпустить карту'}
            icon={this.props.headerIcon}
            isAddShown={this.isAddButtonShown}
          />
        }

        data={this.props.products}
        dataRender={(el, index) => {
          let stylesProp = {};
          const type = el.productType || this.props.type;

          if ((index !== this.props.products.length - 1) && (!this.props.products[index+1].isAdditionalCard)) {
            stylesProp = {
              borderBottomWidth: 1,
              borderBottomColor: "#f2f5f7"
            };
          }

          if (el.hide && !this.state.hiddenProducts) return null;

          const swipeRightButtons = this.swipeButtons({
            confAccess: this.props.confAccess,
            productType: type,
            parentComponentId: this.props.parentComponentId,
            ...el
          });

          const contentRenderer = () => {
            return <ProductCard
              cardType={type}

              product={el}
              styles={{ ...stylesProp }}
              onPress={async (product) => {
                this.props.recenter({ all: true });

                this.props.dispatch(setProductInfo({ product, type }));
                pushScreen({
                  componentId: this.props.parentComponentId,
                  screenName: 'unisab/ProductScreen',
                  showBackButtonTitle: false,
                  title: product.description,
                  passProps: {
                    index: index,
                    productsArr: this.props.products,
                    jwt: await AsyncStorage.getItem('jwt')
                  }
                });
              }}
            />;
          }

          return swipeRightButtons.length ? (
            <SwipeOut
              rightButtons={swipeRightButtons}
              onSwipeStart={() => {
                this.props.recenter({ type: this.props.type, index })
              }
              }
              onRef={(ref) => {
                this.props.onSwipeRef(ref, this.props.type)
              }
              }
            >
              {contentRenderer()}
            </SwipeOut>
          )
            : (
              <View key={String(el.id) + el.number + index + (el.amountRub)}>
                {contentRenderer()}
              </View>
            )
        }}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  confAccess: state.paymentsPage.configuration,
});

export default connect(mapStateToProps)(CollapseProduct);
