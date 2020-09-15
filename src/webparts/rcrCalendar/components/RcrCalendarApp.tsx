import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import Dashboard from './Dashboard';
import Content from './Content';
import { Calendar } from './Calendar';
import EventCard from './EventCard';
import GroupingEvent from '../Models/GroupingEvent';
import Event from '../Models/Event';
// import { sp } from '@pnp/sp/presets/all';
// import pnp from 'sp-pnp-js';
// import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/sp/sites';
// import { IContextInfo } from '@pnp/sp/sites';
import { connect } from 'react-redux';
import { infinityLoadEvents } from '../Actions';
import Categories from './Categories';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import * as $ from 'jquery';
import EditFormCard from './EditFormCard';
import Category from '../Models/Category';
import FilterEvent from '../utils/IFilterEvent';
import { Spin, Button, Tooltip } from 'antd';
import * as moment from 'moment';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
// import { closeEventComments } from '../Actions/comment';
import Feedback from './Feedback';
import { editEvent } from '../Actions';
import { PlusCircleOutlined } from '@ant-design/icons';
import { IAppReducer } from '../Reducers';
import User from '../Models/User';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { setAuth } from '../../../../lib/webparts/rcrCalendar/Actions';
import Service from '../../../../lib/webparts/rcrCalendar/services/Service';
registerLocale('ru', ru);

// const EditIcon = props => <EditOutlined {...props} />
const AddIcon = props => <PlusCircleOutlined {...props} />;

const RcrCalendarApp = (events: GroupingEvent[], filterEvent: FilterEvent) => {
    // const editMode = useSelector((state: IAppReducer) => state.root.editMode);
    const editingEvent: Event = useSelector((state: IAppReducer) => state.event.editingEvent as Event);
    const selectedEventForComments: Event = useSelector((state: IAppReducer) => state.comment.selectedEvent as Event);
    const eventsCount: number = useSelector((state: IAppReducer) =>
        state.event.events.length === 0 ? 0 : (state.event.events as GroupingEvent[])
            .map(evg => evg.Value).reduce((a, b) => a ? a.concat(b) : []).length);
    const currentFilter: FilterEvent = useSelector((state: IAppReducer) => state.event.filterEvent);
    const isFetching: boolean = useSelector((state: IAppReducer) => state.event.isFetching as boolean);
    // const isCommentFetching: boolean = useSelector((state: IAppReducer) => state.comment.isFetching as boolean);
    const currentUser: User = useSelector((state: IAppReducer) => state.root.currentUser);
    const isEditor: boolean = useSelector((state: IAppReducer) => state.root.isEditor);

    const dispatch = useDispatch();

    // dispatch(setAuth(Service.userName, Service.userId));
    const contentElement = (window.location.port === '4321') ?
        $('div[class*=content_]') : $('div[class*=scrollRegion]');
    document.onscroll = (ev) => {
        console.log('document scroll', ev);
    };
    contentElement.scroll(debounce(() => {
        const {
            // loadUsers
        } = this;

        // Bails early if:
        // * there's an error
        // * it's already loading
        // * there's nothing left to load
        // if (error || isLoading || !hasMore) return;

        // Checks that the page has scrolled to the bottom
        if ( // contentElement.clientHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight
            eventsCount > 0 && contentElement.innerHeight() + contentElement.scrollTop() + 0 >= contentElement[0].scrollHeight) {
            console.log('Infinite load', currentFilter, eventsCount, contentElement.innerHeight());
            dispatch(infinityLoadEvents(eventsCount, currentFilter));
        }
    }));

    const renderEvents = (events: any) => {
        console.log('New render events', events);
        moment.locale('ru');
        if (!events.events || events.events.length === 0) {
            return <div>Нет данных</div>;
        }
        return events.events.map(evg => {
            const evGr: GroupingEvent = evg as GroupingEvent;
            const gr: moment.Moment = moment(evg.Key, 'YYYY-MM-DD');
            // console.log(evGr.Value);

            return <div key={`groupingEvent_${evGr.Key}`} className={styles['month-header']}>{gr.format('MMMM')}
                {(evGr.Value).map(ev => <EventCard eventCard={ev as Event} key={`eventCard_${ev.id}_${evg.Key}`}></EventCard>)}
            </div>;
            // return (evGr.Value).map(ev => <EventCard eventCard={ev} key={`eventCard_${ev.id}_${evGr.Key}`}></EventCard>);
        });
    };

    function newEditForm(): void {
        const newRecord: Event = new Event();
        newRecord.id = 0;
        newRecord.startDate = (moment(new Date()).hour(0).minute(0).second(0).millisecond(0)).toDate();
        newRecord.endDate = (moment(new Date()).add(1, 'd').hour(0).minute(0).second(0).millisecond(0)).toDate();
        newRecord.links = [];
        newRecord.materials = [];
        newRecord.actors = [];
        newRecord.users = [];
        newRecord.participants = [];
        newRecord.name = '';
        newRecord.location = '';
        newRecord.description = '';
        newRecord.allDay = false;
        newRecord.freeVisit = false;
        newRecord.author = currentUser;
        if (window.location.port === '4321') {
            // newRecord.author = selectedEventForComments.author;
        }
        dispatch(editEvent(newRecord));
    }

    const renderEditForm = () => {
        return editingEvent ?
            <EditFormCard ></EditFormCard>
            : (selectedEventForComments) ?
                <Feedback />
                : null;
    };
    const initCategories: Category[] = [];
    return (
        // editMode && editMode === 1 ?
        <div className={styles.app}>
            <div className='editFormContent'>
                {renderEditForm()}
            </div>
            <Spin tip='Загрузка данных...' spinning={isFetching} delay={500}>
                <Content filterEvent={filterEvent} >
                    {renderEvents(events)}
                </Content>
                <Dashboard>
                    <div className={styles['new-button']} hidden={!isEditor}>
                        <Tooltip title='Новое событие'>
                            <Button type='link' style={{ color: 'cadetblue', marginLeft: '10px' }}
                                icon={<AddIcon />} onClick={newEditForm} />
                        </Tooltip>
                    </div>
                    <Calendar ></Calendar>
                    <Categories categories={initCategories} />
                </Dashboard>
            </Spin>
        </div>
    );
};

const mapStateToProps = (store: any) => {
    console.log(store.event);
    return {
        events: store.event.events,
        filterEvent: store.event.filterEvent
    };
};

const mapDispatchToProps = () => {
    return {
        // setDate: year => dispatch(changeCalendarDate(year)) // [1]
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RcrCalendarApp);
