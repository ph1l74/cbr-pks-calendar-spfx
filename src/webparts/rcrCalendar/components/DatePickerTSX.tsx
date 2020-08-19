import * as React from 'react';
import { DatePicker, TimePicker } from 'antd';
import * as moment from 'moment';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';

const DatePickerJS: any = DatePicker;

export class DatePickerTSX extends React.Component {
    public render() {
        return <DatePickerJS/>
    }
}
