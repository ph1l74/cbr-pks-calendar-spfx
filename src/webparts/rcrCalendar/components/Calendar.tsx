import * as React from 'react'
import './Calendar.css';
import * as Datetime from 'react-datetime';
import { connect } from 'react-redux';

import styles from './Calendar.module.scss';
import { changeCalendarDate } from '../Actions';
import FilterEvent from '../utils/IFilterEvent';

const DatePickerJS: any = Datetime;

interface ICalendarProps {
    setCalendarDate: (date: Date, filterEvent: FilterEvent) => void;
    filterEvent: FilterEvent;
}

interface ICalendarState {
}

class DatePickerTSX extends React.Component<ICalendarProps, ICalendarState> {
    constructor(props: ICalendarProps) {
        super(props);
        this.state = {
        };
    }
    public render() {
        const onDateChange = (e: any) => {
            console.log('click', e as Date, this.props);
            const date = (e as Date);
            this.props.setCalendarDate(date, this.props.filterEvent);
        }

        return <DatePickerJS
            className={styles["rcr-modern-calendar"]}
            disableOnClickOutside="true"
            onChange={onDateChange}
            open="true"
            input={false}
            locale="ru"
            defaultValue={this.props.filterEvent.selectedDate}
        />
    }

}

// const DatePickerTSX = () => {
//     return <DatePickerJS className={styles["rcr-modern-calendar"]} 
//         onChange={onDateChange}
//         disableOnClickOutside="true" open="true" input={false} locale="ru" />

// }
const mapStateToProps = (store: any) => {
    return {
        filterEvent: store.event.filterEvent
    };
}
const mapDispatchToProps = dispatch => {
    return {
        setCalendarDate: (date: Date, filterEvent: FilterEvent) => dispatch(changeCalendarDate(date, filterEvent)) // [1]
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePickerTSX)