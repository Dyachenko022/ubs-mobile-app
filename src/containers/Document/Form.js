import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import {
  Text, Image, View,
  ScrollView, BackHandler, TouchableWithoutFeedback,
  ActivityIndicator, Alert,
  Slider, Platform, findNodeHandle, Dimensions, PixelRatio, KeyboardAvoidingView
} from 'react-native';
import _ from 'lodash';

import TouchableOpacity from '../../components/Touchable';

const md5 = require('md5');
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  TextBox, ComboBoxDropDown, ComboBoxMultiSelect,
  DateTime, Grid
} from './inputs';

import CustomStyleSheet from "../../resources/customStyleSheet";
import TextBoxInput from "../../components/TextBoxInput";
import CardInput from "../../components/CardInput";
import CardBoxInput from "../../components/CardBoxInput";
import RadioInput from '../../components/Inputs/RadioButton';
import TextBoxFind from '../../components/Inputs/TextBoxFind';
import DateInput from '../../components/Inputs/DateInput';
import TextBoxNote from '../../components/Inputs/TextBoxNote';
import DataGridView from '../../components/Inputs/DataGridView';
import ContactsInput from '../../components/Inputs/ContactsInput';
import BottomSlideView from '../../components/BottomSlideView';
import CardInputAccount from './AccountItem';
import ComboBoxListFind from '../../components/Inputs/ComboBoxListFind';
import DocumentHeader from './Header';
import TextBoxMoney from '../../components/Inputs/TextBoxMoney';
import { WebView } from 'react-native-webview';

import { Linking } from 'react-native';

import {Switch} from 'react-native-ui-lib';

const arrow_down = require('../../../assets/icons/buttons/arrow_down.png');
const arrow_up = require('../../../assets/icons/buttons/arrow_up.png');

import {
  getGroupIdxByName, getGroupNameByIndex, checkCondition,
  checkValueCorrectness, getTextBoxNoteText, getCurrentCurrency
} from './utils';
import { parseMoney, transliterate } from '../../utils/text';
import ListDocs from "./inputs/ListDocs";
import {getPathFile} from "../../api/actions";
import LinkLabel from '../../components/LinkLabel';
import TaxablePeriod from '../../components/Inputs/TaxablePeriod';
import FileUpload from '../../components/Inputs/FileUpload';
import ComboBoxDropdownList from '../../components/ComboBoxDropdownList';
import BankTheme from '../../utils/bankTheme';
import AutosizeImage from '../../components/AutosizeImage';
import bankTheme from '../../utils/bankTheme';


const HEIGHT = 50;
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height
const widthPercentageToDP = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
const heightPercentageToDP = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};
function PaymentWebView(props) {
  return props.uri !== '' && <View style={{ marginLeft: -11, width: width, height: height, flex: 0, backgroundColor: 'black'}}>
    <WebView
      source={{ uri: props.uri }}
      onShouldStartLoadWithRequest={event => {
        if (event.url.indexOf('pdf') !== -1 && event.url !== props.uri) {
          Linking.openURL(event.url)
          return false
        }
        return true
      }}
    />
  </View>;
}


function PaymentWebViewAndoird(props) {
  return props.uri !== '' && <ScrollView style={{ marginLeft: -11, width: width, height: height + heightPercentageToDP(45), backgroundColor: 'black' }}>
    <WebView
      style={{ flex: 0, width: width, height: height + heightPercentageToDP(55) }}
      source={{ uri: props.uri }}
      onShouldStartLoadWithRequest={event => {
        if (event.url !== props.uri) {
          Linking.openURL(event.url)
          return false
        }
        return true
      }}
    />
  </ScrollView>;
}

class CardInputText extends PureComponent {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.itemContainer]}>
          <Text>{this.props.label}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

export const getCardInputSelected = (field, props = {}) => {
  if (!field || !field.inputType) return {};

  return getCardInputOptions(field, props)[getCardInputSelectedIndex(field, props)];
};

export const getCardInputSelectedIndex = (field, props) => {
  if (!field || !field.inputType) return -1;

  const options = getCardInputOptions(field, props);
  const baseSid = field.sid;
  const subSid = field.subSid;
  const fieldValue = props.values[baseSid];
  const accountNumberFieldValue = props.values[subSid];

  if (!fieldValue) return -1;

  if (field.inputType === 'Account') {
    for (let i = 0; i < options.length; ++i) {
      if (options[i].value.code === 'PLCARD') {
        if ((options[i].contractNumber === fieldValue.value || options[i].accountNumber === fieldValue.value)
          && (!accountNumberFieldValue.value
            || accountNumberFieldValue.value === options[i].accountNumber)) {

          return i;
        }
      } else if (options[i].accountNumber === fieldValue.value) {
        return i;
      }
    }

    return -1;
  }

  if (field.inputType === 'ComboBoxDropDown' ||
    field.inputType === 'ComboBoxMultiSelect') {

    return options.findIndex(option => option.value === fieldValue.value);
  }
};

