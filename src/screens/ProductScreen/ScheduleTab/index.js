import React from 'react';
import {ScrollView, View, ActivityIndicator, TouchableHighlight, TouchableNativeFeedback, Platform, Image} from 'react-native';
import {parseMoney} from '../../../utils/text';

import {getCreditSchedules} from '../../../api/actions'

import OperationButton from '../../../components/OperationButton/index';
import {TextRenderer as Text} from '../../../components/TextRenderer';
import Icon from 'react-native-vector-icons/Ionicons';

import styles from "./styles";
import {connect} from "react-redux";

import moment from 'moment';
import BankTheme from '../../../utils/bankTheme';

class ScheduleTab extends React.Component {
  componentDidMount() {
    this.props.dispatch(getCreditSchedules(this.props.id, this.props.code))
  }

  componentWillUpdate(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) this.props.dispatch(getCreditSchedules(nextProps.id, nextProps.code))
  }

  render() {
    const BtnContainer = Platform.OS === 'ios' ? TouchableHighlight : TouchableNativeFeedback;
    const containerStyles = {};

    const loading = this.props.loading ?
      <View key={2} style={{
        display: this.props.loading ? 'flex' : 'none',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",

        position: 'absolute',
        zIndex: 2,
        width: '100%',
        height: '100%',

        backgroundColor: 'rgba(255,255,255,.95)'
      }}>
        <ActivityIndicator size="large" color={BankTheme.color1}/>
      </View>
      :
      null;


    // if (!this.props.loading && this.props.proxy.length !== 0) {
    return ([
      <ScrollView key={1} style={{flex: 1}}>
        {this.props.planPayments.reverse().map((el, idx) => this._renderPlanSchedule(el, idx))}
        {this.props.actualPayments.map((el, idx) => this._renderActualSchedule(el, idx))}
      </ScrollView>,
      loading
    ])
    // } else {
    //   return (
    //     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //       <Text>Ни одной доверенности не найдено</Text>
    //     </View>
    //   )
    // }


  }

  _renderPlanSchedule(data, idx) {

    let isArrears = moment(data.date, 'DD.MM.YYYY').isBefore(moment(), 'day');

    return (
      <View key={`${idx}:${data.date}`} style={[styles.container, isArrears && {backgroundColor: '#fff2f2'}]}>
        <View style={styles.columnWrapper}>
          <Text style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: '500',
            color: isArrears ? "red" : "#000"
          }}>{`${moment(data.date, 'DD.MM.YYYY').format('DD MMM YYYY')}`}</Text>
          <View style={styles.subColumn}>
            <Text>{`Основной долг`}</Text>
            <Text>{`Проценты`}</Text>

            {
              isArrears && [
                <Text key={'задолженность'} style={{color: "red"}}>{`Просроченная задолженность`}</Text>,
                <Text key={'штрафы'} style={{color: "red"}}>{`Штрафы, пени`}</Text>
              ]
            }
          </View>
        </View>

        <View style={styles.columnWrapperRight}>

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            {
              isArrears &&
              <Icon name={'ios-checkmark'} size={24} style={{color: "red", marginRight: 5}}/>
            }

            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: '500', color: isArrears ? "red" : "#000"}}>
              {parseMoney(data.amount, this.props.currency)}
            </Text>
          </View>

          <Text>{parseMoney(data.mainDebt, this.props.currency)}</Text>
          <Text>{parseMoney(data.prc, this.props.currency)}</Text>

          {
            isArrears && [
              <Text key={'задолженность1'} style={{color: "red"}}>{parseMoney(data.rest, this.props.currency)}</Text>,
              <Text key={'штрафы1'} style={{color: "red"}}>{parseMoney(data.commiss, this.props.currency)}</Text>
            ]
          }

        </View>

        <View style={styles.line}/>
      </View>
    )
  }

  _renderActualSchedule(data, idx) {
    return (
      <View key={`${idx}:${data.date}`} style={[styles.container, {opacity: .5}]}>
        <View style={styles.columnWrapper}>
          <Text style={{
            fontSize: 16,
            marginBottom: 5,
            fontWeight: '500'
          }}>{`${moment(data.date, 'DD.MM.YYYY').format('DD MMM YYYY')}`}</Text>
          <View style={styles.subColumn}>
            <Text>{`Основной долг`}</Text>
            <Text>{`Проценты`}</Text>
            {/*<Text>{`Просроченная задолженность`}</Text>*/}
            {/*<Text>{`Штрафы, пени`}</Text>*/}
          </View>
        </View>

        <View style={styles.columnWrapper}>

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon name={'ios-checkmark'} size={35} style={{color: "#0bc600", marginRight: 5, borderWidth: 0}}/>
            <Text style={{fontSize: 16, marginBottom: 5, fontWeight: '500'}}>
              {parseMoney(data.amount, this.props.currency)}
            </Text>
          </View>

          <Text>{parseMoney(data.mainDebt, this.props.currency)}</Text>
          <Text>{parseMoney(data.prc, this.props.currency)}</Text>
        </View>

        <View style={styles.line}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  loading: state.productPage.loadingSchedules,
  actualPayments: state.productPage.actualPayments.reverse(),
  planPayments: state.productPage.planPayments.reverse()
});
export default connect(mapStateToProps)(ScheduleTab);
