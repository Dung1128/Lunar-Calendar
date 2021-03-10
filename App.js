import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  StatusBar,
  Text
} from 'react-native';

import { CalendarList, LocaleConfig } from 'react-native-calendars';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment'
import Recipe from './Recipe'
import DayComponent from './DayComponent'

const themeCalendar = {
  textSectionTitleColor: '#425486',
  backgroundColor: '#fff',
  calendarBackground: '#fff',
  arrowColor: '#425486',
  monthTextColor: '#425486',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: 'bold',
}

LocaleConfig.locales['vi'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'THáng 12'],
  monthNamesShort: ['Thg1.', 'Thg2.', 'Thg3', 'Thg4', 'Thg5', 'Thg6', 'Thg7', 'Thg8', 'Thg9', 'Thg10', 'Thg11', 'Thg12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay\'hn'
};
LocaleConfig.defaultLocale = 'vi';

export default class App extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={false}
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
        />
        <View style={styles.toolbar} />
        <View>
          <Text>sdadad</Text>

          <CalendarStrip
            scrollable
            calendarAnimation={{ type: 'sequence', duration: 30 }}
            daySelectionAnimation={{ type: 'background', duration: 300, highlightColor: '#9265DC' }}
            style={{ height: 60 }}
            calendarHeaderStyle={{ color: 'white' }}
            // calendarColor={'#3343CE'}
            scrollerPaging={true}
            dateNumberStyle={{ color: 'black' }}
            dateNameStyle={{ color: 'black' }}
            iconContainer={{ flex: 0.1 }}
            hideArrow={true}
            paddingContainer={16}
            // customDatesStyles={this.state.customDatesStyles}
            highlightDateNameStyle={{ color: 'red' }}
            highlightDateNumberStyle={{ color: 'yellow' }}
            highlightDateContainerStyle={{ backgroundColor: 'black' }}

            // markedDates={this.state.markedDates}
            // datesBlacklist={this.datesBlacklistFunc}
            // onDateSelected={this.onDateSelected}
            // useIsoWeekday={false}
            dayComponent={({ date }) => {
              const newDate = { ...date, dateString: moment(date._d).format('YYYY-MM-DD'), day: moment(date._d).get('D') }
              let lunarDay = Recipe.convertSolar2Lunar(moment(date._d).get('D'), moment(date._d).get('M') + 1, moment(date._d).get('Y'), 7.0)[0]
              let lunarMonth = Recipe.convertSolar2Lunar(moment(date._d).get('D'), moment(date._d).get('M') + 1, moment(date._d).get('Y'), 7.0)[1]

              return (
                <DayComponent lunarDay={lunarDay} lunarMonth={lunarMonth} date={newDate} />
              )
            }}
          />

        </View>
        <CalendarList
          pastScrollRange={36}
          futureScrollRange={36}
          scrollEnabled={true}
          firstDay={1}
          // disabledDaysIndexes={[6]}
          current={moment().format('YYYY-MM-DD')}
          showScrollIndicator={true}

          dayComponent={({ date }) => {
            let lunarDay = Recipe.convertSolar2Lunar(date.day, date.month, date.year, 7.0)[0]
            let lunarMonth = Recipe.convertSolar2Lunar(date.day, date.month, date.year, 7.0)[1]

            return (
              <DayComponent lunarDay={lunarDay} lunarMonth={lunarMonth} date={date} />
            );
          }}
          theme={themeCalendar}
        />
      </View>

    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 0 : isIphoneX() ? 40 : 30,
    alignItems: 'center',
    zIndex: 99,
  },

});

export function isIphoneX() {
  const dim = Dimensions.get('window');

  return (
    // This has to be iOS
    Platform.OS === 'ios' &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
}

export function isIPhoneXSize(dim) {
  return dim.height === 812 || dim.width === 812;
}

export function isIPhoneXrSize(dim) {
  return dim.height === 896 || dim.width === 896;
}
