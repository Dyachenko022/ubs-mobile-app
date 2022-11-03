import React from 'react';
import PropTypes from 'prop-types';
import { View,Text,TouchableOpacity, Switch } from 'react-native';
import { showModal } from '../../../../utils/navigationUtils';
import { parseMoney } from '../../../../utils/text';
import Collapsible from '../../../../components/Collapsible';
import Svg from 'react-native-svg';
import ArrowRight from '../../../../../assets/icons/arrowRight.svg';
import BankTheme from '../../../../utils/bankTheme';
import LimitCategoryHeader from './LimitCategoryHeader';
import LimitRow from './LimitRow';

export default class LimitCategory extends React.Component {

  state = {
    isLimitsShown: this.props.dailyLimit > -1 || this.props.monthlyLimit > -1,
    dailyLimit: this.props.dailyLimit,
    monthlyLimit: this.props.monthlyLimit,
  }

  editMonthlyLimitPress = () => {
    showModal({
      screenName: 'unisab/ModalSetLimit',
      title: 'Установка лимита',
      passProps: {
        limit: this.state.monthlyLimit,
        maxLimit: this.props.maxMonthlyLimit,
        limitType: 'monthly',
        onChangeLimit: (monthlyLimit) => {
          this.setState({monthlyLimit});
          if (this.props.onChangeMonthlyLimit) this.props.onChangeMonthlyLimit(monthlyLimit);
        },
      }
    })
  }

  editDailyLimitPress = () => {
    showModal({
      screenName: 'unisab/ModalSetLimit',
      title: 'Установка лимита',
      limitType: 'daily',
      passProps: {
        limit: this.state.dailyLimit,
        maxLimit: this.props.maxDailyLimit,
        onChangeLimit: (dailyLimit) => {
          this.setState({dailyLimit});
          if (this.props.onChangeDailyLimit) this.props.onChangeDailyLimit(dailyLimit);
        },
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.monthlyLimit !== this.props.monthlyLimit) {
      this.setState({
        isLimitsShown: this.props.monthlyLimit > -1,
        monthlyLimit: this.props.monthlyLimit > -1 ? this.props.monthlyLimit : 0,
      });
    }
    if (prevProps.dailyLimit !== this.props.dailyLimit) {
      this.setState({
        isLimitsShown: this.props.dailyLimit > -1,
        dailyLimit: this.props.dailyLimit > -1 ? this.props.dailyLimit : 0,
      });
    }
  }

  get isLimitsSet() {
    return this.props.dailyLimit > -1 || this.props.monthlyLimit > -1;
  }

  render() {
    return (
      <View style={styles.container}>

        <LimitCategoryHeader
          isLimitsSet={this.isLimitsSet}
          isLimitsShown={this.state.isLimitsShown}
          onPress={() => this.setState({ isLimitsShown: !this.state.isLimitsShown })}
          limitsName={this.props.limitsName}
        />

        <Collapsible collapsed={!this.state.isLimitsShown}>

          <LimitRow
            limitName="Месячный лимит"
            onPressEditLimit={this.editMonthlyLimitPress}
            limit={this.state.monthlyLimit}
            limitCurrencyISO={this.props.monthlyLimitCurrencyISO}
            limitUsed={this.props.monthlyLimitUsed}
            onSetLimitSet={(v) => {
              if (v) {
                this.props.onChangeMonthlyLimit(0);
              } else {
                this.props.onChangeMonthlyLimit(-1);
              }
            }}
          />

          <LimitRow
            limitName="Дневной лимит"
            onPressEditLimit={this.editDailyLimitPress}
            limit={this.state.dailyLimit}
            limitCurrencyISO={this.props.dailyLimitCurrencyISO}
            limitUsed={this.props.dailyLimitUsed}
            onSetLimitSet={(v) => {
              if (v) {
                this.props.onChangeDailyLimit(0);
              } else {
                this.props.onChangeDailyLimit(-1);
              }
            }}
          />

        </Collapsible>
      </View>
    )
  }
}

LimitCategory.propTypes = {
  monthlyLimit: PropTypes.number,
  monthlyLimitUsed: PropTypes.number,
  dailyLimit: PropTypes.number,
  dailyLimitUsed: PropTypes.number,
  onChangeMonthlyLimit: PropTypes.func,
  onChangeDailyLimit: PropTypes.func,
  limitsName: PropTypes.string,
  maxDailyLimit: PropTypes.number,
  maxMonthlyLimit: PropTypes.number,
  dailyLimitCurrencyISO: PropTypes.string,
  monthlyLimitCurrencyISO: PropTypes.string,
};

const styles = {
  container: {
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
  },
};
