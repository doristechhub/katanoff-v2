import { createSlice } from '@reduxjs/toolkit';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  PRICE_CALCULATION_MODES,
} from 'src/_helpers/constants';

export const initDiamondFilters = {
  diamondShapeIds: [],
  caratWeightRange: {
    min: ALLOW_MIN_CARAT_WEIGHT,
    max: ALLOW_MAX_CARAT_WEIGHT,
  },
};

export const productInitDetails = {
  roseGoldImageFiles: [],
  roseGoldPreviewImages: [],
  roseGoldUploadedDeletedImages: [],
  roseGoldThumbnailImageFile: [],
  roseGoldPreviewThumbnailImage: [],
  roseGoldUploadedDeletedThumbnailImage: [],
  roseGoldVideoFile: [],
  roseGoldPreviewVideo: [],
  roseGoldDeleteUploadedVideo: [],
  yellowGoldImageFiles: [],
  yellowGoldPreviewImages: [],
  yellowGoldUploadedDeletedImages: [],
  yellowGoldThumbnailImageFile: [],
  yellowGoldPreviewThumbnailImage: [],
  yellowGoldUploadedDeletedThumbnailImage: [],
  yellowGoldVideoFile: [],
  yellowGoldPreviewVideo: [],
  yellowGoldDeleteUploadedVideo: [],
  whiteGoldImageFiles: [],
  whiteGoldPreviewImages: [],
  whiteGoldUploadedDeletedImages: [],
  whiteGoldThumbnailImageFile: [],
  whiteGoldPreviewThumbnailImage: [],
  whiteGoldUploadedDeletedThumbnailImage: [],
  whiteGoldVideoFile: [],
  whiteGoldPreviewVideo: [],
  whiteGoldDeleteUploadedVideo: [],
  productName: '',
  sku: '',
  saltSKU: '',
  discount: '',
  collectionIds: [],
  settingStyleIds: [],
  categoryId: '',
  subCategoryIds: [],
  productTypeIds: [],
  gender: '',
  netWeight: '',
  grossWeight: '',
  totalCaratWeight: '',
  centerDiamondWeight: '',
  sideDiamondWeight: '',
  Length: '',
  width: '',
  lengthUnit: 'mm',
  widthUnit: 'mm',
  shortDescription: '',
  description: '',
  variations: [
    {
      subTypes: [],
      variationId: '',
      position: 1,
      variationTypes: [
        {
          variationTypeId: '',
          position: 1,
        },
      ],
    },
  ],
  active: true,
  priceCalculationMode: PRICE_CALCULATION_MODES.AUTOMATIC,
  specifications: [],
  tempVariComboWithQuantity: [],
  isDiamondFilter: false,
  diamondFilters: initDiamondFilters,
};

export const combinationInitDetails = {
  variComboWithQuantity: [
    {
      combination: [
        {
          variationId: '',
          variationName: '',
          variationTypeId: '',
          variationTypeName: '',
        },
      ],
      price: 0,
      quantity: 0,
    },
  ],
};

const initialState = {
  menuList: {},
  productList: [],
  perPageCount: 12,
  categoriesList: [],
  productTypesList: [],
  productLoading: true,
  subCategoriesList: [],
  activeProductList: [],
  crudProductLoading: false,
  processedProductLoading: false,
  duplicateProductLoading: false,
  customizationTypesList: [],
  customizationSubTypesList: [],
  processedProductList: [],
  selectedProduct: productInitDetails,
  isDuplicateProduct: false,
  combinations: combinationInitDetails,
  exportExcelLoading: false,
  filterState: {
    searchQuery: '',
    selectedProductStatus: 'all',
    filterByCategory: 'all',
    filterBySubCategory: 'all',
    filterByCollection: 'all',
    filterBySettingStyle: 'all',
    filterByProductType: 'all',
    filterByGender: 'all',
    page: 1,
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setPerPageCount: (state, action) => {
      state.perPageCount = action.payload;
    },
    setCategoriesList: (state, action) => {
      state.categoriesList = action.payload;
    },
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setProcessedProductLoading: (state, action) => {
      state.processedProductLoading = action.payload;
    },
    setProcessedProductList: (state, action) => {
      state.processedProductList = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setIsDuplicateProduct: (state, action) => {
      state.isDuplicateProduct = action.payload;
    },
    setProductTypesList: (state, action) => {
      state.productTypesList = action.payload;
    },
    setSubCategoriesList: (state, action) => {
      state.subCategoriesList = action.payload;
    },
    setActiveProductList: (state, action) => {
      state.activeProductList = action.payload;
    },
    setCrudProductLoading: (state, action) => {
      state.crudProductLoading = action.payload;
    },
    setDuplicateProductLoading: (state, action) => {
      state.duplicateProductLoading = action.payload;
    },
    setCustomizationTypesList: (state, action) => {
      state.customizationTypesList = action.payload;
    },
    setCustomizationSubTypesList: (state, action) => {
      state.customizationSubTypesList = action.payload;
    },
    setExportExcelLoading: (state, action) => {
      state.exportExcelLoading = action.payload;
    },
    setFilterState(state, action) {
      state.filterState = { ...state.filterState, ...action.payload };
    },
    clearFilterState(state) {
      state.filterState = {
        searchQuery: '',
        selectedProductStatus: 'all',
        filterByCategory: 'all',
        filterBySubCategory: 'all',
        filterByCollection: 'all',
        filterBySettingStyle: 'all',
        filterByProductType: 'all',
        filterByGender: 'all',
        page: 1,
      };
    },
  },
});

export const {
  setMenuList,
  setProductList,
  setPerPageCount,
  setProductLoading,
  setProcessedProductLoading,
  setProcessedProductList,
  setCategoriesList,
  setSelectedProduct,
  setIsDuplicateProduct,
  setProductTypesList,
  setActiveProductList,
  setSubCategoriesList,
  setCrudProductLoading,
  setCustomizationTypesList,
  setCustomizationSubTypesList,
  setExportExcelLoading,
  setDuplicateProductLoading,
  setFilterState,
  clearFilterState,
} = productSlice.actions;
export default productSlice.reducer;
