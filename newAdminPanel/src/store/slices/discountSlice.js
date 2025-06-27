import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { helperFunctions } from 'src/_helpers';
import { DATE_FORMAT } from 'src/_helpers/constants';

const now = moment().add(1, 'minute');
export const defaultBeginsAt = now.format(DATE_FORMAT);
export const defaultBeginsAtDate =
  helperFunctions?.parseDateTime(now.toDate()).date || moment().add(1, 'minute').toDate();
export const defaultBeginsAtTime =
  helperFunctions?.parseDateTime(now.toDate()).time || moment().add(1, 'minute').toDate();

export const initDiscount = {
  discountId: '',
  name: '',
  discountType: 'Order Discount',
  applicationMethod: 'Code',
  promoCode: '',
  discountDetails: { type: 'Percentage', amount: 0 },
  purchaseMode: 'One-Time',
  customerEligibility: 'Everyone',
  minimumOrderValue: 0,
  dateRange: {
    beginsAtDate: defaultBeginsAtDate,
    beginsAtTime: defaultBeginsAtTime,
    expiresAtDate: null,
    expiresAtTime: null,
    beginsAt: defaultBeginsAt,
    expiresAt: null,
  },
};

const initialState = {
  discountList: [],
  discountLoading: false,
  crudDiscountLoading: false,
  selectedDiscount: initDiscount,
};

const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    setDiscountLoading: (state, action) => {
      state.discountLoading = action.payload;
    },
    setDiscountList: (state, action) => {
      state.discountList = action.payload;
    },
    setCrudDiscountLoading: (state, action) => {
      state.crudDiscountLoading = action.payload;
    },
    setSelectedDiscount: (state, action) => {
      state.selectedDiscount = action.payload;
    },
  },
});

export const { setDiscountList, setDiscountLoading, setCrudDiscountLoading, setSelectedDiscount } =
  discountSlice.actions;
export default discountSlice.reducer;
