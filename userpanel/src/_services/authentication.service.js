
import { adminUrl, fetchWrapperService, userUrl } from '../_helper';

const getAllUserAndAdmin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersData = await authenticationService.getAllUsers()
      const adminsData = await fetchWrapperService.getAll(adminUrl);

      const admins = adminsData
        ? Object.values(adminsData)
        : [];

      const mixedData = [...usersData, ...admins]
      resolve(mixedData);
    } catch (e) {
      reject(e);
    }
  })
}

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersData = await fetchWrapperService.getAll(userUrl);
      const users = usersData
        ? Object.values(usersData)
        : [];

      const updatedUserData = users.map((user) => {
        return {
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }
      })
      resolve(updatedUserData);
    } catch (e) {
      reject(e);
    }
  })
}

export const authenticationService = {
  getAllUserAndAdmin,
  getAllUsers
};