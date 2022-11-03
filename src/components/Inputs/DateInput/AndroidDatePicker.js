import React from 'react';
import {CalendarList} from 'react-native-calendars';
import moment from 'moment';

import {
  View,
  Dimensions
} from 'react-native';
import BankTheme from '../../../utils/bankTheme';


export default class AndroidDatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.setRange = this.setRange.bind(this);

    this.range = {};

    this.state = {
      selectedDay: '',
      startDate: '',
      endDate: '',
      range: {}
    }
  }

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{height: Dimensions.get('window').height - 100, width: Dimensions.get('window').width - 100}}>
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
              if(this.state.selectedDay === '') {
                if (Object.keys(this.range).length === 0) {
                  this.range[day.dateString] = {selected: true, color: BankTheme.color1, textColor: '#2d4150'}
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
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}

            // Collection of dates that have to be colored in a special way. Default = {}
            markedDates={{
              ...this.state.range
            }}
            // Date marking style [simple/period/multi-dot]. Default = 'simple'
            markingType={'multi-dot'}


            theme={{
              todayTextColor: BankTheme.color1,
              selectedDayBackgroundColor: BankTheme.color1
            }}
          />
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

    dates[moment(start).format('YYYY-MM-DD')] = {selected: true, color: BankTheme.color1};
    dates[moment(end).format('YYYY-MM-DD')] = {selected: true, color: BankTheme.color1};

    while(currDate.add(1, 'days').diff(lastDate) < 0) {
      dates[moment(currDate).format('YYYY-MM-DD')] = {selected: true, color: BankTheme.color1};
    }

    this.range = {};
    this.setState({
      range: dates,
      selectedDay: ''
    })
  }
}
