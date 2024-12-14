import {
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    LOGOUT,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SET_ERROR_MESSAGE,
} from '../actions/auth/types';

const initialState = {
    users: [],
    loading: false,
    user_loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    globalError: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTH_LOADING:
            return {
                ...state,
                user_loading: true,
            };
        case REMOVE_AUTH_LOADING:
            return {
                ...state,
                user_loading: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
            };
        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                error: null,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
            };
        case USER_LOADED_FAIL:
        case LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                error: 'Authentication failed',
            };
        case REFRESH_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
            };
        case REFRESH_FAIL:
            return {
                ...state,
                isAuthenticated: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
        case REGISTER_FAIL:
            return {
                ...state,
                user: null,
                loading: false,
                error: 'There was a problem with the registration.',
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                globalError: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
