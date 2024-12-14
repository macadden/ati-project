import axios from 'axios';
import {
    GET_BLOG_LIST_SUCCESS,
    GET_BLOG_LIST_FAIL,
    CLEAR_BLOG_LIST,
    GET_BLOG_SUCCESS,
    GET_BLOG_FAIL,
    GET_MORE_BLOG_POSTS_SUCCESS,
    GET_SEARCH_BLOG_SUCCESS,
    GET_SEARCH_BLOG_FAIL,
    GET_POST_COMMENTS_SUCCESS,
    GET_POST_COMMENTS_FAIL,
    SET_POST_DETAILS,
    ADD_COMMENT,
    SET_USER_POSTS_LOADING,
    GET_USER_POSTS_SUCCESS,
    GET_USER_POSTS_FAIL,
    GET_MORE_USER_POSTS_SUCCESS,
    GET_USER_PROFILE_SUCCESS,
    GET_USER_PROFILE_FAIL,
    FOLLOW_USER_SUCCESS,
    FOLLOW_USER_FAIL,
    UNFOLLOW_USER_SUCCESS,
    UNFOLLOW_USER_FAIL,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,
    ADD_NEW_POST_SUCCESS,
    ADD_NEW_POST_FAIL,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAIL,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_FAIL,
    SET_ERROR_MESSAGE,
} from "./types";

const API_URL = process.env.REACT_APP_API_URL;

const getAuthConfig = () => {
    const token = localStorage.getItem('access');
    if (token) {
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        };
    } else {
        return {
            headers: {
                'Accept': 'application/json'
            }
        };
    }
};

// Obtener la lista de blogs
export const get_blog_list = (pageUrl = null) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const url = pageUrl || `${API_URL}/api/posts/`;
        const res = await axios.get(url, config);

        if (res.status === 200) {
            dispatch({
                type: GET_BLOG_LIST_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_BLOG_LIST_FAIL
            });
            dispatch(setErrorMessage('Failed to load blog list.'));
        }
    } catch (err) {
        dispatch({
            type: GET_BLOG_LIST_FAIL
        });
        dispatch(setErrorMessage('Error fetching blog list.'));
    }
};

// Obtener más blogs respondiendo a paginación
export const get_more_blog_posts = (pageUrl) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const res = await axios.get(pageUrl, config);

        if (res.status === 200) {
            dispatch({
                type: GET_MORE_BLOG_POSTS_SUCCESS,
                payload: res.data,
            });
        } else {
            dispatch({
                type: GET_BLOG_LIST_FAIL,
            });
            dispatch(setErrorMessage('Failed to load more blog posts.'));
        }
    } catch (err) {
        dispatch({
            type: GET_BLOG_LIST_FAIL,
        });
        dispatch(setErrorMessage('Error fetching more blog posts.'));
    }
};

export const clear_blog_list = () => {
    return {
        type: CLEAR_BLOG_LIST,
    };
};

// Get details of a specific blog post by ID
export const getBlogDetail = (id) => async dispatch => {
    try {
        const config = getAuthConfig();
        const res = await axios.get(`${API_URL}/api/posts/${id}/`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_BLOG_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_BLOG_FAIL
            });
            dispatch(setErrorMessage('Failed to load blog details.'));
        }
    } catch (err) {
        dispatch({
            type: GET_BLOG_FAIL
        });
        dispatch(setErrorMessage('Error fetching blog details.'));
    }
};

// Search blogs by search term
export const search_blog = (searchTerm) => async dispatch => {
    try {
        const config = getAuthConfig();
        const res = await axios.get(`${API_URL}/api/blog/search?s=${searchTerm}`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_SEARCH_BLOG_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_SEARCH_BLOG_FAIL
            });
            dispatch(setErrorMessage('Search failed.'));
        }
    } catch (err) {
        dispatch({
            type: GET_SEARCH_BLOG_FAIL
        });
        dispatch(setErrorMessage('Error searching blogs.'));
    }
};

// Get comments of a post
export const getPostComments = (postId) => async dispatch => {
    try {
        const config = getAuthConfig();
        const res = await axios.get(`${API_URL}/api/posts/${postId}/comments/`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_POST_COMMENTS_SUCCESS,
                payload: { postId, comments: res.data }
            });
        } else {
            dispatch({
                type: GET_POST_COMMENTS_FAIL
            });
            dispatch(setErrorMessage('Failed to load comments.'));
        }
    } catch (err) {
        dispatch({
            type: GET_POST_COMMENTS_FAIL
        });
        dispatch(setErrorMessage('Error fetching post comments.'));
    }
};

