import * as React from 'react';
import styles from './RcrCalendar.module.scss';

const EventCard = () => {

  const cardInfoInit = {}

  const [cardInfo, setCardInfo] = React.useState(cardInfoInit);

  return (
    <div className="card">
      <div className="dates">
        <span>с</span><div className="date-from">
          <span className="date">10</span>
          <span className="month">Январь</span>
          <span className="year">2021</span>
        </div>
        <span>по</span><div className="date-to">
          <span className="date">10</span>
          <span className="month">Январь</span>
          <span className="year">2021</span>
        </div>
      </div>
      <div className="info">
        <div className="header">
          <div className="time">21:00 - 05:00</div>
          <div className="status">Вы участник</div>
          <div className="location">Москва, 1-й Волоколамский проезд д.10 строение 3.</div>
        </div>
        <div className="title">Курс: Основы визуального моделирования с использованием UML 2.x</div>
        <div className="code">код REQ-001</div>
        <div className="provider">Организатор - Luxoft Training</div>
        <div className="tags"><ul><li>Прочие события</li></ul></div>
        <div className="footer">
          <div className="participants">Список участников (10)</div>
          <div className="materials">Материалы (1)</div>
          <div className="feedback">Отзывы (2)</div>
        </div>
      </div>

    </div>
  )
}

export default EventCard;