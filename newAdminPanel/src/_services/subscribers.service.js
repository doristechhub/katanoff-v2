import { subscribersUrl, fetchWrapperService, sanitizeObject } from '../_helpers';

const getAllSubscribers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(subscribersUrl);
      const subscribersData = respData ? Object.values(respData) : [];
      resolve(subscribersData);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteSubscriber = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { subscriberId } = sanitizeObject(params);
      if (subscriberId) {
        const subscriberData = await fetchWrapperService.findOne(subscribersUrl, {
          id: subscriberId,
        });
        if (subscriberData) {
          await fetchWrapperService._delete(`${subscribersUrl}/${subscriberId}`);
          resolve(true);
        } else {
          reject(new Error('Subscriber not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const subscribersService = {
  getAllSubscribers,
  deleteSubscriber,
};
