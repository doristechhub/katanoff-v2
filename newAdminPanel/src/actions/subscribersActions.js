import { toastError } from '.';
import { subscribersService, toast, usersService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';
import { setSubscribersList, setSubscribersLoading } from 'src/store/slices/subscribersSlice';

// ----------------------------------------------------------------------

export const getSubscribersList = () => async (dispatch) => {
  try {
    dispatch(setSubscribersLoading(true));
    const res = await subscribersService.getAllSubscribers();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setSubscribersList(list || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setSubscribersLoading(false));
  }
};

export const deleteSubscriber = (payload) => async (dispatch) => {
  try {
    dispatch(setSubscribersLoading(true));
    const res = await subscribersService.deleteSubscriber(payload);

    if (res) {
      toast.success('Subscriber deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setSubscribersLoading(false));
  }
};
