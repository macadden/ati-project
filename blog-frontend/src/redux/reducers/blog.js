import {
  GET_BLOG_LIST_SUCCESS,
  GET_BLOG_LIST_FAIL,
  CLEAR_BLOG_LIST,
  GET_BLOG_SUCCESS,
  GET_BLOG_FAIL,
  GET_MORE_BLOG_POSTS_SUCCESS,
  GET_SEARCH_BLOG_SUCCESS,
  GET_SEARCH_BLOG_FAIL,
  GET_USER_POSTS_SUCCESS,
  GET_USER_POSTS_FAIL,
  GET_MORE_USER_POSTS_SUCCESS,
  SET_USER_POSTS_LOADING,
  GET_POST_COMMENTS_SUCCESS,
  GET_POST_COMMENTS_FAIL,
  ADD_COMMENT,
  SET_POST_DETAILS,
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
  EDIT_POST_SUCCESS,
  EDIT_POST_FAIL,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAIL,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAIL,
  SET_ERROR_MESSAGE,
} from '../actions/blog/types';

const initialState = {
  blog_list: [],
  filtered_posts: null,
  post: null,
  userPosts: [],
  userPostsLoading: false,
  commentsByPost: {},
  userProfile: null,
  userProfileLoading: false,
  following: [],
  globalError: null,
  loading: false,
  count: null,
  next: null,
  previous: null,
};

export default function blog(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BLOG_LIST_SUCCESS:
      return {
        ...state,
        // filter the posts to avoid duplicates, only add the ones that are not in the current list
        blog_list: [
          ...state.blog_list,
          ...payload.results.filter(post =>
            !state.blog_list.some(existingPost => existingPost.id === post.id)
          ),
        ],
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
        loading: false,
      };
    case GET_BLOG_LIST_FAIL:
      return {
        ...state,
        blog_list: [], // Posts are emptied if the load fails
        count: null,
        next: null,
        previous: null,
        loading: false,
      };
    case GET_MORE_BLOG_POSTS_SUCCESS:
      return {
        ...state,
        // filter the posts to avoid duplicates
        blog_list: [
          ...state.blog_list,
          ...payload.results.filter(post =>
            !state.blog_list.some(existingPost => existingPost.id === post.id)
          ),
        ],
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
        loading: false,
      };
    case CLEAR_BLOG_LIST:
      return {
        ...state,
        blog_list: [],
        count: null,
        next: null,
        previous: null,
      };
    case GET_BLOG_SUCCESS:
      return {
        ...state,
        post: payload.post,
      };
    case GET_BLOG_FAIL:
      return {
        ...state,
        post: null,
      };
    case GET_SEARCH_BLOG_SUCCESS:
      return {
        ...state,
        filtered_posts: payload.results.filtered_posts,
        count: payload.count,
        next: payload.next,
        previous: payload.previous,
      };
    case GET_SEARCH_BLOG_FAIL:
      return {
        ...state,
        filtered_posts: null,
        count: null,
        next: null,
        previous: null,
      };
    case GET_USER_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: payload.results,
        next: payload.next,
        userPostsLoading: false,
      };
    case GET_MORE_USER_POSTS_SUCCESS:
      return {
        ...state,
        userPosts: [...state.userPosts, ...payload.results],
        next: payload.next,
        userPostsLoading: false,
      };
    case GET_USER_POSTS_FAIL:
      return {
        ...state,
        userPostsLoading: false,
        userPostsError: true,
      };
    case SET_USER_POSTS_LOADING:
      return {
        ...state,
        userPostsLoading: true,
      };
    case GET_POST_COMMENTS_SUCCESS:
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [payload.postId]: payload.comments,
        },
      };
    case GET_POST_COMMENTS_FAIL:
      return {
        ...state,
      };
    case ADD_COMMENT:
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [action.payload.postId]: [
            ...(state.commentsByPost[action.payload.postId] || []),
            action.payload.comment,
          ],
        },
      };

    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        commentsByPost: {
          ...state.commentsByPost,
          [action.payload.postId]: state.commentsByPost[action.payload.postId]
            ? state.commentsByPost[action.payload.postId].filter(comment => comment.id !== action.payload.commentId)
            : [],
        },
      };
    case DELETE_COMMENT_FAIL:
      return {
        ...state,
      };
    case SET_POST_DETAILS:
      return {
        ...state,
        post: payload,
      };
    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: payload,
        userProfileLoading: false,
      };
    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        userProfile: null,
        userProfileLoading: false,
      };
    case FOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: [...state.following, payload],
      };
    case FOLLOW_USER_FAIL:
      return {
        ...state,
      };
    case UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: state.following.filter(userId => userId !== payload),
      };
    case UNFOLLOW_USER_FAIL:
      return {
        ...state,
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        blog_list: state.blog_list.filter(post => post.id !== payload.id),
      };
    case DELETE_POST_FAIL:
      return {
        ...state,
      };
    case ADD_NEW_POST_SUCCESS:
      return {
        ...state,
        blog_list: [...state.blog_list, payload],
      };
    case ADD_NEW_POST_FAIL:
      return {
        ...state,
      };
    case EDIT_POST_SUCCESS:
      return {
        ...state,
        blog_list: state.blog_list.map(post =>
          post.id === payload.id ? { ...post, ...payload } : post
        ),
        post: payload,
      };
    case EDIT_POST_FAIL:
      return {
        ...state,
      };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: payload,
      };
    case UPDATE_USER_PROFILE_FAIL:
      return {
        ...state,
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        globalError: action.payload,
      };
    default:
      return state;
  }
}
