import * as types from '../constants';
import Event from '../Models/Event';
import { combineReducers } from 'redux'
import { EventService } from '../services/Services';
import GroupingEvent from '../Models/GroupingEvent';
import FilterEvent from '../utils/IFilterEvent'
import Comment from '../Models/Comment';
import Material from '../Models/Material';
import Actor from '../Models/Actor';
import Category from '../Models/Category';
import User from '../Models/User';
import Service from '../../../../lib/webparts/rcrCalendar/services/Service';

interface IRootStore {
    categories: Category[];
    users: User[];
    editMode: any;
    isFetchingCategories: boolean;
    currentUser: User;
    userName: string;
    userId: string;
    isEditor: boolean;
    isViewer: boolean;
}

const initState: IRootStore =
{
    // events: [],
    // user:
    // {
    //     name: null,
    //     id: null
    // },
    // rooms: [],
    // activeGame:
    // {
    //     room: null,
    //     conStatus: null
    // },
    editMode: null,
    categories: [],
    users: [],
    isFetchingCategories: false,
    currentUser: undefined,
    userName: '',
    userId: '',
    isEditor: false,
    isViewer: false,
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        // case types.SET_USERNAME:
        //     return { ...state, user: { ...state.user, name: action.value } }
        // case types.SET_USERID:
        //     return { ...state, user: { ...state.user, id: action.value } }
        // case types.SET_ROOMS:
        //     return { ...state, rooms: action.value }
        // case types.ADD_ROOM:
        //     return { ...state, rooms: [...state.rooms, action.value] }
        // case types.JOIN_ROOM:
        //     return { ...state, activeGame: { ...state.activeGame, room: action.value } }
        // case types.EXIT_ROOM:
        //     return { ...state, activeGame: { room: null, conStatus: null } }
        // case types.SET_CON_STATUS:
        //     return { ...state, activeGame: { ...state.activeGame, conStatus: action.value } }
        // new reducers start here:
        case types.SET_EDIT_MODE:
            console.log('showing editForm');
            return { ...state, editMode: action.value }

        case types.SET_USERNAME:
            {
                const userName = action.userName;
                const userId = action.userId;
                let curUser = getUserByName(state.users, userName, state.currentUser);
                Service.userName = userName;
                Service.userId = userId;
                return { ...state, userName: userName, userId: userId, currentUser: curUser }
            }
        case types.SET_IS_EDITOR:
            {
                return { ...state, isEditor: action.permission }
            }
        case types.SET_IS_VIEWER:
            {
                return { ...state, isViewer: action.permission }
            }

        case types.GET_CATEGORIES:
            return { ...state, isFetchingCategories: true }
        case types.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload, isFetchingCategories: false }

        case types.GET_USERS:
            return { ...state, isFetchingCategories: true }
        case types.GET_USERS_SUCCESS:
            {
                let curUser = getUserByName(action.payload, state.userName, state.currentUser);
                return { ...state, users: action.payload, currentUser: curUser, isFetchingCategories: false }
            }

        default:
            return state
    }
}

interface IEventStore {
    events: GroupingEvent[];
    isFetching: boolean;
    filterEvent: FilterEvent,
    editingEvent: Event,
    wasEditComment: boolean,
}

export const filterEventInit: FilterEvent = { selectedCategories: [], selectedDate: new Date() }
const eventInit: IEventStore = {
    events: [],
    isFetching: false,
    filterEvent: filterEventInit,
    editingEvent: undefined,
    wasEditComment: false,
}

