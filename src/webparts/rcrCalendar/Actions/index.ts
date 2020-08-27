import { sp } from '@pnp/sp/presets/all';
import { IContextInfo } from '@pnp/sp/sites';
import { message } from 'antd';
import * as moment from 'moment';
import pnp, { Logger, PermissionKind } from 'sp-pnp-js';
import * as types from '../constants';
import Event from '../Models/Event';
import { filterEventInit } from '../Reducers';
import { ActorService, CategoryService, EventService, GroupingEventService, MaterialService, UserService, CalendarService } from '../services/Services';
import FilterEvent from '../utils/IFilterEvent';


let nextTodoId = 0;
export const addTodo = text => ({
  type: 'ADD_TODO',
  id: nextTodoId++,
  text
});

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

export const toggleTodo = id => ({
  type: 'TOGGLE_TODO',
  id
});

export const setError = (error: string) => ({
  type: types.SET_ERROR,
  error: error
});

export const setAuth = (): any => {
  return async dispatch => {
    if (window.location.port === '4321') {
      dispatch({
        // type: 'SET_AUTH',
        type: types.SET_USERNAME,
        userName: 'workbench'
      });
      dispatch({
        type: types.SET_IS_EDITOR,
        permission: true
      });
      dispatch({
        type: types.SET_IS_VIEWER,
        permission: true
      });
      dispatch(getCategories());
      dispatch(getUsers()); // Только для workbench
      dispatch(initEvents());
    }
    else {
      // sp.setup({
      //     sp: {
      //         baseUrl: 'http://sp2019/',
      //         headers: {
      //             Accept: 'application/json;odata=verbose'
      //         }
      //     }
      // });
      // sp.setup({
      //     spfxContext: this.context
      // });

      // console.log('payload', sp);
      // console.log('fetch', pnp.sp.web.currentUser);
      const web = pnp.sp.site.rootWeb;
      console.log('webSPUrl', web.toUrlAndQuery());
      let currentUserName = '';
      try {
        sp.site.getContextInfo().then(ob => {
          const oContext: IContextInfo = ob;
          const siteUrl = oContext.SiteFullUrl;
          console.log(siteUrl);
          pnp.setup({ sp: { baseUrl: siteUrl } });
          pnp.sp.utility.getCurrentUserEmailAddresses().then(ob => {
            const curruser = ob;
            console.log(curruser);
            // let curProp = await pnp.sp.profiles.myProperties.get();
            // console.log(curProp);
            //let curruser = await sp.web.currentUser.get();
            //console.log(curruser.Email, curruser.Id, curruser.LoginName, curruser.Title, curruser.UserId, curruser.UserPrincipalName);

            web.currentUser.get()
              .then(res => {
                console.log(res);
                currentUserName = res.LoginName as string;
                // const loginInfo = currentUserName.split('\\');
                // setUser(dispatch, loginInfo[loginInfo.length - 1], res.UserId?.NameId);
                setUser(dispatch, currentUserName, res.UserId?.NameId);
                if (res.UserId?.NameId) {
                  const userInfo = currentUserName.split('|');
                  dispatch({
                    type: types.GET_CURRENT_USER
                  });
                  UserService.searchParam('/' + (userInfo[userInfo.length - 1] as string).replace('\\', '_5C')).then(res => {
                    console.log('curUser', res, '/' + (userInfo[userInfo.length - 1] as string).replace('\\', '_5C'));
                    dispatch({
                      type: types.GET_CURRENT_USER_SUCCESS,
                      user: res
                    });
                  })
                  .catch(err => {
                    dispatch({
                      type: types.GET_CURRENT_USER_SUCCESS,
                      user: undefined
                    });
                  });
                }
                // tslint:disable-next-line: no-shadowed-variable
                web.getCurrentUserEffectivePermissions().then(ob => {
                  console.log('my perm', ob);
                  Logger.writeJSON(ob);
                }).catch(err => console.log(err));
                web.currentUserHasPermissions(PermissionKind.EditListItems).then(res => {
                  console.log('edit list', res);
                  dispatch({
                    type: types.SET_IS_EDITOR,
                    permission: res === true
                  });
                  dispatch(getCategories());
                  dispatch(initEvents());
                });
                web.currentUserHasPermissions(PermissionKind.ViewListItems).then(res => {
                  console.log('read list', res);
                  dispatch({
                    type: types.SET_IS_VIEWER,
                    permission: res === true
                  });
                });
                web.currentUserHasPermissions(PermissionKind.FullMask).then(res => console.log('full control ', res));
                web.currentUserHasPermissions(PermissionKind.ManageWeb).then(res => console.log('Manage  ', res));
                // web.roleAssignments.get().then(ob => console.log('roleassign', ob)).catch(err => console.log('err', err)); // Не у всех права
                // web.roleDefinitions.get().then(ob => console.log('role def', ob));
                // web.getUserEffectivePermissions(res.LoginName).then(ob => console.log('permission user ', ob));
              })
              .catch(err => {
                console.log(err);
                setUser(dispatch, currentUserName, '');
              });
          })
            .catch(err => {
              console.log(err);
              setUser(dispatch, currentUserName, '');
            });
        })
          .catch(err => {
            console.log(err);
            setUser(dispatch, currentUserName, '');
          });
      }
      catch (ex) {
        console.log(ex);
        setUser(dispatch, currentUserName, '');
      }
    }
  };
};

