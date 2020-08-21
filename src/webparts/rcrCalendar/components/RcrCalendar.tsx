import '@pnp/polyfill-ie11';
import '@babel/polyfill';
import * as React from 'react';
import styles from './RcrCalendar.module.scss';
import { IRcrCalendarProps } from './IRcrCalendarProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../Reducers';
import RcrCalendarApp from './RcrCalendarApp';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { getCategories, getUsers, setAuth } from '../Actions';
import { initEvents } from '../Actions';
import Service from '../services/Service';

const middleware = [thunk, createLogger({ collapsed: true })];

export const store = createStore(reducers, applyMiddleware(...middleware));
// const store = createStore(rootReducer, initState)
  // + window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )

store.dispatch(setAuth());
// store.dispatch(getCategories());
// // store.dispatch(getUsers());
// store.dispatch(initEvents());

export default class RcrCalendar extends React.Component<IRcrCalendarProps, {}> {
  public render(): React.ReactElement<IRcrCalendarProps> {
    Service.urlApi = this.props.urlApi;
    return (
      <Provider store={store} onScroll={this.handleScroll}>
        <div className={styles.rcrCalendar} >
          <div className={styles.header}>{escape(this.props.title)}</div>
          <RcrCalendarApp events={[]}/>
        </div>
      </Provider>
    );
  }

  public handleScroll = (e: React.UIEvent<HTMLElement>): void => {
    console.log('infinite scroll');
    e.stopPropagation(); // Handy if you want to prevent event bubbling to scrollable parent
    console.log({
        event: e,
        target: e.target, // Note 1* scrollTop is undefined on e.target
        currentTarget: e.currentTarget,
        scrollTop: e.currentTarget.scrollTop,
    });

    const { scrollTop } = e.currentTarget;
    console.log(scrollTop);
  }
}
