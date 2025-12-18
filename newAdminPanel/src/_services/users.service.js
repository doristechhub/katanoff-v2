import {
  cartsUrl,
  fetchWrapperService,
  ordersUrl,
  recentlyViewedUrl,
  returnsUrl,
  sanitizeObject,
  userUrl,
} from '../_helpers';

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

const checkBlockingDependencies = async (userId) => {
  const [order, returnRequest] = await Promise.all([
    fetchWrapperService.findOne(ordersUrl, { userId }),
    fetchWrapperService.findOne(returnsUrl, { userId }),
  ]);

  const reasons = [];
  if (order) reasons.push('orders');
  if (returnRequest) reasons.push('returns');

  return reasons;
};

const deleteAllByUserId = async (dbUrl, userId) => {
  const findPattern = {
    url: dbUrl,
    key: 'userId',
    value: userId,
  };
  const items = await fetchWrapperService.find(findPattern);

  if (!items?.length) return 0;

  const deletePromises = items.map((item) => fetchWrapperService._delete(`${dbUrl}/${item.id}`));

  await Promise.all(deletePromises);
  return items?.length;
};

const cleanupUserTemporaryData = async (userId) => {
  const [deletedCarts, deletedViewed] = await Promise.all([
    deleteAllByUserId(cartsUrl, userId),
    deleteAllByUserId(recentlyViewedUrl, userId),
  ]);

  return { deletedCarts, deletedViewed };
};

const deleteUser = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userId } = sanitizeObject(params);
      if (!userId) {
        return reject(new Error('Invalid user ID'));
      }

      // Verify user exists
      const userData = await fetchWrapperService.findOne(userUrl, { id: userId });
      if (!userData) {
        return reject(new Error('User not found'));
      }

      // Check for blocking dependencies
      const blockingReasons = await checkBlockingDependencies(userId);
      if (blockingReasons.length) {
        return reject(
          new Error(`User cannot be deleted. Linked with: ${blockingReasons.join(', ')}`)
        );
      }

      // Clean up temporary data
      const { deletedCarts, deletedViewed } = await cleanupUserTemporaryData(userId);

      // Optional: Log for admin/debugging
      console.log(
        `User ${userId} cleanup: ` +
          `Deleted ${deletedCarts} cart item(s), ${deletedViewed} recently viewed item(s)`
      );

      // Delete the user
      await fetchWrapperService._delete(`${userUrl}/${userId}`);

      resolve({
        success: true,
        message: 'User deleted successfully',
        deletedCarts,
        deletedViewed,
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const usersService = {
  getAllUserList,
  getUsersByName,
  deleteUser,
};
