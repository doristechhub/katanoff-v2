import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoCodeLoading: false,
  couponCode: "",
  appliedCode: null,
  couponMessage: { message: "", type: "" },
  userEmail: "",
  couponAppliedMail: "",
};

const couponSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPromoCodeLoading: (state, action) => {
      state.promoCodeLoading = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setAppliedCode: (state, action) => {
      state.appliedCode = action.payload;
    },
    setCouponMessage: (state, action) => {
      state.couponMessage = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setCouponAppliedMail: (state, action) => {
      state.couponAppliedMail = action.payload;
    },
  },
});

export const {
  setPromoCodeLoading,
  setCouponCode,
  setAppliedCode,
  setCouponMessage,
  setUserEmail,
  setCouponAppliedMail,
} = couponSlice.actions;

export default couponSlice.reducer;
