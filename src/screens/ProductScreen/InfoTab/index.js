import React from 'react';
import {connect} from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import moment from 'moment';
import { parseMoney } from '../../../utils/text';
import { ScrollView, View, Button, Image, Platform, TouchableOpacity, Alert } from 'react-native';
import { pushScreen } from '../../../utils/navigationUtils';
import OperationButton from '../../../components/OperationButton/index';
import { TextRenderer as Text } from '../../../components/TextRenderer';
import { getPart2Card } from '../../../api/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles';
import BankTheme from '../../../utils/bankTheme';
import {ProductPage as productPageTypes} from '../../../api/actionTypes';
import CvvCodeOutput from '../CvvCodeOutput';

import ApplePayIcon from '../../../../assets/icons/apple_pay.svg';

class InfoTab extends React.Component {

  unmounted = false;
  unmaskedTimer = null;

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.showUnmaskedCard && this.props.showUnmaskedCard) {
      this.unmaskedTimer = setTimeout(this.unmaskedCardTimerTick, 10000);
    }
  }

  checkIfOperationAllowed(sid) {
    return this.props.allowedOperations.find((item) => item.sid === sid) !== undefined;
  }

  showCardNumberPopup = () => {
    Clipboard.setString(this.props.unmaskedCardNumber);
    this.props.showMessagePopup('Номер карты скопирован');
  }

  unmaskedCardTimerTick = () => {
    if (!this.unmounted) {
      clearTimeout(this.unmaskedTimer);
      this.unmaskedTimer = null;
      this.props.clearPart2Card();
    }
  }

  onShowCardPressed = () => {
    if (!this.props.showUnmaskedCard) this.props.getPart2Card(this.props.product.id);
    else this.unmaskedCardTimerTick();
  }

  render() {
    let product = this.props.product;
    switch (this.props.type) {
      case 'cards':
        return product.type ? this._creditCardInfoRenderer(product) : this._cardInfoRenderer(product);
      case 'deposits':
        return this._depositInfoRenderer(product);
      case 'accounts':
        return this._accountInfoRenderer(product);
      case 'credits':
        return this._creditInfoRenderer(product);
    }

    return <Text>Error Info Tab</Text>;
  }

  openModal = ({ passProps, screen }) => {
    pushScreen(
      {
        componentId: this.props.parentComponentId,
        screenName: screen || 'unisab/Document',
        passProps,
      }
    );
  };

  _cardInfoRenderer(product) {
    const accountsCard = this.props.product.accountsCard || [];
    const isExpireCardText = product.expireCardText !== '';
    const addToWalletText = Platform.OS === 'ios' ? 'Добавить в Apple Pay' : 'Добавить в Google Pay';
    return (
      <ScrollView>
        <View style={styles.operations}>
          {product.state === 'active'
            ? [
              this.checkIfOperationAllowed('UBS_TRANSFER_ACC') && (
                <OperationButton
                  key={1}
                  onPress={() => {
                    this.openModal({
                      passProps: {
                        sid: 'UBS_TRANSFER_ACC',
                        defaultValues: {
                          'Документ.Источник зачисления': product.number
                        }
                      },
                    });
                  }}
                  text={'Пополнить'}
                  icon={props => <Image source={{uri: BankTheme.images.productPage.income}} {...props} />}
                />
              ),

              this.checkIfOperationAllowed('UBS_SERVICE_PAYMENT')  && (
                <OperationButton
                  key={2}
                  onPress={() => {
                    this.openModal({
                      screen: 'unisab/PaymentsTabScreen',
                      title: 'Выбор платежа',
                      passProps: {
                        title: 'Выбор платежа',
                        burger: false,
                        isDefaultNavBar: true,
                        onlyPayments: false,
                        defaultDocumentValues: {
                          'Документ.Источник списания': product.number
                        }
                      },
                    });
                  }}
                  text={'Оплатить'}
                  icon={props => <Image source={{uri: BankTheme.images.productPage.pay}} {...props} />}
                />
              )
            ]
            : this.checkIfOperationAllowed('UBS_CARD_CHANGESTATE') && (
              <OperationButton
                key={3}
                onPress={() => {
                  this.openModal({
                    passProps: {
                      sid: 'UBS_CARD_CHANGESTATE',
                      defaultValues: {
                        'Документ.Идентификатор договора': product.id
                      }
                    },
                  });
                }}
                text={'Разблокировать'}
                icon={props => (
                  <Icon key={'ios-unlock-outline'} name={'ios-unlock-outline'} size={23} color={BankTheme.color1} />
                )}
              />
            )}
        </View>

        <View
          style={[
            styles.row,
            {
              paddingLeft: 15,
              paddingVertical: 15
            }
          ]}
        >
          <Text style={styles.infoHeaderText}>Доступный{'\n'}остаток</Text>

          <Text style={styles.balance}>{parseMoney(product.balance, product.currency)}</Text>
        </View>
        {accountsCard.map((item) => {
          return (<View style={styles.row}>
            <Text>{`${item.accountNumber}`}</Text>
            <Text>{`${parseMoney(item.balance, item.currency)}`}</Text>
          </View>)
        })}
        <View style={styles.info}>
          {this.props.isWallet && this.props.canAddPaymentPass ? (
            <View style={styles.row}>
              <View>
                {Platform.OS === 'ios' ? (
                  <ApplePayIcon
                    width={56}
                    height={45}
                    fill="black"
                  />
                ) : (
                    <Image
                      source={require('../../../../assets/icons/google-pay.png')}
                      style={{ width: 50, height: 35, resizeMode: 'contain' }}
                    />
                  )}
              </View>

              <OperationButton
                buttonWrapperStyle={{ paddingHorizontal: 0, width: 140, height: 35 }}
                buttonStyle={styles.payButton}
                onPress={() => {
                  this.props.isProductAddedToWallet ? this.props.removeFromWallet() : this.props.addToWallet();
                }}
                text={this.props.isProductAddedToWallet ? 'Отключить' : addToWalletText}
              />
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Состояние</Text>
            <Text style={[{ color: product.state === 'active' ? '#30c42b' : 'red' }]}>
              {product.state === 'active'
                ? [<Icon key={'ios-unlock-outline'} name={'ios-unlock-outline'} size={16} color={'#000'} />, ` ${product.nameState}`]
                : [
                  <Icon key={'ios-lock-outline'} name={'ios-lock-outline'} size={16} color={'#000'} />,
                  ` ${product.nameState}`
                ]}
            </Text>
          </View>

          <View style={styles.row}>
            <Text>Номер карты</Text>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <TouchableOpacity style={{paddingRight: 10,}} onPress={this.onShowCardPressed}>
                <Image source={this.props.showUnmaskedCard ? require('../../../../assets/icons/eye.png') : require('../../../../assets/icons/crossedEye.png')}
                    style={{width:25, height: 25}}
                />
              </TouchableOpacity>
              <TouchableOpacity onLongPress={this.showCardNumberPopup} disabled={!this.props.showUnmaskedCard}>
                <Text>
                  {this.props.showUnmaskedCard ? this.props.unmaskedCardNumber : product.number}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.row}>
            <Text>Дата открытия</Text>
            <Text>{product.dateOpen}</Text>
          </View>

          <View style={styles.row}>
            <Text style={{color: isExpireCardText? 'red' : 'unset'}}>Срок действия</Text>
            <Text style={{color: isExpireCardText? 'red' : 'unset'}}>{product.expireDate}</Text>
          </View>

          {isExpireCardText &&
            <View style={styles.row}>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={require('../../../../assets/icons/warning_red.png')} style={{width: 16, height: 16,}}/>
                  <Text style={{color: 'red', paddingLeft: 5,}}>{product.expireCardText}</Text>
                </View>
                  <TouchableOpacity
                    style={styles.reissueButton}
                    onPress={this.props.reissueCard}
                  >
                    <Text>Перевыпустить</Text>
                  </TouchableOpacity>
              </View>
            </View>
          }

          {BankTheme.allowShowCvvCode && (
            <View style={styles.row}>
              <Text>CVV / CVC код</Text>
              <CvvCodeOutput
                idCard={this.props.product.id}
                showMessagePopup={this.props.showMessagePopup}
              />
            </View>
          )}

          <View style={styles.row}>
            <Text>Банковский продукт</Text>
            <Text style={styles.nameProduct}>{product.nameProduct}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  _creditCardInfoRenderer(product) {
    const addToWalletText = Platform.OS === 'ios' ? 'Добавить в Apple Pay' : 'Добавить в Google Pay';
    const isExpireCardText = product.expireCardText !== '';
    const sumDebts =
      +product.creditDebts +
      +product.debtOverLimit +
      +product.creditDebtsPrc +
      +product.interestAmount +
      +product.debtAmount +
      +product.debtPrc;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.operations}>
          {product.state === 'active'
            ? [
              this.checkIfOperationAllowed('UBS_TRANSFER_ACC') && (
                <OperationButton
                  key={1}
                  onPress={() => {
                    this.openModal({
                      passProps: {
                        sid: 'UBS_TRANSFER_ACC',
                        defaultValues: {
                          'Документ.Источник зачисления': product.number
                        }
                      },
                    });
                  }}
                  text={'Пополнить'}
                  icon={props => <Image source={{uri: BankTheme.images.productPage.income}} {...props} />}
                />
              ),

              this.checkIfOperationAllowed('UBS_SERVICE_PAYMENT') && (
                <OperationButton
                  key={2}
                  onPress={() => {
                    this.openModal({
                      screen: 'unisab/PaymentsTabScreen',
                      title: 'Выбор платежа',
                      passProps: {
                        title: 'Выбор платежа',
                        burger: false,
                        isDefaultNavBar: true,
                        onlyPayments: false,
                        defaultDocumentValues: {
                          'Документ.Источник списания': product.number
                        }
                      },
                    });
                  }}
                  text={'Оплатить'}
                  icon={props => <Image source={{uri: BankTheme.images.productPage.pay}} {...props} />}
                />
              )
            ]
            : this.checkIfOperationAllowed('UBS_CARD_CHANGESTATE') && (
              <OperationButton
                key={3}
                onPress={() => {
                  this.openModal({
                    passProps: {
                      sid: 'UBS_CARD_CHANGESTATE',
                      defaultValues: {
                        'Документ.Идентификатор договора': product.id
                      }
                    },
                  });
                }}
                text={'Разблокировать'}
                icon={props => (
                  <View {...props}>
                    <Icon key={'ios-unlock-outline'} name={'ios-unlock-outline'} size={23} />
                  </View>
                )}
              />
            )}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 25 }}>
          <View
            style={[
              styles.row,
              {
                paddingLeft: 15,
                paddingVertical: 15
              }
            ]}
          >

            <Text style={styles.infoHeaderText}>Доступный{'\n'}остаток</Text>

            <Text style={styles.balance}>{parseMoney(product.balance, product.currency)}</Text>
            {this.props.product.accountsCard.map((item) => {
              return (<View style={styles.row}>
                <Text>{`${item.accountNumber}`}</Text>
                <Text>{`${item.balance} ${item.currency}`}</Text>
              </View>)
            })}
          </View>

          <View style={styles.info}>
            {this.props.isWallet && this.props.canAddPaymentPass ? (
              <View style={styles.row}>
                <View>
                  {Platform.OS === 'ios' ? (
                    <ApplePayIcon
                      width={56}
                      height={45}
                      fill="black"
                    />
                  ) : (
                      <Image
                        source={require('../../../../assets/icons/google-pay.png')}
                        style={{ width: 50, height: 35, resizeMode: 'contain' }}
                      />
                    )}
                </View>
                <OperationButton
                  buttonWrapperStyle={{ paddingHorizontal: 0, width: 140, height: 35 }}
                  buttonStyle={styles.payButton}
                  onPress={() => {
                    this.props.isProductAddedToWallet ? this.props.removeFromWallet() : this.props.addToWallet();
                  }}
                  text={this.props.isProductAddedToWallet ? 'Отключить' : addToWalletText}
                />
              </View>
            ) : null}
            {
              this.props.product.paymentDate !== '01.01.2222' && <View style={styles.row}>
                <Text style={{ color: 'red' }}>
                  {moment(product.paymentDate, 'DD.MM.YYYY').format('К оплате DD MMMM YYYY')}
                </Text>
                <Text style={{ color: 'red' }}>{parseMoney(product.paymentAmount, product.currency)}</Text>
              </View>
            }
            <View style={styles.row}>
              <Text>Кредитный лимит</Text>
              <Text>{parseMoney(product.creditLimit, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Общая задолженность</Text>
              <Text>{parseMoney(sumDebts, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Сумма основного долга</Text>
              <Text>{parseMoney(product.creditDebts, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Сумма просроченной задолженности</Text>
              <Text>{parseMoney(product.debtAmount, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Сумма просроченных процентов</Text>
              <Text>{parseMoney(product.debtPrc, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Задолженность сверх лимита</Text>
              <Text>{parseMoney(product.debtOverLimit, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Сумма текущих процентов</Text>
              <Text>{parseMoney(product.creditDebtsPrc, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text> Сумма накопленных процентов</Text>
              <Text>{parseMoney(product.interestAmount, product.currency)}</Text>
            </View>

            <View style={styles.row}>
              <Text>Состояние</Text>
              <Text style={[{ color: product.state === 'active' ? '#30c42b' : 'red' }]}>
                {product.state === 'active'
                  ? [
                    <Icon key={'ios-unlock-outline'} name={'ios-unlock-outline'} size={16} color={'#000'} />,
                    ` ${product.nameState}`
                  ]
                  : [
                    <Icon key={'ios-lock-outline'} name={'ios-lock-outline'} size={16} color={'#000'} />,
                    ` ${product.nameState}`
                  ]}
              </Text>
            </View>

            <View style={styles.row}>
              <Text>Номер карты</Text>
              <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <TouchableOpacity style={{paddingRight: 10,}} onPress={this.onShowCardPressed}>
                  <Image source={this.props.showUnmaskedCard ? require('../../../../assets/icons/eye.png') : require('../../../../assets/icons/crossedEye.png')}
                         style={{width:25, height: 25}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={this.showCardNumberPopup} disabled={!this.props.showUnmaskedCard}>
                  <Text>
                    {this.props.showUnmaskedCard ? this.props.unmaskedCardNumber : product.number}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <Text>Срок действия</Text>
              <Text>{product.expireDate}</Text>
            </View>

            {isExpireCardText &&
            <View style={styles.row}>
              <View style={{flexDirection: 'column', width: '100%'}}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={require('../../../../assets/icons/warning_red.png')} style={{width: 16, height: 16,}}/>
                  <Text style={{color: 'red', paddingLeft: 5,}}>{product.expireCardText}</Text>
                </View>
                <TouchableOpacity
                  style={styles.reissueButton}
                  onPress={this.props.reissueCard}
                >
                  <Text>Перевыпустить</Text>
                </TouchableOpacity>
              </View>
            </View>
            }

            <View style={styles.row}>
              <Text>Процентная ставка</Text>
              <Text style={styles.nameProduct}>{product.prcRate}</Text>
            </View>

            {BankTheme.allowShowCvvCode && (
              <View style={styles.row}>
                <Text>CVV / CVC код</Text>
                <CvvCodeOutput
                  idCard={this.props.product.id}
                  showMessagePopup={this.props.showMessagePopup}
                />
              </View>
            )}

            <View style={styles.row}>
              <Text>Банковский продукт</Text>
              <Text style={styles.nameProduct}>{product.nameProduct}</Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    );
  }

  _accountInfoRenderer(product) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.operations}>
          {this.checkIfOperationAllowed('UBS_TRANSFER_ACC') && (
            <OperationButton
              text={'Пополнить'}
              onPress={() => {
                this.openModal({
                  passProps: {
                    sid: 'UBS_TRANSFER_ACC',
                    defaultValues: {
                      'Документ.Источник зачисления': product.accountNumber
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.income}} {...props} />}
            />
          )}

          {this.checkIfOperationAllowed('UBS_SERVICE_PAYMENT') && (
            <OperationButton
              text={'Оплатить'}
              onPress={() => {
                this.openModal({
                  screen: 'unisab/PaymentsTabScreen',
                  title: 'Выбор платежа',
                  passProps: {
                    title: 'Выбор платежа',
                    burger: false,
                    onlyPayments: false,
                    isDefaultNavBar: true,
                    defaultDocumentValues: {
                      'Документ.Источник списания': product.accountNumber
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.pay}} {...props} />}
            />
          )}
        </View>

        <View
          style={[
            styles.row,
            {
              paddingLeft: 15,
              paddingVertical: 15
            }
          ]}
        >
          <Text style={styles.infoHeaderText}>Доступный{'\n'}остаток</Text>

          <Text style={styles.balance}>{parseMoney(product.sumContract || product.balance, product.currency)}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text>Номер счета</Text>
            <Text>{product.accountNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text>Валюта счета</Text>
            <Text>{product.currency}</Text>
          </View>

          <View style={styles.row}>
            <Text>Состояние</Text>
            <Text>{` ${product.state}`}</Text>
          </View>

          <View style={styles.row}>
            <Text>Дата открытия</Text>
            <Text>{product.dateOpen}</Text>
          </View>

          <View style={{...styles.row,  marginBottom: 20 }}>
            <Text>Банковский продукт</Text>
            <View style={{ flexWrap: 'wrap', marginLeft: 10, }}>
              <Text style={{ textAlign: 'right' }}>{product.nameProduct}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  _depositInfoRenderer(product) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.operations}>
          {this.checkIfOperationAllowed('UBS_TRANSFER_ACC') && (
            <OperationButton
              text={'Пополнить'}
              onPress={() => {
                this.openModal({
                  passProps: {
                    sid: 'UBS_TRANSFER_ACC',
                    defaultValues: {
                      'Документ.Источник зачисления': product.accountNumber
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.income}} {...props} />}
            />
          )}

          {this.checkIfOperationAllowed('UBS_SERVICE_PAYMENT') && (
            <OperationButton
              text={'Оплатить'}
              onPress={() => {
                this.openModal({
                  screen: 'unisab/PaymentsTabScreen',
                  title: 'Выбор платежа',
                  passProps: {
                    title: 'Выбор платежа',
                    burger: false,
                    onlyPayments: false,
                    isDefaultNavBar: true,
                    defaultDocumentValues: {
                      'Документ.Источник списания': product.accountNumber
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.pay}} {...props} />}
            />
          )}
        </View>

        <View
          style={[
            styles.row,
            {
              paddingLeft: 15,
              paddingVertical: 15
            }
          ]}
        >
          <Text style={styles.infoHeaderText}>Доступный{'\n'}остаток</Text>

          <Text style={styles.balance}>{parseMoney(product.sumContract, product.currency)}</Text>
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text>Номер счета</Text>
            <Text>{product.accountNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text>Валюта вклада</Text>
            <Text>{product.currency}</Text>
          </View>

          <View style={styles.row}>
            <Text>Дата открытия</Text>
            <Text>{product.dateOpen}</Text>
          </View>

          {product.dateFinish === '01.01.2222' ?
            <View style={styles.row}>
              <Text>Срок вклада</Text>
              <Text>До востребования</Text>
            </View>
            :
            <>
              <View style={styles.row}>
                <Text>Срок вклада</Text>
                <Text>{product.contractTerm}</Text>
              </View>

              <View style={styles.row}>
                <Text>Дата окончания</Text>
                <Text>{product.dateFinish}</Text>
              </View>
            </>
          }

          <View style={styles.row}>
            <Text>Процентная ставка</Text>
            {this._renderPrcRate(product.prcRate)}
          </View>

          <View style={[styles.row, { marginBottom: 20 }]}>
            <Text>Банковский продукт</Text>
            <Text>{product.nameProduct}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  _renderPrcRate(prcRate = '') {
    const lines = prcRate.split(';');
    return <View style={{flexDirection: 'column',}}>
      {lines.map(item => item ? <Text>{item.trim()};</Text> : null)}
    </View>
  }

  _creditInfoRenderer(product) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={[styles.operations, { marginBottom: 10 }]}>
          {this.checkIfOperationAllowed('UBS_TRANSFER_ACC') && (
            <OperationButton
              text={'Пополнить'}
              onPress={() => {
                this.openModal({
                  passProps: {
                    sid: 'UBS_TRANSFER_ACC',
                    defaultValues: {
                      'Документ.Идентификатор договора': product.id,
                      'Код бизнеса': product.code || 'LOAN'
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.income}} {...props} />}
            />
          )}

          {this.checkIfOperationAllowed('UBS_LOAN_AHEAD_PAYM') && (
            <OperationButton
              text={'Погасить'}
              onPress={() => {
                this.openModal({
                  passProps: {
                    sid: 'UBS_LOAN_AHEAD_PAYM',
                    defaultValues: {
                      'Документ.Идентификатор договора': product.id,
                      'Код бизнеса': product.code || 'LOAN'
                    }
                  },
                });
              }}
              icon={props => <Image source={{uri: BankTheme.images.productPage.pay}} {...props} />}
            />
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={{ color: '#af0007' }}>Просроченная задолженость</Text>
            <Text style={{ color: '#af0007' }}>{parseMoney(product.amountPastDue, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={{ color: '#af0007' }}>Штрафы, пени</Text>
            <Text style={{ color: '#af0007' }}>{parseMoney(product.penalties, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Сумма кредита</Text>
            <Text>{parseMoney(product.debtAmount, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Валюта кредита</Text>
            <Text>{product.currency}</Text>
          </View>

          <View style={styles.row}>
            <Text>Осталось погасить</Text>
            <Text>{parseMoney(product.debtAmount + product.debtPrc, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Основной долг</Text>
            <Text>{parseMoney(product.debtAmount, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Накопленные проценты</Text>
            <Text>{parseMoney(product.debtPrc, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={{ maxWidth: '60%' }}>Сумма отсроченных платежей</Text>
            <Text>{parseMoney(product.amountDeferred, product.currency)}</Text>
          </View>

          <View style={styles.row}>
            <Text>Ставка</Text>
            <Text>{product.prcRate}%</Text>
          </View>

          <View style={styles.row}>
            <Text>Дата открытия</Text>
            <Text>{product.dateOpen}</Text>
          </View>

          <View style={styles.row}>
            <Text>Дата окончания</Text>
            <Text>{product.dateFinish}</Text>
          </View>

          <View style={styles.row}>
            <Text>Номер договора</Text>
            <Text>{product.contractNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text>Номер ссудного счета</Text>
            <Text>{product.accountDebtNumber}</Text>
          </View>

          <View style={styles.row}>
            <Text>Способ погашения</Text>
            <Text>{product.typeSchedule === 0 ? 'Аннуитентый' : 'Дифференцированный'}</Text>
          </View>

          <View style={styles.row}>
            <Text>Банковский продукт</Text>
            <Text>{product.nameProduct}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  unmaskedCardNumber: state.productPage.unmaskedCardNumber,
  showUnmaskedCard: state.productPage.showUnmaskedCard,
  allowedOperations: state.productPage.allowedOperations,
})

const mapDispatchToProps = (dispatch) => ({
  getPart2Card: (idObject) => dispatch(getPart2Card(idObject)),
  clearPart2Card: () => dispatch({
    type: productPageTypes.GET_CARD2_PART_SUC,
    payload: '',
    showUnmaskedCard: false,
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoTab);



