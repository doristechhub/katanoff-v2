import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collectionsData: [],
  collectionsLoading: false,
  collectionMessage: { message: "", type: "" },
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
  },
});

export const {
  setCollectionsData,
  setCollectionsLoading,
  setCollectionMessage,
} = collectionSlice.actions;

export default collectionSlice.reducer;
