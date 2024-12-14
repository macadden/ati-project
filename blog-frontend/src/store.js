import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './redux/reducers/blog';
import authReducer from './redux/reducers/auth';
import userReducer from './redux/reducers/user';

const store = configureStore({
  reducer: {
    blog: blogReducer,
    auth: authReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // DevTools solo en desarrollo
});

export default store;