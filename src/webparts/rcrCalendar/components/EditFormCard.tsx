import * as React from 'react';
import { Form, Input, Checkbox, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { DatePicker, TimePicker } from 'antd';
import * as moment from "moment";
import { DatePickerTSX } from './DatePickerTSX';

const { TextArea } = Input

const EditFormCard = () => {

    const [form] = Form.useForm();



    const fileListInit = [
        {
            uid: '-1',
            name: 'xxx.png',
            status: 'done',
            url: 'http://www.baidu.com/xxx.png',
        },
    ];


    const [fileList, setFileList] = React.useState(fileListInit);

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 2, span: 16 },
    };


    const onFinish = values => {
        console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onGenderChange = value => {
        switch (value) {
            case "male":
                form.setFieldsValue({ note: "Hi, man!" });
                return;
            case "female":
                form.setFieldsValue({ note: "Hi, lady!" });
                return;
            case "other":
                form.setFieldsValue({ note: "Hi there!" });
                return;
        }
    };

    const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange: this.handleChange,
        multiple: true,
    };



    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                {...tailLayout}
                label="Название"
                name="eventName"
                rules={[{ required: true, message: 'Пожалуйста, введите название события.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                {...tailLayout} name="gender" label="Категория события" rules={[{ required: true }]}>
                <Select
                    placeholder=""
                    // onChange={onGenderChange}
                    allowClear
                >
                    <Select.Option value="external">Внешнее обучение</Select.Option>
                    <Select.Option value="other">Прочие события</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                {...tailLayout}
                label="Расположение"
                name="location"
            >
                <Input maxLength={255} />
            </Form.Item>

            <Form.Item
                {...tailLayout}
                label="Время начала"
                name="dateFrom"
                rules={[{ required: true }]}
            >
                <DatePickerTSX />
                <TimePicker
                    format={"HH"}
                />
                <TimePicker
                    format={"mm"}
                />
            </Form.Item>

            <Form.Item
                {...tailLayout}
                label="Время окончания"
                name="dateTo"
                rules={[{ required: true }]}
            >
                <DatePickerTSX />
                <TimePicker
                    placeholder="00:"
                    format={"HH"}
                />
                <TimePicker
                    placeholder="00"
                    format={"mm"}
                />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked" label="Событие на весь день">
                <Checkbox />
            </Form.Item>

            <Form.Item
                {...tailLayout}
                label="Описание"
                name="description"
            >
                <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked" label="Свободное посещение">
                <Checkbox />
            </Form.Item>

            <Form.Item {...tailLayout} label="Участники"
                name="participants">
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    defaultValue={['Астахов Филат Александрович', 'Баталов Илья Николаевич']}
                >
                </Select>
            </Form.Item>


            <Form.Item {...tailLayout} label="Материалы"
                name="materials">
                <Upload  {...props}>
                    <Button>
                        Загрузить
                    </Button>
                </Upload >
            </Form.Item>


            <Form.Item {...tailLayout} label="Ссылки"
                name="links">
                <Select mode="tags" style={{ width: '100%' }} placeholder="Введите ссылку и нажмите Etner">

                </Select>
            </Form.Item>

            <Form.Item >
                <Button type="primary" htmlType="submit" shape="round" size="large">
                    Сохранить
                </Button>
                <Button htmlType="submit" shape="round" size="large">
                    Отмена
            </Button>
            </Form.Item>
        </Form>
    );
}

export default EditFormCard;