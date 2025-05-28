import { toastError } from '.';

import {
  setCrudShowCaseBannerLoading,
  setShowCaseBannerLoading,
  setShowCaseBannersList,
} from 'src/store/slices/showCaseBannerSlice';
import { helperFunctions } from 'src/_helpers';
import { showCaseBannerService, toast } from 'src/_services';

// ----------------------------------------------------------------------

export const getShowCaseBannersList = () => async (dispatch) => {
  try {
    dispatch(setShowCaseBannerLoading(true));
    const res = await showCaseBannerService.getAllShowCaseBannersWithProduct();

    dispatch(
      setShowCaseBannersList(typeof res === 'object' ? helperFunctions.sortByField(res) : [])
    );
    return true;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setShowCaseBannerLoading(false));
  }
};

export const deleteShowCaseBanner = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudShowCaseBannerLoading(true));
    const res = await showCaseBannerService.deleteShowCaseBanner(payload);

    if (res) {
      toast.success('Show case banner deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudShowCaseBannerLoading(false));
  }
};

export const addShowCaseBanner = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudShowCaseBannerLoading(true));
    const res = await showCaseBannerService.insertShowCaseBanner(payload);

    if (res) {
      toast.success('Show case banner added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudShowCaseBannerLoading(false));
  }
};
