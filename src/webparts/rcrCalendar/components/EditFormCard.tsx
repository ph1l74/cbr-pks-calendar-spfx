import * as React from 'react';
import { Form, Input, Checkbox, Button, Select, Upload, message, Modal, } from 'antd';
import styles from './EditFormCard.module.scss';
// import { DatePicker } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { TimePicker } from 'antd';
import * as moment from 'moment';
import { DatePickerTSX } from './DatePickerTSX';
import { useSelector, useDispatch } from 'react-redux';
import { setEditMode, closeEditEvent, saveEditEvent } from '../Actions';
import Event from '../Models/Event';
import Category from '../../../../lib/webparts/rcrCalendar/Models/Category';
import * as ReactDOM from 'react-dom';
// import Modal from './Modal';
import SingleDatePicker, { RangePicker } from 'from-antd-datepicker';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import User from '../Models/User';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import Actor from '../Models/Actor';
import Material from '../Models/Material';
import Link from '../Models/Link';
import config from '../constants/config';
import { AttachmentService } from '../services/Services';
import axios from 'axios';
import { parseUid } from '../utils/Utils';
registerLocale('ru', ru)

const { TextArea } = Input

const EditFormCard = () => {

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const editingEvent: Event = useSelector(state => state.event.editingEvent as Event);
    const categories: Category[] = useSelector(state => state.root.categories as Category[]);
    const users: User[] = useSelector(state => state.root.users as User[]);

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 2, span: 16 },
    };

    const dateFormat = 'YYYY/MM/DD';
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

    const onFinish = values => {
        console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const onCategoryChange = value => {
        form.setFieldsValue({ category: value });
        // const selectedCategory = value ? categories.filter(c => c.id === value) : null;
        // editingEvent.category = (selectedCategory && selectedCategory.length > 0) ? selectedCategory[0] : undefined;
    };

    // const props = {
    //     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //     onChange: this.handleChange,
    //     multiple: true,
    // };

    function closeEditForm(): void {
        // setEditMode(0);
        dispatch(closeEditEvent());
    }

    function saveEditForm(): void {
        const editValues = form.getFieldsValue();
        console.log('save editform', editingEvent, editValues.fullDay, editValues);
        let editEvent = editingEvent;
        if (editValues.participants) {
            editEvent.actors = editValues.participants.map(ob => new Actor(editingEvent.id, ob));
        }
        if (editValues.fullDay) {
            editEvent.fullDay = editValues.fullDay;
        }
        editEvent.description = editValues.description;
        if (editValues.freeVisiting) {
            editEvent.freeVisiting = editValues.freeVisiting;
        }
        if (editValues.materials) {
            editEvent.materials = editValues.materials.fileList.map(ob => new Material(parseUid(ob.uid), ob.name));
        }
        if (editValues.links) {
            editEvent.links = editValues.links.map(ob => new Link(0, ob));
        }
        editEvent.name = editValues.eventName;
        editEvent.category = editValues.category ? categories.filter(ob => ob.id === editValues.category)[0] : undefined;
        editEvent.location = editValues.location;
        editEvent.startDate = startDate;
        editEvent.endDate = endDate;
        console.log(editingEvent, editEvent);
        dispatch(saveEditEvent(editEvent));
    }
    // const pickerStart = new DatePicker({defaultValue: moment(editingEvent.startDate, 'YYYY-MM-DD'), onChange: (value) => {console.log(value)}})


    const renderCategories = () => {
        return categories.map(ob => <Select.Option key={`category_${ob.id}`} value={ob.id} style={{ color: ob.color }}>{ob.name}</Select.Option>);
    }
    const renderActors = () => {
        return users.map(ob => <Select.Option key={`user_${ob.login}`} value={ob.login}>{`${ob.firstName} ${ob.lastName} ${ob.patronymic} `}</Select.Option>);
    }
    const DatePickerJS: any = DatePicker;
    const [startDate, setStartDate] = React.useState(editingEvent.startDate);
    const [endDate, setEndDate] = React.useState(editingEvent.endDate);
    const [recordFileList, setRecordFileList] = React.useState({
        fileList: editingEvent.materials.map(ob => {
            return {
                uid: ob.id.toString(),
                name: ob.fileName,
                status: 'done',
            }
        })
    });

    const setDate = (date: Date, prevValue: Date) => {
        let val = prevValue;
        val.setDate(date.getDate());
        val.setMonth(date.getMonth());
        val.setFullYear(date.getFullYear());
        return val;
    }
    const setHours = (hoursDate: moment.Moment, prevValue: Date) => {
        prevValue.setHours(hoursDate.hours());
        return prevValue;
    }
    const setMinutes = (minutesDate: moment.Moment, prevValue: Date) => {
        prevValue.setMinutes(minutesDate.minutes());
        return prevValue;
    }
    // const handleUpload = async (file: RcFile)=> {
    //     console.log('upload file', file);
    //     const formData = new FormData();
    //     formData.append('files', file);
    //     // formData.append('files[]', file);
    //     return await AttachmentService.upload(formData);
    // }

    const uploadImage = options => {

        const { onSuccess, onError, file, onProgress } = options;

        const fmData = new FormData();
        const config = {
            headers: { "content-type": "multipart/form-data" },
            onUploadProgress: event => {
                console.log((event.loaded / event.total) * 100);
                onProgress({ percent: (event.loaded / event.total) * 100 }, file);
            }
        };
        fmData.append("files", file);
        AttachmentService.upload(fmData, config)
            .then(res => {
                onSuccess(file);
                console.log(res);
            })
            .catch(err => {
                const error = new Error('Some error');
                onError({ event: error });
            });
    }

    return (
        <Modal title={'Редактирование события'} onCancel={closeEditForm} visible={editingEvent !== undefined}
            cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}
            width={900} footer={false}>
            <Form
                {...layout}
                form={form}
                name='basic'
                initialValues={{
                    fullDay: editingEvent.fullDay,
                    description: editingEvent.description,
                    freeVisiting: editingEvent.freeVisiting,
                    materials: recordFileList,
                    eventName: editingEvent.name,
                    category: editingEvent.category?.id,
                    location: editingEvent.location,
                    dateFrom: editingEvent.startDate,
                    dateTo: editingEvent.endDate,
                    participants: editingEvent.actors.map(ob => ob.userLogin),
                    links: editingEvent.links.map(ob => ob.linkName),
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    {...tailLayout}
                    label='Название'
                    name='eventName'
                    rules={[{ required: true, message: 'Пожалуйста, введите название события.' }]}
                >
                    <Input defaultValue={editingEvent.name} onChange={(value) => {
                        // editingEvent.name = value.target.value;
                        form.setFieldsValue({ eventName: value.target.value });
                    }} />
                </Form.Item>

                <Form.Item
                    {...tailLayout} name='category' label='Категория события' rules={[{ required: true, message: 'Пожалуйста, выберите категорию события.' }]}>
                    <Select
                        placeholder=''
                        onChange={onCategoryChange}
                        allowClear
                        defaultValue={editingEvent.category.id}
                    >
                        {renderCategories()}
                    </Select>
                </Form.Item>

                <Form.Item
                    {...tailLayout}
                    label='Расположение'
                    name='location'
                >
                    <Input maxLength={255} defaultValue={editingEvent.location} onChange={(value) => {
                        // editingEvent.location = value.target.value;
                        form.setFieldsValue({ location: value.target.value });
                    }} />
                </Form.Item>

                <Form.Item
                    {...tailLayout}
                    label='Время начала'
                    name='dateFrom'
                    rules={[{ required: true }]}
                >
                    {/* <DatePickerJS props={{ onChange: (value) => {
                        console.log('change date', value);
                    }}}/> */}
                    <DatePicker dateFormat='dd.MM.yyyy' locale='ru' selected={startDate} name='dateFrom_date'
                        showYearDropdown showMonthDropdown useShortMonthInDropdown
                        onChange={(value) => {
                            console.log('change date', value, startDate); //Todo: много лишнего
                            const newVal = setDate(value, startDate);
                            setStartDate(newVal);
                            form.setFieldsValue({ startDate: newVal });
                        }} />
                    <TimePicker name='dateFrom_hour'
                        placeholder='00:'
                        format={'HH'} allowClear={false}
                        defaultValue={moment(startDate, 'HH')}
                        onChange={(value, dateString) => {
                            console.log('change hour', value, startDate);
                            const newVal = setHours(value, startDate);
                            setStartDate(newVal);
                            form.setFieldsValue({ startDate: newVal });
                        }}
                    />
                    <TimePicker name='dateFrom_minute'
                        placeholder='00' allowClear={false} format={'mm'}
                        defaultValue={moment(startDate)}
                        onChange={(value, dateString) => {
                            console.log('change minutes', value, startDate);
                            const newVal = setMinutes(value, startDate);
                            setStartDate(newVal);
                            form.setFieldsValue({ startDate: newVal });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    {...tailLayout}
                    label='Время окончания'
                    name='dateTo'
                    rules={[{ required: true }]}
                >
                    <DatePicker dateFormat='dd.MM.yyyy' locale='ru' selected={endDate} name='dateTo_date'
                        showYearDropdown showMonthDropdown useShortMonthInDropdown
                        onChange={(value, dateString) => {
                            console.log('change date', value, endDate);
                            const newVal = setDate(value, endDate);
                            setEndDate(newVal);
                            form.setFieldsValue({ endDate: newVal });
                        }} />
                    <TimePicker name='dateTo_hour'
                        placeholder='00:' allowClear={false} format={'HH'}
                        defaultValue={moment(endDate)}
                        onChange={(value, dateString) => {
                            console.log('change hour', value, endDate);
                            const newVal = setHours(value, endDate);
                            setEndDate(newVal);
                            form.setFieldsValue({ endDate: newVal });
                        }}
                    />
                    <TimePicker name='dateTo_minute'
                        placeholder='00' allowClear={false} format={'mm'}
                        defaultValue={moment(endDate)}
                        onChange={(value) => {
                            console.log('change minutes', value, endDate);
                            const newVal = setMinutes(value, endDate);
                            setEndDate(newVal);
                            form.setFieldsValue({ endDate: newVal });
                        }}
                    />
                </Form.Item>

                {/* <Form.Item {...tailLayout} name='fullDay' valuePropName='checked' label='Событие на весь день'> */}
                <Form.Item {...tailLayout} name='fullDay' label='Событие на весь день'>
                    <Checkbox defaultChecked={editingEvent.fullDay} onChange={value => {
                        form.setFieldsValue({ fullDay: value.target.checked });
                    }} />
                </Form.Item>

                <Form.Item
                    {...tailLayout}
                    label='Описание'
                    name='description'
                >
                    <TextArea autoSize={{ minRows: 3, maxRows: 3 }} defaultValue={editingEvent.description} onChange={(value) => {
                        form.setFieldsValue({ description: value.target.value });
                    }} />
                </Form.Item>

                <Form.Item {...tailLayout} name='freeVisiting' label='Свободное посещение'>
                    <Checkbox defaultChecked={editingEvent.freeVisiting} onChange={value => {
                        console.log('freeVisiting', value.target.checked);
                        form.setFieldsValue({ freeVisiting: value.target.checked });
                    }} />
                </Form.Item>

                <Form.Item {...tailLayout} label='Участники'
                    name='participants'>
                    <Select mode='multiple' style={{ width: '100%' }} placeholder='Выберите участников'
                        defaultValue={editingEvent.actors.map(ob => ob.userLogin)} >
                        {renderActors()}
                    </Select>
                </Form.Item>


                <Form.Item {...tailLayout} label='Материалы' name='materials'>
                    <Upload multiple={true} 
                        defaultFileList={recordFileList.fileList as UploadFile<any>[]} //beforeUpload={() => false}
                        //action = {file => {console.log('upload file', file); return '';}} 
                        // action={handleUpload}
                        customRequest={uploadImage}
                        // action={`${config.API_URL}Attachments`}
                        onChange={(info) => {
                            // console.log('onchange upload', info);
                            if (info.file.status !== 'uploading') {
                                // console.log(info.file, info.fileList);
                            }
                            if (info.file.status === 'done') {
                                message.success(`${info.file.name} был загружен`);
                                let newFileList = recordFileList.fileList;
                                newFileList.push({uid: info.file.uid, name: info.file.name, status: info.file.status});
                                form.setFieldsValue({ materials: {fileList: newFileList } });
                                setRecordFileList({ fileList: newFileList })
                            } else if (info.file.status === 'error') {
                                message.error(`${info.file.name} не был загружен.`);
                            }
                            if (info.file.status === 'removed') {
                                const actualMaterials = recordFileList.fileList.filter(ob => ob.uid.toString() !== info.file.uid);
                                form.setFieldsValue({ materials: {fileList: actualMaterials } });
                                setRecordFileList({ fileList: actualMaterials });
                            }
                        }}>
                        <Button>
                            Загрузить
                    </Button>
                    </Upload >
                </Form.Item>


                <Form.Item {...tailLayout} label='Ссылки' name='links'>
                    <Select mode='tags' style={{ width: '100%' }} placeholder='Введите ссылку и нажмите Etner'
                        defaultValue={editingEvent.links.map(ob => ob.linkName)} onChange={value => {
                            form.setFieldsValue({ links: value });
                        }}>

                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 17, span: 7 }}>
                    <Button type='primary' htmlType='submit' shape='round' size='large' name='SaveBtn' onClick={saveEditForm}>
                        Сохранить
                    </Button>
                    <Button htmlType='submit' shape='round' size='large' name='CancelBtn' onClick={closeEditForm} style={{ margin: 10 }}>
                        Отмена
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditFormCard;