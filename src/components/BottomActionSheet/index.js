import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  View,
  DatePickerAndroid,
  Platform,
  Animated,
  TouchableNativeFeedback,
  TouchableWithoutFeedback
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from '../TextRenderer';
import Interactable from 'react-native-interactable';
import {styles, Screen} from './styles';
import {Navigation} from 'react-native-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class BottomActionSheet extends React.Component {
  static propTypes = {
    onRef: PropTypes.func
  };
  static defaultProps = {
    onRef: () => {
    }
  };

  constructor(props) {
    super(props);

    if (Platform.OS === 'ios') {
      this.BtnWrapper = TouchableOpacity;
      this.openedPos = Screen.height - 329;
    } else {
      this.BtnWrapper = TouchableNativeFeedback;
      this.openedPos = Screen.height/2 - 279/2;
    }

    this._deltaY = new Animated.Value(Screen.height);
    this._deltaX = new Animated.Value(0);
    this._renderInner = this._renderInner.bind(this);

    this._openDatePicker = this._openDatePicker.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);

    this._onDone = this._onDone.bind(this);

    this.state = {
      inner: 0,
      startDate: new Date(),
      endDate: new Date()
    }
  }

  render() {
    const bottomOffset = this.props.bottomOffset || 0;
    return (
      <View style={styles.panelContainer} pointerEvents={'box-none'}>
        <TouchableWithoutFeedback
          onPressIn={() => {
            this.setState({inner: 'period'}, () => {
              this.props.onClose(1);
              this.setState({inner: 0});
            })
          }}
        >
          <Animated.View
            pointerEvents={this.props.isBottomPanelVisible ? 'auto' : 'box-none'}
            style={[styles.panelContainer, {
              backgroundColor: 'black',
              opacity: this._deltaY.interpolate({
                inputRange: [0, 1, Screen.height],
                outputRange: [0, 0.5, 0],
                extrapolateRight: 'clamp'
              })
            }]}/>
        </TouchableWithoutFeedback>

        <Interactable.View
          ref={ref => {
            this.props.onRef(ref)
          }}
          dragEnabled={false}
          verticalOnly={true}
          snapPoints={[{y: this.openedPos - bottomOffset}, {y: Screen.height + 20}]}
          boundaries={{top: -300}}
          initialPosition={{y: Screen.height + 20}}
          animatedValueY={this._deltaY}
          animatedValueX={this._deltaX}
        >

          <View style={[styles.panel, styles.roundAll]}>
            {this._renderInner()}

            <View style={[styles.panelButton, styles.roundAll, {
              marginTop: 7,
              display: Platform.OS === 'ios' ? 'flex' : 'none'
            }]}>
              <this.BtnWrapper onPress={() => {
                this.props.onClose(1);
                this.setState({inner: 0});
              }}>
                <View style={styles.btn}>
                  <Text style={[styles.panelButtonTitle, {fontWeight: '500'}]}>Отмена</Text>
                </View>
              </this.BtnWrapper>
            </View>
          </View>
        </Interactable.View>
      </View>
    )
  }

  _renderInner() {
    switch (this.state.inner) {
      case 0:
        return (
          [
            <View key={'periodHeader'} style={[styles.panelTitleWrapper, styles.roundTop]}>
              <Text style={styles.panelTitle}>Запрос выписки</Text>
            </View>,
            <View key={'periodBtn0'} style={styles.panelButton}>
              <this.BtnWrapper onPress={() => {
                this.props.onDone({
                  dateFrom: moment().subtract(7, 'days').format('DD.MM.YYYY'),
                  dateTo: moment().format('DD.MM.YYYY')
                })
              }}>
                <View style={styles.btn}>
                  <Text style={styles.panelButtonTitle}>За неделю</Text>
                </View>
              </this.BtnWrapper>
            </View>,

            <View key={'periodBtn1'} style={styles.panelButton}>
              <this.BtnWrapper onPress={() => {
                this.props.onDone({
                  dateFrom: moment().subtract(1, 'months').format('DD.MM.YYYY'),
                  dateTo: moment().format('DD.MM.YYYY')
                })
              }}>
                <View style={styles.btn}>
                  <Text style={styles.panelButtonTitle}>За месяц</Text>
                </View>
              </this.BtnWrapper>
            </View>,

            <View key={'periodBtn2'} style={styles.panelButton}>
              <this.BtnWrapper onPress={this._openDatePicker}>
                <View style={styles.btn}>
                  <Text style={styles.panelButtonTitle}>Произвольный период</Text>
                </View>
              </this.BtnWrapper>
            </View>,
          ]
        );
      case 1:
        return (
          <View>
          <View style={[styles.panelTitleWrapper, styles.roundTop, styles.withBtns]}>
            <this.BtnWrapper style={styles.headerPickerBtn}
                             onPress={() => this.setState(prevState => ({inner: prevState.inner - 1}))}>
                <Text style={{color: "#3e3e3e",
                  fontSize: 13,
                  fontWeight: "400",
                  textAlign: 'center'}}>
                  Назад
                </Text>
            </this.BtnWrapper>

            <Text style={styles.panelTitle}>Начало периода</Text>

            <this.BtnWrapper style={styles.headerPickerBtn}
                             onPress={() => this.setState(prevState => ({inner: prevState.inner + 1}))}>
              <Text style={{color: "#3e3e3e",
                fontSize: 13,
                fontWeight: "400",
                textAlign: 'center'}}>
                  Далее
                </Text>
            </this.BtnWrapper>
          </View>
          <View style={[styles.datePickerContainer, styles.roundBottom]}>
            <DateTimePicker
              value={this.state.startDate}
              onChange={this.setDate}
              mode="date"
              display="spinner"
              locale="ru"
            />
          </View>
          </View>
        );
      case 2:
        return ([
          <View key={'pickerHeader'} style={[styles.panelTitleWrapper, styles.roundTop, styles.withBtns]}>
            <this.BtnWrapper style={styles.headerPickerBtn}
                             onPress={() => this.setState(prevState => ({inner: prevState.inner - 1}))}>
              <Text style={{color: "#3e3e3e",
                fontSize: 13,
                fontWeight: "400",
                textAlign: 'center'}}>
                  Назад
                </Text>
            </this.BtnWrapper>

            <Text style={styles.panelTitle}>Конец периода</Text>

            <this.BtnWrapper
              style={styles.headerPickerBtn}
              onPress={() => this._onDone({from: moment(this.state.startDate).format('DD.MM.YYYY'), to: moment(this.state.endDate).format('DD.MM.YYYY')})}
            >
              <Text style={{color: "#3e3e3e",
                fontSize: 13,
                fontWeight: "400",
                textAlign: 'center'}}>
                  Далее
                </Text>
            </this.BtnWrapper>
          </View>,
          <View style={[styles.datePickerContainer, styles.roundBottom]}>
            <DateTimePicker
              value={this.state.endDate}
              onChange={this.setEndDate}
              mode="date"
              display="spinner"
              locale="ru"
            />
          </View>
        ]);
      default:
        break;
    }
  }

  _onDone({from, to}) {
    this.props.onDone({
      dateFrom: from,
      dateTo: to
    });
    this.props.onClose(1);
    this.setState({inner: 0});
  }

  _openDatePicker() {
    if (Platform.OS === 'ios') {
      this.setState({
        inner: 1
      })
    } else {
      Navigation.showOverlay({
        component: {
          name: 'unisab/AndroidDatePicker',
          passProps: {
            onDone: this._onDone
          }
        },
      });
    }
  }

  setDate(evt, newDate) {
    this.setState({startDate: newDate})
  }

  setEndDate(evt, newDate) {
    this.setState({endDate: newDate})
  }
}
