import { toastError } from '.';
import { subscribersService, toast, usersService } from 'src/_services';
import { helperFunctions } from 'src/_helpers';
import { setContactsList, setContactsLoading } from 'src/store/slices/contactSlice';
import { contactService } from 'src/_services/contacts.service';

// ----------------------------------------------------------------------

export const getContactsList = () => async (dispatch) => {
  try {
    dispatch(setContactsLoading(true));
    const res = await contactService.getAllContacts();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setContactsList(list || []));
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setContactsLoading(false));
  }
};

export const deleteContact = (payload) => async (dispatch) => {
  try {
    dispatch(setContactsLoading(true));
    const res = await contactService.deleteContact(payload);

    if (res) {
      toast.success('Contact deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setContactsLoading(false));
  }
};
