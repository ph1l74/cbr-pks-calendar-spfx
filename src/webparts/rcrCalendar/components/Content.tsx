import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IContentProps } from './IContentProps';

export default class Content extends React.Component<IContentProps, {}> {
  public render(): React.ReactElement<IContentProps> {
    return (
      <div className={styles.content} >
        {this.props.children}
      </div >
    );
  }
}
