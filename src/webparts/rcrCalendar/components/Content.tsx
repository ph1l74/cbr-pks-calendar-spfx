import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IContentProps } from './IContentProps';
// import * from '@types/jquery'

export default class Content extends React.Component<IContentProps, {}> {
  constructor(props) {
    super(props);

  }
  
  public render(): React.ReactElement<IContentProps> {
    return (
      <div className={styles.content} >
        <div className={styles.month} >
          {this.props.children}
        </div>
      </div >
    );
  }
  
}