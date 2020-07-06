import * as React from 'react';
import styles from './Participants.module.scss';

const Participant = ({ userInfo }) => {

    const bgImage = (userInfo.img && userInfo.img.length > 0) ? userInfo.img : '/img/anonymous.jpg';
    const avatarStyle: React.CSSProperties = {
        backgroundImage: bgImage
    }

    return (
        <a className={styles.participant} href={userInfo.url}>
            <div className={styles.avatar} style={avatarStyle}>
                {userInfo.img && userInfo.img.length > 0 ? <img src={userInfo.img}></img> : null}
            </div>
            <div>{userInfo.surname}</div>
            <div>{userInfo.name}</div>
        </a >
    );
}

export default Participant;