import * as React from 'react';
import { Form, Input, Checkbox, Button, Select, Upload, Modal, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { closeEditComment, saveEditComment } from '../Actions/comment';
import Comment from '../Models/Comment';
import Material from '../Models/Material';
import Link from '../Models/Link';
import { UploadFile } from 'antd/lib/upload/interface';
import config from '../constants/config';
import { parseUid, uploadFile } from '../utils/Utils';
import { AttachmentService } from '../services/Services';

const { TextArea } = Input

const CommentEditForm = () => {

    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const editingComment = useSelector(state => state.comment.editingComment as Comment);

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 2, span: 16 },
    };

    function closeEditForm(): void {
        dispatch(closeEditComment());
    }

    function saveEditForm(): void {
        const editValues = form.getFieldsValue();
        if (form.getFieldsError().map(ob => ob.errors.length).reduce((a, b) => a = a + b) === 0) {
            console.log('save editform', editingComment, editValues);
            let editComment = editingComment;
            editComment.description = editValues.description;
            if (editValues.materials) {
                editComment.materials = editValues.materials.fileList.map(ob => new Material(parseUid(ob.uid), ob.name));
            }
            if (editValues.links) {
                editComment.links = editValues.links.map(ob => new Link(0, ob));
            }
            console.log(editingComment, editComment);
            dispatch(saveEditComment(editComment));
        }
        else {
            message.error('Данные не могут быть сохранены, т.к. имеются ошибки ввода!');
        }
    }

    const onFinish = values => {
        console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const props = {
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange: this.handleChange,
        multiple: true,
    };

    const [recordFileList, setRecordFileList] = React.useState({
        fileList: editingComment.materials.map(ob => {
            return {
                uid: ob.id.toString(),
                name: ob.fileName,
                status: 'done',
            }
        })
    });

    return (
        <Modal title={'Редактирование отзыва'}
            onCancel={closeEditForm}
            visible={true}
            cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}
            width={900} footer={false} key='editCommentModal'>
            <Form
                {...layout}
                form={form}
                name="basic"
                initialValues={{
                    description: editingComment.description,
                    materials: recordFileList,
                    links: editingComment.links.map(ob => ob.linkName),
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    {...tailLayout}
                    label="Описание"
                    name="description"
                    rules={[{ required: true, message: 'Пожалуйста, введите описание.' }, { type: 'string', max: 2500, message: 'Длина не может превышать 2500 символов' }]}
                >
                    <TextArea autoSize={{ minRows: 3, maxRows: 3 }} onChange={(value) => {
                        form.setFieldsValue({ description: value.target.value });
                    }} />
                </Form.Item>

                <Form.Item {...tailLayout} label='Материалы' name='materials'>
                    <Upload multiple={true} defaultFileList={recordFileList.fileList as UploadFile<any>[]}
                        //beforeUpload={() => false}
                        // action={`${config.API_URL}Attachments`}                        
                        customRequest={uploadFile}
                        onChange={(info) => { // Todo Сделать общую функцию с событиями
                            console.log('onchange upload', info);
                            if (info.file.status !== 'uploading') {
                                // console.log(info.file, info.fileList);
                            }
                            if (info.file.status === 'done') {
                                message.success(`${info.file.name} был загружен`);
                                let newFileList = recordFileList.fileList;
                                newFileList.push({ uid: info.file.uid, name: info.file.name, status: info.file.status });
                                form.setFieldsValue({ materials: { fileList: newFileList } });
                                setRecordFileList({ fileList: newFileList })
                            } else if (info.file.status === 'error') {
                                message.error(`${info.file.name} не был загружен.`);
                            }
                            if (info.file.status === 'removed') {
                                const actualMaterials = recordFileList.fileList.filter(ob => ob.uid.toString() !== info.file.uid);
                                form.setFieldsValue({ materials: { fileList: actualMaterials } });
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
                        defaultValue={editingComment.links.map(ob => ob.linkName)} onChange={value => {
                            form.setFieldsValue({ links: value });
                        }}>

                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 17, span: 7 }} >
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

export default CommentEditForm;