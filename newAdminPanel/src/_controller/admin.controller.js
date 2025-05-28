import { adminUrl, fetchWrapperService, sanitizeObject } from "../_helpers";

const getPermissionsByAdminId = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { adminId } = sanitizeObject(params);
      adminId = adminId ? adminId.trim() : null;
      if (adminId) {
        const adminData = await fetchWrapperService.findOne(adminUrl, {
          id: adminId,
        });
        if (adminData) {
          const permissions = adminData?.permissions ?? [];
          resolve(permissions);
        } else {
          reject(new Error("Admin does not exist"));
        }
      } else {
        reject(new Error("Invalid Id"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const adminController = {
  getPermissionsByAdminId,
};
