import axios from 'axios';
import {
    SEARCH_USERS_REQUEST,
    SEARCH_USERS_SUCCESS,
    SEARCH_USERS_FAILURE,
    SET_ERROR_MESSAGE,
} from './types';

const API_URL = process.env.REACT_APP_API_URL;

export const searchUsers = (query) => async (dispatch) => {
    dispatch({ type: SEARCH_USERS_REQUEST });

    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access')}`,
                'Accept': 'application/json',
            }
        };

        const res = await axios.get(`${API_URL}/api/users/?search=${query}`, config);

        dispatch({
            type: SEARCH_USERS_SUCCESS,
            payload: res.data.results,
        });

    } catch (err) {
        dispatch({
            type: SEARCH_USERS_FAILURE,
            payload: err.response ? err.response.data : 'Error desconocido',
        });
    }
};

// Global errors
export const setErrorMessage = (message) => {
    return {
        type: 'SET_ERROR_MESSAGE',
        payload: message,
    };
};