import { EventService, CategoryService } from "../services/Services"
import * as moment from "moment";
import * as types from '../constants';
import FilterEvent from "../utils/IFilterEvent";
import { filterEventInit } from "../Reducers";


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

export const changeCalendarDate = (dateStart: Date, filterEvent: FilterEvent) => {
  return dispatch => {
    dispatch({
      type: types.CHANGE_DATE,
      payload: dateStart
    });
    filterEvent.selectedDate = dateStart;

    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
  }
}

export const changeCalendarDateSuccess = events => ({
  type: types.CHANGE_DATE_SUCCESS,
  events
})

export const changeSelectedCategory = (categoryId: number, filterEvent: FilterEvent) => {
  let categories = filterEvent.selectedCategories;
  if (categories.indexOf(categoryId) >= 0) {
    categories = categories.filter(ob => ob !== categoryId);
  }
  else {
    categories.push(categoryId);
  }
  filterEvent.selectedCategories = categories;
  return dispatch => {
    dispatch({
      type: types.CHANGE_FILTER_EVENT,
      payload: filterEvent
    })

    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
  }
}

export const initEvents = (): any => {
  return async dispatch => {
    console.log('init events');
    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEventInit, dispatch);
  }
}

export const infinityLoadEvents = (skip: number, filterEvent: any) => {
  return dispatch => {
    console.log('infinity load events', skip, filterEvent as FilterEvent);
    dispatch({
      type: types.CHANGE_FILTER_EVENT,
      payload: filterEvent
    });

    filterEvents(types.INFINITY_LOAD_EVENT_SUCCESS, filterEvent, dispatch, skip);
  }
}

function filterEvents(typeAction: string, filterEvent: FilterEvent, dispatch: any, skip?: number) {
  let date = moment(filterEvent.selectedDate);
  const day = date.date() > 9 ? date.date() : '0' + date.date();
  const months = date.months() + 1;
  const month = months > 9 ? months : '0' + months;
  const filterCategories = filterEvent.selectedCategories.length > 0 ? `&categories=${filterEvent.selectedCategories.join(',')}` : '';
  const skipRequest = skip ? `&skip=${skip}` : '';
  EventService.searchGet(`/?startDate=${day}.${month}.${date.years()}${filterCategories}${skipRequest}`)
    .then(ob => {
      console.log('fetch', ob);
      dispatch({
        type: typeAction,
        payload: ob,
      });
    })
    .catch(err => console.log(err));
}

export const getCategories = (): any => {
  return async dispatch => {
    dispatch({
      type: types.GET_CATEGORIES,
    });
    CategoryService.findAll()
      .then(ob => {
        console.log('fetch categories', ob);
        dispatch({
          type: types.GET_CATEGORIES_SUCCESS,
          payload: ob,
        });
      })
      .catch(err => console.log(err));
  }
}

export const getCategoriesSuccess = categories => ({
  type: types.GET_CATEGORIES_SUCCESS,
  payload: categories
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export const EventFilters = {
  SHOW_ALL: 'SHOW_ALL'
}

export const setEditMode = (value) => {
  return {
    type: types.SET_EDIT_MODE,
    value
  }
}