const getCardInputOptions = (field, props = {}) => {
  if (!field || !field.inputType) return [];

  if (field.inputType === 'Account') {
    const baseSid = field.sid;
    const subSid = field.subSid;

    if (!props.values[baseSid] || !props.listValues[baseSid]) return [];

    const options = field.options || '';
    const invalidCodes = options ? options.split(';') : [];
    const fieldListValues = props.listValues[baseSid];

    const isInfieldListValues = {};
    if (Array.isArray(fieldListValues.value)) {
      fieldListValues.value.forEach(e => {
        isInfieldListValues[e[0] + e[1]] = true;
      })
    }

    let accounts = props.accounts.filter(
      acc =>
        isInfieldListValues[acc.accountNumber + acc.contractNumber] &&
        invalidCodes.indexOf(acc.value.code) === -1
    );
    if (accounts) {
      accounts = accounts.map(el => {
        let newEl = el;
        newEl.value.logo = newEl.logo;
        return newEl;
      });
    }

    return accounts;
  }

  if (field.inputType === 'ComboBoxDropDownList' ||
    field.inputType === 'ComboBoxDropDown' ||
    field.inputType === 'ComboBoxListFind' ||
    field.inputType === 'ComboBoxMultiSelect') {

    return props.listValues[field.sid] ?
      props.listValues[field.sid].value.map(e => ({ value: e[0], label: e[1] })) :
      [];
  }

  if (field.inputType === 'DataGridView') {
    return props.listValues[field.sid] ?
      props.listValues[field.sid].value.map(e => ({ value: e[0], label: e[1] })) :
      [];
  }

  return [];
};

const getSliderInfo = (_values = []) => {
  if (!Array.isArray(_values) && _values.length < 2) return false;

  let values = _values.map(v => Number(v));
  if (values.filter(v => Number.isNaN(v))) return false;

  let step = values[1] - values[0];
  let max = values[0], min = values[0];
  for (let i = 1; i < values.length; ++i) {
    if (values[i] - values[i - 1] < step) {
      step = values[i] - values[i - 1];
    }

    if (step < 1) return false;

    if (values[i] < min) min = values[i];
    if (values[i] > max) max = values[i];
  }

  return {
    step, min, max, values
  };
};

const isRadioInput = (options) => {
  const isLongLabel = Boolean(_.find(options, op => op.label.length > Math.floor(36 / options.length)));

  return !isLongLabel && options.length < 5;
};

const isBottomViewInput = (field, props = {}) => {
  const options = getCardInputOptions(field, props);

  if (field.inputType === 'Account' || field.inputType === 'DataGridView') {
    return true;
  }

  if (field.inputType === 'ComboBoxMultiSelect') {
    return !isRadioInput(options);
  }

  return false;
};

const isSelectableInput = (field, props = {}) => {
  if (field.inputType === 'ComboBoxDropDownList' ||
    field.inputType === 'ComboBoxMultiSelect' ||
    field.inputType === 'ComboBoxListFind'
  ) {

    return true
  }

  return false
};

export default class Form extends React.Component {
  static defaultProps = {
    accounts: [],
    groups: [],
    valuesGroups: {},
    fields: {},
    values: {},
    listValues: {},
    files: [],

    currentGroupName: '',
    currentGroupIndex: -1,
    logoForm: '',
    nameForm: '',
    descriptionForm: '',

    isGroupFilled: false,
    isDescriptionShown: false,
    isFormControlShown: true,
    maxUploadFileSize: 200000,
    allowedFiles: ['pdf', 'docx'],

    handleValuesChange: () => {
    },
    handleFileRemoveByIdx: () => {
    },
    handleFileAdd: () => {
    },
    onFieldFocus: () => {

    }
  };

  get fieldsForRender() {
    const currentGroupName = getGroupNameByIndex(this.props.groups, this.props.currentGroupIndex);
    const fieldSids = this.props.valuesGroups[currentGroupName] || [];

    if (fieldSids[0] === "Перевод Best2Pay") {
      return []
    }

    return fieldSids.filter(fieldSid => {
      const field = this.props.fields[fieldSid];
      if (field.inputType === 'LinkLabel' || field.inputType === 'ImageLogo') return false;
      return fieldSid && field &&
        !field.readOnly &&
        checkCondition(this.props.fields[fieldSid], this.props.values)
    });
  }

  get currentFocusIdx() {
    return this.fieldsForRender.indexOf(this.state.currentFocus);
  }

  get totalSteps() {
    return this.fieldsForRender.length;
  }

  get currentFocusField() {
    return this.props.fields[this.state.currentFocus] || {};
  }

