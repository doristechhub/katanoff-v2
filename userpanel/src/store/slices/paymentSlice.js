import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentIntentLoader: false,
  paymentIntentMessage: { type: "", message: "" },

  checkPIStatusLoader: false,
  paymentIntentStatus: "", // requires_payment_method

  // Stripe
  paymentLoader: false,
  paymentMessage: { type: "", message: "" },

  // Paypal
  paypalPaymentLoader: false,
  paypalPaymentMessage: { type: "", message: "" },
  verifyOrderLoader: false,
  verifyOrderMessage: { type: "", message: "" },

  paymentStatusLoader: false,
  paymentStatusMessage: { type: "", message: "" },
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentIntentLoader: (state, action) => {
      state.paymentIntentLoader = action.payload;
    },
    setPaymentIntentMessage: (state, action) => {
      state.paymentIntentMessage = action.payload;
    },

    setCheckPIStatusLoader: (state, action) => {
      state.checkPIStatusLoader = action.payload;
    },
    setPaymentIntentStatus: (state, action) => {
      state.paymentIntentStatus = action.payload;
    },

    // Stripe
    setPaymentLoader: (state, action) => {
      state.paymentLoader = action.payload;
    },
    setPaymentMessage: (state, action) => {
      state.paymentMessage = action.payload;
    },

    // Paypal
    setPaypalPaymentLoader: (state, action) => {
      state.paypalPaymentLoader = action.payload;
    },
    setPaypalPaymentMessage: (state, action) => {
      state.paypalPaymentMessage = action.payload;
    },
    setVerifyOrderLoader: (state, action) => {
      state.verifyOrderLoader = action.payload;
    },
    setVerifyOrderMessage: (state, action) => {
      state.verifyOrderMessage = action.payload;
    },

    clearPaymentMessage: (state) => {
      state.paymentMessage = { type: "", message: "" };
    },

    setPaymentStatusLoader: (state, action) => {
      state.paymentStatusLoader = action.payload;
    },
    setPaymentStatusMessage: (state, action) => {
      state.paymentStatusMessage = action.payload;
    },
  },
});

export const {
  setPaymentIntentLoader,
  setPaymentIntentMessage,

  setCheckPIStatusLoader,
  setPaymentIntentStatus,

  // Stripe
  setPaymentLoader,
  setPaymentMessage,

  // Paypal
  setPaypalPaymentLoader,
  setPaypalPaymentMessage,
  setVerifyOrderLoader,
  setVerifyOrderMessage,

  clearPaymentMessage,

  setPaymentStatusLoader,
  setPaymentStatusMessage,
} = paymentSlice.actions;

export default paymentSlice.reducer;
