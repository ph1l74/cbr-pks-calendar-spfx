import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';

const EventCard = () => {


  // hardcode test data
  const cardInfoInit = {
    dates: {
      dateFrom: "2020-10-05T14:48:00.000Z",
      dateTo: "2020-10-10T14:48:00.000Z"
    },
    time: {
      allDay: true,
      from: null,
      to: null
    },
    status: true,
    location: "Москва, 1-й Волоколамский проезд д.10 строение 3.",
    title: "Курс: Основы визуального моделирования с использованием UML 2.x",
    code: "REQ-001",
    provider: "Luxoft Training",
    tags: ["Прочие события"],
    participants: ["65afa", "65chdv", "65gsv"],
    materials: ["material"],
    feedback: [{ author: "65afa", comment: "nice" }, { author: "65chdv", comment: "not nice" }]
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
          <span>с</span>
          <span className="date">{new Date(cardInfo.dates.dateFrom).getUTCDate()}</span>
          <span className="month">{monthNames[new Date(cardInfo.dates.dateFrom).getMonth()]}</span>
          <span className="year">{new Date(cardInfo.dates.dateFrom).getUTCFullYear()}</span>
        </div>
        <div className={styles.dateTo}>
          <span>по</span>
          <span className="date">{new Date(cardInfo.dates.dateTo).getUTCDate()}</span>
          <span className="month">{monthNames[new Date(cardInfo.dates.dateTo).getMonth()]}</span>
          <span className="year">{new Date(cardInfo.dates.dateTo).getUTCFullYear()}</span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          {
            cardInfo.time.allDay ?
              <div className={styles.time}>Весь день</div>
              :
              <div className={styles.time}>{cardInfo.time.from} - {cardInfo.time.from}</div>
          }
          {
            cardInfo.status ?
              <div className={styles.status}>Вы участник</div>
              :
              null
          }
          <div className="location">{cardInfo.location}</div>
        </div>
        <div className={styles.title}>{cardInfo.title}</div>
        <div className={styles.code}>код {cardInfo.code}</div>
        <div className={styles.provider}>Организатор - {cardInfo.provider}</div>
        <div className={styles.tags}>
          <ul>
            {cardInfo.tags.map((tag) => (
              <li>{tag}</li>
            ))}
          </ul>
        </div>
        <div className={styles.footer}>
          <div className="participants" onClick={() => { openModal(0) }}>Список участников ({cardInfo.participants.length})</div>
          {
            cardInfo.materials && cardInfo.materials.length > 0 ?
              <div className="materials" onClick={() => { openModal(1) }}>Материалы ({cardInfo.materials.length})</div>
              :
              null
          }
          <div className={styles.feedback} onClick={() => { openModal(2) }}>Отзывы {cardInfo.feedback && cardInfo.feedback.length > 0 ? `(${cardInfo.feedback.length})` : null}</div>
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