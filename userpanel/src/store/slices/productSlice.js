import { createSlice } from "@reduxjs/toolkit";
export const defaultOpenKeys = ["sortBy"];
const initialState = {
  productLoading: false,
  recentlyProductLoading: false,
  latestProductList: [],
  recentlyViewProductList: [],
  productDetail: {},
  collectionTypeProductList: [],
  currentPage: 0,
  selectedVariations: [],
  productQuantity: 1,
  selectedSortByValue: "date_new_to_old",
  openKeys: defaultOpenKeys,
  showFilterSidebar: false,
  uniqueFilterOptions: {},
  selectedSettingStyles: "",
  selectedDiamondShape: "",
  selectedPrices: [],
  customizeProductList: [],
  customizeProductLoading: false,
  productMessage: { message: "", type: "" },
  searchedProductList: [],
  searchQuery: "",
  resultCount: 0,
  hasSearched: false,
  productsPerPage: 8,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setRecentlyProductLoading: (state, action) => {
      state.recentlyProductLoading = action.payload;
    },
    setRecentlyViewProductList: (state, action) => {
      state.recentlyViewProductList = action.payload;
    },
    setLatestProductList: (state, action) => {
      state.latestProductList = action.payload;
    },
    setCollectionTypeProductList: (state, action) => {
      state.collectionTypeProductList = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedVariations: (state, action) => {
      state.selectedVariations = action.payload;
    },
    setProductQuantity: (state, action) => {
      state.productQuantity = action.payload;
    },

    setProductMessage: (state, action) => {
      state.productMessage = action.payload;
    },

    // Filter Sidebar States
    setSortByValue: (state, action) => {
      state.selectedSortByValue = action.payload;
    },
    setOpenKeys: (state, action) => {
      state.openKeys = action.payload;
    },
    toggleOpenKey: (state, action) => {
      const key = action.payload;
      if (state.openKeys.includes(key)) {
        state.openKeys = state.openKeys.filter((k) => k !== key);
      } else {
        state.openKeys.push(key);
      }
    },
    setShowFilterSidebar: (state, action) => {
      state.showFilterSidebar = action.payload;
    },
    resetFilters: (state) => {
      state.selectedSortByValue = "date_new_to_old";
      state.selectedVariations = [];
      state.openKeys = defaultOpenKeys;
      state.selectedSettingStyles = "";
      state.selectedDiamondShape = "";
      state.selectedPrices = [];
    },
    setSelectedPrices: (state, action) => {
      state.selectedPrices = action.payload;
    },
    setUniqueFilterOptions: (state, action) => {
      state.uniqueFilterOptions = action.payload;
    },
    setSelectedSettingStyle: (state, action) => {
      state.selectedSettingStyles = action.payload;
    },

    // Customize Product List States
    setCustomizeProductList: (state, action) => {
      state.customizeProductList = action.payload;
    },
    setCustomizeProductLoading: (state, action) => {
      state.customizeProductLoading = action.payload;
    },
    setSearchedProductList: (state, action) => {
      state.searchedProductList = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setResultCount: (state, action) => {
      state.resultCount = action.payload;
    },
    setHasSearched: (state, action) => {
      state.hasSearched = action.payload;
    },
    setProductsPerPage: (state, action) => {
      state.productsPerPage = action.payload;
    },
    setSelectedDiamondShape: (state, action) => {
      state.selectedDiamondShape = action.payload;
    },
  },
});

export const {
  setProductLoading,
  setRecentlyProductLoading,
  setRecentlyViewProductList,
  setLatestProductList,
  setCollectionTypeProductList,
  setProductDetail,
  setCurrentPage,
  setSelectedVariations,
  setProductQuantity,
  setProductMessage,
  setSortByValue,
  setShowFilterSidebar,
  resetFilters,
  setOpenKeys,
  setSelectedPrices,
  toggleOpenKey,
  setUniqueFilterOptions,
  setSelectedSettingStyle,
  setCustomizeProductList,
  setCustomizeProductLoading,
  setSearchedProductList,
  setSearchQuery,
  setResultCount,
  setHasSearched,
  setProductsPerPage,
  setSelectedDiamondShape,
} = productSlice.actions;

export default productSlice.reducer;
