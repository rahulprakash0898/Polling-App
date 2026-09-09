import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filterType: '',
  activeTab: 'all',
};

export const pollSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetFilters: (state) => {
      state.filterType = '';
      state.activeTab = 'all';
    }
  },
});

export const { setFilterType, setActiveTab, resetFilters } = pollSlice.actions;

export const selectFilterType = (state) => state.polls.filterType;
export const selectActiveTab = (state) => state.polls.activeTab;

export default pollSlice.reducer;
