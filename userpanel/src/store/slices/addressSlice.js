import { createSlice } from "@reduxjs/toolkit";

export const defaultCountry = "US";
export const defaultCountryDisplay = "United States";

export const addressObj = {
  isDefault: false,
  firstName: "",
  lastName: "",
  company: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pinCode: "",
  country: defaultCountry,
  mobile: "",
};

const initialState = {
  isLoading: true,
  addressLoader: false,
  selectedAddress: addressObj,
  addressList: [],
  validateAddressLoader: false,
  invalidAddressDetail: {},
  addressMessage: { message: "", type: "" },
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setAddressLoader: (state, action) => {
      state.addressLoader = action.payload;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setValidateAddressLoader: (state, action) => {
      state.validateAddressLoader = action.payload;
    },

    setInvalidAddressDetail: (state, action) => {
      state.invalidAddressDetail = action.payload;
    },
    setAddressMessage: (state, action) => {
      state.addressMessage = action.payload;
    },
  },
});

export const {
  setAddressLoading,
  setAddressList,
  setAddressLoader,
  setSelectedAddress,
  setValidateAddressLoader,
  setInvalidAddressDetail,
  setAddressMessage,
} = addressSlice.actions;

export default addressSlice.reducer;