export const changeCalendarDate = (dateStart: Date, filterEvent: FilterEvent) => {
  return dispatch => {
    dispatch({
      type: types.CHANGE_DATE,
      payload: dateStart,
    });
    filterEvent.selectedDate = dateStart;

    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
  };
};

export const changeCalendarDateSuccess = events => ({
  type: types.CHANGE_DATE_SUCCESS,
  events,
});

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
      payload: filterEvent,
    });

    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
  };
};

export const initEvents = (): any => {
  return async dispatch => {
    console.log('init events');
    filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEventInit, dispatch);
  };
};

export const infinityLoadEvents = (skip: number, filterEvent: any) => {
  return dispatch => {
    console.log('infinity load events', skip, filterEvent as FilterEvent);
    dispatch({
      type: types.CHANGE_FILTER_EVENT,
      payload: filterEvent,
    });

    filterEvents(types.INFINITY_LOAD_EVENT_SUCCESS, filterEvent, dispatch, skip);
  };
};

export const editEvent = (editingEvent: Event) => {
  return dispatch => { //TODO: change to fetching, Event to number
    dispatch({
      type: types.RUN_EDIT_EVENT
    });
    if (editingEvent.id > 0) {
      EventService.getRecordById(editingEvent.id)
        .then(ob => {
          console.log('fetch', ob);
          dispatch({
            type: types.EDIT_EVENT,
            editEvent: ob,
          });
        })
        .catch(err => {
          sendError(err, dispatch, 'загрузке данных');
          dispatch(closeEditEvent());
        });
    }
    else {
      dispatch({
        type: types.EDIT_EVENT,
        editEvent: editingEvent,
      });
    }
  };
};

export const clearEvents = () => ({
  type: types.CLEAR_EVENTS,
});

export const sendError = (err: any, dispatch: any, actionName: string) => {
  console.log(err);
  const resError = err?.response?.data ?? '';
  message.error(`При ${actionName} произошла ошибка. ${resError}`);
  dispatch(setError(err));
};

export const deleteEvent = (record: Event, filterEvent: FilterEvent, isRefresh: boolean) => {
  const eventId = record.id;
  return dispatch => { //TODO: change to fetching, Event to number
    dispatch({
      type: types.DELETE_EVENT,
      editRecord: record,
    });
    EventService.remove(record.id)
      .then(ob => {
        console.log('delete', ob);
        dispatch({
          type: types.DELETE_EVENT_SUCCESS,
          deleteId: eventId,
        });
        if (isRefresh) {
          dispatch(clearEvents());
          filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
        }
      })
      .catch(err => {
        sendError(err, dispatch, 'удалении');
        dispatch(closeEditEvent());
      });
  };
};

export const closeEditEvent = () => ({
  type: types.CLOSE_EDIT_EVENT,
});

export const saveEditEvent = (event: Event, filterEvent: FilterEvent) => {
  return dispatch => { //TODO: change to fetching, Event to number
    dispatch({
      type: types.SAVE_EDIT_EVENT,
    });
    const saveFunc = (!event.id || event.id <= 0) ? EventService.add(event) : EventService.update(event, event.id);
    saveFunc
      .then(ob => {
        console.log('save ', ob);
        dispatch({
          type: types.SAVE_EDIT_EVENT_SUCCESS,
        });
        dispatch(clearEvents());
        filterEvents(types.CHANGE_FILTER_EVENT_SUCCESS, filterEvent, dispatch);
      })
      .catch(err => {
        sendError(err, dispatch, 'сохранении');
        dispatch({
          type: types.SAVE_EDIT_EVENT_SUCCESS,
        });
      });
  };
};

function setUser(dispatch: any, currentUserName: string, currentUserId: string) {
  dispatch({
    // type: 'SET_AUTH',
    type: types.SET_USERNAME,
    userName: currentUserName,
    userId: currentUserId,
  });
}

function filterEvents(typeAction: string, filterEvent: FilterEvent, dispatch: any, skip?: number) {
  const date = moment(filterEvent.selectedDate);
  const day = date.date() > 9 ? date.date() : '0' + date.date();
  const months = date.months() + 1;
  const month = months > 9 ? months : '0' + months;
  const filterCategories = filterEvent.selectedCategories.length > 0 ? `&categories=${filterEvent.selectedCategories.join(',')}` : '';
  const skipRequest = skip ? `&skip=${skip}` : '';
  GroupingEventService.searchGet(`/?startDate=${day}.${month}.${date.years()}${filterCategories}${skipRequest}`)
    .then(ob => {
      console.log('fetch', ob);
      dispatch({
        type: typeAction,
        payload: ob,
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: typeAction,
        payload: [],
      });
    });
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
  };
};

