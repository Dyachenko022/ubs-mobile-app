import React from 'react';
import {View, SafeAreaView, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import FilledButton from '../../components/buttons/FilledButton';
import PropTypes from 'prop-types';
import LimitCategory from './components/LimitCategory';
import isEqual from 'lodash/isEqual';
import {makeLeftBackButton} from '../../utils/navigationUtils';
import {Navigation} from 'react-native-navigation';
import BankTheme from '../../utils/bankTheme';

export default class LimitsScreen extends React.Component {

  static options = (props) => ({
    topBar: {
      leftButtons: [
        makeLeftBackButton('mapListButtonBack')
      ],
    }
  })

  limitsToSave = {
    cashLimits: {
      dailyLimit: 0,
      monthlyLimit: 0,
    },
    cashlessLimits: {
      dailyLimit: 0,
      monthlyLimit: 0,
    },
    internetLimits: {
      dailyLimit: 0,
      monthlyLimit: 0,
    },
  }

  componentDidMount() {
    this.props.getLimits(this.props.idObject);
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(prevProps.cashLimits, this.props.cashLimits) || !isEqual(prevProps.cashlessLimits, this.props.cashlessLimits)
      || !isEqual(prevProps.internetLimits, this.props.internetLimits)) {
        this.limitsToSave = {
          cashLimits: {
            dailyLimit: this.props.cashLimits.dailyLimit,
            monthlyLimit: this.props.cashLimits.monthlyLimit,
          },
          cashlessLimits: {
            dailyLimit: this.props.cashlessLimits.dailyLimit,
            monthlyLimit: this.props.cashlessLimits.monthlyLimit,
          },
          internetLimits: {
            dailyLimit: this.props.internetLimits.dailyLimit,
            monthlyLimit: this.props.internetLimits.monthlyLimit,
          },
        }
    }
  }

  renderLoader = () => {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(100,100,100,0.2)'
      }}>
        <ActivityIndicator size="large" color={BankTheme.color1}/>
      </View>
    )
  };

  render() {
    if (this.props.isLoading) {
      return this.renderLoader();
    }
    return (
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView>

          <Text style={{fontSize: 26, padding: 5, color: 'gray'}}>Управление лимитами карты</Text>

          <LimitCategory
            limitsName="Выдача наличных"
            dailyLimit={this.props.cashLimits.dailyLimit}
            dailyLimitUsed={this.props.cashLimits.dailyLimitUsed}
            maxDailyLimit={this.props.cashLimits.maxDailyLimit}
            monthlyLimit={this.props.cashLimits.monthlyLimit}
            monthlyLimitUsed={this.props.cashLimits.monthlyLimitUsed}
            maxMonthlyLimit={this.props.cashLimits.maxMonthlyLimit}
            onChangeDailyLimit={(v) => this.limitsToSave.cashLimits.dailyLimit = v}
            onChangeMonthlyLimit={(v) => this.limitsToSave.cashLimits.monthlyLimit = v}
            dailyLimitCurrencyISO={this.props.cashLimits.dailyLimitCurrencyISO}
            monthlyLimitCurrencyISO={this.props.cashLimits.monthlyLimitCurrencyISO}
          />

          <LimitCategory
            limitsName="Безналичная оплата"
            dailyLimit={this.props.cashlessLimits.dailyLimit}
            dailyLimitUsed={this.props.cashlessLimits.dailyLimitUsed}
            maxDailyLimit={this.props.cashlessLimits.maxDailyLimit}
            monthlyLimit={this.props.cashlessLimits.monthlyLimit}
            monthlyLimitUsed={this.props.cashlessLimits.monthlyLimitUsed}
            maxMonthlyLimit={this.props.cashlessLimits.maxMonthlyLimit}
            onChangeDailyLimit={(v) => this.limitsToSave.cashlessLimits.dailyLimit = v}
            onChangeMonthlyLimit={(v) => this.limitsToSave.cashlessLimits.monthlyLimit = v}
            dailyLimitCurrencyISO={this.props.cashlessLimits.dailyLimitCurrencyISO}
            monthlyLimitCurrencyISO={this.props.cashlessLimits.monthlyLimitCurrencyISO}
          />

          <LimitCategory
            limitsName="Безналичная оплата в интернете"
            dailyLimit={this.props.internetLimits.dailyLimit}
            dailyLimitUsed={this.props.internetLimits.dailyLimitUsed}
            maxDailyLimit={this.props.internetLimits.maxDailyLimit}
            monthlyLimit={this.props.internetLimits.monthlyLimit}
            monthlyLimitUsed={this.props.internetLimits.monthlyLimitUsed}
            maxMonthlyLimit={this.props.internetLimits.maxMonthlyLimit}
            onChangeDailyLimit={(v) => this.limitsToSave.internetLimits.dailyLimit = v}
            onChangeMonthlyLimit={(v) => this.limitsToSave.internetLimits.monthlyLimit = v}
            dailyLimitCurrencyISO={this.props.internetLimits.dailyLimitCurrencyISO}
            monthlyLimitCurrencyISO={this.props.internetLimits.monthlyLimitCurrencyISO}
          />

      </ScrollView>
        <View style={{paddingTop: 5,}}>
          <FilledButton title="Установить лимиты" onPress={() => this.props.saveLimits(this.limitsToSave.cashLimits,
            this.limitsToSave.cashlessLimits, this.limitsToSave.internetLimits)}/>
        </View>
      </SafeAreaView>
    )
  }
}

LimitsScreen.propTypes = {
  isLoading: PropTypes.bool,
  cashLimits: PropTypes.shape({
    monthlyLimit: PropTypes.number,
    monthlyLimitUsed: PropTypes.number,
    maxMonthlyLimit: PropTypes.number,
    dailyLimit: PropTypes.number,
    dailyLimitUsed: PropTypes.number,
    maxDailyLimit: PropTypes.number,
    monthlyLimitCurrencyISO: PropTypes.string,
    dailyLimitCurrencyISO: PropTypes.string,
  }),
  cashlessLimits: PropTypes.shape({
    monthlyLimit: PropTypes.number,
    monthlyLimitUsed: PropTypes.number,
    maxMonthlyLimit: PropTypes.number,
    dailyLimit: PropTypes.number,
    dailyLimitUsed: PropTypes.number,
    maxDailyLimit: PropTypes.number,
  }),
  internetLimits: PropTypes.shape({
    monthlyLimit: PropTypes.number,
    monthlyLimitUsed: PropTypes.number,
    maxMonthlyLimit: PropTypes.number,
    dailyLimit: PropTypes.number,
    dailyLimitUsed: PropTypes.number,
    maxDailyLimit: PropTypes.number,
  }),
  needConfirm: PropTypes.bool,
  idDocument: PropTypes.number,
  getLimits: PropTypes.func,
  saveLimits: PropTypes.func,
  idObject: PropTypes.number,
};

LimitsScreen.defaultProps = {
  idObject: 0,
}
