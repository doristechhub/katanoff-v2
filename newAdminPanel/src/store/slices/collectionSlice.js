import { createSlice } from '@reduxjs/toolkit';

export const initCollection = {
  title: '',
};

const initialState = {
  collectionList: [],
  collectionLoading: false,
  crudCollectionLoading: false,
  selectedCollection: initCollection,
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionLoading: (state, action) => {
      state.collectionLoading = action.payload;
    },
    setCollectionList: (state, action) => {
      state.collectionList = action.payload;
    },
    setCrudCollectionLoading: (state, action) => {
      state.crudCollectionLoading = action.payload;
    },
    setSelectedCollection: (state, action) => {
      state.selectedCollection = action.payload;
    },
  },
});

export const {
  setCollectionList,
  setCollectionLoading,
  setSelectedCollection,
  setCrudCollectionLoading,
} = collectionSlice.actions;
export default collectionSlice.reducer;