const eventReducer = (state = eventInit, action) => {
    switch (action.type) {
        // case 'ADD_EVENT':
        //     return [
        //         ...state.events,
        //         {
        //             id: action.id,
        //             text: action.text,
        //             completed: false
        //         }
        //     ]
        // case 'FIND_EVENT':
        //     let findObjs = state.events.filter(ob => ob.id === action.id);
        //     return findObjs.length > 0 ? findObjs[0] : null;

        case types.DELETE_EVENT:
            return { ...state, isFetching: true }
        case types.DELETE_EVENT_SUCCESS:
            {
                let newEvents = state.events;
                newEvents.forEach(eg => {
                    eg.Value = eg.Value.filter(ob => ob.id !== action.deleteId);
                });
                return { ...state, events: newEvents, isFetching: false }
            }
        case types.CHANGE_DATE:
            state.filterEvent.selectedDate = action.payload;
            return { ...state, date: action.payload, isFetching: true }

        case types.CHANGE_DATE_SUCCESS:
            return { ...state, events: action.payload, isFetching: false, wasEditComment: false }

        case types.CHANGE_FILTER_EVENT:
            return { ...state, filterEvent: action.payload, isFetching: true }

        case types.CHANGE_FILTER_EVENT_SUCCESS:
            return { ...state, events: action.payload, isFetching: false, wasEditComment: false }

        case types.CHANGE_CATEGORY:
            let selectCategories = state.filterEvent.selectedCategories;
            if (selectCategories.indexOf(action.payload) >= 0) {
                selectCategories = selectCategories.filter(ob => ob !== action.payload);
            }
            else {
                selectCategories.push(action.payload);
            }
            state.filterEvent.selectedCategories = selectCategories;
            return { ...state, date: action.payload, isFetching: true, wasEditComment: false }
        case types.INFINITY_LOAD_EVENT_SUCCESS:
            const newEvents = infinityLoadEvents(action.payload as GroupingEvent[], state.events);
            console.log('newEvents', newEvents, action.payload as GroupingEvent[]);
            return { ...state, events: newEvents, isFetching: false }

        case types.CLEAR_EVENTS:
            return { ...state, events: [] }
        case types.RUN_EDIT_EVENT:
            return { ...state, isFetching: true }
        case types.EDIT_EVENT:
            const editEvent = (action.editEvent as Event);
            editEvent.startDate = new Date(editEvent.startDate.toString());
            editEvent.endDate = new Date(editEvent.endDate.toString());
            return { ...state, editingEvent: editEvent, isFetching: false }

        case types.SAVE_EDIT_EVENT:
            return { ...state, editingEvent: undefined, isFetching: true }
        case types.SAVE_EDIT_EVENT_SUCCESS:
            return { ...state, editingEvent: undefined, isFetching: false }
        case types.SET_EVENT_COUNT_COMMENT:
            const newRecords = state.events;
            newRecords.map(ob => ob.Value).reduce((a, b) => a.concat(b)).filter(ob => ob.id === action.eventId)
                .forEach(ob => ob.feedbacksCount = ob.feedbacksCount + action.addingCount);
            state.events = [];
            return { ...state, events: newRecords, wasEditComment: true }

        case types.CLOSE_EDIT_EVENT:
            return { ...state, editingEvent: undefined }

        default:
            return state
    }
}

const infinityLoadEvents = (events: GroupingEvent[], currentEvents: GroupingEvent[]): GroupingEvent[] => {
    if (events && currentEvents) {
        events.forEach(ob => {
            const findKey = currentEvents.filter(cur => cur.Key === ob.Key); // Todo: можно переделать на reduce
            if (findKey.length > 0) { // Если запись была найдена ранее, мы включаем в нее новые
                findKey[0].Value.push(...ob.Value.filter(el => findKey[0].Value.filter(fel => fel.id === el.id).length === 0));
                // let evs = findKey[0].Value;
                // evs.reduce((a, b) => { a.id === b. id ? a : b});
            }
            else { // Иначе добавляем сгруппированную запись
                currentEvents.push(ob);
            }
        });
        return currentEvents;
    }
    return [];
}

