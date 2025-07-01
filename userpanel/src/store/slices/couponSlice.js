import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  promoCodeLoading: false,
  couponCode: "",
  appliedPromoDetail: null,
  couponMessage: { message: "", type: "" },
  userEmail: "",
  couponAppliedMail: "",
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    setPromoCodeLoading: (state, action) => {
      state.promoCodeLoading = action.payload;
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setAppliedPromoDetail: (state, action) => {
      state.appliedPromoDetail = action.payload;
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
  setAppliedPromoDetail,
  setCouponMessage,
  setUserEmail,
  setCouponAppliedMail,
} = couponSlice.actions;

export default couponSlice.reducer;