// Obtener los detalles de un post específico
export const getPostDetails = (id) => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/api/posts/${id}/`, getAuthConfig());
        dispatch({ type: SET_POST_DETAILS, payload: response.data });
    } catch (error) {
        dispatch(setErrorMessage("Error fetching post details."));
    }
};


// Agregar un comentario a un post
export const addComment = (postId, content) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_URL}/api/posts/${postId}/comments/`, { content }, getAuthConfig());
        dispatch({
            type: ADD_COMMENT,
            payload: { postId, comment: response.data }
        });
    } catch (error) {
        dispatch(setErrorMessage("Error adding comment."));
    }
};


// Delete a comment
export const deleteComment = (postId, commentId) => async (dispatch, getState) => {
    try {
        const config = getAuthConfig();

        const deleteUrl = `${API_URL}/api/posts/${postId}/comments/${commentId}/delete/`;
        const res = await axios.delete(deleteUrl, config);

        dispatch({
            type: DELETE_COMMENT_SUCCESS,
            payload: { postId, commentId },
        });
    } catch (error) {
        dispatch({
            type: DELETE_COMMENT_FAIL,
        });
        dispatch(setErrorMessage("Error deleting comment."));
    }
};

// Get posts of a specific user
export const getUserPosts = (author_id, page_number = 1) => async dispatch => {
    dispatch({ type: SET_USER_POSTS_LOADING });

    const config = getAuthConfig();

    try {
        const res = await axios.get(`${API_URL}/api/posts/?author_id=${author_id}&page_number=${page_number}`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_USER_POSTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_USER_POSTS_FAIL
            });
            dispatch(setErrorMessage('Failed to load user posts.'));
        }
    } catch (err) {
        dispatch({
            type: GET_USER_POSTS_FAIL
        });
        dispatch(setErrorMessage('Error fetching user posts.'));
    }
};

// Get more posts from a user
export const getMoreUserPosts = (nextUrl, author_id) => async dispatch => {
    dispatch({ type: SET_USER_POSTS_LOADING });

    const config = getAuthConfig();

    try {
        const urlWithAuthorId = nextUrl.includes('author_id')
            ? nextUrl
            : `${nextUrl}&author_id=${author_id}`;

        const res = await axios.get(urlWithAuthorId, config);

        if (res.status === 200) {
            dispatch({
                type: GET_MORE_USER_POSTS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_USER_POSTS_FAIL
            });
            dispatch(setErrorMessage('Failed to load more user posts.'));
        }
    } catch (err) {
        dispatch({
            type: GET_USER_POSTS_FAIL
        });
        dispatch(setErrorMessage('Error fetching more user posts.'));
    }
};

// Get user profile
export const getUserProfile = (userId) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const res = await axios.get(`${API_URL}/api/users/${userId}/`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_USER_PROFILE_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_USER_PROFILE_FAIL
            });
            dispatch(setErrorMessage('Failed to load user profile.'));
        }
    } catch (err) {
        dispatch({
            type: GET_USER_PROFILE_FAIL
        });
        dispatch(setErrorMessage('Error fetching user profile.'));
    }
};

// Follow a user
export const followUser = (userId, targetUserId) => async (dispatch) => {
    const config = getAuthConfig();
    try {
        const res = await axios.post(
            `${API_URL}/api/users/${userId}/follow/${targetUserId}/`,
            {},
            config
        );

        if (res.status === 200) {
            dispatch({
                type: FOLLOW_USER_SUCCESS,
                payload: targetUserId,
            });
        }
    } catch (err) {
        dispatch({
            type: FOLLOW_USER_FAIL,
        });
        dispatch(setErrorMessage('Error following user.'));
    }
};

// Unfollow a user
export const unfollowUser = (userId, targetUserId) => async (dispatch) => {
    const config = getAuthConfig();
    try {
        const res = await axios.post(
            `${API_URL}/api/users/${userId}/unfollow/${targetUserId}/`,
            {},
            config
        );

        if (res.status === 200) {
            dispatch({
                type: UNFOLLOW_USER_SUCCESS,
                payload: targetUserId,
            });
        }
    } catch (err) {
        dispatch({
            type: UNFOLLOW_USER_FAIL,
        });
        dispatch(setErrorMessage('Error unfollowing user.'));
    }
};

