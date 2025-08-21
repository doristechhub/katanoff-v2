import { toast } from 'react-toastify';
import { settingsService } from 'src/_services';
import {
  setPriceMultiplier,
  setCustomizedLoading,
  setNonCustomizedError,
  setCustomizedError,
  setCustomizedSettings,
  customizedSettingsInit,
  setNonCustomizedLoading,
  setFailedProductUpdates,
  setAddUpdateNonCustomizedLoading,
} from 'src/store/slices/settingsSlice';

export const fetchPriceMultiplier = () => async (dispatch) => {
  try {
    dispatch(setNonCustomizedLoading(true));
    const priceMultiplier = await settingsService.fetchPriceMultiplier();
    dispatch(setPriceMultiplier(priceMultiplier));
    return true;
  } catch (e) {
    dispatch(setNonCustomizedError(e.message));
    return false;
  } finally {
    dispatch(setNonCustomizedLoading(false));
  }
};

export const upsertPriceMultiplier = (payload) => async (dispatch) => {
  try {
    dispatch(setFailedProductUpdates([]));
    dispatch(setAddUpdateNonCustomizedLoading(true));
    const res = await settingsService.upsertPriceMultiplier(payload);

    if (res) {
      dispatch(setPriceMultiplier(res.priceMultiplier));
      dispatch(setFailedProductUpdates(res.failedProducts || []));

      if (res.failedProducts?.length > 0) {
        toast.warning(`Price Multiplier changed, but some product prices could not be updated`);
      } else {
        toast.success('Price Multiplier changed successfully');
      }

      return true;
    }
    dispatch(setPriceMultiplier(1));
  } catch (e) {
    dispatch(setPriceMultiplier(1));
    dispatch(setNonCustomizedError(e.message));
    return false;
  } finally {
    dispatch(setAddUpdateNonCustomizedLoading(false));
  }
};

export const fetchCustomizedSettings = () => async (dispatch) => {
  try {
    dispatch(setCustomizedLoading(true));
    const customizedSettings = await settingsService.fetchCustomizedSettings();
    dispatch(setCustomizedSettings(customizedSettings || customizedSettingsInit));
    return true;
  } catch (e) {
    dispatch(setCustomizedError(e.message));
    dispatch(setCustomizedSettings(customizedSettingsInit));
    return false;
  } finally {
    dispatch(setCustomizedLoading(false));
  }
};

export const upsertCustomizedSettings = (payload) => async (dispatch) => {
  try {
    dispatch(setCustomizedLoading(true));
    const res = await settingsService.upsertCustomizedSettings(payload);
    dispatch(setCustomizedSettings(res || customizedSettingsInit));
    toast.success(`Customized Settings updated successfully`);
    return true;
  } catch (e) {
    dispatch(setCustomizedError(e.message));
    dispatch(setCustomizedSettings(customizedSettingsInit));
    return false;
  } finally {
    dispatch(setCustomizedLoading(false));
  }
};
