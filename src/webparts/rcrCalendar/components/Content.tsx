import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IContentProps } from './IContentProps';

export default class Content extends React.Component<IContentProps, {}> {
  public render(): React.ReactElement<IContentProps> {
    return (
      <div className={styles.content} >
        <div className={styles.month} >
          <div className={styles["month-header"]}>Октябрь</div>
          {this.props.children}
        </div>
      </div >
    );
  }
}