// Create a new post
export const createPost = (data) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const formData = new FormData();

        if (data.thumbnail && data.thumbnail instanceof File) {
            formData.append('thumbnail', data.thumbnail);
        } else {
            dispatch(setErrorMessage('picture file is invalid.'));
            return;
        }
        if (data.content) {
            formData.append('content', data.content);
        } else {
            dispatch(setErrorMessage('Content field is empty.'));
            return;
        }
        if (data.status) {
            formData.append('status', data.status);
        } else {
            dispatch(setErrorMessage('Status field is empty.'));
            return;
        }
        if (data.author) {
            formData.append('author', data.author);
        } else {
            dispatch(setErrorMessage('Author field is empty.'));
            return;
        }

        const res = await axios.post(`${API_URL}/api/posts/`, formData, config);

        if (res.status === 201) {
            dispatch({
                type: ADD_NEW_POST_SUCCESS,
                payload: res.data,
            });
        } else {
            dispatch({
                type: ADD_NEW_POST_FAIL,
            });
            dispatch(setErrorMessage('Failed to create post.'));
        }
    } catch (err) {
        dispatch({
            type: ADD_NEW_POST_FAIL,
        });
        dispatch(setErrorMessage('Error creating post.'));
    }
};

// Delete a post
export const deletePost = (id) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const res = await axios.delete(`${API_URL}/api/posts/${id}/delete/`, config);

        if (res.status === 200 && res.data.success) {
            dispatch({
                type: DELETE_POST_SUCCESS,
                payload: { id },
            });
        } else {
            dispatch({
                type: DELETE_POST_FAIL,
            });
            dispatch(setErrorMessage('Failed to delete post.'));
        }
    } catch (err) {
        dispatch({
            type: DELETE_POST_FAIL,
        });
        dispatch(setErrorMessage('Error deleting post.'));
    }
};

// Edit a post
export const editPost = (id, data) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const formData = new FormData();

        if (data.content) {
            formData.append('content', data.content);
        } else {
            dispatch(setErrorMessage('Content field is empty.'));
            return;
        }

        if (data.thumbnail && data.thumbnail instanceof File) {
            formData.append('thumbnail', data.thumbnail);
        }

        const res = await axios.patch(`${API_URL}/api/posts/${id}/`, formData, config);

        if (res.status === 200) {
            dispatch({
                type: 'EDIT_POST_SUCCESS',
                payload: res.data,
            });
        } else {
            dispatch({
                type: 'EDIT_POST_FAIL',
            });
            dispatch(setErrorMessage('Failed to edit post.'));
        }
    } catch (err) {
        dispatch({
            type: 'EDIT_POST_FAIL',
        });
        dispatch(setErrorMessage('Error editing post.'));
    }
};

// Update user profile
export const updateUserProfile = (userId, data) => async (dispatch) => {
    try {
        const config = getAuthConfig();
        const formData = new FormData();

        if (data.profileImage && data.profileImage instanceof File) {
            formData.append('profile_image', data.profileImage);
        }
        if (data.coverImage && data.coverImage instanceof File) {
            formData.append('cover_image', data.coverImage);
        }
        if (data.username) {
            formData.append('username', data.username);
        }
        if (data.bio) {
            formData.append('bio', data.bio);
        }

        const res = await axios.patch(`${API_URL}/api/users/${userId}/`, formData, config);

        if (res.status === 200) {
            dispatch({
                type: UPDATE_USER_PROFILE_SUCCESS,
                payload: res.data,
            });
        } else {
            dispatch({
                type: UPDATE_USER_PROFILE_FAIL,
            });
            dispatch(setErrorMessage('Failed to update user profile.'));
        }
    } catch (err) {
        dispatch({
            type: UPDATE_USER_PROFILE_FAIL,
        });
        dispatch(setErrorMessage('Error updating user profile.'));
    }
};

// Global errors
export const setErrorMessage = (message) => {
    return {
        type: 'SET_ERROR_MESSAGE',
        payload: message,
    };
};