import "@pnp/polyfill-ie11";
import "@babel/polyfill";
import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Provider } from "react-redux";
import { createStore } from 'redux';
import rootReducer from '../Reducers';
import RcrCalendarApp from "./RcrCalendarApp";

const initState =
{
  user:
  {
    name: null,
    id: null
  },
  rooms: [],
  activeGame:
  {
    room: null,
    conStatus: null
  }
}

const store = createStore(rootReducer, initState
  // + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)


export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {
  public render(): React.ReactElement<IRcrCalendarProps> {
    return (
      <Provider store={store}>
        <div className={styles.rcrCalendar}>
          <div className={styles.header}>{escape(this.props.title)}</div>
          <RcrCalendarApp />
        </div>
      </Provider>
    );
  }
}
