import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    updateUserStats: (state, action) => {
      const { key, value } = action.payload;
      if (state.user) {
        state.user[key] = value;
      }
    },
    onUserVoted: (state) => {
      if (state.user) {
        state.user.totalPollsVotes = (state.user.totalPollsVotes || 0) + 1;
      }
    },
    onPollCreateOrDelete: (state, action) => {
      const type = action.payload || "create";
      if (state.user) {
        const currentCount = state.user.totalPollsCreated || 0;
        state.user.totalPollsCreated = type === "create" ? currentCount + 1 : Math.max(0, currentCount - 1);
      }
    },
    toggleBookmarkId: (state, action) => {
      const pollId = action.payload;
      if (!state.user) return;

      const bookmarks = state.user.bookmarkedPolls || [];
      const index = bookmarks.indexOf(pollId);

      if (index === -1) {
        state.user.bookmarkedPolls = [...bookmarks, pollId];
        state.user.totalPollsBookmarked = (state.user.totalPollsBookmarked || 0) + 1;
      } else {
        state.user.bookmarkedPolls = bookmarks.filter((id) => id !== pollId);
        state.user.totalPollsBookmarked = Math.max(0, (state.user.totalPollsBookmarked || 1) - 1);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const {
  setUser,
  clearUser,
  updateUserStats,
  onUserVoted,
  onPollCreateOrDelete,
  toggleBookmarkId,
  setLoading
} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserLoading = (state) => state.user.loading;

export default userSlice.reducer;
