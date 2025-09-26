import { uid } from 'uid';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  adminUrl,
  confirmPassword,
  email,
  fetchWrapperService,
  firstName,
  helperFunctions,
  lastName,
  mobile,
  password,
  sanitizeObject,
  userUrl,
} from '../_helpers';
import { setAdminPermissionsLoader, setAdminWisePermisisons } from '../store/slices/adminSlice';
import { adminController } from '../_controller';
import bcrypt from 'bcryptjs';

const getAllAdmins = async () => {
  try {
    const respData = await fetchWrapperService.getAll(adminUrl);
    const adminData = respData ? Object.values(respData) : [];
    const pagesData = helperFunctions.getAllPagesList();

    const transformedAdminsData = adminData.map(async (adminItem) => {
      const tempPermissionArray = adminItem?.permissions || [];
      const permissionsArray = await Promise.all(
        tempPermissionArray.map(async (permissionItem) => {
          const findedItem = pagesData.find((page) => page.pageId === permissionItem.pageId);
          return {
            ...permissionItem,
            title: findedItem?.title,
            actions: permissionItem?.actions || [],
          };
        })
      );

      return {
        ...adminItem,
        permissions: permissionsArray,
      };
    });

    const resolvedAdminsData = await Promise.all(transformedAdminsData);
    return resolvedAdminsData;
  } catch (e) {
    throw e;
  }
};

