import React from 'react';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import LogoSbp from '../../../assets/icons/logo-sbp.png';
import {
  Platform,
  Text,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  PermissionsAndroid,
  SafeAreaView, Linking,
} from 'react-native';
import _ from 'lodash';
import TouchableOpacity from '../../components/Touchable';
import { isIphoneX } from '../../utils/platform';
import Touchable from '../../components/Touchable';
import Form from './Form';
import ModalInput from '../../components/Inputs/ModalInput';
import FilledButton from '../../components/buttons/FilledButton';
import { getProductInfo, getPathImage, getPathDescr } from '../../api/actions';
import getParameters from './utils/getParameters';
import parseFormData from './utils/parseFormData';
import QrCodeScanner from './inputs/QrCodeScanner';
import stateDecode from './utils/stateDecode';
import {
  getGroupIdxByName,
  getGroupNameByIndex,
  parseResponseAccounts,
  checkValueCorrectness,
  processEndingAction,
  openReceipt,
  getCurrentCurrency,
  checkCondition, addDescrPathIfNeed,
} from './utils';
import { getCardInputSelected } from './Form';
import { parseMoney } from '../../utils/text/index';
import { execute, listContractForDocs, addDocumentFiles } from './api';
import {updatePersonalOffers} from '../../reducers/personalOffers/actions';
import {pushScreen} from '../../utils/navigationUtils';
import * as specialCompleteBlocks from './specialCompletesBlocks';
import styles from './styles'
import BankTheme from '../../utils/bankTheme';

const WrapperComponent = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

const documentSteps = {
  start: 0,
  confirm: 1,
  sign: 2,
  complete: 3,
  editTemplate: 4,
};
const documentSids = {
  sum: 'Документ.Сумма',
  source: 'Документ.Источник списания',
};


class Document extends React.Component {
  static defaultProps = {
    sid: '',
    defaultValues: {},
    isHeaderShown: false,
    type: '',
    //formType: '',
    //formAction: '',
  };

  initialSidRequest = undefined;

  get isNextEnabled() {
    const agreementSid = 'Согласен с условиями';
    const isLoading = this.props.isLoading || this.state.isLoading;
    const isAgreementError =
      this.state.values[agreementSid]
      && this.state.valuesGroups[getGroupNameByIndex(this.state.groups, this.state.currentGroupIndex)]
      && this.state.valuesGroups[getGroupNameByIndex(this.state.groups, this.state.currentGroupIndex)].indexOf(agreementSid) > -1
      && this.state.values[agreementSid].value === '0';
    return !isLoading && !isAgreementError && !this.state.isSbpPermissionError;
  }

  get isPrevShown() {
    return this.state.currentGroupIndex > 0;
  }

  get isEndOperationShown() {
    const sidWithoutOperations = [
      'UBS_CARD_ISSUE',
      'UBS_DEPOSIT_OPEN',
      'UBS_CARD_CHANGESTATE',
      'UBS_DEPOSIT_CLOSE',
      'UBS_ACCOUNT_CLOSE',
      'UBS_FO_CREATE_CLAIM'
    ];
    return sidWithoutOperations.indexOf(this.sidDocument) === -1;
  }

