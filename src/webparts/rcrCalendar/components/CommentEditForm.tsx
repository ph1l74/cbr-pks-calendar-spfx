import * as React from 'react';
import { Form, Input, Checkbox, Button, Select, Upload, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { closeEditComment } from '../Actions/comment';
import Comment from '../Models/Comment';

const { TextArea } = Input

const CommentEditForm = () => {

    const [form] = Form.useForm();

    const dispatch = useDispatch();
    // const editingComment = useSelector(state => state.comment.editingComment as Comment);

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

    function closeEditForm(): void {
        dispatch(closeEditComment());
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



    return (
        <Modal title={'Редактирование отзыва'} 
        onCancel={closeEditForm} 
        visible={true}
            cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}
            width={900} footer={false} key='editCommentModal'>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    {...tailLayout}
                    label="Описание"
                    name="description"
                >
                    <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                </Form.Item>

                <Form.Item {...tailLayout} label="Ссылки"
                    name="links">
                    <Select mode="tags" style={{ width: '100%' }} placeholder="Введите ссылку и нажмите Etner">

                    </Select>,
            </Form.Item>

                <Form.Item {...tailLayout} label="Материалы"
                    name="materials">
                    <Upload {...props}>
                        <Button>
                            Загрузить
                    </Button>
                    </Upload>
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
        </Modal>
    );
}

export default CommentEditForm;