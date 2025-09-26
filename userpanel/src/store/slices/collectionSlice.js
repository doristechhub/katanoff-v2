import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionsData: [],
  collectionsLoading: false,
  collectionMessage: { message: "", type: "" },
  collectionsList: [],
  collectionsListLoading: false,
};

const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollectionsData(state, action) {
      state.collectionsData = action.payload;
    },
    setCollectionsLoading(state, action) {
      state.collectionsLoading = action.payload;
    },
    setCollectionMessage(state, action) {
      state.collectionMessage = action.payload;
    },
    setCollectionsList(state, action) {
      state.collectionsList = action.payload;
    },
    setCollectionsListLoading(state, action) {
      state.collectionsListLoading = action.payload;
    },
  },
});

export const {
  setCollectionsData,
  setCollectionsLoading,
  setCollectionMessage,
  setCollectionsList,
  setCollectionsListLoading,
} = collectionSlice.actions;

export default collectionSlice.reducer;
