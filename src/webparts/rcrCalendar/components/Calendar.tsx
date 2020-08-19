import * as React from 'react';
import './Calendar.css';
import * as Datetime from 'react-datetime';
import { connect } from 'react-redux';

import styles from './Calendar.module.scss';
import { changeCalendarDate } from '../Actions';
import FilterEvent from '../utils/IFilterEvent';
import * as moment from 'moment';
// import 'moment/locale/ru-ru';
import 'react-datepicker/dist/react-datepicker.css';
import GroupingEvent from '../Models/GroupingEvent';
import { useSelector, useDispatch } from 'react-redux';

const DatePickerJS: any = Datetime;

moment.locale('ru');

export const Calendar = () => {
    const dispatch = useDispatch();
    const filterEvent = useSelector(state => (state.event.filterEvent as FilterEvent));
    const datesOfEvents: any = useSelector(state => (state.event.events && state.event.events.length > 0)
        ? (state.event.events as GroupingEvent[])
            .map(ob => ob.Value).reduce((a, b) => a.concat(b)).map(ob => {
                return {
                    start: ob.startDate,
                    end: ob.endDate,
                };
            })
        : []);

    const onDateChange = (e: any) => {
        console.log('click', e as Date);
        const date = (e as Date);
        dispatch(changeCalendarDate(date, filterEvent));
    };
    const onRenderDay = (dayProps: any, currentDate: moment.Moment, selectedDate: moment.Moment) => {
        const style: any = {};
        const curDate = new Date(currentDate.year(), currentDate.month(), currentDate.date());
        const curDateM = moment(curDate).add(1, 'd');
        const curDate2 = new Date(curDateM.year(), curDateM.month(),curDateM.date());
        const selDate = new Date(selectedDate.year(), selectedDate.month(), selectedDate.date());
        // console.log('render day', dayProps, currentDate.date(), currentDate.month(), currentDate.year(), curDate, selDate);
        const curDay = currentDate.date();
        if ((curDate > selDate || curDate < selDate)
            && datesOfEvents.filter(ob => ob.start <= curDate2 && ob.end >= curDate).length > 0
        ) {
            style.border = '0px solid';
            style.borderRadius = '50%';
            style.background = '#faad14';
        }
        return (
            <td {...dayProps} style={style}>{currentDate.date()}</td>
        );
    };

    return <div>
        <DatePickerJS className={styles['rcr-modern-calendar']} disableOnClickOutside='true'
            onChange={onDateChange}
            open={true} input={false} locale='ru'
            dayClassName={'highlight'} renderDay={onRenderDay}
            defaultValue={filterEvent.selectedDate} />
    </div>;
};
