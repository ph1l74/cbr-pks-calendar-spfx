import * as types from '../Constants';

export const setUserName = (value) => {
    return {
        type: types.SET_USERNAME,
        value
    }
}


export const setUserId = (value) => {
    return {
        type: types.SET_USERID,
        value
    }
}


export const setRooms = (value) => {
    return {
        type: types.SET_ROOMS,
        value
    }
}


export const addRoom = (value) => {
    return {
        type: types.ADD_ROOM,
        value
    }
}

export const joinRoom = (value) => {
    return {
        type: types.JOIN_ROOM,
        value
    }
}

export const exitRoom = () => {
    return {
        type: types.EXIT_ROOM
    }
}

export const setConStatus = (value) => {
    return {
        type: types.SET_CON_STATUS,
        value
    }
}

export const setEditMode = (value) => {
    return {
        type: types.SET_EDIT_MODE,
        value
    }
}
