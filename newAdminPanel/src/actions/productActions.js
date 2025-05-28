import { toast } from 'react-toastify';

import { toastError } from '.';

import {
  customizationSubTypeService,
  customizationTypeService,
  productService,
} from 'src/_services';
import {
  setMenuList,
  setProductList,
  setProductLoading,
  setCategoriesList,
  setSelectedProduct,
  setActiveProductList,
  setCrudProductLoading,
  setCustomizationTypesList,
  setCustomizationSubTypesList,
  productInitDetails,
} from 'src/store/slices/productSlice';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

export const getProducts = () => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const res = await productService.getAllProductsWithPagging();

    await dispatch(setProductList(helperFunctions.sortByField(res) || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const processBulkProductsWithApi = () => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.processBulkProductsWithApi();

    if (res) {
      toast.success('Processed Product successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.deleteProduct(id);

    if (res) {
      toast.success('Product deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const getAllCustomizationTypeList = () => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const res = await customizationTypeService.getAllCustomizationTypes();

    dispatch(setCustomizationTypesList(res || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const getAllCustomizationSubTypeList = () => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const res = await customizationSubTypeService.getAllCustomizationSubTypes();

    dispatch(setCustomizationSubTypesList(res || []));
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const createProduct = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.insertProduct(payload);

    if (res) {
      toast.success('Product inserted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const getSingleProduct = (productId) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.getSingleProduct(productId);

    if (res) {
      let product = { ...productInitDetails, ...res };

      if (res?.images?.length) {
        const imagesArray = res?.images?.map((image) => {
          return {
            type: 'old',
            image: image.image,
          };
        });
        product = {
          ...product,
          imageFiles: [],
          previewImages: imagesArray,
          uploadedDeletedImages: [],
        };
      }

      const thumbnailImageUrl = res?.thumbnailImage;
      if (thumbnailImageUrl) {
        const url = new URL(thumbnailImageUrl);
        const fileExtension = url.pathname.split('.').pop();

        const previewThumbnailImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: thumbnailImageUrl,
        };
        product = {
          ...product,
          thumbnailImageFile: [],
          uploadedDeletedThumbnailImage: [],
          previewThumbnailImage: [previewThumbnailImageObj],
        };
      }

      const videoUrl = res?.video;
      if (videoUrl) {
        const url = new URL(videoUrl);
        const fileExtension = url.pathname.split('.').pop();

        const previewVideoObj = {
          type: 'old',
          mimeType: `video/${fileExtension}`,
          video: videoUrl,
        };
        product = {
          ...product,
          videoFile: [],
          deleteUploadedVideo: [],
          previewVideo: [previewVideoObj],
        };
      }
      dispatch(setSelectedProduct(product));
      return res;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateStatusProduct = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.activeDeactiveProduct(payload);

    if (res) return res;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateProduct = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateProduct(payload);

    if (res) {
      toast.success('Product updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateProductPhotosAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateProductPhotos(payload);

    if (res) {
      toast.success('Product updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateProductThumbnailPhotoAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateProductThumbnailPhoto(payload);

    if (res) {
      toast.success('Product thumbnail image updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateProductVideoAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateProductVideo(payload);

    if (res) {
      toast.success('Product video updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const getActiveProducts = () => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const res = await productService.getAllActiveProducts();

    if (res) {
      dispatch(setActiveProductList(helperFunctions.sortByField(res) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};
