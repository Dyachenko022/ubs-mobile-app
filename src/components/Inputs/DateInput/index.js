import React from 'react';
import moment from 'moment'

import {
  Platform,
  Dimensions,
  View,
  Modal,
  TouchableWithoutFeedback,
  DatePickerAndroid
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TextRenderer as Text} from "../../TextRenderer";
import Touchable from '../../Touchable';
import Input from '../IconInput'
import BankTheme from '../../../utils/bankTheme';

const Screen = {width, height} = Dimensions.get('window');

export default class DateInput extends React.Component {
  static propTypes = {
  };
  static defaultProps = {
    name: '',
    chosenDate: moment(),

    onDone: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      lastUpdatedDate: moment(),
      chosenDate: moment()
    };

    this.focus = this.focus.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.chosenDate) {
      const momentChosen = moment(nextProps.chosenDate, 'DD.MM.YYYY');
      if (momentChosen.toDate().getTime() !== prevState.lastUpdatedDate.toDate().getTime()) {
        return {chosenDate: momentChosen, lastUpdatedDate: momentChosen};
      }
    }

    return null;
  }

  onClose = () => {
    this.setState({focus: false});
    this.props.onClose && this.props.onClose();
  }

  render() {
    const {name, isValid} = this.props;
    return (
      <View
        style={{
          alignItems: "center",
          overflow: 'visible',
          zIndex: 5,
          width: '100%',
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.focus}
          onRequestClose={() => {
          }}
        >
          <TouchableWithoutFeedback onPress={this.focus}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 35,
                backgroundColor: this.state.focus
                  ? "rgba(0,0,0,.5)"
                  : "transparent",
                width: Screen.width,
                height: Screen.height,

                justifyContent: 'center'
              }}
            >
              <View style={{backgroundColor: "#fff", borderRadius: 10}}>

                <DateTimePicker
                  value={moment(this.state.chosenDate).format('DD.MM.YYYY') === '01.01.2222' ? moment().toDate() : this.state.chosenDate.toDate()}
                  onChange={this.setDate}
                  mode={'date'}
                  display="spinner"
                  locale={'ru'}
                />

                <View style={{borderTopWidth: 1, borderColor: "#ddd", flexDirection: 'row'}}>
                  <Touchable onPress={this.onClose} style={{flex: 1, height: 50, justifyContent: 'center'}}>
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                      <Text style={{textAlign: 'center', fontSize: 16, color: BankTheme.color1}}>
                        Отмена
                      </Text>
                    </View>
                  </Touchable>

                  <View style={{width: 1, height: '100%', backgroundColor: "#ddd"}}/>

                  <Touchable onPress={() => {
                    this.setState(() => ({ focus: false }));
                    this.props.onDone(moment(this.state.chosenDate).format('DD.MM.YYYY'))
                  }} style={{flex: 1, height: 50, justifyContent: 'center'}}>
                    <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
                      <Text style={{textAlign: 'center', fontSize: 16, color: BankTheme.color1, fontWeight: '500'}}>
                        ОК
                      </Text>
                    </View>
                  </Touchable>
                </View>

              </View>

            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View>
          <TouchableWithoutFeedback onPress={this.focus}>
            <View style={{borderRadius: 5, zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>
          </TouchableWithoutFeedback>
          <Text style={{fontWeight: 'bold'}}>{name}</Text>
          <Input
            isValid={isValid}
            placeholder={'Не указано'}
            inputProps={{value: moment(this.state.chosenDate).format('DD.MM.YYYY') === '01.01.2222' ? '' : moment(this.state.chosenDate).format('DD.MM.YYYY')}}/>
        </View>

      </View>
    )
  }

  setDate(event, newDate) {
    this.setState({chosenDate: moment(newDate)})
  }

  async focus() {
    this.props.onFocus && this.props.onFocus();

    if(Platform.OS === 'ios') {
      this.setState((prevState) => ({focus: !prevState.focus}))
    } else {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: moment(this.state.chosenDate).format('DD.MM.YYYY') === '01.01.2222' ? moment().toDate() : this.state.chosenDate.toDate(),
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          // Selected year, month (0-11), day
          let day0 = day>9?day:'0'+day;
          let month0 = month > 8?month:'0'+month;
          // this.setDate(moment(`${day0}.${month0+1}.${year}`, 'DD.MM.YYYY'));
          this.props.onDone(moment(`${day0}.${+month0+1}.${year}`, 'DD.MM.YYYY').format('DD.MM.YYYY'))
        }
      } catch ({code, message}) {
      }
    }
  }
}
