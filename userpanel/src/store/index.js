import { combineReducers, configureStore } from "@reduxjs/toolkit";
import common from "./slices/commonSlice.js";
import product from "./slices/productSlice.js";
import cart from "./slices/cartSlice.js";
import order from "./slices/orderSlice.js";
import user from "./slices/userSlice.js";
import address from "./slices/addressSlice.js";
import checkout from "./slices/checkoutSlice.js";
import payment from "./slices/paymentSlice.js";
import subscriber from "./slices/subscriberSlice.js";
import selectedDiamond from "./slices/selectDiamondSlice.js";
import returns from "./slices/returnSlice.js";
import appointment from "./slices/appointmentSlice.js";
import customJewelry from "./slices/customjewelrySlice.js";
import contact from "./slices/contactSlice.js";
import coupon from "./slices/couponSlice.js";
import collection from "./slices/collectionSlice.js";

const reducers = combineReducers({
  common,
  product,
  cart,
  user,
  address,
  checkout,
  payment,
  subscriber,
  order,
  selectedDiamond,
  returns,
  appointment,
  customJewelry,
  contact,
  coupon,
  collection,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
