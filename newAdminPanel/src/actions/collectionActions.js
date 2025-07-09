import { toast } from 'react-toastify';

import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { collectionService } from 'src/_services';
import {
  initCollection,
  setCollectionList,
  setCollectionLoading,
  setCrudCollectionLoading,
  setSelectedCollection,
} from 'src/store/slices/collectionSlice';

// ----------------------------------------------------------------------

export const getCollectionList = () => async (dispatch) => {
  try {
    dispatch(setCollectionLoading(true));
    const res = await collectionService.getAllCollection();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setCollectionList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCollectionLoading(false));
  }
};

export const getSingleCollection = (collectionId) => async (dispatch) => {
  try {
    dispatch(setCrudCollectionLoading(true));
    const res = await collectionService.getSingleCollection(collectionId);
    if (res) {
      let updatedCollection = {
        ...initCollection, ...res,
        selectedProductsList: (res.products || []).map((product) => ({
          ...product,
          selected: true,
        })),
      };
      // Desktop Banner Image
      const desktopBannerImageUrl = res?.desktopBannerImage;
      if (desktopBannerImageUrl) {
        const url = new URL(desktopBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const desktopBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: desktopBannerImageUrl,
        };
        updatedCollection = {
          ...updatedCollection,
          desktopBannerFile: [],
          desktopBannerPreviewImage: [desktopBannerPreviewImageObj],
          desktopBannerUploadedDeletedImage: [],
        };
      }
      // Mobile Banner Image
      const mobileBannerImageUrl = res?.mobileBannerImage;
      if (mobileBannerImageUrl) {
        const url = new URL(mobileBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const mobileBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: mobileBannerImageUrl,
        };
        updatedCollection = {
          ...updatedCollection,
          mobileBannerFile: [],
          mobileBannerPreviewImage: [mobileBannerPreviewImageObj],
          mobileBannerUploadedDeletedImage: [],
        };
      }

      // Thumbnail Image
      const thumbnailImageUrl = res?.thumbnailImage;
      if (thumbnailImageUrl) {
        const url = new URL(thumbnailImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const thumbnailPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: thumbnailImageUrl,
        };
        updatedCollection = {
          ...updatedCollection,
          thumbnailFile: [],
          thumbnailPreviewImage: [thumbnailPreviewImageObj],
          thumbnailUploadedDeletedImage: [],
        };
      }

      dispatch(setSelectedCollection(updatedCollection));
      return updatedCollection;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCollectionLoading(false));
  }
};

export const deleteCollection = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCollectionLoading(true));
    const res = await collectionService.deleteCollection(payload);

    if (res) {
      toast.success('Collection deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCollectionLoading(false));
  }
};

export const createCollection = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCollectionLoading(true));
    const res = await collectionService.insertCollection(payload);

    if (res) {
      toast.success('Collection added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCollectionLoading(false));
  }
};

export const updateCollection = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudCollectionLoading(true));
    const res = await collectionService.updateCollection(payload);

    if (res) {
      toast.success('Collection updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudCollectionLoading(false));
  }
};
