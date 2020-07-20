import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import Dashboard from './Dashboard';
import Content from './Content';
import Calendar from './Calendar';
import EventCard from './EventCard';
import { EventService } from '../services/Services';
import GroupingEvent from '../Models/GroupingEvent';


const RcrCalendarApp = () => {

    const [events, setEvents] = React.useState([]);
    const filterSelectedDay = (selectedDay: Date) => {
        console.log('fetch');
        EventService.searchGet(`/?startDate=${selectedDay.getDate()}.0${selectedDay.getMonth()}.${selectedDay.getFullYear()}`)
            .then(evts => setEvents(evts))
            .catch(err => console.log(err));
        /*console.log(events);
        events.map((ob) => (
            console.log(ob.key)
          )
        );*/
    }

    filterSelectedDay(new Date());

    const renderEvents = () => {
        console.log('render events', events);
        return events.map(evg => {
            const evGr = evg as GroupingEvent;
            console.log(evGr.Value);
            return (evGr.Value).map(ev => <EventCard eventCard={ev}></EventCard>);
        });
    }

    return (
        <div className={styles.app}>
            <Content>
                {renderEvents()}
                {/* <EventCard></EventCard>
                <EventCard></EventCard>
                <EventCard></EventCard> */}
            </Content>
            <Dashboard>
                <Calendar></Calendar>
            </Dashboard>
        </div>
    );
}



export default RcrCalendarApp;