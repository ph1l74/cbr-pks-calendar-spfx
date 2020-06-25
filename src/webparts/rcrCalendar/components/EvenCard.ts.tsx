import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';

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
            </div>
          </div>
        </div>
      </div >
    );
  }
}
