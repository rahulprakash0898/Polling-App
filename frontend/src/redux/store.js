import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import pollReducer from './slices/pollSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    polls: pollReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
