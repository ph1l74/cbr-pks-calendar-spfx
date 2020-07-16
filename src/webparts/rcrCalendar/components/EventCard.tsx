import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';

const EventCard = () => {


  // hardcode test data
  const cardInfoInit =
  {
    "allDay": true,
    "attachmentsCount": 89,
    "category": {
      "id": 1,
      "name": "Мероприятия",
      "color": "#000000"
    },
    "description": "<p> Метания копья в зале. </p>",
    "endDate": "2020-07-04T00:42:37.3002723",
    "feedbacksCount": 4,
    "freeVisit": true,
    "id": 17,
    "isParticipant": false,
    "linksCount": 98,
    "location": "Location 058",
    "participantsCount": 13,
    "startDate": "2020-06-16T00:42:37.3002723",
    "title": "Event 058"
  }


  // month names for translation
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];


  const modalTypes = ["Участники", "Материалы", "Отзывы"]

  // react hooks instead of props
  const [cardInfo, setCardInfo] = React.useState(cardInfoInit);

  // open modal state

  const [stateModal, setModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);

  function openModal(type: number): void {
    setModalType(type);
    setModal(true);
  }


  function closeModal(): void {
    console.log("closed modal");
    setModal(false);
  }


  return (
    <div className={styles.card}>
      <div className={styles.dates}>
        <div className={styles.dateFrom}>
          <span className={styles.dateDest}>с</span>
          <span className={styles.dateDay}>{new Date(cardInfo.startDate).getUTCDate()}</span>
          <span className={styles.dateMonth}>{monthNames[new Date(cardInfo.startDate).getMonth()]}</span>
          <span className={styles.dateYear}>{new Date(cardInfo.startDate).getUTCFullYear()}</span>
        </div>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{new Date(cardInfo.endDate).getUTCDate()}</span>
          <span className={styles.dateMonth}>{monthNames[new Date(cardInfo.endDate).getMonth()]}</span>
          <span className={styles.dateYear}>{new Date(cardInfo.endDate).getUTCFullYear()}</span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          {
            cardInfo.allDay ?
              <div className={styles.time}>Событие на весь день</div>
              :
              <div className={styles.time}>{new Date(cardInfo.startDate).getHours()} - {new Date(cardInfo.endDate).getHours()}</div>
          }
          {
            cardInfo.isParticipant ?
              <div className={styles.status}>Вы участник</div>
              :
              null
          }
          <div className={styles.location}>{cardInfo.location}</div>
        </div>
        <div className={styles.title}>{cardInfo.title}</div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: cardInfo.description }}></div>
        <div className={styles.tags}>
          <ul>
<<<<<<< HEAD
            {cardInfo.tags.map((tag, i) => (
              <li key={i}>{tag}</li>
            ))}
=======
            <li>{cardInfo.category.name}</li>
>>>>>>> e944cb4580c1a8d0a4bf287892c73a21c7a1519b
          </ul>
        </div>
        <div className={styles.footer}>
          <div className="participants" onClick={() => { openModal(0) }}>Список участников ({cardInfo.participantsCount})</div>
          {
            cardInfo.attachmentsCount > 0 ?
              <div className="materials" onClick={() => { openModal(1) }}>Материалы ({cardInfo.attachmentsCount})</div>
              :
              null
          }
          <div className={styles.feedback} onClick={() => { openModal(2) }}>Отзывы {cardInfo.feedbacksCount > 0 ? `(${cardInfo.feedbacksCount})` : null}</div>
        </div>
      </div>
      {
        stateModal ?
          <Modal title={modalTypes[modalType]} closeModalFn={closeModal}>
            {
              modalType === 0 ?
                <Participants />
                : modalType === 1 ?
                  <Materials />
                  :
                  <div>Отзывы</div>
            }
          </Modal>
          :
          null
      }
    </div>
  )
}

export default EventCard;