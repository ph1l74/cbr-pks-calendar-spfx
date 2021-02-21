import * as React from 'react';
import FeedbackEl from './FeedbackEl';
import styles from './Feedback.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';
import { closeEventComments, infinityLoadEventComments, editComment } from '../Actions/comment';
import Comment from '../Models/Comment';
import Event from '../Models/Event';
import { debounce } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import CommentEditForm from '../../../../lib/webparts/rcrCalendar/components/CommentEditForm';
import User from '../Models/User';
import { IAppReducer } from '../Reducers';

const Feedback = () => {

    const viewComments: Comment[] = useSelector(state => state.comment.comments as Comment[]);
    const selectedEventForComments: Event = useSelector(state => state.comment.selectedEvent as Event);
    const isFetching = useSelector(state => state.comment.isFetching as boolean);
    const editRecord = useSelector(state => state.comment.editingComment as Comment);
    const users: User[] = useSelector((state: IAppReducer) => state.root.users);
    const isEditor: boolean = useSelector((state: IAppReducer) => state.root.isEditor);

    const dispatch = useDispatch();

    function closeViewCommentForm(): void {
        // setEditMode(0);
        dispatch(closeEventComments());
    }

    const onScroll = () => {
        const contentElement = $('div[class*=commentsModal]');
        // console.log('scroll comments', contentElement);
        // debounce(() => {
        // Checks that the page has scrolled to the bottom
        if (!isFetching && viewComments.length > 0 &&
            contentElement.innerHeight() + contentElement.scrollTop() + 50 > contentElement[0].scrollHeight) {
            console.log('Infinity load', selectedEventForComments, viewComments.length);
            dispatch(infinityLoadEventComments(viewComments.length, selectedEventForComments));
        }
        // });
    };

    function newEditForm(): void {
        const newRecord = new Comment();
        newRecord.id = 0;
        newRecord.event = selectedEventForComments;
        newRecord.eventID = selectedEventForComments.id;
        newRecord.links = [];
        newRecord.materials = [];
        console.log('port', window.location.port);
        if (window.location.port === '4321') { // Todo временное решение, т.к. аутентификации нет, особенно в воркбенче
            // tslint:disable-next-line:no-console
            newRecord.author = selectedEventForComments.author ?? users[0];
        }
        dispatch(editComment(newRecord));
    }

    return (
        editRecord ? <CommentEditForm />
            :
            (<Modal title={'Отзывы'} onCancel={closeViewCommentForm} visible={true} key='commentsModal'
                cancelButtonProps={{ style: { display: 'none' } }} okButtonProps={{ style: { display: 'none' } }}
                width={900} footer={false}>
                <div key={`commentsModal_${selectedEventForComments.id}`} onScroll={e => onScroll()}
                    className={'commentsModal'} style={{ maxHeight: '900px', overflow: 'auto' }} >
                    {/* <ul style={styles}> */}
                    {viewComments.map(el =>
                        <div key={`eventComment_${el.id}`}>
                            <FeedbackEl comment={el} />
                        </div>
                    )}
                </div>
                <div className={styles.feedbacksHeader} >
                    <Button type='primary' shape='round' size='large' className={styles.NewCommentBtn} onClick={newEditForm}>
                        Добавить отзыв
                    </Button>
                </div>
            </Modal>)

    );

};

export default Feedback;