import * as React from 'react'
import './Calendar.css';
import * as Datetime from 'react-datetime';
import { connect } from 'react-redux'

import styles from './Calendar.module.scss';
import { changeCalendarDate } from '../Actions';

const DatePickerJS: any = Datetime;

interface ICalendarProps {
    setCalendarDate: (date: Date) => void;
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
            this.props.setCalendarDate(date);
        }

        return <DatePickerJS
            className={styles["rcr-modern-calendar"]}
            disableOnClickOutside="true"
            onChange={onDateChange}
            open="true"
            input={false}
            locale="ru"
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
    };
}
const mapDispatchToProps = dispatch => {
    return {
        setCalendarDate: (date: Date) => dispatch(changeCalendarDate(date)) // [1]
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatePickerTSX)