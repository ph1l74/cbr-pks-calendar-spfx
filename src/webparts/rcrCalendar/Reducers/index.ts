import * as types from '../constants';
import Event from '../Models/Event';
import { combineReducers } from 'redux'
import { EventService } from '../services/Services';
import GroupingEvent from '../../../../lib/webparts/rcrCalendar/Models/GroupingEvent';

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
    }
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
            return { ...state, editMode: action.value }
        default:
            return state
    }
}
const eventInit = { date: Date, events: [], isFetching: false };
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

        case 'CHANGE_DATE':
            return { ...state, date: action.payload, isFetching: true }

        case 'CHANGE_DATE_SUCCESS':
            return { ...state, events: action.payload, isFetching: false }

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