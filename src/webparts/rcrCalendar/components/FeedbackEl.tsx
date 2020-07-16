import * as React from 'react';
import styles from './Feedback.module.scss';
import { default as IComment } from '../Models/Comment';


const FeedbackEl: React.FunctionComponent<IComment> = (FeedbackObj) => {

    return (
        <div>
            <div className={styles.avatar}></div>
            <div className={styles.content}>
                <div className={styles.name}>{FeedbackObj.authorLogin}</div>
            </div>
        </div>
    )

}

export default FeedbackEl;