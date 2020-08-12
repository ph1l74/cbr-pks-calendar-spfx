import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import Dashboard from './Dashboard';
import Content from './Content';
import { Calendar } from './Calendar';
import EventCard from './EventCard';
import GroupingEvent from '../Models/GroupingEvent';
import Event from '../Models/Event';
import { sp } from '@pnp/sp/presets/all';
import pnp from 'sp-pnp-js';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import '@pnp/sp/sites';
import { IContextInfo } from '@pnp/sp/sites';
import { connect } from 'react-redux'
import { changeCalendarDate, infinityLoadEvents } from '../Actions';
import Categories from './Categories';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import * as $ from 'jquery';
import EditFormCard from './EditFormCard';
import Category from '../Models/Category';
import FilterEvent from '../utils/IFilterEvent';
import { Spin, Modal, Button, Tooltip } from 'antd';
import * as moment from 'moment';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import { closeEventComments } from '../Actions/comment';
import Feedback from './Feedback';
import { editEvent } from '../Actions';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
registerLocale('ru', ru);

const EditIcon = props => <EditOutlined {...props} />
const AddIcon = props => <PlusCircleOutlined {...props} />

const RcrCalendarApp = (events: GroupingEvent[], filterEvent: FilterEvent, setDateChange: (date: Date) => void) => {
    const editMode = useSelector(state => state.root.editMode);
    const editingEvent: Event = useSelector(state => state.event.editingEvent as Event);
    const selectedEventForComments: Event = useSelector(state => state.comment.selectedEvent as Event);
    const eventsCount = useSelector(state => state.event.events.length === 0 ? 0 : (state.event.events as GroupingEvent[])
        .map(evg => evg.Value).reduce((a, b) => a ? a.concat(b) : []).length);
    const currentFilter = useSelector(state => state.event.filterEvent);
    const isFetching = useSelector(state => state.event.isFetching);
    const isCommentFetching = useSelector(state => state.comment.isFetching as boolean);

    const dispatch = useDispatch();

    const contentElement = (window.location.port === '4321') ? $('div[class*=content_]') : $('div[class*=scrollRegion]');
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
            console.log('Infinity load', currentFilter, eventsCount);
            dispatch(infinityLoadEvents(eventsCount, currentFilter));
        }
    }));

    //const [events, setEvents] = React.useState([]);

    // const filterSelectedDay = async (selectedDay: Date) => {
    //     // sp.setup({
    //     //     sp: {
    //     //         baseUrl: 'http://sp2019/',
    //     //         headers: {
    //     //             Accept: 'application/json;odata=verbose'
    //     //         }
    //     //     }
    //     // });
    //     // sp.setup({
    //     //     spfxContext: this.context
    //     // });

    //     // console.log('payload', sp);
    //     // console.log('fetch', pnp.sp.web.currentUser);
    //     let web = pnp.sp.site.rootWeb;
    //     console.log(web.toUrlAndQuery());
    //     try {
    //         const oContext: IContextInfo = await sp.site.getContextInfo();
    //         const siteUrl = oContext.SiteFullUrl;
    //         console.log(siteUrl);
    //         pnp.setup({ sp: { baseUrl: siteUrl } });
    //         let curruser = await pnp.sp.utility.getCurrentUserEmailAddresses();
    //         console.log(curruser);
    //         // let curProp = await pnp.sp.profiles.myProperties.get();
    //         // console.log(curProp);
    //         //let curruser = await sp.web.currentUser.get();
    //         //console.log(curruser.Email, curruser.Id, curruser.LoginName, curruser.Title, curruser.UserId, curruser.UserPrincipalName);

    //         web.currentUser.get().then(res => console.log(res)).catch(err => console.log(err));
    //     }
    //     catch (ex) {
    //         console.log(ex);
    //     }
    // }

    const renderEvents = (events: any) => {
        console.log('New render events', events);
        moment.locale('ru');
        if (!events.events || events.events.length === 0) {
            return <div>Нет данных</div>
        }
        return events.events.map(evg => {
            const evGr = evg as GroupingEvent;
            let gr = moment(evg.Key, 'YYYY-MM-DD');
            // console.log(evGr.Value);

            return <div key={`groupingEvent_${evGr.Key}`} className={styles['month-header']}>{gr.format('MMMM')}
                {(evGr.Value).map(ev => <EventCard eventCard={ev as Event} key={`eventCard_${ev.id}_${evg.Key}`}></EventCard>)}
            </div>
            // return (evGr.Value).map(ev => <EventCard eventCard={ev} key={`eventCard_${ev.id}_${evGr.Key}`}></EventCard>);
        });
    }

    function newEditForm(): void {
        const newRecord = new Event();
        newRecord.id = 0;
        newRecord.startDate = (moment(new Date()).hour(0).minute(0).second(0).millisecond(0)).toDate();
        newRecord.endDate = (moment(new Date()).add(1, 'd').hour(0).minute(0).second(0).millisecond(0)).toDate();
        newRecord.links = [];
        newRecord.materials = [];
        newRecord.actors = [];
        if (window.location.port === '4321') {
            // newRecord.author = selectedEventForComments.author;
        }
        dispatch(editEvent(newRecord));
    }

    const initCategories: Category[] = [];
    return (
        // editMode && editMode === 1 ?
        editingEvent ?
            <EditFormCard ></EditFormCard>
            : (selectedEventForComments) ?
            <Feedback/>
            :
            (
                <div className={styles.app}>
                    <Spin tip='Загрузка данных...' spinning={isFetching} delay={500}>
                        <Content filterEvent={filterEvent} >
                            {renderEvents(events)}
                        </Content>
                        <Dashboard>
                            <div className={styles["new-button"]} >
                                <Tooltip title="Новое событие">
                                    <Button type='link' style={{ color: 'cadetblue', marginLeft: '10px' }} icon={<AddIcon />}
                                        onClick={newEditForm} />
                                </Tooltip>
                            </div>
                            <Calendar ></Calendar>
                            <Categories categories={initCategories} />
                        </Dashboard>
                    </Spin>
                </div>
            )
    );
}


const mapStateToProps = (store: any) => {
    console.log(store.event);
    return {
        events: store.event.events,
        filterEvent: store.event.filterEvent
    };
}

const mapDispatchToProps = dispatch => {
    return {
        // setDate: year => dispatch(changeCalendarDate(year)) // [1]
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RcrCalendarApp)
