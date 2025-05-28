import { createSlice } from '@reduxjs/toolkit';
import { helperFunctions } from 'src/_helpers';
import { topSellingDurationButtonsList } from 'src/_helpers/constants';

export const initVariationvalue = {
  variationId: '',
  variationTypeId: '',
};

const initialState = {
  filterBy: '',
  searchValue: '',
  selectedVariation: [],

  orderStatusLoader: false,
  orderStatusCountList: [],
  orderDateRange: helperFunctions.getWeeksRange(),

  salesCompLoader: false,
  selectedYearSalesComp: helperFunctions.lastFiveYears()?.[0],
  salesGraphData: { timePeriodList: [], salesAmountList: [], refundAmountList: [] },

  topSellingCurrentPage: 1,
  topSellingLoader: false,
  topSellingProductsList: [],
  topSellingLimit: { label: 'All', value: 0 },
  topSellingDateRange: helperFunctions.getWeeksRange(),
  topSellingPriceRange: { minPrice: null, maxPrice: null },
  topSellingSelectedDuration: topSellingDurationButtonsList[0],
  topSellingFilteredItems: [],

  downloadPdfLoader: false,
  exportToExcelLoader: false,
  printLoader: false,
};

const reportAndAnalysisSlice = createSlice({
  name: 'reportAndAnalysis',
  initialState,
  reducers: {
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSelectedVariation: (state, action) => {
      state.selectedVariation = action.payload;
    },
    setOrderStatusLoader: (state, action) => {
      state.orderStatusLoader = action.payload;
    },
    setOrderStatusCountList: (state, action) => {
      state.orderStatusCountList = action.payload;
    },
    setOrderDateRange: (state, action) => {
      state.orderDateRange = action.payload;
    },
    setSalesCompLoader: (state, action) => {
      state.salesCompLoader = action.payload;
    },
    setSalesGraphData: (state, action) => {
      state.salesGraphData = action.payload;
    },
    setSelectedYearSalesComp: (state, action) => {
      state.selectedYearSalesComp = action.payload;
    },
    setTopSellingCurrentPage: (state, action) => {
      state.topSellingCurrentPage = action.payload;
    },
    setTopSellingLoader: (state, action) => {
      state.topSellingLoader = action.payload;
    },
    setTopSellingProductsList: (state, action) => {
      state.topSellingProductsList = action.payload;
    },
    setTopSellingLimit: (state, action) => {
      state.topSellingLimit = action.payload;
    },
    setTopSellingSelectedDuration: (state, action) => {
      state.topSellingSelectedDuration = action.payload;
    },
    setTopSellingDateRange: (state, action) => {
      state.topSellingDateRange = action.payload;
    },
    setTopSellingPriceRange: (state, action) => {
      state.topSellingPriceRange = action.payload;
    },
    setTopSellingFilteredItems: (state, action) => {
      state.topSellingFilteredItems = action.payload;
    },
    setDownloadPdfLoader: (state, action) => {
      state.downloadPdfLoader = action.payload;
    },
    setExportToExcelLoader: (state, action) => {
      state.exportToExcelLoader = action.payload;
    },
    setPrintLoader: (state, action) => {
      state.printLoader = action.payload;
    },
  },
});

export const {
  setFilterBy,
  setSearchValue,
  setSelectedVariation,

  setOrderStatusLoader,
  setOrderStatusCountList,
  setOrderDateRange,

  setSalesCompLoader,
  setSalesGraphData,
  setSelectedYearSalesComp,

  setTopSellingCurrentPage,
  setTopSellingLimit,
  setTopSellingSelectedDuration,
  setTopSellingLoader,
  setTopSellingPriceRange,
  setTopSellingProductsList,
  setTopSellingDateRange,
  setTopSellingFilteredItems,

  setDownloadPdfLoader,
  setExportToExcelLoader,
  setPrintLoader,
} = reportAndAnalysisSlice.actions;
export default reportAndAnalysisSlice.reducer;
