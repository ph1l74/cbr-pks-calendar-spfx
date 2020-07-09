import * as React from 'react'
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar as ReactCalendar } from 'react-modern-calendar-datepicker'



const myCustomLocale = {
    // months list by order
    months: [
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
  
    // week days by order
    weekDays: [
      {
        name: 'Понедельник', // used for accessibility 
        short: 'Пн', // displayed at the top of days' rows
        isWeekend: false, // is it a formal weekend or not?
      },
      {
        name: 'Вторник',
        short: 'Вт',
      },
      {
        name: 'Среда',
        short: 'Ср',
      },
      {
        name: 'Четверг',
        short: 'Чт',
      },
      {
        name: 'Пятница',
        short: 'Пт',
      },
      {
        name: 'Суббота',
        short: 'Сб',
        isWeekend: true,
      },
      {
        name: 'Воскресенье',
        short: 'Вс',
        isWeekend: true,
      },
    ],
  
    // just play around with this number between 0 and 6
    weekStartingIndex: 0,
  
    // return a { year: number, month: number, day: number } object
    getToday(gregorainTodayObject) {
      return gregorainTodayObject;
    },
  
    // return a native JavaScript date here
    toNativeDate(date) {
      return new Date(date.year, date.month - 1, date.day);
    },
  
    // return a number for date's month length
    getMonthLength(date) {
      return new Date(date.year, date.month, 0).getDate();
    },
  
    // return a transformed digit to your locale
    transformDigit(digit) {
      return digit;
    },
  
    // texts in the date picker
    nextMonth: 'Next Month',
    previousMonth: 'Previous Month',
    openMonthSelector: 'Open Month Selector',
    openYearSelector: 'Open Year Selector',
    closeMonthSelector: 'Close Month Selector',
    closeYearSelector: 'Close Year Selector',
    defaultPlaceholder: 'Select...',
  
    // for input range value
    from: 'from',
    to: 'to',
  
  
    // used for input value when multi dates are selected
    digitSeparator: ',',
  
    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,
  
    // is your language rtl or ltr?
    isRtl: false,
  }

const Calendar = () => {

    const defaultValue = {
        year: 2020,
        month: 6,
        day: 15,
    };
    const [selectedDay, setSelectedDay] = React.useState(defaultValue);

    return (
        <ReactCalendar
            value={selectedDay}
            onChange={setSelectedDay}
            colorPrimary="#9c88ff" // added this
            locale={myCustomLocale}
            calendarClassName="rcr-modern-calendar" // and this
            calendarTodayClassName="custom-today-day" // also this
            shouldHighlightWeekends
        />
    );
}

export default Calendar;