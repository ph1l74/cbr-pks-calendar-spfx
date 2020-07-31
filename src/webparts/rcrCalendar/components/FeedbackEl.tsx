import * as React from 'react';
import styles from './Feedback.module.scss';
import Comment from '../Models/Comment';
import cardStyles from './EventCard.module.scss';
import * as moment from 'moment';
import { Tooltip, Button, Anchor } from 'antd';
import Icon from '@ant-design/icons/lib/components/AntdIcon';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { editComment, deleteComment } from '../Actions/comment';
const { Link } = Anchor;

const FeedbackEl = (props: { comment: Comment }) => {
    const dispatch = useDispatch();
    const [commentInfo, setCommentInfo] = React.useState(props.comment);
    const [author, setAuthor] = React.useState(props.comment.author);

    const EditIcon = props => <EditOutlined {...props} />
    const DeleteIcon = props => <DeleteOutlined {...props} />
    const onEditClick = () => {
        console.log('on edit click');
        dispatch(editComment(commentInfo));
    }
    const onDeleteClick = () => {
        console.log('on delete click');
        dispatch(deleteComment(commentInfo));
    }

    return (
        <div className={cardStyles.card}>
            <div className={styles.avatar}></div>
            <div className={styles.content}>
                <div className={styles.name} style={{ display: 'inline-flex' }}>
                    <div style={{ color: 'blue', paddingRight: '30px' }}>
                        {author ? `${author.firstName} ${author.lastName} ${author.patronymic}      ` : null}
                    </div>
                    <div style={{ paddingRight: '30px' }}>
                        {`${moment(commentInfo.modifiedDate).format('DD.MM.yyyy')}      `}
                    </div>
                    <Tooltip title="Редактировать">
                        <Button type='link' style={{ color: 'cadetblue', marginLeft: '10px' }} icon={<EditIcon />}
                            onClick={onEditClick} />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button type='link' style={{ color: 'cadetblue', marginLeft: '10px' }} icon={<DeleteIcon />}
                            onClick={onDeleteClick} />
                    </Tooltip>
                </div>
                <div className={styles.comment}>{commentInfo.description}</div>
            </div>
            <div className={styles.materials}>
                <Anchor >
                    {commentInfo.materials.map(el =>
                        <Link key={`material_${el.id}_${el.eventID}`} href={`#${el.fileName}`} title={el.fileName} className={styles.materialsLink} />
                    )}
                    {commentInfo.links.map(el =>
                        <Link key={`link_${el.id}_${el.eventID}`} href={`${el.linkName}`} title={el.linkName} className={styles.materialsLink} />
                    )}
                </Anchor>
            </div>
        </div>
    )

}

export default FeedbackEl;