import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';
import Event from '../Models/Event';
import { useReducer, useDispatch } from 'react-redux';
import { setEditMode, editEvent } from '../Actions';
import * as moment from 'moment';
import { getCommentsByEvent } from '../Actions/comment';

const editIcon = require("../Icons/Edit.svg") as string;
const EventCard = (props: {eventCard: Event}) => {

  // modal types
  const modalTypes = ["Участники", "Материалы", "Отзывы"]

  // react hooks instead of props
  const [cardInfo, setCardInfo] = React.useState(props.eventCard);

  // open modal state

  const [stateModal, setModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);

  const dispatch = useDispatch()

  // event card styled by categorie color
  const categorieColor = cardInfo.category.color ? cardInfo.category.color : '#000000';
  const categorieStyle: React.CSSProperties = {
    color: categorieColor,
    borderColor: categorieColor,
  }

  const categorieBorderStyle: React.CSSProperties = {
    borderColor: categorieColor
  }


  // 
  const openEditForm = () => {
    console.log('send open editform');
    // dispatch(setEditMode(1))
    dispatch(editEvent(cardInfo));
  }

  function openModal(type: number): void {
    setModalType(type);
    setModal(true);
  }


  function closeModal(): void {
    console.log("closed modal");
    setModal(false);
  }
  moment.locale('ru');
  const startDate = moment(cardInfo.startDate, 'YYYY-MM-DD');
  const endDate = moment(cardInfo.endDate, 'YYYY-MM-DD');

  return (
    <div className={styles.card}>
      <div className={styles.dates}>
        <div className={styles.dateFrom}>
          <span className={styles.dateDest}>с</span>
          <span className={styles.dateDay}>{startDate.dates()}</span>
          <span className={styles.dateMonth}>{startDate.format('MMMM')}</span>
          <span className={styles.dateYear}>{startDate.years()}</span>
        </div>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{endDate.dates()}</span>
          <span className={styles.dateMonth}>{endDate.format('MMMM')}</span>
          <span className={styles.dateYear}>{endDate.years()}</span>
        </div>
      </div>
      <div className={styles.info} style={categorieBorderStyle}>
        <a className={styles.editLink} onClick={openEditForm}>
          <img src={editIcon} className={styles.editIcon} />
        </a>
        <div className={styles.header}>
          {
            cardInfo.fullDay ?
              <div className={styles.time}>Событие на весь день</div>
              :
              <div className={styles.time}>{cardInfo.startDate.getHours()} - {cardInfo.endDate.getHours()}</div>
          }
          {
            // cardInfo.isParticipant ?
            //   <div className={styles.status}>Вы участник</div>
            //   :
              null
          }
          <div className={styles.location}>{cardInfo.location}</div>
        </div>
        <div className={styles.title}>{cardInfo.name}</div>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: cardInfo.description }}></div>
        <div className={styles.tags}>
          <ul>
            <li style={categorieStyle}>{cardInfo.category.name}</li>
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
          <div className='comment' onClick={() => { dispatch(getCommentsByEvent(props.eventCard)) }}>Отзывы {cardInfo.feedbacksCount > 0 ? `(${cardInfo.feedbacksCount})` : null}</div>
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