import { toast } from 'react-toastify';

import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { collectionService } from 'src/_services';
import {
  setCollectionList,
  setCollectionLoading,
  setCrudCollectionLoading,
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
