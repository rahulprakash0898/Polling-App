import React, { createContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  clearUser as clearUserAction,
  updateUserStats as updateUserStatsAction,
  onUserVoted as onUserVotedAction,
  onPollCreateOrDelete as onPollCreateOrDeleteAction,
  toggleBookmarkId as toggleBookmarkIdAction,
  selectUser
} from '../redux/slices/userSlice';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const updateUser = useCallback((userData) => {
    dispatch(setUser(userData));
  }, [dispatch]);

  const clearUser = useCallback(() => {
    dispatch(clearUserAction());
  }, [dispatch]);

  const updateUserStats = useCallback((key, value) => {
    dispatch(updateUserStatsAction({ key, value }));
  }, [dispatch]);

  const onUserVoted = useCallback(() => {
    dispatch(onUserVotedAction());
  }, [dispatch]);

  const onPollCreateOrDelete = useCallback((type = "create") => {
    dispatch(onPollCreateOrDeleteAction(type));
  }, [dispatch]);

  const toggleBookmarkId = useCallback((pollId) => {
    dispatch(toggleBookmarkIdAction(pollId));
  }, [dispatch]);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        updateUserStats,
        onPollCreateOrDelete,
        onUserVoted,
        toggleBookmarkId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;