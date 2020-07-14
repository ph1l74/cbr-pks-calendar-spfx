import * as React from 'react';
import Participant from './Participant';
import {UserService} from '../services/Services';
import User from '../Models/User';

const Participants = () => {

    const initParticipants = [/*{
        url: '/users/65afa',
        img: '',
        surname: 'Астахов',
        name: 'Филат Александрович'
    },
    {
        url: '/users/65bin',
        img: '',
        surname: 'Баталов',
        name: 'Илья Николаевич'
    },
    {
        url: '/users/65gsv',
        img: '',
        surname: 'Гайдаренко',
        name: 'Сергей Викторович'
    }*/
    ]

    const [participants, setParticipants] = React.useState(initParticipants);
    UserService.findAll().then(ob=> {
        console.log('ob', ob);
        setParticipants(ob);
    }).catch(ex => console.log(ex) );
    
    return (
        <div className="participants">
            {participants.map((p) => (
                <Participant userInfo={p}></Participant>
            ))}
        </div >
    );
}

export default Participants