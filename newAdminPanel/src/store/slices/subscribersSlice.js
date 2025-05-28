import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subscribersPage: 0,
  subscribersList: [],
  subscribersLoading: false,
  crudSubscribersLoading: false,
};

const subscribersSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {
    setSubscribersPage: (state, action) => {
      state.subscribersPage = action.payload;
    },
    setSubscribersLoading: (state, action) => {
      state.subscribersLoading = action.payload;
    },
    setSubscribersList: (state, action) => {
      state.subscribersList = action.payload;
    },
    setCrudSubscribersLoading: (state, action) => {
      state.crudSubscribersLoading = action.payload;
    },
  },
});

export const {
  setSubscribersPage,
  setSubscribersList,
  setSubscribersLoading,
  setCrudSubscribersLoading,
} = subscribersSlice.actions;
export default subscribersSlice.reducer;
