import { sendError } from '.';
import * as types from '../constants';
import Comment from '../Models/Comment';
import Event from '../Models/Event';
import { CommentService } from '../services/Services';

export const getCommentsByEvent = (event: Event) => {
    return dispatch => {
        dispatch({
            type: types.GET_EVENT_COMMENTS,
            payload: event
        });
        getEventComments(types.GET_EVENT_COMMENTS_SUCCESS, event, dispatch);
    };
};

export const changeCalendarDateSuccess = events => ({
    type: types.CHANGE_DATE_SUCCESS,
    events
});

function getEventComments(typeAction: string, event: Event, dispatch: any, skip?: number) {
    const skipRequest = skip ? `&skip=${skip}` : '';
    CommentService.searchGet(`/?eventId=${event.id}${skipRequest}`)
        .then(ob => {
            console.log('fetch', ob);
            dispatch({
                type: typeAction,
                payload: ob,
            });
        })
        .catch(err => {
            sendError(err, dispatch, 'загрузке данных');
            dispatch({
                type: types.CLOSE_EDIT_COMMENT
            });
        });
}

export const infinityLoadEventComments = (skip: number, event: Event) => {
    return dispatch => {
        console.log('infinity load ', skip, event);
        dispatch({
            type: types.GET_EVENT_COMMENTS,
            payload: event
        });

        getEventComments(types.INFINITY_LOAD_EVENT_COMMENTS_SUCCESS, event, dispatch, skip);
    };
};

export const closeEventComments = () => ({
    type: types.CLOSE_EVENT_COMMENTS
});

// export const editComment = (editingRecord: Comment) => {
//     return dispatch => { //TODO: change to fetching, Event to number
//       dispatch({
//         type: types.RUN_EDIT_COMMENT
//       });
//       CommentService.getRecordById(editingRecord.id)
//         .then(ob => {
//           console.log('fetch', ob);
//           dispatch({
//             type: types.EDIT_COMMENT,
//             editRecord: ob,
//           });
//         })
//         .catch(err => console.log(err));
//     }
//   }
export const editComment = (editingRecord: Comment) => ({
    type: types.EDIT_COMMENT,
    editRecord: editingRecord,
});

export const closeEditComment = () => ({
    type: types.CLOSE_EDIT_COMMENT
});

export const clearEventComments = () => ({
    type: types.CLEAR_EVENT_COMMENTS,
  });

export const saveEditComment = (record: Comment) => {
    return dispatch => { //TODO: change to fetching, Event to number
        dispatch({
            type: types.SAVE_EDIT_COMMENT
        });
        const editFunc = (!record.id || record.id <= 0) ? CommentService.add(record) : CommentService.update(record, record.id);
        editFunc
            .then(ob => {
                console.log('save ', ob);
                dispatch({
                    type: types.SAVE_EDIT_COMMENT_SUCCESS,
                });
                dispatch({
                    type: types.SET_EVENT_COUNT_COMMENT,
                    eventId: record.eventID,
                    addingCount: record.id > 0 ? 0 : 1
                });
                const event = new Event();
                event.id = record.eventID;
                dispatch(clearEventComments());
                getEventComments(types.GET_EVENT_COMMENTS_SUCCESS, event, dispatch);
            })
            .catch(err => {
                sendError(err, dispatch, 'сохранении');
                dispatch({
                    type: types.SAVE_EDIT_COMMENT_SUCCESS,
                });
            });
    };
};

export const deleteComment = (editingRecord: Comment) => {
    const eventId = editingRecord.eventID;
    return dispatch => { //TODO: change to fetching, Event to number
        dispatch({
            type: types.DELETE_COMMENT,
            editRecord: editingRecord,
        });
        CommentService.remove(editingRecord.id)
            .then(ob => {
                console.log('delete', ob);
                dispatch({
                    type: types.DELETE_COMMENT_SUCCESS,
                    editRecord: ob,
                });
                dispatch({
                    type: types.SET_EVENT_COUNT_COMMENT,
                    eventId: eventId,
                    addingCount: -1
                });
            })
            .catch(err => {
                sendError(err, dispatch, 'удалении');
            });
    };
};
