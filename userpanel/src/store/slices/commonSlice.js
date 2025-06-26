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
  customizeOptionLoading: false,
  diamondShapeList: [],
  transparentHeaderBg: false,
  isSearchOpen: false,
  isMobileSearchOpen: false,
  isShowingResults: false,
  searchQuery: "",
  weddingHeaderUniqueFilterOptions: [],
  weddingHeaderLoader: false,
  engagementHeaderUniqueFilterOptions: [],
  engagementHeaderLoader: false,
  uniqueDiamondShapesForHomePage: {},
  uniqueDiamondShapesAndCaratBounds: {},
  selectedDiamondInfoModel: "",
  openHomePagePopup: false,
  homePagePopupLoader: false,
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
      state.transparentHeaderBg = action.payload;
    },
    setWeddingHeaderUniqueFilterOptions: (state, action) => {
      state.weddingHeaderUniqueFilterOptions = action.payload;
    },
    setWeddingHeaderLoader: (state, action) => {
      state.weddingHeaderLoader = action.payload;
    },
    setEngagementHeaderUniqueFilterOptions: (state, action) => {
      state.engagementHeaderUniqueFilterOptions = action.payload;
    },
    setEngagementHeaderLoader: (state, action) => {
      state.engagementHeaderLoader = action.payload;
    },
    // Search
    setIsSearchOpen: (state, action) => {
      state.isSearchOpen = action.payload;
    },

    setIsMobileSearchOpen: (state, action) => {
      state.isMobileSearchOpen = action.payload;
    },
    setIsShowingResults: (state, action) => {
      state.isShowingResults = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
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
    setCustomizeOptionLoading: (state, action) => {
      state.customizeOptionLoading = action.payload;
    },
    setDiamonShapeList: (state, action) => {
      state.diamondShapeList = action.payload;
    },
    setUniqueDiamondShapesForHomePage: (state, action) => {
      state.uniqueDiamondShapesForHomePage = action.payload;
    },
    setUniqueDiamondShapesAndCaratBounds: (state, action) => {
      state.uniqueDiamondShapesAndCaratBounds = action.payload;
    },
    setSelectedDiamondInfoModel: (state, action) => {
      state.selectedDiamondInfoModel = action.payload;
    },
    setOpenHomePagePopup: (state, action) => {
      state.openHomePagePopup = action.payload;
    },
    setHomePagePopupLoader: (state, action) => {
      state.homePagePopupLoader = action.payload;
    },
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
  setSearchQuery,
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
  setCustomizeOptionLoading,
  setIsSearchOpen,
  setIsMobileSearchOpen,
  setIsShowingResults,
  setWeddingHeaderLoader,
  setWeddingHeaderUniqueFilterOptions,
  setEngagementHeaderUniqueFilterOptions,
  setEngagementHeaderLoader,
  setUniqueDiamondShapesForHomePage,
  setUniqueDiamondShapesAndCaratBounds,
  setSelectedDiamondInfoModel,
  setOpenHomePagePopup,
  setHomePagePopupLoader,
} = commonSlice.actions;

export default commonSlice.reducer;
