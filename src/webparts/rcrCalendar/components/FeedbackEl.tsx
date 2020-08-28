import * as React from 'react';
import styles from './Feedback.module.scss';
import Comment from '../Models/Comment';
import * as moment from 'moment';
import { Tooltip, Button, Anchor, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { editComment, deleteComment } from '../Actions/comment';
import config from '../constants/config';
import { IAppReducer } from '../Reducers';
import { DownloadWithJwtViaFormPost } from '../utils/Utils';
import Service from '../services/Service';
import { getToken } from '../utils/auth';

const unknownImage = require('../Icons/unknown.png') as string;

const FeedbackEl = (props: { comment: Comment }) => {
    const dispatch = useDispatch();
    const [commentInfo] = React.useState(props.comment);
    const [author] = React.useState(props.comment.author);
    // Права на редактирование у редакторов или авторов
    const isEditor: boolean = useSelector((state: IAppReducer) => state.root.isEditor ||
        (state.root.currentUser && author && state.root.currentUser.login === author.login));

    const EditIcon = props => <EditOutlined {...props} />;
    const DeleteIcon = props => <DeleteOutlined {...props} />;
    const onEditClick = () => {
        console.log('on edit click');
        dispatch(editComment(commentInfo));
    };
    const onDeleteClick = () => {
        console.log('on delete click');
        dispatch(deleteComment(commentInfo));
    };

    return (
        // <div className={cardStyles.card}>
        <div className={styles.feedback}>
            <div className={styles.avatar}>
                <img width='25px' style={{ borderRadius: '50%' }}
                    src={author.img && author.img.toString().length > 0 ? author.img.toString() : unknownImage}></img>
            </div>
            <div className={styles.content}>
                <div className={styles.name} style={{ display: 'inline-flex' }}>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>
                            {author ? `${author.firstName} ${author.lastName} ${author.patronymic}      ` : undefined}
                        </div>
                    </div>
                    <div style={{ paddingRight: '30px' }}>
                        {`${moment(commentInfo.modifiedDate).format('DD.MM.yyyy')}      `}
                    </div>
                    <Tooltip title='Редактировать'>
                        <Button type='link' style={{ color: 'cadetblue', marginLeft: '10px', top: '-5px' }} icon={<EditIcon />}
                            hidden={!isEditor} onClick={onEditClick} />
                    </Tooltip>

                    <Popconfirm
                        title='Вы действительно хотите удалить комментарий?'
                        onConfirm={onDeleteClick}
                        okText='OK' cancelText='Отмена' >
                        <Tooltip title='Удалить'>
                            <Button type='link' style={{ color: '#eb780d', marginLeft: '10px', top: '-5px' }} icon={<DeleteIcon />}
                                hidden={!isEditor} />
                        </Tooltip>
                    </Popconfirm>
                </div>
                <div className={styles.comment}>{commentInfo.description}</div>
                <div className={styles.materials}>
                    {commentInfo.materials.map((el, ind) =>
                        <a key={`material_${el.id}_${el.eventID}_${ind}`} // href={`${config.API_URL}attachments/${el.id}`}
                            title={el.fileName} className={styles.materialsLink} target='_blank'
                            onClick={() => DownloadWithJwtViaFormPost(`${config.API_URL}attachments/${el.id}`, el.fileName,
                                getToken(Service.userName, Service.userId, Service.isEdit, Service.isRead).token)}>{el.fileName}</a>
                    )}
                    {commentInfo.links.map((el, ind) =>
                        <a key={`link_${el.id}_${el.eventID}_${ind}`} href={`${el.linkName}`} title={el.linkName}
                            className={styles.materialsLink} target='_blank' >{el.linkName}</a>
                    )}
                </div>
            </div>
        </div>
    );

};

export default FeedbackEl;