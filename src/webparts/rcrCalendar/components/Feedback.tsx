import * as React from 'react';
import FeedbackEl from './FeedbackEl';
import styles from './Feedback.module.scss';

const Feedback = () => {

    const initFeedbacks = [
        {
            name: 'Завьялова Мария Владимировна',
            date: '16.05.2019',
            img: '/img/65zmv.jpg',
            description: 'Для сведения участников',
            attachments: [{ name: 'rcr.xlsx', url: '/attachments/rcr.xlsx' }, { name: 'Таблица переходов статусов.xlsx', url: '/attachments/tps.xlsx' }],
            links: ['http://ppod.cbr.ru/awesome', 'http://cbrportal.cbr.ru/dep/dep_it/cr']
        },
        {
            name: 'Кузыева Лилия Ураловна',
            date: '14.05.2019',
            img: '/img/65klu.jpg',
            description: 'Полезное мероприятие',
            links: ['http://vk.com/id1']
        },
    ]

    const [feedback, setFeedback] = React.useState(initFeedbacks)

    React.useEffect(() => {
        // ask feedbacks
    }, [])

    return (
        <ul style={styles}>
            {/* <li><FeedbackEl  /></li> */}
        </ul>
    )

}

export default Feedback;