const adminLogin = async (payload, abortController) => {
  try {
    if (Object.keys(payload).length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post('/admin/adminLogin', payload, { signal });
      let { status, message, adminData } = response.data;

      if (status === 200) {
        const allPageList = helperFunctions.getAllPagesList();
        const payload = {
          adminId: adminData.id,
          permissions: adminData.permissions
            ?.filter((x) => allPageList?.some((y) => y?.pageId === x?.pageId))
            .map((x) => ({
              pageId: x.pageId,
              actions: x?.actions || [],
            })),
        };
        const updatePermissionRes = await updateAdminPermission(payload);
        if (updatePermissionRes) {
          response.data.adminData.permissions = payload?.permissions;
          return response.data;
        } else {
          toast.error('Unable to login!');
          return false;
        }
      } else {
        toast.error(message);
        return false;
      }
    } else {
      toast.error('Invalid Data');
      return false;
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const createAdmin = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { firstName, lastName, email, mobile, password, confirmPassword, permissions } =
        sanitizeObject(params);
      permissions = Array.isArray(permissions) ? permissions : [];
      firstName = firstName ? firstName.trim() : null;
      lastName = lastName ? lastName.trim() : null;
      email = email ? email.trim() : null;
      mobile = mobile ? Number(mobile) : null;
      password = password ? password.trim() : null;
      confirmPassword = confirmPassword ? confirmPassword.trim() : null;
      if (firstName && lastName && email && mobile && password && confirmPassword && uuid) {
        const adminData = await fetchWrapperService.findOne(adminUrl, {
          email: email,
        });
        const userData = await fetchWrapperService.findOne(userUrl, {
          email: email,
        });
        if (userData) {
          reject(new Error('Account Already Exists in User Panel. Use Another EmailID'));
          return;
        }
        if (!adminData) {
          if (password === confirmPassword) {
            let matchedPermissionsPageIds = [];
            if (permissions.length) {
              const isPermissionsValidKey = helperFunctions.isValidKeyName(permissions, 'pageId');
              if (!isPermissionsValidKey) {
                reject(new Error('permissions data not valid'));
                return;
              }
              const pagesList = helperFunctions.getAllPagesList();
              matchedPermissionsPageIds = permissions
                .map((permission) => {
                  const matchedPage = pagesList.find((page) => page.pageId === permission.pageId);
                  if (!matchedPage) return null; // skip if page not found

                  const validActions = (permission.actions || []).filter((action) =>
                    matchedPage.actions.some((pageAction) => pageAction.value === action.actionId)
                  );

                  return {
                    pageId: matchedPage.pageId,
                    actions: validActions.map((action) => ({ actionId: action.actionId })),
                  };
                })
                .filter(Boolean);
            }

            const hash = bcrypt.hashSync(password, 12);
            const insertPattern = {
              id: uuid,
              firstName,
              lastName,
              email,
              mobile,
              password: hash,
              permissions: matchedPermissionsPageIds,
              createdDate: Date.now(),
              updatedDate: Date.now(),
            };
            const createPattern = {
              url: `${adminUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during admins creation.'));
              });
          } else {
            reject(new Error('Password mismatch!...try again!'));
          }
        } else {
          reject(new Error('You already have an account please Login'));
        }
      } else {
        reject(new Error('invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateAdmin = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { adminId, firstName, lastName, email, mobile, permissions } = sanitizeObject(params);

      if (adminId) {
        const adminData = await fetchWrapperService.findOne(adminUrl, {
          id: adminId,
        });
        if (adminData) {
          email = email ? email.trim() : adminData.email;
          const findPattern = {
            id: adminId,
            key: 'email',
            value: email,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            adminUrl,
            findPattern
          );
          if (!duplicateData.length) {
            firstName = firstName ? firstName.trim() : adminData.firstName;
            lastName = lastName ? lastName.trim() : adminData.lastName;
            mobile = mobile ? Number(mobile) : adminData.mobile;
            permissions = Array.isArray(permissions) ? permissions : adminData.permissions;
            const pagesList = helperFunctions.getAllPagesList();

            const matchedPermissionsPageIds = permissions
              .map((permission) => {
                const matchedPage = pagesList.find((page) => page.pageId === permission.pageId);
                if (!matchedPage) return null;

                const validActions = (permission.actions || []).filter((action) =>
                  matchedPage.actions.some((pageAction) => pageAction.value === action.actionId)
                );

                return {
                  pageId: matchedPage.pageId,
                  actions: validActions.map((action) => ({ actionId: action.actionId })),
                };
              })
              .filter(Boolean);

            const payload = {
              email,
              firstName,
              lastName,
              mobile,
              permissions: matchedPermissionsPageIds,
            };
            const updatePattern = {
              url: `${adminUrl}/${adminId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update admin.'));
              });
          } else {
            reject(new Error('email already exists'));
          }
        } else {
          reject(new Error('admin not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateAdminPermission = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { adminId, permissions } = sanitizeObject(params);

      if (!adminId) return reject(new Error('Invalid Data'));

      const adminData = await fetchWrapperService.findOne(adminUrl, { id: adminId });
      if (!adminData) return reject(new Error('Admin not found!'));

      permissions = Array.isArray(permissions) ? permissions : [];

      const pagesList = helperFunctions.getAllPagesList();

      const matchedPermissionsPageIds = permissions?.length
        ? permissions
          .map((permission) => {
            const matchedPage = pagesList.find((page) => page.pageId === permission.pageId);
            if (!matchedPage) return null;

            const validActions = (permission.actions || []).filter((action) =>
              matchedPage.actions.some((pageAction) => pageAction.value === action.actionId)
            );

            return {
              pageId: matchedPage.pageId,
              actions: validActions.map((action) => ({ actionId: action.actionId })),
            };
          })
          .filter(Boolean)
        : [];

      const payload = { permissions: matchedPermissionsPageIds };

      await fetchWrapperService._update({ url: `${adminUrl}/${adminId}`, payload });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const forgotPassword = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, password, confirmPassword } = sanitizeObject(params);
      email = email ? email.trim() : null;
      password = password ? password.trim() : null;
      confirmPassword = confirmPassword ? confirmPassword.trim() : null;
      if (email && password && confirmPassword) {
        if (password === confirmPassword) {
          const adminData = await fetchWrapperService.findOne(adminUrl, {
            email: email,
          });
          if (adminData) {
            const hash = bcrypt.hashSync(password, 12);
            const payload = {
              password: hash,
            };
            const updatePattern = {
              url: `${adminUrl}/${adminData.id}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve();
              })
              .catch((e) => {
                reject(new Error('An error occurred during update forgetting password.'));
              });
          } else {
            reject(new Error('email does not exists'));
          }
        } else {
          reject(new Error('password does not match with confirm password'));
        }
      } else {
        reject(new Error('invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteAdmin = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { adminId } = sanitizeObject(params);
      if (adminId) {
        const adminData = await fetchWrapperService.findOne(adminUrl, {
          id: adminId,
        });
        if (adminData) {
          if (adminData.email === email) {
            reject(new Error('record can not delete Because it is super admin'));
            return;
          }
          await fetchWrapperService._delete(`${adminUrl}/${adminId}`);
          resolve(true);
        } else {
          reject(new Error('admin not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const createSuperAdmin = async () => {
  try {
    const adminData = await fetchWrapperService.findOne(adminUrl, {
      email: email,
    });
    const pagesList = helperFunctions.getAllPagesList();
    if (adminData) {
      let currentUser = helperFunctions.getCurrentUser();
      if (currentUser?.email === email) {

        const permissionsArr = pagesList.map((page) => ({
          pageId: page.pageId,
          actions:
            page.actions.map((action) => ({ actionId: action.value }))
            || [],
        }));

        const updatePermissionPayload = {
          adminId: adminData.id,
          permissions: permissionsArr,
        };
        const res = await updateAdminPermission(updatePermissionPayload);
        if (res) {
          currentUser.permissions = updatePermissionPayload?.permissions;
          localStorage.setItem('adminCurrentUser', JSON.stringify(currentUser));
        }
      }
      return;
    }

    const permissionsArr = pagesList.map((page) => ({
      pageId: page.pageId,
      actions:
        page?.actions?.map((action) => ({ actionId: action.value }))
        || [],
    }));

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
      password: password,
      confirmPassword: confirmPassword,
      permissions: permissionsArr,
    };
    await createAdmin(payload);
  } catch (error) {
    console.log(error, 'error');
  }
};

export const getPermissionsDataByAdminId = (payload) => async (dispatch) => {
  try {
    dispatch(setAdminPermissionsLoader(true));
    dispatch(setAdminWisePermisisons([]));
    const permissionsData = await adminController.getPermissionsByAdminId(payload);
    if (permissionsData) {
      dispatch(setAdminWisePermisisons(permissionsData));

      let currentUser = helperFunctions.getCurrentUser();
      if (currentUser && currentUser?.email !== email) {
        currentUser.permissions = permissionsData;
        localStorage.setItem('adminCurrentUser', JSON.stringify(currentUser));
      }

      return permissionsData;
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setAdminWisePermisisons([]));
  } finally {
    dispatch(setAdminPermissionsLoader(false));
  }
};

export const adminService = {
  getAllAdmins,
  adminLogin,
  forgotPassword,
  deleteAdmin,
  createAdmin,
  updateAdmin,
  updateAdminPermission,
  createSuperAdmin,
  getPermissionsDataByAdminId,
};
