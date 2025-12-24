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
  setProcessedProductLoading,
  setProcessedProductList,
  setCreateManyProductErrorMsg,
} from 'src/store/slices/productSlice';
import { helperFunctions } from 'src/_helpers';
import CustomError from 'src/_helpers/customError';
import { uid } from 'uid';

// ----------------------------------------------------------------------

export const getProducts = () => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const res = await productService.getAllProductsWithPagging();

    const sortedProducts = helperFunctions.sortByField(res) || [];
    await dispatch(setProductList(sortedProducts));
    return sortedProducts;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProductLoading(false));
  }
};

export const getAllProcessedProducts = () => async (dispatch) => {
  try {
    dispatch(setProcessedProductLoading(true));
    const res = await productService.getAllProcessedProducts();
    const sortedProducts = helperFunctions.sortByField(res) || [];

    await dispatch(setProcessedProductList(sortedProducts));
    return sortedProducts;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setProcessedProductLoading(false));
  }
};

export const createManyProductsFromExcel = (payload) => async (dispatch) => {
  try {
    dispatch(setCreateManyProductErrorMsg(''));

    dispatch(setCrudProductLoading(true));
    const res = await productService.addUpdateManyProducts(payload);
    if (res) {
      toast.success(res);
      return true;
    }
  } catch (err) {
    // toastError(e);
    if (err instanceof CustomError) {
      dispatch(
        setCreateManyProductErrorMsg({ message: err.message, status: err.status, data: err.data })
      );
    } else {
      dispatch(setCreateManyProductErrorMsg({ message: err?.message || 'Something Went Wrong' }));
    }
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

      const customizationSubTypesList = await customizationSubTypeService.getAllCustomizationSubTypes()
      let product = { ...productInitDetails, ...res };

      const formattedMediaMapping = product.mediaMapping.map((item) => {
        const [shapeId, colorId] = item.mediaSetId.split('_');

        const shapeObj = customizationSubTypesList.find(
          (sub) => sub.id === shapeId
        ) || { id: shapeId, name: 'Unknown Shape' };

        const colorObj = customizationSubTypesList.find((sub) => sub.id === colorId);
        const goldColor = colorObj?.title || 'Unknown Color';

        // thumbnail preview
        let previewThumbnailImage = [];
        if (item.thumbnailImage) {
          const uuid = uid();
          const url = new URL(item.thumbnailImage);
          const ext = url.pathname.split('.').pop();
          previewThumbnailImage = [
            {
              id: uuid,
              type: 'old',
              mimeType: `image/${ext}`,
              image: item.thumbnailImage,
            },
          ];
        }

        // images preview
        const previewImages = item.images.map((img) => {
          const uuid = uid();
          const url = new URL(img.image);
          const ext = url.pathname.split('.').pop();
          return {
            id: uuid,
            type: 'old',
            mimeType: `image/${ext}`,
            image: img.image,
          };
        });

        // video preview
        let previewVideo = [];
        if (item.video) {
          const uuid = uid();
          previewVideo = [
            {
              id: uuid,
              type: 'old',
              mimeType: 'video/mp4',
              video: item.video,
            },
          ];
        }

        return {
          mediaSetId: item.mediaSetId,
          name: item.name,
          diamondShape: { id: shapeObj.id, name: shapeObj.title || shapeObj.name },
          goldColor,
          thumbnailImageFile: [],
          previewThumbnailImage,
          deletedThumbnailImage: [],
          imageFiles: [],
          previewImages,
          deletedImages: [],
          videoFile: [],
          previewVideo,
          deleteUploadedVideo: [],
        };
      });

      product = { ...product, mediaMapping: formattedMediaMapping }
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
