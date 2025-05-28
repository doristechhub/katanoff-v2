import { toast } from 'react-toastify';

import { helperFunctions } from 'src/_helpers';
import { brandSliderService } from 'src/_services';
import { setBrandLoading, setBrandsList, setCrudBrandLoading } from 'src/store/slices/brandSlice';
import { toastError } from '.';

export const getBrands = () => async (dispatch) => {
  try {
    dispatch(setBrandLoading(true));
    const res = await brandSliderService.getAllBrandSlider();

    dispatch(setBrandsList(helperFunctions.sortByField(res) || []));
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setBrandLoading(false));
  }
};

export const deleteBrand = (id) => async (dispatch) => {
  try {
    dispatch(setCrudBrandLoading(true));
    const res = await brandSliderService.deleteBrandSlider({
      brandSliderId: id,
    });

    if (res) {
      toast.success('Brand deleted successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudBrandLoading(false));
  }
};

export const createBrand = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudBrandLoading(true));
    const res = await brandSliderService.insertBrandSlider(payload);

    if (res) {
      toast.success('Brand created successfully');
      return true;
    } else return false;
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudBrandLoading(false));
  }
};
