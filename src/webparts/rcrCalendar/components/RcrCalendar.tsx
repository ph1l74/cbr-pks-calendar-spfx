import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Dashboard from './Dashboard';
import Content from './Content';
import EventCard from './EventCard';

export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {
  public render(): React.ReactElement<IRcrCalendarProps> {
    return (
      <div className={styles.rcrCalendar}>
        <div className={styles.header}>{escape(this.props.description)}</div>
        <div className={styles.app}>
          <Content>
            <EventCard></EventCard>
            <EventCard></EventCard>
            <EventCard></EventCard>
          </Content>
          <Dashboard></Dashboard>
        </div>
      </div>
    );
  }
}