  constructor(props) {
    super(props);
    this.state = {
      // currentStep: 0,
      currentFocus: 0,
      renderFuncName: "blankRender",
      isCardInputShown: true,
      options: [],

      contacts: [],
      fieldFocused: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.showCarousel = this.showCarousel.bind(this);
    this.nextField = this.nextField.bind(this);
    this.prevField = this.prevField.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);

    this.renderField = this.renderField.bind(this);
    this.renderTextNode = this.renderTextNode.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.renderGroup = this.renderGroup.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderTextBoxNote = this.renderTextBoxNote.bind(this);
    this.renderAccount = this.renderAccount.bind(this);
    this.renderTextBoxFind = this.renderTextBoxFind.bind(this);
    this.renderDropDownList = this.renderDropDownList.bind(this);
    this.renderPreviousGroups = this.renderPreviousGroups.bind(this);

    this.setFieldValueBySid = this.setFieldValueBySid.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler?.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.currentGroupIndex !== prevProps.currentGroupIndex && this.fieldsForRender.length) {
      this.onFocus(this.fieldsForRender[0]);
    }
  }

  render() {
    return this.rendererFullRender();
  }

  rendererSimpleRender() {
    return (
      <Fragment>
        {this.renderGroups()}
      </Fragment>
    )
  }

  rendererFullRender() {
    const currentFocusIdx = this.currentFocusIdx + 1;

    const ContainerComponent = bankTheme.hasEmui ? KeyboardAvoidingView : View;

    return (
      <View style={styles.screenContainer}>
        {this.props.isLoading && (
          <View style={styles.screenLoader}>
            <ActivityIndicator size="large" color={BankTheme.color1} />
          </View>
        )}

        <ScrollView style={styles.scrollView}
          keyboardShouldPersistTaps={"always"}
          ref={(element) => this.scrollContainer = element}
        >
          {this.props.isDescriptionShown && (
            <DocumentHeader
              logo={this.props.logoForm}
              name={this.props.nameForm}
              description={this.props.descriptionForm}
            />
          )}

          <ContainerComponent behavior="padding" enabled   keyboardVerticalOffset={100}>
            {this.renderGroups()}

            {this.props.children}

            {this.props.customErrorComponent()}
          </ContainerComponent>

        </ScrollView>

        {Boolean(this.totalSteps) && (
          <View style={[styles.bottomView, { minHeight: this.props.isFormControlShown ? 50 : 0 }]}>
            {this.props.isFormControlShown && (
              <View style={styles.formControl}>
                <View style={styles.stepContainer}>
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text>{currentFocusIdx + " шаг из " + this.totalSteps}</Text>
                    <View style={styles.stepContainer}>
                      <View style={[styles.line, { flex: currentFocusIdx }]} />
                      <View style={[styles.line, {
                        flex: this.totalSteps - currentFocusIdx,
                        backgroundColor: 'transparent'
                      }]} />
                    </View>
                  </View>
                </View>
                {this.totalSteps > 1 && (
                  <View style={styles.downButtonContainer}>
                    <TouchableOpacity onPress={this.prevField}>
                      <Image style={styles.imageStyle} source={arrow_up} />
                    </TouchableOpacity>
                  </View>
                )}
                {this.totalSteps > 1 && (
                  <View style={styles.upButtonContainer}>
                    <TouchableOpacity onPress={this.nextField}>
                      <Image style={styles.imageStyle} source={arrow_down} />
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.formControlContent} />
              </View>
            )}

            <BottomSlideView isShown={isBottomViewInput(this.currentFocusField, this.props)}
              ref={component => this.bottomView = {
                show: () => {
                },
                hide: () => {
                }
              }}>
              {this.renderBottomViewContent()}
            </BottomSlideView>

          </View>
        )}
      </View>
    )
  }

  renderBottomViewContent = () => {
    const field = this.currentFocusField;
    const cardInputOptions = getCardInputOptions(field, this.props);

    if (field.inputType === 'DataGridView') {
      const fieldValue = this.props.values[field.sid] && this.props.values[field.sid].value
        ? this.props.values[field.sid].value
        : [];

      return (
        <DataGridView
          options={cardInputOptions}
          values={fieldValue}
          onChange={(values) => {
            this.setFieldValueBySid(field.sid, values);
          }}
        />
      );
    } else {
      const cardInputRender = this.getCardInputRender(field);
      return (
        <CardInput
          // refCarousel={component => this.bottomViewCarousel = component}
          data={cardInputOptions}
          renderItem={cardInputRender}
          selectedIndex={getCardInputSelectedIndex(field, this.props)}
          onSnapToItem={(index) => {
            if (cardInputOptions[index]) {
              this.setFieldValueBySid(this.state.currentFocus, cardInputOptions[index].value)
            }
          }}
        />
      )
    }
  };

  renderGroups() {
    const currentGroupName = getGroupNameByIndex(this.props.groups, this.props.currentGroupIndex);

    return [this.renderPreviousGroups(),
    currentGroupName && this.renderGroup(currentGroupName, false)
    ];
  }

  renderPreviousGroups() {
    const groupsForRender = [];
    let offset = 0;

    this.props.groups.forEach((groupsArray) => {
      if (offset >= this.props.currentGroupIndex) return;

      if (Array.isArray(groupsArray)) {
        if (groupsArray.length > (this.props.currentGroupIndex - offset)) {
          groupsForRender.push(...groupsArray.slice(0, this.props.currentGroupIndex - offset));
        } else {
          groupsForRender.push(...groupsArray);
        }
        offset += groupsArray.length;
      } else {
        groupsForRender.push(groupsArray);
        offset += 1;
      }
    });

    return groupsForRender.map((name) => this.renderGroup(name, true));
  }

  renderGroup(name, isTextNode = false, isGroupFilled = false) {
    if (!this.props.valuesGroups[name]) {
      return;
    }

    const fields = this.props.valuesGroups[name].map((el) => this.props.fields[el]);
    const isSame = /^ext#/.test(name);

    return (
      <View key={name} style={styles.group}>
        {!isSame && !this.props.isWebView && (
          <View>
            <Text style={styles.groupTitle}>{name}</Text>
          </View>
        )}
        <View style={styles.groupContent}>
          {fields.map((field, idx) => this.renderField(field, isTextNode, idx))}
        </View>
      </View>
    )
  }

  renderField(field, isTextNode, idx) {
    if (!field || !checkCondition(field, this.props.values)) return;

    return (
      <View key={field.sid}
        ref={`field_${field.sid}`}
        style={styles.groupField}
      >
        {this.renderInput(field, isTextNode, idx)}
        {Boolean(!isTextNode && field.comment) && (
          <View>
            <Text
              style={{
                fontSize: 11,
                color: '#aeaeae',
                paddingLeft: 10,
                paddingTop: 2
              }}
            >
              {field.comment}
            </Text>
          </View>
        )}
      </View>
    )
  }

  renderInput(field, isTextNode, idx) {
    let { inputType } = field;
    let fieldValue

    if (field.sid === 'Перевод Best2Pay') {
      fieldValue = this.props.values['Адрес запроса'];
    } else {
      fieldValue = this.props.values[field.sid];
    }

    // render text if the field from previous steps or it is read-only field
    if (isTextNode || field.readOnly) return <View>{this.renderTextNode(field)}</View>; //this.renderTextNode(field);

    if (inputType !== 'ToogleSwitch' && /телефон/i.test(field.name)) {
      inputType = 'Contacts';
    }
    // else render correct input type
    switch (inputType) {
      case 'TextBoxFind':
        return this.renderTextBoxFind(field);
      case 'webView':
        return Platform.OS === 'ios' ? <PaymentWebView uri={fieldValue.value} /> : <PaymentWebViewAndoird uri={fieldValue.value} />;
      case 'Contacts':
        return this.renderContacts(field);
      case 'TextBoxNote':
        return this.renderTextBoxNote(field);
      case 'ComboBoxListFind':
        return this.renderComboBoxListFind(field);
      case 'TextBox':
        return (
          <TextBoxInput
            // autoFocus
            ref={"input" + field.sid}
            isFocused={field.sid === this.state.currentFocus}
            key={field.sid}
            mask={field.mask}
            name={field.name}
            isValid={fieldValue.isCorrect}
            maxLength={field.maxSize}
            placeholder={''}
            value={fieldValue.value}
            onFocus={() => this.onFocus(field.sid)}
            keyboardType={field.mobileInputKeyBoard || 'default'}
            onChangeText={(text) => {
              this.setFieldValueBySid(field.sid, text)
            }} />
        );
      case 'TextBoxMoney':
        return (
          <TextBoxMoney
            ref={"input" + field.sid}
            isFocused={field.sid === this.state.currentFocus}
            key={field.sid}
            isValid={fieldValue.isCorrect}
            name={field.name}
            keyboardType={Platform.OS === 'ios' ? "decimal-pad" : "numeric"}
            placeholder={'9999.99'}
            value={fieldValue.value}
            onFocus={() => this.onFocus(field.sid)}
            onChangeText={(text) => {
              this.setFieldValueBySid(field.sid, text)
            }} />
        );
      case 'Account':
        return this.renderAccount(field, idx);
      case 'AttachFile':
        return this.renderFileUpload(field);
      case 'ComboBoxDropDownList':
        const options = this.props.listValues[field.sid].value.map(item => ({
          label: item[1],
          value: item[0],
        }));

        const v = _.find(options, op => {
          if (field.sid === 'Документ.Назначение платежа') {
            return Number(op.value).toFixed(2) === Number(fieldValue.value).toFixed(2)
          }
          return op.value === fieldValue.value;
        });

        if (isRadioInput(options)) {
          let name = field.name;
          if (field.sid === 'Согласен с условиями' || field.sid === 'Документ.Согласен с условиями') {
            name = this.makeConfirmWithTermsDescription(field);
          }
          return <RadioInput
            isValid={fieldValue.isCorrect}
            ref={"input" + field.sid}
            name={name}
            options={options}
            value={v ? v.value : ''}
            onPress={(e) => {
              this.setFieldValueBySid(field.sid, e.value);
            }}
            onFocus={() => {
              this.onFocus(field.sid);
            }}
          />
        }

        return (
          <ComboBoxDropdownList
            ref={"input" + field.sid}
            fieldName={field.name}
            isValid={fieldValue.isCorrect}
            options={options}
            value={fieldValue.value}
            onChange={(value) => {
              this.setFieldValueBySid(field.sid, value)
            }}
            onFocus={() => this.onFocus(field.sid)}
          />
        );
      case 'ComboBoxDropDown':
        return this.renderTaxablePeriod(field);
      case 'ComboBoxMultiSelect':
        return this.renderDropDownList(field);
      case 'ListDocs':
        return this.renderListDocs(field);
      case 'ToogleSwitch':
        return this.renderSwitch(field);
      case 'Date':
        return (
          <DateInput
            ref={(e) => this.refs['input' + field.sid] = e}
            name={field.name}
            chosenDate={fieldValue.value || new Date()}
            onDone={(date) => {
              this.setFieldValueBySid(field.sid, date);
            }}
            isValid={fieldValue.isCorrect}
            onClose={() => { }}
            onFocus={() => {
              this.onFocus(field.sid);
            }}
          />
        );
      case 'DateTime':
        return <Text>DateTime</Text>;
      case 'ImageLogo':
        return (
          <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <AutosizeImage source={{ uri: fieldValue?.value }} />
          </View>
        );
      case 'LinkLabel':
        return this.renderLinkLabel(field);
      case 'array':
      case 'Grid':
        if (field.sid === 'Документ.Список файлов') {
          return this.renderFilesInput(field);
        } else {
          return this.renderGrid(field);
        }
      case 'DataGridView':
        return this.renderDataGridView(field);

      default:
        return <Text>Невозможно отобразить поле ввода</Text>
    }
  }  //`

  makeConfirmWithTermsDescription = (field) => {
    let components = [field.name];

    const toReplace = [{
      reg: 'условиями',
      link: this.props.linkInfo,
    }, {
      reg: 'тарифами',
      link: this.props.linkContract,
    }];
    // Разломаем текст на строки, а "условиями" и "тарифами" заменим на гиперссылки
    for (const entry of toReplace) {
      for (let i = components.length - 1; i >= 0; i--) {
        const component = components[i];
        if (typeof component === 'string') {
          const t = component.match(entry.reg);
          if (t) {
            components.splice(i + 1, 0, (
              <TouchableOpacity onPress={() => Linking.openURL(entry.link)}>
                <Text style={{color: BankTheme.color1}}>
                  {entry.reg}
                </Text>
              </TouchableOpacity>),
              components[i].substring(t.index + entry.reg.length)
            );
            components[i] = components[i].substring(0, t.index);
          }
        }
      }
    }
    // Оставшиеся string превратим в элементы
    return (
      <View style={{flexDirection: 'row', width: '100%', flexWrap: 'wrap',}}>
        {components.map((component) => {
          if (typeof component === 'string') return <Text>{component}</Text>;
          return component;
        })}
      </View>
    );
  }

  renderTaxablePeriod(field) {
    const fieldValue = this.props.values[field.sid] || {};
    const options = getCardInputOptions(field, this.props);

    const ftsAccounts = this.props.listValues['ФТС'] || {};
    const accountObj = this.props.values['Получатель.Счет'] || {};
    const bic = this.props.values['Банк получателя.БИК'] || {};
    const account = accountObj.value || '';

    return (
      <TaxablePeriod
        accountsFts={ftsAccounts.value}
        account={account.split('.').join('')}
        bic={bic.value}
        isValid={fieldValue.isCorrect}
        isFocused={field.sid === this.state.currentFocus}
        key={field.sid}
        ref={"input" + field.sid}
        name={field.name}
        value={fieldValue.value || ''}
        options={options}
        onChange={(value) => this.setFieldValueBySid(field.sid, value)}
        onFocus={() => this.onFocus(field.sid)}
      />
    )
  }

  renderLinkLabel(field) {
    const fieldValue = this.props.values[field.sid];
    return (
      <LinkLabel
        value={fieldValue.value}
        listValues={this.props.listValues[field.sid].value}
        name={field.name}
        hideName={field.hideName}
      />
    );
  }


  renderComboBoxListFind(field) {
    const fieldValue = this.props.values[field.sid];
    const options = this.props.listValues[field.sid].value.map(item => ({
      label: item[1],
      value: item[0],
    }));

    return(
      <ComboBoxListFind
        ref={"input" + field.sid}
        options={options}
        placeholder={field.name}
        fieldName={field.name}
        value={fieldValue.value}
        onFocus={() => this.onFocus(field.sid)}
        isValid={fieldValue.isCorrect}
        isSbp={this.props.sid.includes('SBP')}
        onChange={(value) => this.setFieldValueBySid(field.sid, value)}
      />
    )
  }

  renderFileUpload = (field, readOnly = false) => {
    const fieldValue = this.props.values[field.sid].value || [];
    const isCorrect = this.props.values[field.sid].isCorrect;
    const files = fieldValue.map(file => ({name: file[2].originFileName, uri: file[2].uri}));

    return (
      <FileUpload
        ref={(el) => this.refs[`input${field.sid}`] = el}
        onFocus={() => this.onFocus(field.sid)}
        name={field.name}
        files={files}
        readOnly={readOnly}
        isValid={isCorrect}
        maxSize={field.maxSize}
        minSize={field.minSize}
        addFile={() => this.addFile(field, false)}
        removeFile={(idx) => {
          const uri = files[idx].uri;
          const updatedFieldValue = fieldValue.filter(item => item[1] !== uri);
          this.setFieldValueBySid(field.sid, updatedFieldValue);
        }}
        />
    );
  }

  renderSwitch(field, readOnly = false) {
    const fieldValue = this.props.values[field.sid];
    const value = fieldValue.value == 1 ? true : false;

    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{width: '86%'}}>{field.name}</Text>
        <Switch
          disabled={readOnly}
          onColor={BankTheme.color1}
          offColor={'gray'}
          disabledColor={'#AAA'}
          onValueChange={() => this.setFieldValueBySid(field.sid, value ? 0 : 1)}
          value={value}
          />
      </View>
    );
  }

  renderListDocs(field, readOnly = false) {
    const fieldValue = this.props.values[field.sid];

    const documents = this.props.listValues[field.sid] && this.props.listValues[field.sid].value.map(item => ({
        documentName: item[0],
        documentLink: getPathFile() + item[1],
        isRequired: item[2],}
    )) || [];

    return (
      <ListDocs
        isCorrect={fieldValue.isCorrect}
        readOnly={readOnly}
        documents={documents}
        title={field.name}
        onFocus={() => this.onFocus(field.sid)}
        onDocumentShown={(documentIndex) => {
          /*
          Ты на сервер передаешь
            [1]-Имя файла он же вид
            [2]-guid
            [3]-дата ознакомления
            [4]-ХЭШ
           */
          let documents = this.props.values[field.sid].value;
          if (!Array.isArray(documents) || documents.length === 0) documents = this.props.listValues[field.sid].value.map(item => {
            const newItem = item.slice(0);
            newItem[2]=null;
            return newItem;
          });
          documents[documentIndex][2] = moment().format('DD.MM.YYYY');
          this.setFieldValueBySid(field.sid, documents);
        }}
        />
    )

  }

  renderTextBoxNote(field) {
    const fieldValue = this.props.values[field.sid];
    const options = this.props.listValues[field.sid].value.map((el) => {
      let val = el[0];
      if (val !== '0' || val !== '00') val = Number(el[0]).toFixed(2);

      return { value: val, label: el[1] };
    });

    return (
      <TextBoxNote
        ref={"input" + field.sid}
        isFocused={field.sid === this.state.currentFocus}
        key={field.sid}
        mask={field.mask}
        name={field.name}
        maxLength={field.maxSize}
        isValid={fieldValue.isCorrect}
        value={fieldValue.value}
        options={options}
        onFocus={() => this.onFocus(field.sid)}
        onChangeText={(text) => {
          this.setFieldValueBySid(field.sid, text)
        }}
      />
    )

  }

  renderContacts(field) {
    const fieldValue = this.props.values[field.sid];

    return (
      <ContactsInput
        autoFocus={true}
        isFocused={field.sid === this.state.currentFocus}
        ref={(el) => this.refs[`input${field.sid}`] = el}
        mask={field.mask}
        value={fieldValue.value}
        isCorrect={fieldValue.isCorrect}
        name={field.name}
        onChange={(value) => {
          this.setFieldValueBySid(field.sid, value);
        }}
        onFocus={() => this.onFocus(field.sid)}
      />
    )
  }

  renderTextBoxFind(field) {
    const actionData = this.props.actions[field.action];
    const fieldValue = this.props.values[field.sid];

    if (actionData && fieldValue) {
      const fieldIdx = actionData.fields.indexOf(field.sid);

      return (
        <TextBoxFind
          ref={(el) => this.refs[`input${field.sid}`] = el}
          isValid={fieldValue.isCorrect}
          value={fieldValue.value}
          data={actionData.values}
          name={field.name}

          itemRenderer={(values, idx) => (
            <TouchableOpacity
              key={`${idx}-${values[fieldIdx]}`}
              onPress={() => {
                values.forEach((value, idx) => {
                  if (!actionData.fields[idx] || !this.props.fields[actionData.fields[idx]]) return;

                  this.setFieldValueBySid(actionData.fields[idx], value || '');
                });
                this.refs[`input${field.sid}`].focus();
              }}
            >
              <Text style={{
                fontSize: 16,
                marginBottom: 5
              }}>{values[fieldIdx]} {values.find((e, i) => i !== fieldIdx)}</Text>
            </TouchableOpacity>
          )}

          filter={(el, cond) => {
            return !cond || !el[fieldIdx] || el[fieldIdx].match(new RegExp(cond, 'i'));
          }}
          onChange={(value) => {
            this.setFieldValueBySid(field.sid, value);
          }}
          onSubmit={(value) => {
            this.setFieldValueBySid(field.sid, value);
          }}
        />
      )
    } else {
      return <Text>Загрузка информации для поля...</Text>
    }
  }

  renderAccount(field, idx) {
    const showAccountNumberOnCard = field.showAccountNumberOnCards;
    // Нужны ли вообще options тут?
    const accounts = getCardInputOptions(field, this.props);
    const fieldValue = this.props.values[field.sid];
    const item = getCardInputSelected(field, this.props);
    const itemLabel = item && item.label
      ? item.label.slice(0, 25) + (item.label.length > 25 ? '...' : '')
      : '';
    return <CardBoxInput
      isValid={fieldValue.isCorrect}
      isFocused={field.sid === this.state.currentFocus}
      key={field.sid}
      ref={"input" + field.sid}
      name={field.name}
      value={fieldValue.value}
      options={accounts}
      onFocus={() => {
        this.onFocus(field.sid);
        // this.showCarousel(field.sid);
      }}
    >
      {item
        ? (
          <CardInputAccount
            logo={item.value.logo}
            label={itemLabel}
            accountNumber={item.accountNumber}
            contractNumber={item.value.contractNumber}
            code={item.value.code}
            balance={item.value.balance}
            currency={item.value.currency}
            showAccountNumberOnCard={showAccountNumberOnCard}

            imageContainerStyle={{
              height: 30,
              paddingLeft: 0,
              paddingRight: 10
            }}
            imageStyle={{
              height: 23,
              width: 35
            }}
            cardTextContainerStyle={{
              flex: 8
            }}
          />
        )
        : <Text>{field.placeholder}</Text>
      }
    </CardBoxInput>
  }

  renderDataGridView = (field) => {
    const fieldValue = this.props.values[field.sid];
    const options = getCardInputOptions(field, this.props);
    // const v = _.find(options, op => op.value === fieldValue.value);

    return <CardBoxInput
      isValid={fieldValue.isCorrect}
      isFocused={field.sid === this.state.currentFocus}
      key={field.sid}
      ref={"input" + field.sid}
      name={field.name}
      value={fieldValue.value ? fieldValue.value.sort((a, b) => a - b).join(', ') : ''}
      options={options}
      onFocus={() => {
        this.onFocus(field.sid);
      }}
    />
  }

  renderDropDownList(field) {
    const fieldValue = this.props.values[field.sid];
    const options = getCardInputOptions(field, this.props);
    const v = _.find(options, op => {
      if (field.sid === 'Документ.Назначение платежа') {
        return Number(op.value).toFixed(2) === Number(fieldValue.value).toFixed(2)
      }

      return op.value === fieldValue.value
    });
    const sliderInfo = getSliderInfo(options.map(op => op.value));

    if (sliderInfo) {
      return <Slider
        maximumValue={sliderInfo.max}
        minimumValue={sliderInfo.min}
        step={sliderInfo.step}
        value={v.value}

        onValueChange={(e) => {
        }}
      />
    } else if (isRadioInput(options)) {
      return <RadioInput
        isValid={fieldValue.isCorrect}
        ref={"input" + field.sid}
        name={field.name}
        options={options}
        value={v ? v.value : ''}
        onPress={(e) => {
          this.setFieldValueBySid(field.sid, e.value);
        }}
        onFocus={() => {
          this.onFocus(field.sid);
        }}
      />
    } else {
      return <CardBoxInput
        isValid={fieldValue.isCorrect}
        isFocused={field.sid === this.state.currentFocus}
        key={field.sid}
        ref={"input" + field.sid}
        name={field.name}
        value={v ? v.label : ''}
        options={options}
        onFocus={() => {
          this.onFocus(field.sid);
        }}
      />
    }
  }

  renderTextNode(field) {
    if (field.inputType === 'ScannerQR') return null;
    const fieldValue = this.props.values[field.sid] || {};
    let value = fieldValue.value;
    let curr = getCurrentCurrency(this.props) || '';

    if (fieldValue.type === 'decimal' && value) {
      if (fieldValue.name.indexOf('Процент') !== -1) {
        value = parseMoney(String(value).replace(/ /g, ''), '%') || 0.00;
      } else {
        value = parseMoney(String(value).replace(/ /g, ''), curr) || 0.00;
      }
    }

    if (isSelectableInput(field, this.props)) {
      const options = getCardInputOptions(field, this.props);
      const v = _.find(options, op => op.value === fieldValue.value);

      value = v ? v.label : '';
    }

    if (field.inputType === 'TextBoxNote') {
      // const [text, number] = value.split('^');
      // const sumFiledValue = this.props.values['Документ.Сумма'];
      //
      // value = `${text} ${getTextBoxNoteText(number, sumFiledValue.value)}`;

      const [text, nds] = value.split('^');
      const sumFiledValue = this.props.values['Документ.Сумма'];

      value = `${text} ${getTextBoxNoteText(nds, sumFiledValue.value)}`;
    }

    if (field.inputType === 'ToogleSwitch') {
      return (
        <View style={[styles.groupField, styles.groupTextField]}>
          <Text style={styles.groupFieldLabel}>{field.name}</Text>
          <View>
            {this.renderSwitch({...field, name: field.comment || field.name}, true)}
          </View>
        </View>
      )
    }

    if (field.inputType === 'ListDocs') {
      return (
        <View style={styles.groupField}>
          {this.renderListDocs(field, true)}
        </View>
      );
    }

    if (field.inputType === 'LinkLabel') return this.renderLinkLabel(field);

    return (
      <View style={[styles.groupField, styles.groupTextField]}>
        <Text style={styles.groupFieldLabel}>{field.name}</Text>
        <View>
          <Text style={[styles.groupFieldValue, { textAlign: 'left' }]}>{value}</Text>
        </View>
      </View>
    );
  }

  isNotValidExtension = fileName => {
    const extension = fileName.substr(fileName.lastIndexOf(".") + 1).toLowerCase();
    return this.props.allowedFiles.indexOf(extension) === -1;
  };

  addFile = async (field, addToFileProp = true) => {
    // Для старого контрола addToFileProp - true, для нового (FileUpload) надо ставить в false

    const result = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles]
    });

    const { sid } = field;
    const { name, size, type, uri } = result;

    if (this.isNotValidExtension(name)) {
      Alert.alert(
        "Ошибка загрузки файла!",
        "Недопустимый формат файла",
        [
          {
            text: "Закрыть",
            onPress: () => { }
          }
        ]
      );
      return;
    }

    const sumSizes = this.props.files.reduce((accum, _file) => _file.size + accum, 0);

    if (sumSizes + size > this.props.maxUploadFileSize) {
      Alert.alert(
        "Ошибка",
        `Превышена максимальная сумма размеров файлов – ${this.props.maxUploadFileSize / 1000 / 1000} мегабайт`,
        [
          {
            text: "Закрыть",
            onPress: () => { }
          }
        ]
      );
      return;
    }

    const newFieldValue = [...this.props.values[sid].value];

    const fff = Object.assign({}, result, {
      originFileName: name,
      fileName: transliterate(name)
    });

    newFieldValue.push([transliterate(name), uri, fff]);
    this.setFieldValueBySid(sid, newFieldValue);
    addToFileProp && this.props.handleFileAdd && this.props.handleFileAdd(fff, sid);
  }

  renderFilesInput = (field) => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
          <Text>{field.name}</Text>
          <TouchableWithoutFeedback
            onPress={() => this.addFile(field)}
          >
            <View
              style={{
                width: 24,
                height: 24,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Icon color={BankTheme.color1} size={24} name="md-attach" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {
          this.props.files.length ? this.props.files.map((file, idx) => {
            return (
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fefefe',
                paddingHorizontal: 10
              }}>
                <Text>{file.originFileName}</Text>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.props.handleFileRemoveByIdx && this.props.handleFileRemoveByIdx(idx);
                  }}
                >
                  <Icon name="ios-close" size={45} color={BankTheme.color1} />
                </TouchableWithoutFeedback>
              </View>
            )
          }) :
            <View>
              <Text style={{ color: '#666' }}>Ни одного файла не выбрано</Text>
            </View>
        }
      </View >
    )
  };


  getCardInputRender = (field) => {
    switch (field.inputType) {
      case 'Account':
        return ({ item, index }) => (
          <CardInputAccount
            logo={item.value.logo}
            label={item.label}
            accountNumber={item.accountNumber}
            contractNumber={item.value.contractNumber}
            code={item.value.code}
            balance={item.value.balance}
            currency={item.value.currency}
            showAccountNumberOnCard={field.showAccountNumberOnCards}
            onPress={() => {
              this.setFieldValueBySid(this.state.currentFocus, item.value);
              this.nextField();
            }}
          />
        );

      case 'ComboBoxDropDown':
      case 'ComboBoxMultiSelect':
        return ({ item, index }) => (
          <CardInputText
            value={item.value}
            label={item.label}
            onPress={() => {
              // this.onPressCardInputItem(index)
              this.setFieldValueBySid(this.state.currentFocus, item.value);
            }}
          />
        );

      default:
        return () => {
        };
    }
  };
  // RENDERERS END

  // EVENTS
  onPressCardInputItem = (index) => {
    this.setCardInputIndex(index);
  };

  onFocus(sid) {
    if (this.state.currentFocus != null &&
      this.state.currentFocus !== sid &&
      this.refs["input" + this.state.currentFocus] &&
      this.refs["input" + this.state.currentFocus].blur) {
      this.refs["input" + this.state.currentFocus].blur();
    }

    const isBottomView = isBottomViewInput(this.props.fields[sid], this.props);

    this.setState({
      currentFocus: sid,
      isCardInputShown: isBottomView
    }, () => {
      this.props.onFieldFocus(sid);
      setTimeout(() => {
        try {
          this.refs[`field_${sid}`].measureLayout(findNodeHandle(this.scrollContainer), (x, y, width, height) => {
            this.scrollContainer.scrollTo({
              x: 0,
              y: y - 10
            })
          })
        } catch (e) {
        }
      }, isBottomView ? 500 : 250);

    });
  }


  handleBackButton() {
    if (this.state.isCardInputShown && this.bottomView) {
      this.hideCarousel();
      return true;
    } else {
      return false;
    }
  }

  // EVENTS END


  // METHODS
  nextField() {
    if (this.currentFocusIdx < this.totalSteps) {
      const nextSid = this.fieldsForRender[this.currentFocusIdx + 1];
      const nextInput = "input" + nextSid;

      if (this.refs[nextInput] && this.refs[nextInput].focus) {
        this.refs[nextInput].focus();
      }
    }
  }

  prevField() {
    if (this.currentFocusIdx > 0) {
      const nextSid = this.fieldsForRender[this.currentFocusIdx - 1];
      const nextInput = "input" + nextSid;

      if (this.refs[nextInput]) {
        this.refs[nextInput].focus();
      }
    }
  }

  showCarousel(sid) {
    if (this.state.currentFocus != null &&
      sid !== this.state.currentFocus &&
      this.refs["input" + this.state.currentFocus] &&
      this.refs["input" + this.state.currentFocus].blur
    ) {
      this.refs["input" + this.state.currentFocus].blur();
    }

    this.setState({
      currentFocus: sid,
      isCardInputShown: true
    }, () => {
      // set card input index
      this.setCardInputIndex(getCardInputSelectedIndex(this.props.fields[sid], this.props));
      // set card input index END

      this.bottomView.show();
    });
  }

  hideCarousel = () => {
    this.setState({ isCardInputShown: false });
    this.bottomView.hide();
  }

  setCardInputIndex = (index) => {
    this.bottomViewCarousel
      && this.bottomViewCarousel.snapToItem
      && this.bottomViewCarousel.snapToItem(index);
  };

  setFieldValueBySid(fieldSid, value, type = '') {
    const field = this.props.fields[fieldSid];
    let newValues = Object.assign({}, this.props.values);
    if (!newValues[fieldSid]) {
      newValues[fieldSid] = {
        value: '',
        type: 'string',
        isCorrect: true
      }
    }

    if (field.inputType === 'Account') {
      let newValues = Object.assign({}, this.props.values);
      newValues[fieldSid].value = value.code === 'PLCARD' ? value.contractNumber : value.accountNumber;
      newValues[field.subSid].value = value.accountNumber;
    } else if (field.inputType === 'ComboBoxListFind'){
        newValues[fieldSid].isCorrect = true;
        newValues[fieldSid].value = value;
    } else {
      // TODO: change for different types
      newValues[fieldSid].value = value;
    }
    this.props.handleValuesChange(newValues);
  }

  //  METHODS END
}


