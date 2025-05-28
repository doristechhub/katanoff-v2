import { setOrdersList, setOrdersLoading } from 'src/store/slices/ordersSlice';
import { toastError } from '.';
import { customizationTypeService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

export const getCustomaizationTypeList = () => async (dispatch) => {
  try {
    a;
    dispatch(setOrdersLoading(true));
    const res = await customizationTypeService.getAllCustomizationTypes();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setOrdersList(list || []));
      return list;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setOrdersLoading(false));
  }
};
