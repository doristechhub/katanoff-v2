import { createSlice } from "@reduxjs/toolkit";
export const defaultsmOpenFilter = ["shape", "metal", "settingStyle", "price"];
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
  smOpenFilter: defaultsmOpenFilter,
  isFilterMenuOpen: false,
  isFilterFixed: false,
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
  searchResults: [],
  searchQuery: "",
  resultCount: 0,
  hasSearched: false,
  productsPerPage: 8,
  filteredProducts: [],
  visibleItemCount: 10,
  bannerLoading: false,
  banners: {
    desktop: "",
    mobile: "",
  },
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
    setIsFilterFixed: (state, action) => {
      state.isFilterFixed = action.payload;
    },
    setSMOpenFilter: (state, action) => {
      state.smOpenFilter = action.payload;
    },
    toggleSMOpenFilter: (state, action) => {
      const filter = action.payload;
      if (state.smOpenFilter.includes(filter)) {
        state.smOpenFilter = state.smOpenFilter.filter(
          (item) => item !== filter
        );
      } else {
        state.smOpenFilter.push(filter);
      }
    },
    setIsFilterMenuOpen: (state, action) => {
      state.isFilterMenuOpen = action.payload;
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
      state.smOpenFilter = defaultsmOpenFilter;
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
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
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

    setBannerLoading: (state, action) => {
      state.bannerLoading = action.payload;
    },
    setBanners: (state, action) => {
      state.banners = action.payload;
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
  setIsFilterMenuOpen,
  resetFilters,
  setSMOpenFilter,
  setIsFilterFixed,
  setSelectedPrices,
  setUniqueFilterOptions,
  setSelectedSettingStyles,
  setSelectedSettingStyle,
  setCustomizeProductList,
  setCustomizeProductLoading,
  setSearchedProductList,
  setSearchResults,
  setSearchQuery,
  setResultCount,
  setHasSearched,
  setProductsPerPage,
  setSelectedDiamondShapes,
  setSelectedDiamondShape,
  setVisibleItemCount,
  toggleSMOpenFilter,
  setFilteredProducts,
  setBannerLoading,
  setBanners,
} = productSlice.actions;

export default productSlice.reducer;
