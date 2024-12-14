import { clear_blog_list } from '../blog/blog';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_CONFIRM_SUCCESS,
    RESET_PASSWORD_CONFIRM_FAIL,
    SET_AUTH_LOADING,
    REMOVE_AUTH_LOADING,
    LOGOUT,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    REFRESH_SUCCESS,
    REFRESH_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    SET_ERROR_MESSAGE,
} from './types';

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// export const load_user = () => async dispatch => {
//     if (localStorage.getItem('access')) {
//         dispatch({ type: SET_AUTH_LOADING });
//         const config = {
//             headers: {
//                 'Authorization': `Bearer ${localStorage.getItem('access')}`,
//                 'Accept': 'application/json',
//             }
//         };

//         try {
//             const res = await axios.get(`${API_URL}/api/users/auth/user/`, config);
//             if (res.status === 200) {
//                 dispatch({
//                     type: USER_LOADED_SUCCESS,
//                     payload: res.data,
//                 });
//             } else {
//                 dispatch({
//                     type: USER_LOADED_FAIL,
//                 });
//             }
//         } catch (err) {
//             dispatch({
//                 type: USER_LOADED_FAIL,
//             });
//         } finally {
//             dispatch({ type: REMOVE_AUTH_LOADING });
//         }
//     } else {
//         dispatch({
//             type: USER_LOADED_FAIL,
//         });
//     }
// };

export const load_user = () => async dispatch => {
    const accessToken = localStorage.getItem('access');
    
    if (accessToken) {
        dispatch({ type: SET_AUTH_LOADING });
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
            },
        };
        
        try {
            const res = await axios.get(`${API_URL}/api/users/auth/user/`, config);
            
            if (res.status === 200) {
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data,
                });
            } else {
                dispatch({ type: USER_LOADED_FAIL });
            }
        } catch (err) {
            dispatch({ type: USER_LOADED_FAIL });
        } finally {
            dispatch({ type: REMOVE_AUTH_LOADING });
        }
    } else {
        dispatch({ type: USER_LOADED_FAIL });
    }
};


export const login = (username, password) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const body = JSON.stringify({ username, password });
    const config = { headers: { 'Content-Type': 'application/json' } };

    try {
        const res = await axios.post(`${API_URL}/api/token/`, body, config);

        if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
            dispatch(load_user());
            return res.data;
        } else {
            dispatch({ type: LOGIN_FAIL });
            dispatch(setErrorMessage('Invalid username or password.'));
        }

        dispatch({ type: REMOVE_AUTH_LOADING });
    } catch (err) {
        dispatch({ type: LOGIN_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setErrorMessage('Error trying to log in.'));
        throw err;
    }
};

// Check if the token is valid.
export const check_authenticated = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const body = JSON.stringify({ token: localStorage.getItem('access') });
        const config = { headers: { 'Content-Type': 'application/json' } };

        try {
            const res = await axios.post(`${API_URL}/api/token/verify/`, body, config);

            if (res.status === 200) {
                dispatch({ type: AUTHENTICATED_SUCCESS });
            } else {
                dispatch({ type: AUTHENTICATED_FAIL });
            }
        } catch (err) {
            dispatch({ type: AUTHENTICATED_FAIL });
        }
    } else {
        dispatch({ type: AUTHENTICATED_FAIL });
    }
};

// refresh token
export const refresh = () => async dispatch => {
    const refreshToken = localStorage.getItem('refresh');
    if (refreshToken) {
        const body = JSON.stringify({ refresh: refreshToken });
        const config = { headers: { 'Content-Type': 'application/json' } };

        try {
            const res = await axios.post(`${API_URL}/api/token/refresh/`, body, config);

            if (res.status === 200) {
                localStorage.setItem('access', res.data.access);
                dispatch({ type: REFRESH_SUCCESS, payload: res.data });
            } else {
                dispatch({ type: REFRESH_FAIL });
            }
        } catch (err) {
            dispatch({ type: REFRESH_FAIL });
        }
    } else {
        dispatch({ type: REFRESH_FAIL });
    }
};

export const reset_password = (email) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const body = JSON.stringify({ email });
    const config = { headers: { 'Content-Type': 'application/json' } };

    try {
        const res = await axios.post(`${API_URL}/api/auth/users/reset_password/`, body, config);

        if (res.status === 204) {
            dispatch({ type: RESET_PASSWORD_SUCCESS });
        } else {
            dispatch({ type: RESET_PASSWORD_FAIL });
            dispatch(setErrorMessage('Error sending password reset email.'));
        }
        dispatch({ type: REMOVE_AUTH_LOADING });
    } catch (err) {
        dispatch({ type: RESET_PASSWORD_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setErrorMessage('Error sending password reset email.'));
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => async dispatch => {
    dispatch({ type: SET_AUTH_LOADING });

    const body = JSON.stringify({ uid, token, new_password, re_new_password });
    const config = { headers: { 'Content-Type': 'application/json' } };

    if (new_password !== re_new_password) {
        dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
    } else {
        try {
            const res = await axios.post(`${API_URL}/api/auth/users/reset_password_confirm/`, body, config);

            if (res.status === 204) {
                dispatch({ type: RESET_PASSWORD_CONFIRM_SUCCESS });
            } else {
                dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL });
                dispatch(setErrorMessage('Error confirming password reset.'));
            }
            dispatch({ type: REMOVE_AUTH_LOADING });
        } catch (err) {
            dispatch({ type: RESET_PASSWORD_CONFIRM_FAIL });
            dispatch({ type: REMOVE_AUTH_LOADING });
            dispatch(setErrorMessage('Error confirming password reset.'));
        }
    }
};

export const registerUser = (userData) => async (dispatch) => {
    dispatch({ type: SET_AUTH_LOADING });

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    };

    try {
        const formData = new FormData();

        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);

        if (userData.profile_image && userData.profile_image instanceof File) {
            formData.append('profile_image', userData.profile_image);
        } else {
            dispatch(setErrorMessage('The profile picture file is invalid.'));
        }

        if (userData.cover_image && userData.cover_image instanceof File) {
            formData.append('cover_image', userData.cover_image);
        } else {
            dispatch(setErrorMessage('The cover image file is invalid.'));
        }

        const res = await axios.post(`${API_URL}/api/users/`, formData, config);

        if (res.status === 201) {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data, // registered user
            });
            dispatch(load_user());  // Load user after registration
        } else {
            dispatch({ type: REGISTER_FAIL });
            dispatch(setErrorMessage('Error registering user.'));
        }

        dispatch({ type: REMOVE_AUTH_LOADING });
    } catch (err) {
        dispatch({ type: REGISTER_FAIL });
        dispatch({ type: REMOVE_AUTH_LOADING });
        dispatch(setErrorMessage('Error registering user.'));
    }
};

// Global errors
export const setErrorMessage = (message) => {
    return {
      type: 'SET_ERROR_MESSAGE',
      payload: message,
    };
  };

// Logout
export const logout = () => dispatch => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    dispatch({ type: LOGOUT });
    dispatch(clear_blog_list());
};