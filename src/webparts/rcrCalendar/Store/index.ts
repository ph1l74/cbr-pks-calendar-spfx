import { createStore } from 'redux';
import  rootReducer  from '../Reducers';

const configureStore = (initialState: any) => {
    return createStore(rootReducer, initialState);
}

export default configureStore;