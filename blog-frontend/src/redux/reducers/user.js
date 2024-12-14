import {
    SEARCH_USERS_REQUEST,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_FAILURE,
    SET_ERROR_MESSAGE,
} from '../actions/user/types';

const initialState = {
    users: [],
    isLoading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_USERS_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case SEARCH_USERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                users: action.payload,
            };
        case SEARCH_USERS_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
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

export default userReducer;