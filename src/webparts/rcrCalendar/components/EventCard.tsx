import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';
import { default as IEventProps } from '../Models/Event';
import { useReducer, useDispatch } from 'react-redux';
import { setEditMode } from '../Actions';

const editIcon = require("../Icons/Edit.svg") as string;
const EventCard = (eventCard: any) => {


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

  // modal types
  const modalTypes = ["Участники", "Материалы", "Отзывы"]

  // react hooks instead of props
  const [cardInfo, setCardInfo] = React.useState(eventCard);

  // open modal state

  const [stateModal, setModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);

  const dispatch = useDispatch()

  // event card styled by categorie color
  const categorieColor = cardInfo.eventCard.category.color ? cardInfo.eventCard.category.color : '#000000';
  const categorieStyle: React.CSSProperties = {
    color: categorieColor,
    borderColor: categorieColor,
  }

  const categorieBorderStyle: React.CSSProperties = {
    borderColor: categorieColor
  }


  // 
  const openEditForm = (e) => {
    console.log('send open editform');
    dispatch(setEditMode(1))
  }

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
          <span className={styles.dateDay}>{new Date(cardInfo.eventCard.startDate).getUTCDate()}</span>
          <span className={styles.dateMonth}>{monthNames[new Date(cardInfo.eventCard.startDate).getMonth()]}</span>
          <span className={styles.dateYear}>{new Date(cardInfo.eventCard.startDate).getUTCFullYear()}</span>
        </div>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{new Date(cardInfo.eventCard.endDate).getUTCDate()}</span>
          <span className={styles.dateMonth}>{monthNames[new Date(cardInfo.eventCard.endDate).getMonth()]}</span>
          <span className={styles.dateYear}>{new Date(cardInfo.eventCard.endDate).getUTCFullYear()}</span>
        </div>
      </div>
      <div className={styles.info} style={categorieBorderStyle}>
        <div className={styles.editLink} onClick={openEditForm}>
          <img src={editIcon} className={styles.editIcon} />
        </div>
        <div className={styles.header}>
          {
            cardInfo.eventCard.allDay ?
              <div className={styles.time}>Событие на весь день</div>
              :
              <div className={styles.time}>{new Date(cardInfo.eventCard.startDate).getHours()} - {new Date(cardInfo.eventCard.endDate).getHours()}</div>
          }
          {
            cardInfo.eventCard.isParticipant ?
              <div className={styles.status}>Вы участник</div>
              :
              null
          }
          <div className={styles.location}>{cardInfo.eventCard.location}</div>
        </div>
        <div className={styles.title}>{cardInfo.eventCard.title}</div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: cardInfo.eventCard.description }}></div>
        <div className={styles.tags}>
          <ul>
            <li style={categorieStyle}>{cardInfo.eventCard.category.name}</li>
          </ul>
        </div>
        <div className={styles.footer}>
          <div className="participants" onClick={() => { openModal(0) }}>Список участников ({cardInfo.eventCard.participantsCount})</div>
          {
            cardInfo.attachmentsCount > 0 ?
              <div className="materials" onClick={() => { openModal(1) }}>Материалы ({cardInfo.eventCard.attachmentsCount})</div>
              :
              null
          }
          <div className={styles.feedback} onClick={() => { openModal(2) }}>Отзывы {cardInfo.eventCard.feedbacksCount > 0 ? `(${cardInfo.eventCard.feedbacksCount})` : null}</div>
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