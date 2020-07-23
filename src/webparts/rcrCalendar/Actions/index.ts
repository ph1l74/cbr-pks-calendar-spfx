import { EventService } from "../services/Services"
import * as moment from "moment";


let nextTodoId = 0
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
})
export const changeCalendarDate = (dateStart: Date) => {
  return dispatch => {
    dispatch({
      type: 'CHANGE_DATE',
      payload: dateStart
    })

    let date = moment(dateStart); 
    const day = date.date() > 9 ? date.date() : '0' + date.date();
    const months = date.months() + 1;
    const month = months > 9 ? months : '0' + months;
    EventService.searchGet(`/?startDate=${day}.${month}.${date.years()}`)
      .then(ob => {
        console.log('fetch', ob);
        dispatch({
          type: 'CHANGE_DATE_SUCCESS',
          payload: ob,
        });
      })
      .catch(err => console.log(err));
  }

  // return {
  //   type: 'CHANGE_DATE',
  //   payload: date
  // };
  // экшен с типом REQUEST (запрос начался)
  // диспатчится сразу, как будто-бы перед реальным запросом

  // // а экшен внутри setTimeout
  // // диспатчится через секунду
  // // как будто-бы в это время
  // // наши данные загружались из сети
  // const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
  // const month = date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth();
  // EventService.searchGet(`/?startDate=${day}.${month}.${date.getFullYear()}`)
  //   .then(ob =>{
  //     console.log('fetch', ob);
  //     dispatch({
  //       type: 'CHANGE_DATE_SUCCESS',
  //       payload: ob,
  //     });
  //   })
  //   .catch(err => console.log(err));

  // setTimeout(() => {
  //   dispatch({
  //     type: 'CHANGE_DATE_SUCCESS',
  //     payload: [1, 2, 3, 4, 5],
  //   })
  // }, 1000)
}

export const changeCalendarDateSuccess = events => ({
  type: 'CHANGE_DATE_SUCCESS',
  events
})
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const EventFilters = {
  SHOW_ALL: 'SHOW_ALL'
}