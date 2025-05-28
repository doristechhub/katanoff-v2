import { toastError } from '.';
import { usersService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';
import { setUserList, setUserLoading } from 'src/store/slices/userSlice';

// ----------------------------------------------------------------------

export const getUserList = () => async (dispatch) => {
  try {
    dispatch(setUserLoading(true));
    const res = await usersService.getAllUserList();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setUserList(list || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setUserLoading(false));
  }
};
