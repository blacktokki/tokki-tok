import React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View,StyleProp, ViewStyle } from 'react-native';
import {LocaleConfig, Calendar as BaseCalendar} from 'react-native-calendars';
import { DateData, DayState, MarkedDates, MarkingTypes } from 'react-native-calendars/src/types';

moment.locale('ko')

LocaleConfig.locales['ko'] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysShort(),
  today: "오늘"
};
LocaleConfig.defaultLocale = 'ko';

export const defaultWidth = 400

export type CalendarProps = {
  date?:string,
  setDate?:(date:string)=>void,
  style:StyleProp<ViewStyle>
  markingType?:MarkingTypes
  markedDates?:MarkedDates
  onMonthChange?:(date:DateData)=>void
  disableAllTouchEventsForDisabledDays?:boolean
  dayComponent?:React.ComponentType<{date:DateData, state:DayState}>
}

export default function Calendar(props:CalendarProps) {
  return (
    <View>
      <BaseCalendar
        markingType={props.markingType}
        markedDates={props.markedDates}
        renderArrow={direction => <Text>{direction == 'left'?"이전":"다음"}</Text>}
        monthFormat={'yyyy년 MM월'}
        initialDate={props.date}
        disableAllTouchEventsForDisabledDays={props.disableAllTouchEventsForDisabledDays}
        onMonthChange={props.onMonthChange}
        onDayPress={(date)=> props.setDate?.(date.dateString)}
        current={props.date}
        style={[{width:defaultWidth }, props.style]}
        dayComponent={props.dayComponent as any}
      />
      {/* <Text style={styles.dateText}>선택: {props.date}</Text> */}
    </View>
  );
}
