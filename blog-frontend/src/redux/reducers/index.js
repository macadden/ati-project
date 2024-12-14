import { combineReducers } from 'redux';
import authReducer from './auth';
import blog from './blog';
import userReducer from './userReducer';

export default combineReducers({
    auth: authReducer,
    blog,
    user: userReducer,
})