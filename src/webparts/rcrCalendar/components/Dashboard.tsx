import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IDashboardProps } from './IDashboardProps';

export default class Dashboard extends React.Component<IDashboardProps, {}> {
  public render(): React.ReactElement<IDashboardProps> {
    return (
      <div className={styles.dashboard} >
        {this.props.children}
      </div >
    );
  }
}
