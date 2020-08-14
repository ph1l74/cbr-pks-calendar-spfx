import * as React from 'react';
import styles from './Participants.module.scss';

const unknownImage = require("../Icons/unknown.png") as string;

const Participant = ({ userInfo }) => {

    const bgImage = (userInfo.img && userInfo.img.length > 0) ? `url('${userInfo.img}')` : unknownImage; // '/lib/webparts/rcrCalendar/icons/unknown.png'; // '/img/anonymous.jpg';
    const avatarStyle: React.CSSProperties = {
        backgroundImage: bgImage
    }

    return (
        <a className={styles.participant} href={userInfo.login} target='_blank'>
            <div className={styles.avatar} style={avatarStyle}>
                <img width='45px' style={{borderRadius: '50%'}} src={userInfo.img && userInfo.img.length > 0 ? userInfo.img : unknownImage}></img>
            </div>
            <div>{userInfo.firstName}</div>
            <div>{userInfo.patronymic}</div>
            <div>{userInfo.lastName}</div>
        </a >
    );
}

export default Participant;