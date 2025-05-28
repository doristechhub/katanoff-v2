import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userList: [],
  userLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
  },
});

export const { setUserList, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
