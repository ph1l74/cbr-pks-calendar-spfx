import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Dashboard from './Dashboard';
import Content from './Content';
import EventCard from './EvenCard.ts';

export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {  
  public render(): React.ReactElement<IRcrCalendarProps> {
    return (
      <div className={styles.rcrCalendar} >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>{escape(this.props.description)}</span>
            </div>
            <div className={styles.row}>
              <div className={styles.column}>
                <Content>
                  <EventCard></EventCard>
                  <EventCard></EventCard>
                  <EventCard></EventCard>
                </Content>
                <Dashboard></Dashboard>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