export const styles = CustomStyleSheet({
  screenContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column'
  },
  screenLoader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100,0.2)',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10
  },
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  bottomView: {
    width: "100%",
    alignSelf: 'flex-end'
  },
  formControl: {
    height: 50,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  formControlContent: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },

  stepContainer: {
    flex: 0.6,
    flexDirection: 'row'
  },
  upButtonContainer: {
    flex: 0.2
  },
  downButtonContainer: {
    flex: 0.2
  },
  line: {
    height: 8,
    backgroundColor: BankTheme.color1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent'
  },

  itemContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 65,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    height: 40,
    width: 60,
    borderRadius: 2,
    marginRight: 10
  },
  cardTextContainer: {
    flex: 5,
    backgroundColor: 'transparent'
  },
  cardNameText: {
    fontSize: 11,
    flexWrap: 'nowrap'
  },
  cardNumberText: {
    fontSize: 10,
    color: '#9e9e9e'
  },
  balanceContainer: {
    flex: 4,
    alignItems: 'flex-end',
    backgroundColor: 'transparent'
  },
  balanceText: {
    fontSize: 14,
    flexWrap: 'nowrap'
  },

  group: {
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10
  },
  groupContent: {},
  groupField: {
    marginBottom: 10
  },
  groupTextField: {
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 5
  },
  groupFieldLabel: {
    color: '#7e7e7e',
    fontSize: 12
  },
  groupFieldValue: {
    fontWeight: '800',
    textAlign: 'center'
  }
});