interface ICommentStore {
    comments: Comment[],
    selectedEvent: Event,
    isFetching: boolean,
    editingComment: Comment,
}
const commentInit: ICommentStore = {
    comments: [],
    selectedEvent: undefined,
    isFetching: false,
    editingComment: undefined,
}
const commentReducer = (state = commentInit, action) => {
    switch (action.type) {
        case types.GET_EVENT_COMMENTS:
            return { ...state, selectedEvent: action.payload, isFetching: true }
        case types.GET_EVENT_COMMENTS_SUCCESS:
            return { ...state, comments: action.payload, isFetching: false }
        case types.CLOSE_EVENT_COMMENTS:
            return { ...state, comments: [], selectedEvent: undefined, isFetching: false }
        case types.INFINITY_LOAD_EVENT_COMMENTS_SUCCESS:
            console.log('newComments', state.comments, action.payload as Comment[]);
            return { ...state, comments: state.comments.concat(action.payload as Comment[]), isFetching: false }
        case types.RUN_EDIT_COMMENT:
            return { ...state, isFetching: true }
        case types.EDIT_COMMENT:
            return { ...state, editingComment: action.editRecord, isFetching: false }
        case types.SAVE_EDIT_COMMENT:
            return { ...state, isFetching: true }
        case types.CLOSE_EDIT_COMMENT:
            return { ...state, editingComment: undefined, isFetching: false }
        case types.SAVE_EDIT_COMMENT_SUCCESS:
            return { ...state, editingComment: undefined, isFetching: false }
        case types.DELETE_COMMENT:
            return { ...state, comments: state.comments.filter(ob => ob.id !== action.editRecord.id), isFetching: true }
        case types.DELETE_COMMENT_SUCCESS:
            return { ...state, isFetching: false }

        default:
            return state;
    }
}

interface IViewEventStore {
    materials: Material[],
    actors: Actor[],
    selectedEvent: Event,
    isFetching: boolean,
    isFetchingFull: boolean,
}
const viewEventInit: IViewEventStore = {
    materials: [],
    actors: [],
    selectedEvent: undefined,
    isFetching: false,
    isFetchingFull: false,
}
const viewEventReducer = (state = viewEventInit, action) => {
    switch (action.type) {
        case types.GET_EVENT_MATERIALS:
            return { ...state, selectedEvent: action.payload, isFetching: true }
        case types.GET_EVENT_MATERIALS_SUCCESS:
            return { ...state, materials: action.payload, isFetching: false, isFetchingFull: false }
        case types.CLOSE_EVENT_MATERIALS:
            return { ...state, materials: [], selectedEvent: undefined, isFetching: false, isFetchingFull: false }
        case types.INFINITY_LOAD_EVENT_MATERIALS_SUCCESS:
            console.log('newRecords', state.materials, action.payload as Material[]);
            let materialIds = state.materials.map(ob => ob.id);
            return {
                ...state,
                materials: state.materials.concat((action.payload as Material[]).filter(ob => materialIds.indexOf(ob.id) < 0)),
                isFetching: false,
                isFetchingFull: action.isFetchingFull,
            }
        case types.GET_EVENT_PARTICIPANTS:
            return { ...state, selectedEvent: action.payload, isFetching: true }
        case types.GET_EVENT_PARTICIPANTS_SUCCESS:
            return { ...state, actors: action.payload, isFetching: false, isFetchingFull: false }
        case types.CLOSE_EVENT_PARTICIPANTS:
            return { ...state, actors: [], selectedEvent: undefined, isFetching: false, isFetchingFull: false }
        case types.INFINITY_LOAD_EVENT_PARTICIPANTS_SUCCESS:
            console.log('newRecords', state.actors, action.payload as Actor[]);
            let actorLogins = state.actors.filter(ob => ob.user).map(ob => ob.user?.login);
            return {
                ...state,
                actors: state.actors.concat((action.payload as Actor[]).filter(ob => ob.user && actorLogins.indexOf(ob.user.login) < 0)),
                isFetching: false,
                isFetchingFull: action.isFetchingFull,
            }

        default:
            return state;
    }
}

export interface IAppReducer {
    root: IRootStore,
    event: IEventStore,
    comment: ICommentStore,
    viewEvent: IViewEventStore,
}

export default combineReducers<IAppReducer>({
    root: rootReducer,
    event: eventReducer,
    comment: commentReducer,
    viewEvent: viewEventReducer,
})

function getUserByName(users: User[], userName: string, currentUser: User) {
    let curUser = currentUser;
    if (userName === 'workbench') {
        curUser = curUser ?? (users.length > 0 ? users[0] : undefined);
    }
    else {
        const findUsers = users.filter(ob => ob.login.split('@')[0] === userName);
        curUser = findUsers.length > 0 ? findUsers[0] : undefined;
    }
    return curUser;
}
