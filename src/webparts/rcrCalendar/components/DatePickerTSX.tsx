import * as React from 'react';
import { DatePicker, TimePicker } from 'antd';
import * as moment from "moment";

const DatePickerJS: any = DatePicker;

export class DatePickerTSX extends React.Component {
    public render() {
        return <DatePickerJS />
    }
}
