import { toast } from 'react-toastify';

import { toastError } from '.';
import { helperFunctions } from 'src/_helpers';
import { adminService } from 'src/_services';
import {
  setAdminsList,
  setPermissionsLoading,
  setCrudPermissionsLoading,
  setPermissionsOfAllAdmins,
  setAssignPermissionsLoading,
} from 'src/store/slices/permissionsSlice';

// ----------------------------------------------------------------------

export const getAdminsList = () => async (dispatch) => {
  try {
    dispatch(setPermissionsLoading(true));
    const res = await adminService.getAllAdmins();

    if (res) {
      let list = helperFunctions.sortByField(res);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setAdminsList(helperFunctions.sortByField(list) || []));

      let permissionAdminwise = {};
      list.forEach((admin) => {
        permissionAdminwise[admin?.id] = admin?.permissions?.map(
          (permission) => permission?.pageId
        );
      });

      dispatch(setPermissionsOfAllAdmins(permissionAdminwise));
      return list;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setPermissionsLoading(false));
  }
};

export const deleteAdmin = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudPermissionsLoading(true));
    const res = await adminService.deleteAdmin(payload);

    if (res) {
      toast.success('Admin deleted successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudPermissionsLoading(false));
  }
};

export const insertAdmin = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudPermissionsLoading(true));
    const res = await adminService.createAdmin(payload);

    if (res) {
      toast.success('Admin added successfully');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudPermissionsLoading(false));
  }
};

export const updateAdminPermission = (payload) => async (dispatch) => {
  try {
    dispatch(setAssignPermissionsLoading(true));
    const res = await adminService.updateAdminPermission(payload);

    if (res) {
      toast.success('Admin has been successfully updated.');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setAssignPermissionsLoading(false));
  }
};

export const updateAdmin = (payload) => async (dispatch) => {
  try {
    dispatch(setCrudPermissionsLoading(true));
    const res = await adminService.updateAdmin(payload);

    if (res) {
      toast.success('Admin has been successfully updated.');
      return true;
    }
  } catch (e) {
    toastError(e);
    return false;
  } finally {
    dispatch(setCrudPermissionsLoading(false));
  }
};
