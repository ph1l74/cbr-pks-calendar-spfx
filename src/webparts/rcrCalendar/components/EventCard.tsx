import * as React from 'react';
import styles from './EventCard.module.scss';
import Modal from './Modal';
import Participants from './Participants';
import Materials from './Materials';
import Event from '../Models/Event';
import { useDispatch, useSelector } from 'react-redux';
import { setEditMode, editEvent, getParticipantsByEvent, getMaterialsByEvent, infinityLoadEventMaterials, infinityLoadEventParticipants } from '../Actions';
import * as moment from 'moment';
import { getCommentsByEvent } from '../Actions/comment';
import * as $ from 'jquery';
import { IAppReducer } from '../Reducers';

const editIcon = require("../Icons/Edit.svg") as string;
const EventCard = (props: { eventCard: Event }) => {

  // modal types
  const modalTypes = ["Участники", "Материалы", "Отзывы"]

  // react hooks instead of props
  const [cardInfo, setCardInfo] = React.useState(props.eventCard);

  // open modal state

  const [stateModal, setModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);

  const dispatch = useDispatch();
  const selectedEventForView: Event = useSelector(state => state.viewEvent.selectedEvent as Event);
  const materialsCount: number = useSelector(state => state.viewEvent.materials.length);
  const actorsCount: number = useSelector(state => state.viewEvent.actors.length);
  const isFetching: boolean = useSelector(state => state.viewEvent.isFetching as boolean);
  const isFetchingFull: boolean = useSelector(state => state.viewEvent.isFetchingFull as boolean);
  const events: Event[] = useSelector((state: IAppReducer) => state.event.events.map(ob => ob.Value).reduce((a, b) => a.concat(b)));
  const wasEditComment: boolean = useSelector((state: IAppReducer) => state.event.wasEditComment);

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

  const onScroll = () => {
    const contentElement = $(`div[class*=${modalType === 0 ? 'participants' : 'materials'}]`).closest('div[class*=window]');
    if (!isFetchingFull && contentElement && contentElement.length > 0) {
      console.log('onScroll');
      if (!isFetching &&
        contentElement.innerHeight() + contentElement.scrollTop() + 50 > contentElement[0].scrollHeight) {
        if (modalType === 0) {
          if (actorsCount > 0) {
            // Checks that the page has scrolled to the bottom
            console.log('Infinity load', actorsCount);
            dispatch(infinityLoadEventParticipants(actorsCount, selectedEventForView));
          }
        }
        else if (modalType === 1) {
          if (materialsCount > 0) {
            // Checks that the page has scrolled to the bottom
            console.log('Infinity load', materialsCount);
            dispatch(infinityLoadEventMaterials(materialsCount, selectedEventForView));
          }
        }
      }
    }
  }


  function closeModal(): void {
    console.log("closed modal");
    setModal(false);
  }
  moment.locale('ru');
  const startDate = moment(cardInfo.startDate, 'YYYY-MM-DD');
  const endDate = moment(cardInfo.endDate, 'YYYY-MM-DD');

  const actualEvent = wasEditComment ?
    (events.filter(ob => ob.id === cardInfo.id).length > 0 ?
      events.filter(ob => ob.id === cardInfo.id)[0] : cardInfo)
    : cardInfo;

  return (
    <div className={styles.card}>
      <div className={styles.dates}>
        <div className={styles.dateFrom}>
          <span className={styles.dateDest}>с</span>
          <span className={styles.dateDay}>{startDate.date()}</span>
          <span className={styles.dateMonth}>{startDate.format('MMMM')}</span>
          <span className={styles.dateYear}>{startDate.year()}</span>
        </div>
        <div className={styles.dateTo}>
          <span className={styles.dateDest}>по</span>
          <span className={styles.dateDay}>{endDate.date()}</span>
          <span className={styles.dateMonth}>{endDate.format('MMMM')}</span>
          <span className={styles.dateYear}>{endDate.year()}</span>
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
          <div className="participants" onClick={() => { dispatch(getParticipantsByEvent(props.eventCard)); openModal(0); }}>Список участников ({cardInfo.participantsCount})</div>
          {
            cardInfo.attachmentsCount > 0 ?
              <div className="materials" onClick={() => { dispatch(getMaterialsByEvent(props.eventCard)); openModal(1); }}>Материалы ({cardInfo.attachmentsCount})</div>
              :
              null
          }
          <div className='comment' onClick={() => { dispatch(getCommentsByEvent(props.eventCard)) }}>Отзывы {actualEvent.feedbacksCount > 0 ? `(${actualEvent.feedbacksCount})` : null}</div>
        </div>
      </div>
      {
        stateModal ?
          <Modal title={modalTypes[modalType]} closeModalFn={closeModal} onScroll={onScroll} >
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