import * as React from 'react'
import './Calendar.css';
import * as Datetime from 'react-datetime';
import { connect } from 'react-redux';

import styles from './Calendar.module.scss';
import { changeCalendarDate } from '../Actions';
import FilterEvent from '../utils/IFilterEvent';
import * as moment from 'moment';
// import 'moment/locale/ru-ru';
import "react-datepicker/dist/react-datepicker.css";
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
                }
            })
        : []);

    const onDateChange = (e: any) => {
        console.log('click', e as Date);
        const date = (e as Date);
        dispatch(changeCalendarDate(date, filterEvent));
    }
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
    }

    return <div>
        <DatePickerJS className={styles["rcr-modern-calendar"]} disableOnClickOutside="true"
            onChange={onDateChange}
            open={true} input={false} locale='ru'
            dayClassName={"highlight"} renderDay={onRenderDay}
            defaultValue={filterEvent.selectedDate} />
    </div>
}

// interface ICalendarProps {
//     setCalendarDate: (date: Date, filterEvent: FilterEvent) => void;
//     filterEvent: FilterEvent;
//     events: GroupingEvent[];
// }

// interface ICalendarState {
// }

// // const datesOfEvents: any = useSelector(state => (state.event.events as Event[]).map(ob => {
// //     return {
// //         start: ob.startDate,
// //         end: ob.endDate,
// //     }
// // }));

// class DatePickerTSX extends React.Component<ICalendarProps, ICalendarState> { //Todo переделать на useDispatch и useSelector
//     constructor(props: ICalendarProps) {
//         super(props);
//         this.state = {
//         };
//     }
//     public curEvents = this.props.events;
//     public render() {
//         this.curEvents = this.props.events;
//         const onDateChange = (e: any) => {
//             console.log('click', e as Date, this.props);
//             const date = (e as Date);
//             this.props.setCalendarDate(date, this.props.filterEvent);
//         }
//         const onRenderDay = (dayProps: any, currentDate: moment.Moment, selectedDate: moment.Moment ) => {
//             const curDate = moment(new Date(currentDate.year(), currentDate.month(), currentDate.date()));
//             const selDate = moment(new Date(selectedDate.year(), selectedDate.month(), selectedDate.date()));
//             console.log('render day', dayProps, currentDate.date(), currentDate.month(), currentDate.year(), curDate, selDate);
//             const style: any = {};
//             const curDay = currentDate.date();
//             if (curDate !== selDate && 
//                 this.curEvents.filter(gr => gr.Value.filter(ob => moment(ob.startDate) < curDate.add(1,'d') && moment(ob.endDate) <= curDate).length > 0).length > 0) {
//                 style.border = '0px solid';
//                 style.borderRadius = '50%';
//                 style.background = '#faad14';
//             }
//             return (
//                 <td {...dayProps} style={style}>{curDay}</td>
//             );
//         }
//         if (this.props.events.length < 0){ // Newer use, for rerender
//             return <div></div>
//         }
//         return <div>
//             {/* <Calendar onChange={onDateChange} fullscreen={false} locale={ruRU}
//                 defaultValue={moment(this.props.filterEvent.selectedDate)} dateFullCellRender={onDateCellRender} />
//             <Input style={{ width: '100%' }} type='date' /> */}
//             {/* <DatePicker open={true} disableOnClickOutside="true" className={styles["rcr-modern-calendar"]}
//                 dayClassName={getDayClassName}
//                 onChange={onDateChange} input={false} locale='ru' renderCell={(date) => console.log('rend', date)} /> */}
//             <DatePickerJS className={styles["rcr-modern-calendar"]} disableOnClickOutside="true"
//                 onChange={onDateChange} open={true} input={false} locale='ru'
//                 dayClassName={"highlight"} renderDay={onRenderDay}
//                 defaultValue={this.props.filterEvent.selectedDate} />
//         </div>
//     }

// }

// // const DatePickerTSX = () => {
// //     return <DatePickerJS className={styles["rcr-modern-calendar"]} 
// //         onChange={onDateChange}
// //         disableOnClickOutside="true" open="true" input={false} locale="ru" />

// // }
// const mapStateToProps = (store: any) => {
//     return {
//         filterEvent: store.event.filterEvent,
//         events: store.event.events as GroupingEvent[],
//     }
// }
// const mapDispatchToProps = dispatch => {
//     return {
//         setCalendarDate: (date: Date, filterEvent: FilterEvent) => dispatch(changeCalendarDate(date, filterEvent)) // [1]
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(DatePickerTSX)