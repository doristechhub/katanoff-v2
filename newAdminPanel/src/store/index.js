import { combineReducers, configureStore } from '@reduxjs/toolkit';

import user from '../store/slices/userSlice';
import menu from '../store/slices/menuSlice';
import brand from '../store/slices/brandSlice';
import admin from '../store/slices/adminSlice';
import orders from '../store/slices/ordersSlice';
import refund from '../store/slices/refundSlice';
import returns from '../store/slices/returnSlice';
import product from '../store/slices/productSlice';
import dashboard from '../store/slices/dashboardSlice';
import collection from '../store/slices/collectionSlice';
import settingStyle from '../store/slices/settingStyleSlice';
import diamondShape from '../store/slices/diamondShapeSlice';
import subscribers from '../store/slices/subscribersSlice';
import permissions from '../store/slices/permissionsSlice';
import appointments from '../store/slices/appointmentSlice';
import customJewelry from '../store/slices/customJewelrySlice';
import customization from '../store/slices/customizationSlice';
import showCaseBanner from '../store/slices/showCaseBannerSlice';
import reviewAndRating from '../store/slices/reviewAndRatingSlice';
import reportAndAnalysis from '../store/slices/reportAndAnalysisSlice';
import contacts from '../store/slices/contactSlice';
import discounts from '../store/slices/discountSlice';

// ----------------------------------------------------------------------

const reducers = combineReducers({
  menu,
  user,
  brand,
  admin,
  orders,
  refund,
  returns,
  product,
  dashboard,
  collection,
  settingStyle,
  diamondShape,
  permissions,
  subscribers,
  appointments,
  customization,
  customJewelry,
  showCaseBanner,
  reviewAndRating,
  reportAndAnalysis,
  contacts,
  discounts,
});

// ----------------------------------------------------------------------

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
