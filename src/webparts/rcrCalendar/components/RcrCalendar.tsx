import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import Dashboard from './Dashboard';
import Content from './Content';
import Calendar from './Calendar';
import EventCard from './EventCard';
import "@pnp/polyfill-ie11";
//import EditForm from './EditForm';
import CommentEditForm from './CommentEditForm';
import { UserService, EventService } from '../services/Services';
import { GroupContext } from 'antd/lib/checkbox/Group';
import GroupingEvent from '../Models/GroupingEvent';
import Event from '../Models/Event';

export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {
  state = {
    events: []
  }

  filterSelectedDay = (selectedDay: Date) => {
    console.log('fetch');
    EventService.searchGet(`/?startDate=${selectedDay.getDate()}.0${selectedDay.getMonth()}.${selectedDay.getFullYear()}`)
      .then(events => this.setState({ events }))
      .catch(err => console.log(err));
    /*console.log(events);
    events.map((ob) => (
        console.log(ob.key)
      )
    );*/
  }

  componentDidMount() {
    this.filterSelectedDay(new Date());
  }

  renderEvents = () => {
    console.log('render events', this.state.events);
    let events = this.state.events as GroupingEvent[];
    return events.map(evg => {
      console.log(evg.Value);
      return (evg.Value).map(ev => <EventCard eventCard={ev}></EventCard>);
    });
  }

  public render(): React.ReactElement<IRcrCalendarProps> {
    return (
      <div className={styles.rcrCalendar}>
        <div className={styles.header}>{escape(this.props.title)}</div>
        <div className={styles.app}>
          <Content>
            {this.renderEvents()}
          </Content>
          <Dashboard>
            <Calendar></Calendar>
          </Dashboard>
        </div>
      </div>
    );
  }
}
