import * as React from 'react'
import './Calendar.css';
import* as Datetime from 'react-datetime'; 

import styles from './Calendar.module.scss';

const DatePickerJS: any = Datetime;

export default class DatePickerTSX extends React.Component {
    public render() {
        return <DatePickerJS 
        className={styles["rcr-modern-calendar"]}
        disableOnClickOutside="true"
        open="true"
        input={false}
        locale="ru"
        />
    }
}