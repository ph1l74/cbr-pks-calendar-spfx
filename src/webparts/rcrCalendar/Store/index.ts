import { createStore } from 'redux';
import  rootReducer, { IAppReducer }  from '../Reducers';

const configureStore = (initialState: IAppReducer) => {
    return createStore(rootReducer, initialState);
}

export default configureStore;