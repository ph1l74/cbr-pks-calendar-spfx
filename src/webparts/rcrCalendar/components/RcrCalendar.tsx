import "@pnp/polyfill-ie11";
import "@babel/polyfill";
import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import reducers, { filterEventInit } from '../Reducers';
import RcrCalendarApp from "./RcrCalendarApp";
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { getCategories } from "../Actions";
import { initEvents } from "../Actions";

const initState =
{
  user:
  {
    name: null,
    id: null
  },
  rooms: [],
  events: [],
  activeGame:
  {
    room: null,
    conStatus: null
  }
}

const middleware = [thunk, createLogger({ collapsed: true })];

export const store = createStore(reducers, applyMiddleware(...middleware));
// const store = createStore(rootReducer, initState)
  // + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )

store.dispatch(getCategories());
store.dispatch(initEvents());

export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {
  public render(): React.ReactElement<IRcrCalendarProps> {
    return (
      <Provider store={store}>
        <div className={styles.rcrCalendar}>
          <div className={styles.header}>{escape(this.props.title)}</div>
          <RcrCalendarApp events={[]}/>
        </div>
      </Provider>
    );
  }
}
