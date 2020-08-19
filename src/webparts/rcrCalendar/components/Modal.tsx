import * as React from 'react';
import styles from './Modal.module.scss';

interface IModalProps {
    title: string,
    closeModalFn: () => void,
    onScroll: () => void,
};

const Modal: React.FunctionComponent<IModalProps> = (props) => {

    return (
        <div className={styles.bg}>
            <div className={styles.border}>
                <div className={styles.close} onClick={props.closeModalFn}></div>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.window} onScroll={props.onScroll}>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default Modal;