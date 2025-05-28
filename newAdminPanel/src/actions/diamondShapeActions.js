import { toast } from 'react-toastify';

import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { diamondShapeService } from 'src/_services';
import {
  setDiamondShapeList,
  setDiamondShapeLoading,
  setCrudDiamondShapeLoading,
} from 'src/store/slices/diamondShapeSlice';

// ----------------------------------------------------------------------

export const getDiamondShapeList = () => async (dispatch) => {
  try {
    dispatch(setDiamondShapeLoading(true));
    const res = await diamondShapeService.getAllDiamondShape();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setDiamondShapeList(helperFunctions.sortByField(list) || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setDiamondShapeLoading(false));
  }
};

export const deleteDiamondShape = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiamondShapeLoading(true));
    const res = await diamondShapeService.deleteDiamondShape(payload);

    if (res) {
      toast.success('DiamondShape deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiamondShapeLoading(false));
  }
};

export const createDiamondShape = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiamondShapeLoading(true));
    const res = await diamondShapeService.insertDiamondShape(payload);

    if (res) {
      toast.success('DiamondShape added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiamondShapeLoading(false));
  }
};

export const updateDiamondShape = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudDiamondShapeLoading(true));
    const res = await diamondShapeService.updateDiamondShape(payload);

    if (res) {
      toast.success('DiamondShape updated successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudDiamondShapeLoading(false));
  }
};