  constructor(props) {
    super(props);
    const defaultValues = {};
    this.sidDocument = props.sid; //Он может помнеяться, если оплата через QR код
    this.initialSidRequest = props.initialSidRequest;
    defaultValues['Код вида документа'] = {
      value: this.sidDocument,
      type: 'string',
      isCorrect: true,
    };
    if (props.sid === 'GetAutoPaymentField') {
      defaultValues['Код вида документа'] = {
        value: 'UBS_STO_OPEN',
        type: 'string',
        isCorrect: true,
      };
    } else if (props.sid === 'getServiceContract') {
      defaultValues['Код вида документа'] = {
        value: 'UBS_SMS_SERVICE',
        type: 'string',
        isCorrect: true,
      };
    } else if (props.sid === 'getDocument') {
      let typeOper = '';
      if (this.props.defaultValues.type) typeOper = 'Просмотр'
      else typeOper = 'Повтор';

      defaultValues['Вид операции'] = {
        value: typeOper,
        type: 'string',
        isCorrect: true,
      };
    }
    else if (props.sid === 'UBS_MESSAGE') {
      requestFilePermission()
        .then(() => null)
        .catch(() => null);
    }

    _.each(props.defaultValues, (value, key) => {
      switch (key) {
        case 'Документ.Идентификатор провайдера':
        case 'Документ.Идентификатор договора':
        case 'Идентификатор продукта':
        case 'Идентификатор документа':
        case 'Идентификатор бизнес-договора':
        case 'Идентификатор договора SMS-Банка':
        case 'Идентификатор доверенности':
        case 'Идентификатор предложения':
        case 'Идентификатор депозитного договора':
        case 'Идентификатор акцепта':
          defaultValues[key] = {
            value: parseInt(value, 10),
            type: 'int',
            isCorrect: true,
          };
          return;
        case 'sid':
        case 'action':
        case 'type':
          return;

        case 'Документ.Источник зачисления':
          defaultValues[key] = {
            value,
            type: 'string',
            isCorrect: true,
          };
          defaultValues['Получатель.Счет'] = {
            value: '',
            type: 'string',
            isCorrect: true,
          };
          return;

        case 'Документ.Источник списания':
          defaultValues[key] = {
            value,
            type: 'string',
            isCorrect: true,
          };
          defaultValues['Плательщик.Счет'] = {
            value: '',
            type: 'string',
            isCorrect: true,
          };
          return;

        case 'Идентификатор токена':
        case 'Идентификатор намерения':
        case 'Данные QR-кода':
        case 'Документ.Идентификатор поставщика':
        default:
          defaultValues[key] = {
            value,
            type: 'string',
            isCorrect: true,
          };
      }
    });

    let steps = [];
    if (props.isHeaderShown) {
      steps.push('заполнение документа');
      if (storage.get('isConfirmation') == '1' && !this.props.type) {
        steps.push('подтверждение документа');
      }
      if (storage.get('isSign') == '1' && !this.props.type) {
        steps.push('подписание документа');
      }
      switch (props.type) {
        case 'template':
          steps.push('редактирование шаблона');
          break;
        case 'autopayment':
          steps.push('подключение автоплатеж');
          break;
        default:
          steps.push('статус документа');
      }
    }

    let step;
    let currentActiveStep = 0;

    this.state = {
      steps,
      nSteps: steps.length,
      currentActiveStep: currentActiveStep,
      accounts: [],

      groups: [], // array of array for each sidRequest
      valuesGroups: {},
      fields: {},
      values: defaultValues,
      listValues: {},
      currentGroupIndex: null,
      docStatus: 0,

      processValues: {}, // this values doesn't pass to execute

      nextSidNumber: 0,
      sidRequests: [],
      nameForm: '',
      descriptionForm: '',
      nameButton: '',
      linkInfo: '',
      linkContract: '',

      searchValues: {},
      actions: {},

      // for steps
      step: 0,
      formType: this.props.type,
      formAction: this.props.action,
      // for Sign
      pin: '',
      // for Confirm
      code: '',
      liveTime: 0,
      liveTimeAgain: 0,
      phoneNumber: '',
      timeSending: '',
      // for create template
      templateNameValue: '',
      favoriteNameValue: '',
      isTemplateModalVisible: false,
      isTemplateLoading: false,

      isLoading: false,
      isCurrencyError: false,

      // for files upload
      files: [],

      isSbpPermissionError: false,
      sbpErrorText: '',
      isSbpFatalError: false,
    };

  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      listContractForDocs(this.props.basePath, 7)
        .then(data => {
          const accounts = parseResponseAccounts(data.contracts);
          this.setState({ accounts }, () => {
            setAccounts.bind(this)(accounts);
          });
          return this.fetchDocument(this.initialSidRequest || this.props.sid);
        })
        .catch(async (err) => {
          if (err.codeResult !== 200) {
            await Navigation.dismissAllModals()
            await Navigation.pop(this.props.componentId);
          }
        });
    });

    function setAccounts(contracts) {
      if (this.state.values['Документ.Источник списания']) {
        const v = _.findLast(contracts, item => item['contractNumber'] === this.state.values['Документ.Источник списания'].value ||
          item['accountNumber'] === this.state.values['Документ.Источник списания'].value
        );
        if (v) {
          let newValues = Object.assign({}, this.state.values);
          newValues['Плательщик.Счет'].value = v.value['accountNumber'];
          this.setState({ values: newValues });
        }
      }
      if (this.state.values['Документ.Источник зачисления']) {
        const v = _.findLast(contracts, item => item['contractNumber'] === this.state.values['Документ.Источник зачисления'].value ||
          item['accountNumber'] === this.state.values['Документ.Источник зачисления'].value
        );
        if (v) {
          let newValues = Object.assign({}, this.state.values);
          newValues['Получатель.Счет'].value = v.value['accountNumber'];
          this.setState({ values: newValues });
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(updatePersonalOffers());
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    );
  }

  get nextButtonText() {
    const lastIdx = this.state.sidRequests.length - 1;
    const nextSidRequest = this.state.sidRequests[lastIdx];
    if ((['CreateVerify', 'GetCommis', 'Create', 'Verify'].indexOf(nextSidRequest) > -1) && this.props.type !== 'template') {
      return this.state.nameButton || 'Выполнить';
    }
    else if(this.props.type === 'template') {
      const nextGroupIdx = this.state.currentGroupIndex + 1;
      const nextGroupName = getGroupNameByIndex(
        this.state.groups,
        nextGroupIdx,
      );
      if (!nextGroupName && ['CreateVerify', 'Create', 'Verify', ''].includes(nextSidRequest) && this.state.fields['Шаблон.Название']){
        return 'Сохранить';
      }
    }
    return 'Далее';
  }

  renderContent = () => {
    const lastIdx = this.state.sidRequests.length - 1;
    const isWebView = this.state.sidRequests.includes("UBS_P2P_BEST2PAY");

    let nextSidRequest = this.state.sidRequests[lastIdx];
    let nextButtonText = this.nextButtonText;
    const currentGroup = this.state.groups[this.state.currentGroupIndex];
    if (currentGroup) {
      const fieldSids = this.state.valuesGroups[currentGroup];
      if (fieldSids) {
        const existsQrFields = Object.values(this.state.fields).filter(field => fieldSids.includes(field.sid) && field.inputType === 'ScannerQR');
        if (existsQrFields.length > 0 && !this.state.isSbpFatalError) return (
          <QrCodeScanner
            onScanSuccess={(data) => {
              this.state.values[existsQrFields[0].sid].value = data;
              // После сканирования QR меняется Код вида документа
              // Если жмем назад, нужно заменить код вида документа - UBS_PAYMENT_QR
              this.state.values['Код вида документа'].value = 'UBS_PAYMENT_QR';
              this.onClickNext();
            }}
          />
        )
      }
    }

    switch (this.state.step) {
      case documentSteps.confirm:
      case documentSteps.start:
      case documentSteps.editTemplate:
        return (
          <SafeAreaView style={styles.safeArea}>
            <WrapperComponent
              behavior="padding"
              keyboardVerticalOffset={isIphoneX() ? 105 : 85}
              style={styles.KAV}
            >
              <Form
                sid={this.sidDocument}
                values={this.state.values}
                listValues={this.state.listValues}
                fields={this.state.fields}
                groups={this.state.groups}
                valuesGroups={this.state.valuesGroups}
                accounts={this.state.accounts}
                actions={this.state.actions}
                files={this.state.files}
                linkInfo={this.state.linkInfo}
                linkContract={this.state.linkContract}
                isDescriptionShown={this.props.isDescriptionShown}
                logoForm={this.state.logoForm}
                nameForm={this.state.nameForm}
                descriptionForm={this.state.descriptionForm}
                isWebView
                maxUploadFileSize={this.props.maxUploadFileSize}
                allowedFiles={this.props.allowedFiles}
                customErrorComponent={this.customErrorComponent}
                currentGroupName={''}
                currentGroupIndex={this.state.currentGroupIndex}
                handleValuesChange={newValues => {
                  const setStateObject = {
                    values: newValues,
                  };
                  if (newValues['Документ.Источник зачисления'] &&
                    newValues['Документ.Источник зачисления'].value === ''
                  ) {
                    setStateObject.isCurrencyError = false;
                  }
                  this.setState(setStateObject);
                }}
                handleFileAdd={this.addFile}
                handleFileRemoveByIdx={this.removeFileByIndex}
                onFieldFocus={sid => {
                  this.setState(state => {
                    if (!state.values[sid]) {
                      return;
                    }

                    const newValues = Object.assign({}, state.values);
                    newValues[sid].isCorrect = true;

                    return {
                      values: newValues,
                    };
                  });
                }}
                onBlurField={sid => {
                  this.setState(state => {
                    if (!state.values[sid]) {
                      return;
                    }

                    const newValues = Object.assign({}, state.values);
                    newValues[sid].isCorrect = checkValueCorrectness(
                      state.fields[sid],
                      state.values,
                    );

                    return {
                      values: newValues,
                    };
                  });
                }}
                checkValueCorrectness={this.checkValueCorrectness}
                isCurrencyError={this.state.isCurrencyError}
                isLoading={this.state.isLoading}
                isFilled={this.state.step === documentSteps.confirm}
              />

              <View style={{
                flexDirection: 'row',
                marginTop: 2,
              }}>
                {this.isPrevShown && (
                  <View
                    style={{
                      flex: 1,
                      minHeight: 50,
                      justifyContent: 'center',
                      marginRight: this.isPrevShown ? 1 : 0,
                    }}
                  >
                    <FilledButton onPress={this.onClickPrev} title="Назад"/>
                  </View>
                )}
                {
                  !isWebView && (<View
                    style={{
                      flex: 1,
                      minHeight: 50,
                      justifyContent: 'center',
                      borderTopLeftRadius: this.isPrevShown ? 5 : 0,
                      marginLeft: this.isPrevShown ? 1 : 0,
                    }}
                  >
                    <FilledButton
                      onPress={this.onClickNext}
                      disabled={!this.isNextEnabled}
                      title={nextButtonText}
                    />
                  </View>)
                }
              </View>
            </WrapperComponent>
          </SafeAreaView>
        );

      case documentSteps.complete:
        const state = stateDecode[this.state.docStatus] || {};
        const sumFieldValue = this.state.values[documentSids.sum];

        if (this.state.isSbpFatalError) return this.renderSbpFatalError();
        if (this.state.docStatus === 199 || this.state.isSbpFatalError) return this.renderCompleteWithErrorMessage();

        if (this.state.formType === 'template') return specialCompleteBlocks.editTemplateCompleteBlock(this.props, this.state, this.onClickCancel);

        const nameTemplate = this.state.values['Шаблон.Название'];
        const source =
          getCardInputSelected(
            this.state.fields[documentSids.source],
            this.state,
          ) || {};

        const { forbidSaveAsTemplate, } = this.props;
        const allowTemplates = !forbidSaveAsTemplate.includes(this.sidDocument);
        return (
          <View style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
            <ScrollView style={{ flex: 1 }}>

              <View style={styles.statusContainer}>
                <Text style={styles.statusHeader}>{state.text}</Text>
                <Image
                  source={state.icon}
                  style={{
                    width: 100,
                    height: 100,
                  }}
                />

                {sumFieldValue && (
                  <View style={styles.statusSum}>
                    <Text style={styles.statusSumLabel}>Сумма:</Text>
                    <Text style={styles.statusSumValue}>
                      {parseMoney(
                        sumFieldValue.value,
                        getCurrentCurrency(this.state),
                      )}
                    </Text>
                  </View>
                )}

                {this.props.sid === 'UBS_TRANSFER_SBP' && this.renderCompleteBlockForSbp() }
                {this.props.sid === 'UBS_TRANSFER_SBP_SETUP' && specialCompleteBlocks.sbpSettingsCompleteBlock(this.props, this.state) }
                {this.props.sid === 'UBS_SBP_REQUEST_TR' && specialCompleteBlocks.sbpRequestTrCompleteBlock(this.props, this.state)}
                {this.state.values['Код вида документа'].value === 'UBS_TRANSFER_SBP_QRPAY' && specialCompleteBlocks.payWithQrCompleteBlock(this.props, this.state)}
              </View>

              <View>
                {this.isEndOperationShown && allowTemplates &&  (
                  <Touchable
                    onPress={() => {
                      this.openTemplateModal();
                    }}
                  >
                    <View style={styles.resultButton}>
                      <Text>Сохранить как шаблон</Text>
                    </View>
                  </Touchable>
                )}

                {this.state.docStatus === 110 &&
                  <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 30, }}>
                      <Text style={{ color: '#999',fontSize: 18,  }}>
                        Готовые документы доступны в разделе
                      </Text>
                      <TouchableOpacity onPress={this.navigateToBankInquiries}>
                        <Text style={{ color: BankTheme.color1, fontSize: 18, }}>
                        Справки и выписки
                      </Text>
                    </TouchableOpacity>
                  </View>
                }

                {this.state.docStatus === 111 &&
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 30, }}>
                  <TouchableOpacity onPress={this.openInquiry}>
                    <Text style={{ color: BankTheme.color1, fontSize: 18 }}>
                      Открыть в новом окне
                    </Text>
                  </TouchableOpacity>
                </View>
                }

                { this.sidDocument !== 'UBS_TRANSFER_SBP_SETUP' && this.state.docStatus !== 110 && this.state.docStatus !== 111 &&
                  <Touchable
                    onPress={() => {
                      openReceipt({
                        componentId: this.props.componentId,
                        id: this.state.values['Идентификатор документа'].value,
                      });
                    }}
                  >
                    <View style={styles.resultButton}>
                      <Text>Сохранить или отправить квитанцию</Text>
                    </View>
                  </Touchable>
                }

                {this.isEndOperationShown && allowTemplates && (
                  <Touchable
                    onPress={async () => {
                      await this.openNewAutopayment();
                    }}
                  >
                    <View style={styles.resultButton}>
                      <Text>Подключить автоплатеж</Text>
                    </View>
                  </Touchable>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity onPress={this.onClickFinish}>
              <View style={[styles.next, { backgroundColor: '#fefefe' }]}>
                <Text>
                  {this.hasReturnLink ? 'Вернуться в магазин' : 'Завершить'}
                </Text>
              </View>
            </TouchableOpacity>

            <ModalInput
              visible={this.state.isTemplateModalVisible}
              title={'Название шаблона'}
              inputValue={this.state.templateNameValue}
              onChangeInput={text => {
                this.setState(() => ({ templateNameValue: text }));
              }}
              close={this.closeTemplateModal}
              onDone={this.onDoneTemplateModal}
            />
          </View>
        );
    }
  };

  customErrorComponent = () => {
    if (this.state.isSbpPermissionError) {
      return (
        <View style={{width: '100%', justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{textAlign: 'center', color: 'red', width: '80%'}}>{this.state.sbpErrorText}</Text>

          <View style={{width: 200, paddingTop: 20}}>
            <FilledButton
              onPress={this.openSettings}
              title="Настройки"
            />
          </View>
        </View>
      );
    } else return null;
  }

  navigateToBankInquiries = async  () => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(this.props.componentId);
    await pushScreen({
      componentId: this.props.logonTabComponentId,
      screenName: 'unisab/BankInquiriesScreen',
    });
  }

  openInquiry = async  () => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(this.props.componentId);
    openReceipt({
      componentId: this.props.logonTabComponentId,
      id: this.state.values['Идентификатор документа'].value,
    });
  }

  openSettings = async () => {
    await Navigation.dismissAllModals();
    await Navigation.popToRoot(this.props.componentId);
    await pushScreen({
      componentId: this.props.logonTabComponentId,
      screenName: 'unisab/SettingsScreen',
    });
  }

  renderSbpFatalError = () => {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        <View style={{...styles.statusContainer, flex: 1,}}>
          <Text style={styles.statusHeader}>Ошибка</Text>
          <Image
            source={require('../../../assets/icons/error.png')}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={{color: 'red', height: '100%', width: '90%', textAlign: 'center'}}>
            {this.state.sbpErrorText}
          </Text>
        </View>

        <View style={{ alignItems: 'center'}}>
          <Image source={LogoSbp} style={{width: 140, marginTop: 5, marginBottom: 5}} resizeMode="contain"/>
        </View>

        <TouchableOpacity onPress={this.onClickCancel}>
          <View style={[styles.next, { backgroundColor: '#fefefe' }]}>
            <Text>Завершить</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderCompleteWithErrorMessage() {
    const state = stateDecode[this.state.docStatus] || {};
    const errorField = this.state.processValues['Сообщение'];
    const errorText = errorField ? errorField.value : 'Произошла ошибка!\r\n Обратитесь в банк.';

    if (this.props.sid.includes('SBP')) {
      const SbpErrorComp = specialCompleteBlocks.sbpError;
      return (
        <SbpErrorComp
          receiver={this.state.values['Получатель.Наименование']?.value}
          hideSumAndBank={this.props.sid === 'UBS_TRANSFER_SBP_SETUP'}
          bankReceiverName={this.state.values['Банк получателя.Наименование']?.value}
          bankSenderName={this.state.values['Банк плательщика.Наименование']?.value}
          phoneNumber={this.state.values['Номер телефона']?.value}
          sum={this.state.values[documentSids.sum]?.value}
          sumCommiss={this.state.values['Документ.Комиссия']?.value}
          onClickFinish={this.onClickCancel}
        />
      );
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        <View style={{...styles.statusContainer}}>
          <Text style={styles.statusHeader}>{state.text}</Text>
          <Image
            source={state.icon}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 2, }}>

          <Text style={{color: 'red', width: '90%', textAlign: 'center', paddingTop: 10, paddingBottom: 10,}}>
            {errorText}
          </Text>

          {this.state.values['Код вида документа'].value === 'UBS_TRANSFER_SBP_QRPAY' && specialCompleteBlocks.payWithQrCompleteBlock(this.props, this.state, true)}
        </View>

        <TouchableOpacity onPress={this.onClickCancel}>
          <View style={[styles.next, { backgroundColor: '#fefefe', paddingBottom: 10,}]}>
            <Text>
              Завершить
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderCompleteBlockForSbp() {

    if (this.props.sid !== 'UBS_TRANSFER_SBP') return null;
    const comissValueField = this.state.values['Документ.Комиссия'];
    const bankReceiverField = this.state.values['Банк получателя.Наименование'];
    const receiverField = this.state.values['Получатель.Наименование'];
    const phoneField = this.state.values['Номер телефона'];

    return (
      <>
        <View style={styles.statusSum}>
          <Text style={styles.statusSumLabel}>Комиссия:</Text>
          <Text style={styles.statusSumValue}>
            {parseMoney(
              comissValueField.value,
              getCurrentCurrency(this.state),
            )}
          </Text>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'column'}}>
          <View style={{flexDirection: 'row', paddingBottom: 5, paddingTop: 10,}}>
            <Text style={{...styles.statusSumLabel, textAlign: 'center', marginRight: 0}}>В {bankReceiverField.value}</Text>
          </View>
          <Text style={styles.statusSumLabel}>{receiverField.value}</Text>
          <Text style={styles.statusSumLabel}>{phoneField.value}</Text>

          <Image source={LogoSbp} style={{width: 80, marginTop: 5, marginBottom: 5}} resizeMode="contain"/>

        </View>
      </>
    )
  }

  onClickCancel = async () => {
    await Navigation.popToRoot(this.props.componentId);
    await Navigation.dismissAllModals();
  };

  get hasReturnLink() {
    return !!this.state.values['Ссылка для возврата']?.value;
  }

  onClickFinish = async () => {
    if (this.hasReturnLink) {
      await Linking.openURL(this.state.values['Ссылка для возврата'].value);
    }
    await Navigation.popToRoot(this.props.componentId);
    await Navigation.dismissAllModals();
  }

  onClickNext = nextIndex => {
    if (this.state.currentActiveStep === 0) {
      if (!this.checkCurrentGroupValues()) {
        return;
      }
      const nextGroupIdx = nextIndex ? nextIndex : this.state.currentGroupIndex + 1;
      const nextGroupName = getGroupNameByIndex(
        this.state.groups,
        nextGroupIdx,
      );

      if (!nextGroupName || !this.state.valuesGroups[nextGroupName]) {
        this.getNextData();
      } else {
        if(!this.checkIfAnyFieldApplyCondition(nextGroupIdx)) {
          this.onClickNext(nextGroupIdx + 1);
          return;
        }
        this.setCurrentGroupIndex(nextGroupIdx);
      }
    }
  };

  onClickPrev =nextGroupIndex => {
    const nextGroupIdx = (nextGroupIndex || nextGroupIndex === 0) ? nextGroupIndex : this.state.currentGroupIndex - 1;
    const nextGroupName = getGroupNameByIndex(
      this.state.groups,
      nextGroupIdx,
    );

    if (!nextGroupName || !this.state.valuesGroups[nextGroupName]) {
    } else {
      if(!this.checkIfAnyFieldApplyCondition(nextGroupIdx)) {
        this.onClickPrev(nextGroupIdx - 1);
        return;
      }
      this.setCurrentGroupIndex(nextGroupIdx);
    }

    //if (this.state.currentActiveStep === 0) {
    //  const nextGroupIdx = this.state.currentGroupIndex - 1;
    //  this.setCurrentGroupIndex(nextGroupIdx);
    //}
  };

  onDoneTemplateModal = () => {
    this.setState({ isTemplateLoading: true },
      () => {
        let parameters = getParameters(this.state).filter(
          el =>
            el.type != 'dateTime' &&
            el.name != 'Строка для подписи' &&
            (el.name != 'Идентификатор документа' ||
              this.props.action === 'edit'),
        );
        parameters.push({
          name: 'Шаблон.Название',
          type: 'string',
          value: this.state.templateNameValue,
        });
        parameters.push({
          name: 'Признак шаблона',
          type: 'boolean',
          value: true,
        });

        this.handleExecute('create', parameters)
          .then(() => this.closeTemplateModal(() => null));
        });
  }

  openTemplateModal = () => {
    this.setState({ isTemplateModalVisible: true });
  };

  closeTemplateModal = cb => {
    this.setState({
      isTemplateModalVisible: false,
      isTemplateLoading: false,
    });
  };

  setCurrentGroupIndex = idx => {
    const nextGroupName = getGroupNameByIndex(this.state.groups, idx);
    let newState = { currentGroupIndex: idx };

    if (this.state.groups[this.state.groups.length - 1].indexOf(nextGroupName) === -1) {
      Object.assign(newState, {
        groups: this.state.groups.slice(0, -1),
        sidRequests: this.state.sidRequests.slice(0, -1),
      });
    }
    this.setState(newState);
  };

  checkCurrentGroupValues = () => {
    let isCorrect = true;
    const groupName = getGroupNameByIndex(
      this.state.groups,
      this.state.currentGroupIndex,
    );

    const currentGroupValues = this.state.valuesGroups[groupName];
    let newValues = Object.assign({}, this.state.values);
    let errorValue = null;
    let errorSid = null;

    currentGroupValues.forEach(sid => {
      const value = this.state.values[sid];

      if (value === 'Документ.Валюта' && value.value === "") {
        isCorrect = false;
        newValues[sid].isCorrect = false;
        !errorValue &&
          ((errorValue = this.state.fields[sid].name), (errorSid = sid));
      }

      if (!checkValueCorrectness(this.state.fields[sid], this.state.values, null, this.state.listValues)) {
        isCorrect = false;
        newValues[sid].isCorrect = false;
        !errorValue &&
          ((errorValue = this.state.fields[sid].name), (errorSid = sid));
      } else {
        newValues[sid].isCorrect = true;
      }
    });
    if (!isCorrect) {
      this.setState({ values: newValues });
    }
    return isCorrect;
  };

  getNextData = () => {
    const lastIdx = this.state.sidRequests.length - 1;
    let nextSidRequest = this.state.sidRequests[lastIdx];
    if (lastIdx < 0) return;

    if (!nextSidRequest || nextSidRequest === 'CreateVerify' || nextSidRequest === 'create') {
      if (this.props.type === 'template' && !this.state.fields['Шаблон.Название']) {
        let { fields, valuesGroups, groups } = this.state;
        fields['Шаблон.Название'] = {
          name: 'Шаблон',
          sid: 'Шаблон.Название',
          inputType: 'TextBox',
          minSize: 1,
          maxSize: 0,
        };
        valuesGroups['_Шаблон'] = ['Шаблон.Название'];
        groups.push(['_Шаблон']);
        this.setState({fields, valuesGroups, groups}, () => this.onClickNext());
        return;
      }
    }
    if (!nextSidRequest) {
      this.fetchDocument('getCommiss');
    } else {
      if (nextSidRequest === 'CreateVerify' && this.state.formType) {
        this.verifyAndProcessDoc();
      } else {
        this.fetchDocument(nextSidRequest);
      }
    }
  };



  addFile = (file, sid = 'Документ.Список файлов') => {
    if (!file) {
      return;
    }
    this.setState({ files: this.state.files.concat(file) });
  };

  removeFileByIndex = (idx, sid = 'Документ.Список файлов') => {
    let files = [...this.state.files];
    files.splice(idx, 1);
    this.setState({ files });
  };

  handleExecute = (sid, parameters = []) => {
    return new Promise((resolve, reject) => {
      parameters = [
        ...parameters,
        {
          value: 'Мобильное приложение',
          name: 'Источник создания',
          type: 'string',
          typeColumns: null,
        },
      ];

      this.setState(
        {isLoading: true},
        () => {
          execute(this.props.basePath, {
            sidRequest: sid,
            parameters,
          })
            .then(formDataResponse => {
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  resolve(formDataResponse);
                },
              );
            })
            .catch(err => {
              if (err.codeResult === 4) {
                Alert.alert('Внимание!', err.textResult, [
                  {
                    text: 'Закрыть',
                    onPress: () => {
                      this.handleExecute('Delete', parameters)
                      reject();
                    },
                  },
                  {
                    text: 'Продолжить',
                    onPress: () => {
                      const newValues = Object.assign({}, this.state.values, {
                        'Согласен с условиями': {
                          value: 1,
                          typeColumns: null,
                          type: 'int',
                        },
                      });

                      this.setState(
                        {values: newValues, isLoading: false},
                        this.getNextData,
                      );
                    },
                  },
                ]);
                return;
              } else if (err.codeResult === 6) {
                this.setState({
                  isSbpPermissionError: true,
                  sbpErrorText: err.textResult,
                })
              } else if (err.codeResult === 200) {
                this.setState({
                  step: documentSteps.complete,
                  isSbpFatalError: true,
                  sbpErrorText: err.textResult,
                });
              } else if (err.codeResult === 100) {
                Alert.alert('Информация', err.textResult, [
                  {
                    text: 'Закрыть',
                    onPress: () => {
                    },
                  },
                ]);
              } else if (err.codeResult === 1) {
                this.setState(
                  {
                    isLoading: false,
                  });
                Alert.alert('Ошибка!', err.textResult, [
                  {
                    text: 'Закрыть',
                    onPress: () => reject()
                  },
                ]);
                return;
              } else {
                Alert.alert('Ошибка!', err.textResult, [
                  {
                    text: 'Закрыть',
                    onPress: () => {
                    },
                  },
                ]);
              }

              this.setState(
                {
                  isLoading: false,
                  isCurrencyError: err.codeResult === 9,
                },
                () => {
                  reject(err);
                },
              );
            });
        },
      );
    });
  };

  fetchDocument = (sid) => {
    let parameters = getParameters(this.state, this.props);
    parameters = parameters.filter(el => {
      if (el['name'] === 'Идентификатор документа') {
        return (
          sid === 'getDocument' ||
          sid === 'processDocument' ||
          sid === 'Verify' ||
          sid === 'Create' ||
          this.state.formAction === 'continue' ||
          this.sidDocument === 'GetAutoPaymentField' ||
          this.sidDocument === 'UBS_STO_OPEN' ||
          this.sidDocument === 'UBS_STO_CHANGE_STATE'
        );
      }
      else {
        return true;
      }
    });

    return this.handleExecute(sid, parameters)
      .then(formDataResponse => {
      let formData = {};
      try {
        formData = parseFormData(formDataResponse, this.state.values);
      } catch (err) {
      }

      let sidRequests = [...this.state.sidRequests];
      // Если завалится processDocument, то отправится getCommis, что нехорошо... Поэтому не добавляем пустой sidRequest
      if (!formData.nextSidRequest && this.state.sidRequests[this.state.sidRequests.length - 1] === 'CreateVerify') {
      } else {
        sidRequests.push(formData.nextSidRequest);
      }
      const groups = [...this.state.groups, formData.groups];

      let groupIndex = getGroupIdxByName(groups, formData.currentGroupName);
      let values = Object.assign({}, this.state.values, formData.values);

      if (values['Код вида документа'] && values['Код вида документа'].value) this.sidDocument = values['Код вида документа'].value;

      const staticsFieldsNames = {
        nameForm: 'nameForm',
        descriptionForm: 'descriptionForm',
        pathImage: 'logoForm',
        nameButton: 'nameButton',
        linkInfo: 'linkInfo',
        linkContract: 'linkContract',
      };
      let pathToImage = getPathImage();
      const staticFieldsState = {};
      _.each(staticsFieldsNames, (value, key) => {
        if (formDataResponse[key]) {
          if (key === 'pathImage') {
            staticFieldsState[value] = pathToImage + formDataResponse[key];
          } else if (key === 'linkInfo') {
            staticFieldsState[value] = addDescrPathIfNeed(formDataResponse[key].replace(/[\\]/g, "/"));
          } else if (key === 'linkContract') {
            staticFieldsState[value] = addDescrPathIfNeed(formDataResponse[key].replace(/[\\]/g, "/"));
          } else {
            staticFieldsState[value] = formDataResponse[key];
          }
        }
      });

      if (values['Шаблон.Название']) {
        this.setState({
          templateNameValue: values['Шаблон.Название'].value,
        });
      }
      if (staticFieldsState['nameForm']) {
        Navigation.mergeOptions(this.props.componentId, {
          topBar: {
            title: {
              text: staticFieldsState['nameForm']
            },
          }
        });
      }

      const oldState = this.state;
      this.setState(
        {
          ...staticFieldsState,
          nameButton: staticFieldsState['nameButton'] ? staticFieldsState['nameButton'] : null,
          groups: groups,
          valuesGroups: Object.assign(
            {},
            formData.valuesGroups,
            this.state.valuesGroups,
          ),
          fields: Object.assign({}, this.state.fields, formData.fields),
          values: values,
          listValues: Object.assign(
            {},
            this.state.listValues,
            formData.listValues,
          ),
          currentGroupIndex:
            groupIndex === -1 ? this.state.currentGroupIndex : groupIndex,
          sidRequests: sidRequests,
        },
        () => {
          if (sid === 'Create') {
            if (this.state.formType === 'template') return this.verifyAndProcessDoc();

            const getFiles = () => {
              const result = (this.state.files && this.state.files.length > 0) ? [...this.state.files] : [];
              const fileUploadFields = Object.keys(this.state.fields).filter(fieldSid => this.state.fields[fieldSid].inputType === 'AttachFile');
              fileUploadFields.forEach(fieldSid => {
                if (this.state.values[fieldSid].value && this.state.values[fieldSid].value.length > 0)
                  this.state.values[fieldSid].value.forEach(file =>result.push(file[2]));
              });
              return result;
            }

            const files = getFiles();

            if (
              files.length > 0
            ) {
              addDocumentFiles(this.props.basePath, {
                files: files,
                id: this.state.values['Идентификатор документа'].value,
              })
                .then(response => {
                  this.fetchDocument('Verify')
                    .catch(() => this.setState(oldState));
                })
                .catch(err => {
                });
            } else {
              this.fetchDocument('Verify')
                .catch(() => this.setState(oldState));
            }
          } else if (groupIndex === -1) {
            if (formData.nextSidRequest) {
              this.fetchDocument(formData.nextSidRequest);
            } else {
              return this.verifyAndProcessDoc();
            }
          } else {
            const nextGroupIdx = groupIndex;
            if (!this.checkIfAnyFieldApplyCondition(nextGroupIdx))
              this.onClickNext(nextGroupIdx + 1);
          }
        },
      );

      try {
        // this.requestAccountsData(formData.fields);
        this.requestActionData(formData.fields);
      } catch (error) {
        console.error(error);
      }
    })
  }

  checkIfAnyFieldApplyCondition(groupIndex) {
    const nextGroupIdx = groupIndex;
    const nextGroupName = getGroupNameByIndex(
      this.state.groups,
      nextGroupIdx,
    );
    const fields = this.state.valuesGroups[nextGroupName]
    .map((el) => this.state.fields[el])
    .filter(item => checkCondition(item, this.state.values));
    return fields.length > 0;
  }

  verifyAndProcessDoc = () => {
    if (this.state.formType) {
      let nextStep = documentSteps.complete;
      switch (this.state.formType) {
        case 'template':
          if (this.state.templateCreateSent) break;
          const values = this.state.values;
          values['Признак шаблона'] = {
            name: 'Признак шаблона',
            type: 'boolean',
            value: true,
            isCorrect: true,
          };
          this.setState({values, templateCreateSent:  true}, () => {
            this.fetchDocument('Create');
            this.setState({
              currentActiveStep: this.state.steps.length - 1,
              step: nextStep,
            });
          });
          return;
        case 'autopayment':
        case 'new_autopayment':
          nextStep = 5;
          break;
        case 'favorite':
          nextStep = 6;
          break;
      }
      this.setState({
        currentActiveStep: this.state.steps.length - 1,
        step: nextStep,
      });
    }
    else {
      // if (storage.get('isSign') == '1') {
      //   this.processSign();
      // TODO REMOVE FALSE
      if (false && this.props.regimeConfirmation == '1') {
        this.processConfirm();
      } else {
        this.processDoc();
      }
    }
  };

  processConfirm() {
    this.setState(
      { step: 2 },
      () => {
        this.handleRequestConfirm();
      },
    );
  }

  handleConfirm() {
    if (this.isLoading) {
      return;
    }

    this.processDoc(this.state.code);
  }

  handleRequestConfirm() {
    // last step processDoc
    const parameters = [
      {
        name: 'Идентификатор документа',
        type: 'int',
        value: this.state.values['Идентификатор документа'].value,
      },
    ];

    execute({
      sidRequest: 'GetCodeSMS',
      parameters,
    })
      .then(formDataResponse => {
        const formData = parseFormData(formDataResponse, this.state.values);

        this.setState(
          {
            code: '',
            phoneNumber:
              formData.values['Телефон на который отправлен код'].value,
            timeSending: formData.values['Время отправки'].value,
            liveTime:
              Number(
                formData.values['Срок действия одноразового пароля'].value,
              ) * 60,
          },
          this.startRequestTimer,
        );
      })
      .catch(err => {
      });
  }

  startRequestTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(() => {
      if (this.state.liveTime > 0) {
        this.setState({
          liveTime: this.state.liveTime - 1,
        });
      } else {
        clearInterval(this.timerId);
      }
    }, 1000);
  }

  processDoc = code => {
    const parameters = getParameters(this.state, this.props);
    this.isLoading = true;

    if (code) {
      parameters.push({
        name: 'Код подтверждения',
        type: 'string',
        value: code,
      });
    }

    this.handleExecute('processDocument', parameters)
      .then(formDataResponse => {
        this.isLoading = false;

        const formData = parseFormData(formDataResponse, this.state.values);
        const nextStep = (this.sidDocument === 'UBS_MESSAGE' || this.sidDocument === 'GetAutoPaymentField') ?
          'message' : documentSteps.complete;
        let values = Object.assign({}, this.state.values, formData.values);

        // AUTO COMPLETE!
        if (false && this.sidDocument === 'UBS_MESSAGE') {
          if (this.props.onCancel) {
            this.props.onCancel();
          } else {
            history.goBack();
          }
        }
        if (this.sidDocument === 'GetAutoPaymentField') {
          const state = stateDecode[formData.values['Состояние'].value] || {
            text: 'В обработке!',
          };
          Alert.alert('Статус подключения автоплатежа', state.text, [
            {
              text: 'Закрыть',
              onPress: () => {
                Navigation.dismissAllModals();
              },
            },
          ]);
        }

        if (this.sidDocument === 'UBS_MESSAGE') {
          const state = stateDecode[formData.values['Состояние'].value] || {
            text: 'В обработке!',
          };
          Alert.alert('Отправка сообщения', state.text, [
            {
              text: 'Закрыть',
              onPress: () => {
                Navigation.pop(this.props.componentId);
              },
            },
          ]);
          return;
        }

        if (this.sidDocument === 'UBS_CARD_CHANGESTATE') {
          this.props.dispatch(
            getProductInfo(
              this.state.values['Документ.Идентификатор договора'].value,
              'cards',
              '',
            ),
          );
        }

        this.setState({
          currentActiveStep: this.state.currentActiveStep + 1,
          step: nextStep,
          docStatus: formData.values['Состояние'].value,
          valuesGroups: Object.assign(
            {},
            this.state.valuesGroups,
            formData.valuesGroups,
          ),
          fields: Object.assign({}, this.state.fields, formData.fields),
          processValues: values,
        });
        if (code) {
          clearInterval(this.timerId);
        }
        this.props.onComplete && this.props.onComplete();
        processEndingAction({
          sid: this.sidDocument,
          dispatch: this.props.dispatch,
        });
        if (this.props.sid === 'UBS_SBP_M_APP_CONFIRM') {
          const linkToOpen = `sbpay://tokenIntent/${this.props.defaultValues['Идентификатор намерения']}/success`;
          Linking.openURL(linkToOpen);
        }
      })
      .catch(() => {
        this.isLoading = false;
        if (this.props.sid === 'UBS_SBP_M_APP_CONFIRM') {
          const linkToOpen = `sbpay://tokenIntent/${this.props.defaultValues['Идентификатор намерения']}/failed`;
          Linking.openURL(linkToOpen);
        }
        if (code) {
          this.nErrorEnters++;
          if (this.nErrorEnters === 3) {
            this.nErrorEnters = 0;
            this.setState({
              liveTime: 0,
              code: '',
            });
            clearInterval(this.timerId);
          }
        }
      },
    );
  };

  requestActionData = fields => {
    let actions = {};
    _.each(fields, field => {
      if (field.inputType === 'TextBoxFind' && field.action) {
        actions[field.action] = true;
      }
    });
    let actionsPromises = _.map(actions, (value, action) => {
      return new Promise((resolve, reject) => {
        execute(this.props.basePath, {
          sidRequest: action,
        })
          .then(response => {
            resolve({
              data: response,
              action: action,
            });
          })
          .catch(err => {
            console.error(err);
            reject(err);
          });
      });
    });
    this.setState({ isLoading: true })
    Promise.all(actionsPromises)
      .then(responseArray => {
        const actions = {};
        responseArray.forEach(response => {
          try {
            const data = response.data;
            const gridValues = _.find(data.values, {
              name: data.inputFields[1].fields[0].sid,
            }).value;
            const fields = data.inputFields[0].fields.map(e => e.sid);
            const names = data.inputFields[0].fields.map(e => e.name);

            actions[response.action] = {
              values: gridValues,
              fields,
              names,
            };
          } catch (err) {
            this.setState({ err });
          }
        });

        this.setState({
          actions: Object.assign({}, this.state.actions, actions),
          isLoading: false,
        });
      })
      .catch(err => { console.error(err);
      });
  };

  openNewAutopayment = async () => {
    let defaultValues = {};
    if (this.props.type === 'new_autopayment') {
      defaultValues = getParameters(this.state);
    } else {
      defaultValues = {
        'Идентификатор документа': this.state.values['Идентификатор документа'].value,
      };
    }

    await Navigation.dismissAllModals();
    await Navigation.popToRoot(this.props.componentId);
    await pushScreen({
      componentId: this.props.logonTabComponentId,
      screenName: 'unisab/Document',
      title: 'Подключение автоплатежа',
      passProps: {
        sid: 'GetAutoPaymentField',
        defaultValues,
        isDescriptionShown: false,
      },
    });
  };
}

async function requestFilePermission() {
  if (Platform.OS === 'ios') {
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Запрос доступа к файлам',
          message: 'Для прикрепления файлов необходимо предоставить доступ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
    }
  }
}

const mapStateToProps = state => ({
  basePath: state.api.apiRoute,
  logonTabComponentId: state.routing.logonTabComponentId,
  regimeConfirmation: state.login.regimeConfirmation,
  forbidSaveAsTemplate: state.settingsFront.forbidSaveAsTemplate,
  maxUploadFileSize: state.settingsFront.maxUploadFileSize,
  allowedFiles: state.settingsFront.allowedFiles,
});

export default connect(mapStateToProps)(Document);
