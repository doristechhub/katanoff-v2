import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviewPage: 0,
  reviewLoading: true,
  crudReviewLoading: false,
  reviewAndRatingsList: [],
};

const reviewAndRatingSlice = createSlice({
  name: 'reviewAndRating',
  initialState,
  reducers: {
    setReviewPage: (state, action) => {
      state.reviewPage = action.payload;
    },
    setReviewLoading: (state, action) => {
      state.reviewLoading = action.payload;
    },
    setCrudReviewLoading: (state, action) => {
      state.crudReviewLoading = action.payload;
    },
    setReviewAndRatingsList: (state, action) => {
      state.reviewAndRatingsList = action.payload;
    },
  },
});

export const { setReviewPage, setReviewLoading, setCrudReviewLoading, setReviewAndRatingsList } =
  reviewAndRatingSlice.actions;

export default reviewAndRatingSlice.reducer;
