import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';

import { CalendarList, LocaleConfig } from 'react-native-calendars';
import moment from 'moment'

const PI = 3.1415;

LocaleConfig.locales['fr'] = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'THáng 12'],
  monthNamesShort: ['Thg1.', 'Thg2.', 'Thg3', 'Thg4', 'Thg5', 'Thg6', 'Thg7', 'Thg8', 'Thg9', 'Thg10', 'Thg11', 'Thg12'],
  dayNames: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay\'hn'
};
LocaleConfig.defaultLocale = 'fr';

export default class App extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {}

  }

  jdFromDate(dd, mm, yy) {

    let a, y, m, jd;
    a = parseInt((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd = dd + parseInt((153 * m + 2) / 5) + 365 * y + parseInt(y / 4) - parseInt(y / 100) + parseInt(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + parseInt((153 * m + 2) / 5) + 365 * y + parseInt(y / 4) - 32083;
    }
    return jd;
  }

  getNewMoonDay(k, timeZone) {
    let T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = PI / 180;
    Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    };
    JdNew = Jd1 + C1 - deltat;
    return parseInt(JdNew + 0.5 + timeZone / 24)
  }


  getSunLongitude(jdn, timeZone) {
    let T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.5 - timeZone / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = PI / 180; // degree to radian
    M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - PI * 2 * (parseInt(L / (PI * 2))); // Normalize to (0, 2*PI)
    return parseInt(L / PI * 6)
  }



  getLunarMonth11(yy, timeZone) {
    var k, off, nm, sunLong;
    off = this.jdFromDate(31, 12, yy) - 2415021;
    k = parseInt(off / 29.530588853);
    nm = this.getNewMoonDay(k, timeZone);
    sunLong = this.getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
      nm = this.getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  getLeapMonthOffset(a11, timeZone) {

    let k, last, arc, i;
    k = parseInt((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;

  }




  convertSolar2Lunar(dd, mm, yy, timeZone) {
    let k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap, diff, leapMonthDiff;
    dayNumber = this.jdFromDate(dd, mm, yy);
    k = parseInt((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = this.getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = this.getNewMoonDay(k, timeZone);
    }
    a11 = this.getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = this.getLunarMonth11(yy + 1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    diff = parseInt((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff == leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }

    return [lunarDay, lunarMonth, lunarYear]
  }


  customStyleDate(date) {
    console.log(date)

    if (date.dateString == moment().format('YYYY-MM-DD')) {
      return {
        backgroundColor: '#425486',
      }
    }

    return {
      backgroundColor: '#F4F7FD',
    }

  }

  customStyleTitleDate(date) {

    if (date.dateString == moment().format('YYYY-MM-DD')) {
      return {
        color: '#fff',
        fontWeight: 'bold',
      }
    }

    return {
      color: '#425486',
    }

  }
  //9097A5

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          backgroundColor={'#fff'}
          barStyle={'dark-content'}
        />
        <View style={styles.toolbar} />
        <CalendarList
          pastScrollRange={36}
          futureScrollRange={36}
          scrollEnabled={true}
          firstDay={1}
          // disabledDaysIndexes={[6]}
          current={moment().format('YYYY-MM-DD')}
          showScrollIndicator={true}

          dayComponent={({ date }) => {
            let lunarDay = this.convertSolar2Lunar(date.day, date.month, date.year, 7.0)[0]
            let lunarMonth = this.convertSolar2Lunar(date.day, date.month, date.year, 7.0)[1]

            return (
              <View style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                padding: 5,
                ...this.customStyleDate(date)
              }}>
                <Text style={{
                  fontSize: 15,
                  ...this.customStyleTitleDate(date),
                }}>
                  {date.day}
                </Text>
                <Text style={{
                  fontSize: 10,
                  color: '#9097A5',
                  ...this.customStyleTitleDate(date)
                }}>
                  {lunarDay} {lunarDay == 1 && `/${lunarMonth}`}
                </Text>
              </View>
            );
          }}

          theme={{
            textSectionTitleColor: '#425486',
            backgroundColor: '#fff',
            calendarBackground: '#fff',
            arrowColor: '#425486',
            monthTextColor: '#425486',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',

          }}
        />
      </View>

    )

  }
}

const styles = StyleSheet.create({
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