export const getUsers = (): any => {
  return async dispatch => {
    dispatch({
      type: types.GET_USERS,
    });
    UserService.findAll()
      .then(ob => {
        console.log('fetch users', ob);
        dispatch({
          type: types.GET_USERS_SUCCESS,
          payload: ob,
        });
      })
      .catch(err => console.log(err));
  };
};

export const getCalendarDate = (startDate: moment.Moment, endDate: moment.Moment): any => {
  return async dispatch => {
    dispatch({
      type: types.GET_CALENDAR_DATE,
      start: startDate,
      end: endDate,
    });
    CalendarService.searchGet(`/?startDate=${startDate.format('DD.MM.yyyy')}&endDate=${endDate.format('DD.MM.yyyy')}`)
      .then(ob => {
        console.log('fetch calendar dates', ob, startDate, endDate);
        dispatch({
          type: types.GET_CALENDAR_DATE_SUCCESS,
          payload: ob,
        });
      })
      .catch(err => console.log(err));
  };
};

export const searchUsers = (search: string): any => {
  return async dispatch => {
    dispatch({
      type: types.GET_USERS,
    });
    UserService.searchGet(`/?search=${search}`)
      .then(ob => {
        console.log('search users', ob);
        dispatch({
          type: types.GET_USERS_SUCCESS,
          payload: ob,
        });
      })
      .catch(err => console.log(err));
  };
};

export const getCategoriesSuccess = categories => ({
  type: types.GET_CATEGORIES_SUCCESS,
  payload: categories
});

export const getParticipantsByEvent = (event: Event) => {
  return dispatch => {
    dispatch({
      type: types.GET_EVENT_PARTICIPANTS,
      payload: event,
    });
    getEventParticipants(types.GET_EVENT_PARTICIPANTS_SUCCESS, event, dispatch);
  };
};

export const infinityLoadEventParticipants = (skip: number, event: Event) => {
  return dispatch => {
    console.log('infinity load ', skip, event);
    dispatch({
      type: types.GET_EVENT_PARTICIPANTS,
      payload: event,
    });

    getEventParticipants(types.INFINITY_LOAD_EVENT_PARTICIPANTS_SUCCESS, event, dispatch, skip);
  };
};

function getEventParticipants(typeAction: string, event: Event, dispatch: any, skip?: number) {
  const skipRequest = skip ? `&skip=${skip}` : '';
  const take = 10;
  const takeRequest = `&take=${take}`;
  ActorService.searchGet(`/?eventId=${event.id}${takeRequest}${skipRequest}`)
    .then(ob => {
      console.log('fetch', ob);
      dispatch({
        type: typeAction,
        payload: ob,
        isFetchingFull: ob.length < take,
      });
    })
    .catch(err => {
      sendError(err, dispatch, 'загрузке данных');
      dispatch({
        type: types.CLOSE_EVENT_PARTICIPANTS,
      });
    });
}

export const getMaterialsByEvent = (event: Event) => {
  return dispatch => {
    dispatch({
      type: types.GET_EVENT_MATERIALS,
      payload: event,
    });
    getEventMaterials(types.GET_EVENT_MATERIALS_SUCCESS, event, dispatch);
  };
};

export const infinityLoadEventMaterials = (skip: number, event: Event) => {
  return dispatch => {
    console.log('infinity load ', skip, event);
    dispatch({
      type: types.GET_EVENT_MATERIALS,
      payload: event,
    });

    getEventMaterials(types.INFINITY_LOAD_EVENT_MATERIALS_SUCCESS, event, dispatch, skip);
  };
};

function getEventMaterials(typeAction: string, event: Event, dispatch: any, skip?: number) {
  const skipRequest = skip ? `&skip=${skip}` : '';
  const take = 30;
  const takeRequest = `&take=${take}`;
  MaterialService.searchGet(`/?eventId=${event.id}${takeRequest}${skipRequest}`)
    .then(ob => {
      console.log('fetch', ob);
      dispatch({
        type: typeAction,
        payload: ob,
        isFetchingFull: ob.length < take,
      });
    })
    .catch(err => {
      sendError(err, dispatch, 'загрузке данных');
      dispatch({
        type: types.CLOSE_EVENT_MATERIALS,
      });
    });
}

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

export const EventFilters = {
  SHOW_ALL: 'SHOW_ALL',
};

export const setEditMode = (value) => {
  return {
    type: types.SET_EDIT_MODE,
    value,
  };
};
