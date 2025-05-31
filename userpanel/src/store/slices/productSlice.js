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
  selectedFilterVariations: {},
  productQuantity: 1,
  selectedSortByValue: "date_new_to_old",
  shortByValue: "date_new_to_old",
  openKeys: defaultOpenKeys,
  showFilterSidebar: false,
  uniqueFilterOptions: {},
  selectedSettingStyles: [],
  selectedSettingStyle: "",
  selectedDiamondShapes: [],
  selectedDiamondShape: "",
  selectedPrices: [],
  selectedGenders: [],
  customizeProductList: [],
  customizeProductLoading: false,
  productMessage: { message: "", type: "" },
  searchedProductList: [],
  searchQuery: "",
  resultCount: 0,
  hasSearched: false,
  productsPerPage: 8,
  filteredProducts: [],
  visibleItemCount: 10,
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
    setSelectedFilterVariations: (state, action) => {
      state.selectedFilterVariations = action.payload;
    },
    setProductQuantity: (state, action) => {
      state.productQuantity = action.payload;
    },

    setProductMessage: (state, action) => {
      state.productMessage = action.payload;
    },

    // Filter Sidebar States
    setSelectedSortByValue: (state, action) => {
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
    setVisibleItemCount: (state, action) => {
      state.visibleItemCount = action.payload;
    },
    setSelectedGenders: (state, action) => {
      state.selectedGenders = action.payload;
    },
    resetFilters: (state) => {
      state.selectedSortByValue = "date_new_to_old";
      state.selectedFilterVariations = {};
      state.openKeys = defaultOpenKeys;
      state.selectedSettingStyles = [];
      state.selectedDiamondShapes = [];
      state.selectedGenders = [];
    },
    setSelectedPrices: (state, action) => {
      state.selectedPrices = action.payload;
    },
    setUniqueFilterOptions: (state, action) => {
      state.uniqueFilterOptions = action.payload;
    },
    setSelectedSettingStyles: (state, action) => {
      state.selectedSettingStyles = action.payload;
    },
    setSelectedSettingStyle: (state, action) => {
      state.selectedSettingStyle = action.payload;
    },
    // Remove that 
    setSortByValue: (state, action) => {
      state.shortByValue = action.payload;
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
    setSelectedDiamondShapes: (state, action) => {
      state.selectedDiamondShapes = action.payload;
    },
    setSelectedDiamondShape: (state, action) => {
      state.selectedDiamondShape = action.payload;
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
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
  setSelectedGenders,
  setSelectedVariations,
  setSelectedFilterVariations,
  setProductQuantity,
  setProductMessage,
  setSelectedSortByValue,
  setShowFilterSidebar,
  resetFilters,
  setOpenKeys,
  setSelectedPrices,
  toggleOpenKey,
  setUniqueFilterOptions,
  setSelectedSettingStyles,
  setSelectedSettingStyle,
  setCustomizeProductList,
  setCustomizeProductLoading,
  setSearchedProductList,
  setSearchQuery,
  setResultCount,
  setHasSearched,
  setProductsPerPage,
  setSelectedDiamondShapes,
  setSelectedDiamondShape,
  setSortByValue,
  setVisibleItemCount,
  setFilteredProducts
} = productSlice.actions;

export default productSlice.reducer;
