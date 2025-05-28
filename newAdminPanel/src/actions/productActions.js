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

      // Rose Gold Images
      if (res?.roseGoldImages?.length) {
        const roseGoldImagesArray = res.roseGoldImages.map((image) => ({
          type: 'old',
          image: image.image,
        }));
        product = {
          ...product,
          roseGoldImageFiles: [],
          roseGoldPreviewImages: roseGoldImagesArray,
          roseGoldUploadedDeletedImages: [],
        };
      }

      // Rose Gold Thumbnail Image
      const roseGoldThumbnailImageUrl = res?.roseGoldThumbnailImage;
      if (roseGoldThumbnailImageUrl) {
        const url = new URL(roseGoldThumbnailImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const roseGoldPreviewThumbnailImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: roseGoldThumbnailImageUrl,
        };
        product = {
          ...product,
          roseGoldThumbnailImageFile: [],
          roseGoldUploadedDeletedThumbnailImage: [],
          roseGoldPreviewThumbnailImage: [roseGoldPreviewThumbnailImageObj],
        };
      }

      // Rose Gold Video
      const roseGoldVideoUrl = res?.roseGoldVideo;
      if (roseGoldVideoUrl) {
        const url = new URL(roseGoldVideoUrl);
        const fileExtension = url.pathname.split('.').pop();
        const roseGoldPreviewVideoObj = {
          type: 'old',
          mimeType: `video/${fileExtension}`,
          video: roseGoldVideoUrl,
        };
        product = {
          ...product,
          roseGoldVideoFile: [],
          roseGoldDeleteUploadedVideo: [],
          roseGoldPreviewVideo: [roseGoldPreviewVideoObj],
        };
      }

      // Yellow Gold Images
      if (res?.yellowGoldImages?.length) {
        const yellowGoldImagesArray = res.yellowGoldImages.map((image) => ({
          type: 'old',
          image: image.image,
        }));
        product = {
          ...product,
          yellowGoldImageFiles: [],
          yellowGoldPreviewImages: yellowGoldImagesArray,
          yellowGoldUploadedDeletedImages: [],
        };
      }

      // Yellow Gold Thumbnail Image
      const yellowGoldThumbnailImageUrl = res?.yellowGoldThumbnailImage;
      if (yellowGoldThumbnailImageUrl) {
        const url = new URL(yellowGoldThumbnailImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const yellowGoldPreviewThumbnailImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: yellowGoldThumbnailImageUrl,
        };
        product = {
          ...product,
          yellowGoldThumbnailImageFile: [],
          yellowGoldUploadedDeletedThumbnailImage: [],
          yellowGoldPreviewThumbnailImage: [yellowGoldPreviewThumbnailImageObj],
        };
      }

      // Yellow Gold Video
      const yellowGoldVideoUrl = res?.yellowGoldVideo;
      if (yellowGoldVideoUrl) {
        const url = new URL(yellowGoldVideoUrl);
        const fileExtension = url.pathname.split('.').pop();
        const yellowGoldPreviewVideoObj = {
          type: 'old',
          mimeType: `video/${fileExtension}`,
          video: yellowGoldVideoUrl,
        };
        product = {
          ...product,
          yellowGoldVideoFile: [],
          yellowGoldDeleteUploadedVideo: [],
          yellowGoldPreviewVideo: [yellowGoldPreviewVideoObj],
        };
      }

      // White Gold Images
      if (res?.whiteGoldImages?.length) {
        const whiteGoldImagesArray = res.whiteGoldImages.map((image) => ({
          type: 'old',
          image: image.image,
        }));
        product = {
          ...product,
          whiteGoldImageFiles: [],
          whiteGoldPreviewImages: whiteGoldImagesArray,
          whiteGoldUploadedDeletedImages: [],
        };
      }

      // White Gold Thumbnail Image
      const whiteGoldThumbnailImageUrl = res?.whiteGoldThumbnailImage;
      if (whiteGoldThumbnailImageUrl) {
        const url = new URL(whiteGoldThumbnailImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const whiteGoldPreviewThumbnailImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: whiteGoldThumbnailImageUrl,
        };
        product = {
          ...product,
          whiteGoldThumbnailImageFile: [],
          whiteGoldUploadedDeletedThumbnailImage: [],
          whiteGoldPreviewThumbnailImage: [whiteGoldPreviewThumbnailImageObj],
        };
      }

      // White Gold Video
      const whiteGoldVideoUrl = res?.whiteGoldVideo;
      if (whiteGoldVideoUrl) {
        const url = new URL(whiteGoldVideoUrl);
        const fileExtension = url.pathname.split('.').pop();
        const whiteGoldPreviewVideoObj = {
          type: 'old',
          mimeType: `video/${fileExtension}`,
          video: whiteGoldVideoUrl,
        };
        product = {
          ...product,
          whiteGoldVideoFile: [],
          whiteGoldDeleteUploadedVideo: [],
          whiteGoldPreviewVideo: [whiteGoldPreviewVideoObj],
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

export const updateRoseGoldMediaAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateRoseGoldMedia(payload);

    if (res) {
      toast.success('Rose Gold media updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateYellowGoldMediaAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateYellowGoldMedia(payload);

    if (res) {
      toast.success('Yellow Gold media updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudProductLoading(false));
  }
};

export const updateWhiteGoldMediaAction = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudProductLoading(true));
    const res = await productService.updateWhiteGoldMedia(payload);

    if (res) {
      toast.success('White Gold media updated successfully');
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
