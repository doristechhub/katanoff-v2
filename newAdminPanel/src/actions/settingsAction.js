import { toast } from 'react-toastify';
import { settingsService } from 'src/_services';
import { setPriceMultiplier, setLoading, setSetttingsError } from 'src/store/slices/settingsSlice';

export const fetchPriceMultiplier = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const priceMultiplier = await settingsService.fetchPriceMultiplier();
    dispatch(setPriceMultiplier(priceMultiplier));
    return true;
  } catch (e) {
    dispatch(setSetttingsError(e.message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const upsertPriceMultiplier = (payload) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await settingsService.upsertPriceMultiplier(payload);

    if (res) {
      dispatch(setPriceMultiplier(res));
      toast.success(`Price Multiplier changed successfully`);
      return true;
    }
    dispatch(setPriceMultiplier(1));
  } catch (e) {
    dispatch(setPriceMultiplier(1));
    dispatch(setSetttingsError(e.message));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};
