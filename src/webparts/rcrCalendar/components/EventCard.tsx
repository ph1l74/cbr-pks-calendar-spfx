import * as React from 'react';
import styles from './EventCard.module.scss';

const EventCard = () => {

  const cardInfoInit = {}

  const [cardInfo, setCardInfo] = React.useState(cardInfoInit);

  return (
    <div className={styles.card}>
      <div className={styles.dates}>
        <div className={styles.dateFrom}>
          <span>с</span>
          <span className="date">10</span>
          <span className="month">Январь</span>
          <span className="year">2021</span>
        </div>
        <div className={styles.dateTo}>
          <span>по</span>
          <span className="date">10</span>
          <span className="month">Январь</span>
          <span className="year">2021</span>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.header}>
          <div className={styles.time}>21:00 - 05:00</div>
          <div className={styles.status}>Вы участник</div>
          <div className="location">Москва, 1-й Волоколамский проезд д.10 строение 3.</div>
        </div>
        <div className={styles.title}>Курс: Основы визуального моделирования с использованием UML 2.x</div>
        <div className={styles.code}>код REQ-001</div>
        <div className={styles.provider}>Организатор - Luxoft Training</div>
        <div className={styles.tags}><ul><li>Прочие события</li></ul></div>
        <div className={styles.footer}>
          <div className="participants">Список участников (10)</div>
          <div className="materials">Материалы (1)</div>
          <div className={styles.feedback}>Отзывы (2)</div>
        </div>
      </div>

    </div>
  )
}

export default EventCard;