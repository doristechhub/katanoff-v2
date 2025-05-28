import { adminUrl, fetchWrapperService, userUrl } from "../_helpers";

const getAllUserAndAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersData = await fetchWrapperService.getAll(userUrl);
      const adminsData = await fetchWrapperService.getAll(adminUrl);
      const users = usersData ? Object.values(usersData) : [];
      const admins = adminsData ? Object.values(adminsData) : [];
      const mixedData = [...users, ...admins];

      const updatedMixedData = mixedData.map((userAndAdminItem) => {
        return {
          ...userAndAdminItem,
          name: `${userAndAdminItem.firstName} ${userAndAdminItem.lastName}`,
        };
      });
      resolve(updatedMixedData);
    } catch (e) {
      reject(e);
    }
  });
};

const logOut = () => {
  localStorage.removeItem("adminCurrentUser");
};

export const authenticationService = {
  getAllUserAndAdmin,
  logOut,
};
