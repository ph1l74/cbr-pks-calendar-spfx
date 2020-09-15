import * as React from 'react';
// import './Calendar.css';
import * as Datetime from 'react-datetime';

import styles from './Calendar.module.scss';
import { changeCalendarDate, getCalendarDate } from '../Actions';
import FilterEvent from '../utils/IFilterEvent';
import * as moment from 'moment';
// import 'moment/locale/ru-ru';
import 'react-datepicker/dist/react-datepicker.css';
import GroupingEvent from '../Models/GroupingEvent';
import { useSelector, useDispatch } from 'react-redux';
import { IAppReducer } from '../Reducers';

const DatePickerJS: any = Datetime;

moment.locale('ru');

export const Calendar = () => {
    const dispatch = useDispatch();
    const filterEvent: FilterEvent = useSelector((state: IAppReducer) => (state.event.filterEvent));
    const calendarDates: string[] = useSelector((state: IAppReducer) => (state.viewEvent.calendarDates));
    const intervalStart: moment.Moment = useSelector((state: IAppReducer) => (state.viewEvent.intervalStart));
    const intervalEnd: moment.Moment = useSelector((state: IAppReducer) => (state.viewEvent.intervalEnd));
    const datesOfEvents: any = useSelector(state => (state.event.events && state.event.events.length > 0)
        ? (state.event.events as GroupingEvent[])
            .map(ob => ob.Value).reduce((a, b) => a.concat(b)).map(ob => {
                return {
                    start: ob.startDate,
                    end: ob.endDate,
                };
            })
        : []);

    const changeSearchDate = (start: moment.Moment, end: moment.Moment) => { // (searchDate: moment.Moment) => {
        // console.log('changeSearchDate', changingInterval, searchingDate, searchDate.format('DD.MM.yyyy'), searchDate);
        // if (searchingDate !== searchDate.format('DD.MM.yyyy')) {
        //     searchingDate = searchDate.format('DD.MM.yyyy');
        //     datesInterval.start = searchDate.add(-14, 'd');
        //     datesInterval.end = searchDate.add(1, 'month').add(14, 'd');
        //     console.log('datesInterval', datesInterval, searchDate);
        //     dispatch(getCalendarDate(datesInterval.start.format('DD.MM.yyyy'),
        //         datesInterval.end.format('DD.MM.yyyy')));
        // }
        console.log('changeSearchDate', calendarDates);
        if (start < intervalStart || end > intervalEnd) {
            dispatch(getCalendarDate(start, end));
        }
    };
    const onDateChange = (e: any) => {
        console.log('click', e as Date);
        const date = (e as Date);
        dispatch(changeCalendarDate(date, filterEvent));
    };
    const onRenderDay = (dayProps: any, currentDate: moment.Moment, selectedDate: moment.Moment) => {
        const style: any = {};
        const curDate = new Date(currentDate.year(), currentDate.month(), currentDate.date());
        const curDateM = moment(curDate).add(1, 'd');
        if (currentDate < intervalStart) { // Сложный алгоритм поиска событий по датам
            // if (changingInterval === false)
            {
                changeSearchDate(currentDate.add(-30, 'd'), intervalEnd);
                // setDatesInterval({start: searchDate.add(-2, 'w'), end: searchDate.add(1, 'month').add(2, 'w')});
                // dispatch(getCalendarDate(searchDate.add(-2, 'w').format('DD.MM.yyyy'),
                //     searchDate.add(1, 'month').add(2, 'w').format('DD.MM.yyyy')));
            }
        }
        else if (currentDate > intervalEnd) {
            // if (changingInterval === false)
            {
                changeSearchDate(intervalStart, currentDate.add(30, 'd'));
                // setDatesInterval({start: searchDate.add(-2, 'w'), end: searchDate.add(1, 'month').add(2, 'w')});
                // dispatch(getCalendarDate(searchDate.add(-2, 'w').format('DD.MM.yyyy'),
                //     searchDate.add(1, 'month').add(2, 'w').format('DD.MM.yyyy')));
            }
        }
        const curDate2 = new Date(curDateM.year(), curDateM.month(), curDateM.date());
        const selDate = new Date(selectedDate.year(), selectedDate.month(), selectedDate.date());
        if ((curDate > selDate || curDate < selDate)
            && (datesOfEvents.filter(ob => ob.start < curDate2 && ob.end >= curDate).length > 0 ||
                calendarDates.filter(ob => ob === currentDate.format('DD.MM.yyyy')).length > 0)
        ) {
            style.border = '0px solid';
            style.borderRadius = '50%';
            style.background = '#faad14';
            style.margin = '1';
        }
        return (
            <td {...dayProps} style={style}>{currentDate.date()}</td>
        );
    };

    return <div>
        <DatePickerJS className={styles['rcr-modern-calendar']} disableOnClickOutside='true'
            onChange={onDateChange}
            onBlur={(inputStr) => { console.log('onBlur', inputStr); }}
            onFocus={() => console.log('onFocus', filterEvent)}
            open={true} input={false} locale='ru'
            dayClassName={'highlight'} renderDay={onRenderDay}
            defaultValue={filterEvent.selectedDate} />
    </div>;
};
