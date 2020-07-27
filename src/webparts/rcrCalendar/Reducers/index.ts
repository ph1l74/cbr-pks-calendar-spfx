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

        default:
            return state
    }
}

interface IEventStore {
    events: GroupingEvent[];
    isFetching: false;
    filterEvent: FilterEvent
}

export const filterEventInit: FilterEvent = { selectedCategories: [], selectedDate: new Date() }
const eventInit: IEventStore = {
    events: [],
    isFetching: false,
    filterEvent: filterEventInit
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

        // case 'CHANGE_DATE':
        //     console.log('CHANGE_DATE');
        //     const selectedDay = action.date;
        //     const day = selectedDay.days() > 9 ? selectedDay.days() : '0' + selectedDay.days();
        //     const month = selectedDay.months() > 9 ? selectedDay.months() : '0' + selectedDay.months();
        //     return EventService.searchGet(`/?startDate=${day}.${month}.${selectedDay.years()}`)
        //         .then(ob => {
        //             state.events = ob;
        //             return ob;
        //         })
        //         .catch(err => {
        //             throw err;
        //         });
        default:
            return state
    }
}

// export default rootReducer;

export default combineReducers({
    root: rootReducer,
    event: eventReducer
})