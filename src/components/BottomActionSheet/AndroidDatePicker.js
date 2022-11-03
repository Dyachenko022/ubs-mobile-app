import React from 'react';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Navigation } from 'react-native-navigation';

import {
  View,
  Dimensions,
  TouchableNativeFeedback,
  Text
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import BankTheme from '../../utils/bankTheme';

LocaleConfig.locales['ru'] = {
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';

export default class AndroidDatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.setRange = this.setRange.bind(this);

    this.range = {};

    this.state = {
      selectedDay: '',
      startDate: '',
      endDate: '',
      from: moment().subtract(1, 'days').format('DD.MM.YYYY'),
      to: moment().format('DD.MM.YYYY'),
      range: {}
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.75)', }}>
        <View style={{ height: Dimensions.get('window').height - 150, width: Dimensions.get('window').width - 15 }}>
          <CalendarList
            // Callback which gets executed when visible months change in scroll view. Default = undefined
            onVisibleMonthsChange={(months) => {
            }}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={12}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={1}
            // Enable or disable scrolling of calendar list
            scrollEnabled={true}
            // Enable or disable vertical scroll indicator. Default = false
            showScrollIndicator={true}


            // Initially visible month. Default = Date()
            // current={'2012-03-01'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            // minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={new Date()}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              if (this.state.selectedDay === '') {
                if (Object.keys(this.range).length === 0) {
                  this.range[day.dateString] = { selected: true, color: BankTheme.color1, textColor: '#2d4150' }
                }

                this.setState({
                  selectedDay: day.dateString,
                  range: this.range
                })
              } else if (!moment(this.state.selectedDay, 'YYYY-MM-DD').isSame(moment(day.dateString, 'YYYY-MM-DD'))) {
                let startDay = '';
                let endDay = '';

                startDay = this.state.selectedDay;
                endDay = day.dateString;
                this.setRange(startDay, endDay)
              }
            }}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'yyyy MMM'}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {
            }}
            firstDay={1}
            markedDates={{
              ...this.state.range
            }}
            markingType={'multi-dot'}
            theme={{
              todayTextColor: BankTheme.color1,
              selectedDayBackgroundColor: BankTheme.color1,
              textDayFontSize: 13,
              textMonthFontSize: 13,
              textDayHeaderFontSize: 13
            }}
          />
        </View>

        <View style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: BankTheme.color1,
          width: Dimensions.get('window').width - 100,
          height: 40,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
          <TouchableOpacity onPress={() => { Navigation.dismissOverlay(this.props.componentId) }}
                            style={{ flexBasis: '50%', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff' }}>Отмена</Text>
          </TouchableOpacity>

          <View style={{ height: '100%', width: 1, backgroundColor: '#fff' }} />

          <TouchableOpacity
            style={{ flexBasis: '50%', justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              this.props.onDone({ from: this.state.from, to: this.state.to });
              Navigation.dismissOverlay(this.props.componentId);
            }}
          >
            <Text style={{ color: '#fff' }}>Получить выписку</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  setRange(from, to) {
    let dates = {};

    let start = '';
    let end = '';
    let currDate = moment();
    let lastDate = moment();

    let a = moment(from, 'YYYY-MM-DD').startOf('day');
    let b = moment(to, 'YYYY-MM-DD').startOf('day');

    let diff = b.diff(a, 'days');

    if (diff > 0) {
      start = from;
      end = to;

      currDate = moment(from, 'YYYY-MM-DD').startOf('day');
      lastDate = moment(to, 'YYYY-MM-DD').startOf('day');
    } else {
      start = to;
      end = from;

      currDate = moment(to, 'YYYY-MM-DD').startOf('day');
      lastDate = moment(from, 'YYYY-MM-DD').startOf('day');
    }

    dates[moment(start).format('YYYY-MM-DD')] = { selected: true, color: BankTheme.color1 };
    dates[moment(end).format('YYYY-MM-DD')] = { selected: true, color: BankTheme.color1 };

    while (currDate.add(1, 'days').diff(lastDate) < 0) {
      dates[moment(currDate).format('YYYY-MM-DD')] = { selected: true, color: BankTheme.color1 };
    }

    this.range = {};
    this.setState({
      from: moment(start, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      to: moment(end, 'YYYY-MM-DD').format('DD.MM.YYYY'),
      range: dates,
      selectedDay: ''
    })
  }
}
