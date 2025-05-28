import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuList: [],
  openDropdown: false,
  menuLoading: false,
  isMenuOpen: false,
  lastScrollY: false,
  openDropdownMobile: false,
  isHovered: false,
  isCartOpen: false,
  openProfileDropdown: null,
  showModal: false,
  isChecked: false,
  isSubmitted: false,
  customProductDetails: {},
  customizeLoader: false,
  openDiamondDetailDrawer: "",
  openDiamondDetailProductId: "",
  uniqueFilterOptionsForHeader: {},
  customizeOptionLoading: false,
  diamondShapeList: [],
  transparenHeadertBg: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    // Header
    setMenuLoading: (state, action) => {
      state.menuLoading = action.payload;
    },
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setOpenDropdown: (state, action) => {
      state.openDropdown = action.payload;
    },
    setLastScrollY: (state, action) => {
      state.lastScrollY = action.payload;
    },
    setOpenDropdownMobile: (state, action) => {
      state.openDropdownMobile = action.payload;
    },
    setTransparentHeaderBg: (state, action) => {
      state.transparenHeadertBg = action.payload
    },

    // Others
    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    setOpenProfileDropdown: (state, action) => {
      state.openProfileDropdown = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setIsChecked(state, action) {
      state.isChecked = action.payload;
    },
    setIsSubmitted(state, action) {
      state.isSubmitted = action.payload;
    },

    // For Customization steps
    setCustomProductDetails(state, action) {
      state.customProductDetails = action.payload;
    },
    setCustomizeLoader(state, action) {
      state.customizeLoader = action.payload;
    },
    setOpenDiamondDetailDrawer(state, action) {
      state.openDiamondDetailDrawer = action.payload;
    },
    setOpenDiamondDetailProductId(state, action) {
      state.openDiamondDetailProductId = action.payload;
    },
    setUniqueFilterOptionsForHeader: (state, action) => {
      state.uniqueFilterOptionsForHeader = action.payload;
    },
    setCustomizeOptionLoading: (state, action) => {
      state.customizeOptionLoading = action.payload;
    },
    setDiamonShapeList: (state, action) => {
      state.diamondShapeList = action.payload;
    }
  },
});

export const {
  setMenuList,
  setDiamonShapeList,
  setMenuLoading,
  setIsMenuOpen,
  setOpenDropdown,
  setOpenDropdownMobile,
  setLastScrollY,
  setIsHovered,
  setIsCartOpen,
  setTransparentHeaderBg,
  setOpenProfileDropdown,
  setShowModal,
  setIsChecked,
  setIsSubmitted,
  setCustomizeLoader,
  setCustomProductDetails,
  setOpenDiamondDetailDrawer,
  setOpenDiamondDetailProductId,
  setUniqueFilterOptionsForHeader,
  setCustomizeOptionLoading
} = commonSlice.actions;

export default commonSlice.reducer;
