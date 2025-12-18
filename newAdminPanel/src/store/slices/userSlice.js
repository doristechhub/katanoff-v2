import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userList: [],
  userLoading: false,
  crudUserLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setCrudUserLoading: (state, action) => {
      state.crudUserLoading = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
});

export const { setUserList, setCrudUserLoading, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
