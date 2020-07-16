import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import Dashboard from './Dashboard';
import Content from './Content';
import Calendar from './Calendar';
import EventCard from './EventCard';


const RcrCalendarApp = () => {

    return (
        <div className={styles.app}>
            <Content>
                <EventCard></EventCard>
                <EventCard></EventCard>
                <EventCard></EventCard>
            </Content>
            <Dashboard>
                <Calendar></Calendar>
            </Dashboard>
        </div>
    );
}



export default RcrCalendarApp;