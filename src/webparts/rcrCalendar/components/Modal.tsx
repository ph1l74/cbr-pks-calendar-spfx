import * as React from 'react';
import styles from './Modal.module.scss';

interface IModalProps {
    title: string,
    closeModalFn: () => void
}

const Modal: React.FunctionComponent<IModalProps> = (props) => {

    return (
        <div className={styles.bg}>
            <div className={styles.window}>
                <div className="header">{props.title}</div>
                <div className="close"><button onClick={props.closeModalFn}>Close</button></div>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;