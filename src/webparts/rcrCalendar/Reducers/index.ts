import * as types from '../constants';
import Event from '../Models/Event';
import { combineReducers } from 'redux'
import { EventService } from '../services/Services';
import GroupingEvent from '../../../../lib/webparts/rcrCalendar/Models/GroupingEvent';
import FilterEvent from '../utils/IFilterEvent'

const initState =
{
    events: [],
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
    },
    editMode: null,
    categories: [],
    users: [],
    isFetchingCategories: false,
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case types.SET_USERNAME:
            return { ...state, user: { ...state.user, name: action.value } }
        case types.SET_USERID:
            return { ...state, user: { ...state.user, id: action.value } }
        case types.SET_ROOMS:
            return { ...state, rooms: action.value }
        case types.ADD_ROOM:
            return { ...state, rooms: [...state.rooms, action.value] }
        case types.JOIN_ROOM:
            return { ...state, activeGame: { ...state.activeGame, room: action.value } }
        case types.EXIT_ROOM:
            return { ...state, activeGame: { room: null, conStatus: null } }
        case types.SET_CON_STATUS:
            return { ...state, activeGame: { ...state.activeGame, conStatus: action.value } }
        // new reducers start here:
        case types.SET_EDIT_MODE:
            console.log('showing editForm');
            return { ...state, editMode: action.value }

        case types.GET_CATEGORIES:
            return { ...state, isFetchingCategories: true }
        case types.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload, isFetchingCategories: false }

        case types.GET_USERS:
            return { ...state, isFetchingCategories: true }
        case types.GET_USERS_SUCCESS:
            return { ...state, users: action.payload, isFetchingCategories: false }

        default:
            return state
    }
}

interface IEventStore {
    events: GroupingEvent[];
    isFetching: false;
    filterEvent: FilterEvent,
    editingEvent: Event,
}

export const filterEventInit: FilterEvent = { selectedCategories: [], selectedDate: new Date() }
const eventInit: IEventStore = {
    events: [],
    isFetching: false,
    filterEvent: filterEventInit,
    editingEvent: undefined,
}

const eventReducer = (state = eventInit, action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            return [
                ...state.events,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ]
        case 'FIND_EVENT':
            let findObjs = state.events.filter(ob => ob.id === action.id);
            return findObjs.length > 0 ? findObjs[0] : null;

        case types.CHANGE_DATE:
            state.filterEvent.selectedDate = action.payload;
            return { ...state, date: action.payload, isFetching: true }

        case types.CHANGE_DATE_SUCCESS:
            return { ...state, events: action.payload, isFetching: false }

        case types.CHANGE_FILTER_EVENT:
            return { ...state, filterEvent: action.payload, isFetching: true }

        case types.CHANGE_FILTER_EVENT_SUCCESS:
            return { ...state, events: action.payload, isFetching: false }

        case types.CHANGE_CATEGORY:
            let selectCategories = state.filterEvent.selectedCategories;
            if (selectCategories.indexOf(action.payload) >= 0) {
                selectCategories = selectCategories.filter(ob => ob !== action.payload);
            }
            else {
                selectCategories.push(action.payload);
            }
            state.filterEvent.selectedCategories = selectCategories;
            return { ...state, date: action.payload, isFetching: true }
        case types.INFINITY_LOAD_EVENT_SUCCESS:
            const newEvents = infinityLoadEvents(action.payload as GroupingEvent[], state.events);
            console.log('newEvents', newEvents, action.payload as GroupingEvent[]);
            return { ...state, events: newEvents, isFetching: false }

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

// export default rootReducer;

export default combineReducers({
    root: rootReducer,
    event: eventReducer
})