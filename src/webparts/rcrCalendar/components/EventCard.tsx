import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';
import Event from '../Models/Event';
import * as moment from 'moment';

const EventCard = (eventCard: any) => {


  // hardcode test data
  const cardInfoInit = {
    dates: {
      startDate: "2020-10-05T14:48:00.000Z",
      endDate: "2020-10-10T14:48:00.000Z"
    },
    time: {
      allDay: true,
      from: null,
      to: null
    },
    status: true,
    location: "Москва, 1-й Волоколамский проезд д.10 строение 3.",
    title: "Курс: Основы визуального моделирования с использованием UML 2.x",
    description: "Код: REQ-001</br>Организатор: Luxoft Training",
    tags: ["Прочие события"],
    participants: ["65afa", "65chdv", "65gsv"],
    materials: ["material"],
    feedback: [{ author: "65afa", comment: "nice" }, { author: "65chdv", comment: "not nice" }]
  }


  const renderDate = (ev: any) => {
    const startDate = moment(ev.eventCard.startDate as Date);
    const endDate = moment(ev.eventCard.endDate);
    //console.log(ev, ev.eventCard.startDate, ev.eventCard.endDate as Date, startDate, endDate);
    return (
      <div className={styles.dates}>
        <div className={styles.dateFrom}>
          <span className={styles.dateDest}>с</span>
          <span className={styles.dateDay}>{startDate.date()}</span>
          <span className={styles.dateMonth}>{monthNames[startDate.month()]}</span>
          <span className={styles.dateYear}>{startDate.year()}</span>
        </div>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{endDate.date()}</span>
          <span className={styles.dateMonth}>{monthNames[endDate.month()]}</span>
          <span className={styles.dateYear}>{endDate.year()}</span>
        </div>
      </div>
    )
  }

  // month names for translation
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const modalTypes = ["Участники", "Материалы", "Отзывы"]

  // react hooks instead of props
  const [cardInfo, setCardInfo] = React.useState(eventCard);

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
      {renderDate(cardInfo)}
      {/* <div className={styles.dates}>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{new Date(cardInfo.endDate).getUTCDate()}</span>
          <span className={styles.dateMonth}>{monthNames[new Date(cardInfo.endDate).getMonth()]}</span>
          <span className={styles.dateYear}>{new Date(cardInfo.endDate).getUTCFullYear()}</span>
        </div> 
      </div> */}
      <div className={styles.info}>
        <div className={styles.header}>
          {
            cardInfo.eventCard.allDay ?
              <div className={styles.time}>Событие на весь день</div>
              :
              <div className={styles.time}>{cardInfo.eventCard.startDate.toString()} - {cardInfo.eventCard.endDate.toString()}</div>
          }
          {
            cardInfo.eventCard.status ?
              <div className={styles.status}>Вы участник</div>
              :
              null
          }
          <div className={styles.location}>{cardInfo.eventCard.location}</div>
        </div>
        <div className={styles.title}>{cardInfo.eventCard.title}</div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: cardInfo.eventCard.description }}></div>
        <div className={styles.tags}>
          {/* <ul>
            {cardInfo.tags ? cardInfo.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))
              : null
            }
          </ul> */}
        </div>
        <div className={styles.footer}>
          {/* <div className="participants" onClick={() => { openModal(0) }}>Список участников ({cardInfo.participants ? cardInfo.participants.length : "-"})</div>
          {
            cardInfo.materials && cardInfo.materials.length > 0 ?
              <div className="materials" onClick={() => { openModal(1) }}>Материалы ({cardInfo.materials ? cardInfo.materials.length : "-"})</div>
              :
              null
          }
          <div className={styles.feedback} onClick={() => { openModal(2) }}>Отзывы {cardInfo.feedback && cardInfo.feedback.length > 0 ? `(${cardInfo.feedback.length})` : null}</div> */}
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