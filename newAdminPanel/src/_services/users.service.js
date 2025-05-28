import { fetchWrapperService, userUrl } from '../_helpers';

const getAllUserList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(userUrl);
      const usersData = respData ? Object.values(respData) : [];
      resolve(usersData);
    } catch (e) {
      reject(e);
    }
  });
};

const getUsersByName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const usersData = await usersService.getAllUserList();
      const searchRegex = new RegExp(name, 'i'); // Case-insensitive search regex
      const filteredUsers = usersData.filter((user) =>
        searchRegex.test(`${user.firstName} ${user.lastName}`)
      );

      resolve(filteredUsers);
    } catch (e) {
      reject(e);
    }
  });
};

export const usersService = {
  getAllUserList,
  getUsersByName,
};
