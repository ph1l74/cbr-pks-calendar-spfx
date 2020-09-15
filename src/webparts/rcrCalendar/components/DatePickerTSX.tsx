import * as React from 'react';
import { DatePicker, TimePicker } from 'antd';
import * as moment from 'moment';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';

const DatePickerJS: any = DatePicker;

export class DatePickerTSX extends React.Component {
    public render() {
        return <DatePickerJS />;
    }
}

export const MyPicker = (props) => {
    const [val, setVal] = React.useState(null);
    const onBlur = () => {
        props?.onChange(val);
    };
    return <TimePicker {...props} onPanelChange={setVal} onBlur={onBlur} />;
};
export const DatePickerAutoaccept = (props: PickerProps<moment.Moment>) => {
    const onBlur = (elem: React.FocusEvent<HTMLInputElement>) => {
      const value = moment(elem.target.value, props.format);
      if (value && value.isValid() && props.onChange) {
        props.onChange(value, elem.target.value);
      }
    };
    return <TimePicker {...props} onBlur={onBlur} />;
  };