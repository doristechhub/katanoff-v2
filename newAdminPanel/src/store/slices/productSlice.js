import { createSlice } from '@reduxjs/toolkit';
import { ALLOW_MAX_CARAT_WEIGHT, ALLOW_MIN_CARAT_WEIGHT } from 'src/_helpers/constants';

export const initDiamondFilters = {
  diamondShapeIds: [],
  caratWeightRange: {
    min: ALLOW_MIN_CARAT_WEIGHT,
    max: ALLOW_MAX_CARAT_WEIGHT,
  },
};

export const productInitDetails = {
  videoFile: [],
  imageFiles: [],
  thumbnailImageFile: [],
  previewVideo: [],
  previewImages: [],
  previewThumbnailImage: [],
  deleteUploadedVideo: [],
  uploadedDeletedImages: [],
  uploadedDeletedThumbnailImage: [],
  productName: '',
  sku: '',
  saltSKU: '',
  discount: '',
  collectionIds: [],
  settingStyleIds: [],
  categoryId: '',
  subCategoryId: '',
  productTypeIds: [],
  netWeight: '',
  shortDescription: '',
  description: '',
  variations: [
    {
      subTypes: [],
      variationId: '',
      variationTypes: [
        {
          variationTypeId: '',
        },
      ],
    },
  ],
  active: true,
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
  duplicateProductLoading: false,
  customizationTypesList: [],
  customizationSubTypesList: [],
  selectedProduct: productInitDetails,
  isDuplicateProduct: false,
  combinations: combinationInitDetails,
  exportExcelLoading: false,
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
  },
});

export const {
  setMenuList,
  setProductList,
  setPerPageCount,
  setProductLoading,
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
} = productSlice.actions;
export default productSlice.reducer;
