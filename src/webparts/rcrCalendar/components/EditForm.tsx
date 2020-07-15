import * as React from 'react';
import { Form, Input, Checkbox, Button, Select, DatePicker, TimePicker } from 'antd';
import * as moment from "moment";



const EditForm = () => {

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
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

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Название"
                name="eventName"
                rules={[{ required: true, message: 'Пожалуйста, введите название события.' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="gender" label="Категория события" rules={[{ required: true }]}>
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
                label="Расположение"
                name="location"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Время начала"
                name="eventName"
                rules={[{ required: true }]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
            </Button>
            </Form.Item>
        </Form>
    );
}

export default EditForm;