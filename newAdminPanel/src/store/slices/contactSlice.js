import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contactsPage: 0,
  contactsList: [],
  contactsLoading: false,
  crudContactsLoading: false,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContactsPage: (state, action) => {
      state.contactsPage = action.payload;
    },
    setContactsLoading: (state, action) => {
      state.contactsLoading = action.payload;
    },
    setContactsList: (state, action) => {
      state.contactsList = action.payload;
    },
    setCrudContactsLoading: (state, action) => {
      state.crudContactsLoading = action.payload;
    },
  },
});

export const { setContactsPage, setContactsList, setContactsLoading, setCrudContactsLoading } =
  contactsSlice.actions;
export default contactsSlice.reducer;
