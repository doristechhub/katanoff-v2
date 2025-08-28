import { createSlice } from '@reduxjs/toolkit';

export const initMenuProductType = {
  title: '',
  categoryId: undefined,
  subCategoryId: undefined,
  position: undefined,
  imageFile: [],
  previewImage: [],
  deleteUploadedImage: [],
};

export const initMenuCategory = {
  title: '',
  desktopBannerFile: [],
  desktopBannerPreviewImage: [],
  desktopBannerUploadedDeletedImage: [],
  mobileBannerFile: [],
  mobileBannerPreviewImage: [],
  mobileBannerUploadedDeletedImage: [],
};

export const initMenuSubCategory = {
  title: '',
  categoryId: undefined,
  position: undefined,
  imageFile: [],
  previewImage: [],
  deleteUploadedImage: [],
  desktopBannerFile: [],
  desktopBannerPreviewImage: [],
  desktopBannerUploadedDeletedImage: [],
  mobileBannerFile: [],
  mobileBannerPreviewImage: [],
  mobileBannerUploadedDeletedImage: [],
};

const initialState = {
  page: 0,
  categoryList: [],
  productTypePage: 0,
  menuLoading: false,
  menuProductTypeList: [],
  crudMenuLoading: false,
  menuSubCategoryList: [],
  menuProductTypeLoading: false,
  menuSubCategoryLoading: false,
  crudMenuProductTypeLoading: false,
  crudMenuSubCategoryLoading: false,
  selectedMenuCategory: initMenuCategory,
  selectedMenuProductType: initMenuProductType,
  selectedMenuSubCategory: initMenuSubCategory,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setProductTypePage: (state, action) => {
      state.productTypePage = action.payload;
    },
    setMenuLoading: (state, action) => {
      state.menuLoading = action.payload;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
    setCrudMenuLoading: (state, action) => {
      state.crudMenuLoading = action.payload;
    },
    setMenuSubCategoryList: (state, action) => {
      state.menuSubCategoryList = action.payload;
    },
    setSelectedMenuCategory: (state, action) => {
      state.selectedMenuCategory = action.payload;
    },
    setSelectedMenuSubCategory: (state, action) => {
      state.selectedMenuSubCategory = action.payload;
    },
    setMenuSubCategoryLoading: (state, action) => {
      state.menuSubCategoryLoading = action.payload;
    },
    setMenuCrudSubCategoryLoading: (state, action) => {
      state.crudMenuSubCategoryLoading = action.payload;
    },
    setCrudMenuProductTypeLoading: (state, action) => {
      state.crudMenuProductTypeLoading = action.payload;
    },
    setMenuProductTypeList: (state, action) => {
      state.menuProductTypeList = action.payload;
    },
    setMenuProductTypeLoading: (state, action) => {
      state.menuProductTypeLoading = action.payload;
    },
    setSelectedMenuProductType: (state, action) => {
      state.selectedMenuProductType = action.payload;
    },
  },
});

export const {
  setPage,
  setMenuLoading,
  setCategoryList,
  setCrudMenuLoading,
  setProductTypePage,
  setMenuProductTypeList,
  setMenuSubCategoryList,
  setSelectedMenuCategory,
  setMenuProductTypeLoading,
  setMenuSubCategoryLoading,
  setSelectedMenuProductType,
  setSelectedMenuSubCategory,
  setCrudMenuProductTypeLoading,
  setMenuCrudSubCategoryLoading,
} = menuSlice.actions;
export default menuSlice.reducer;
