import {
  customJewelryUrl,
  deleteFile,
  fetchWrapperService,
  helperFunctions,
  sanitizeObject,
} from '../_helpers';
import { setCustomJewelryLoader } from '../store/slices/customJewelrySlice';

const getAllCustomJewelryList = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setCustomJewelryLoader(true));
      const respData = await fetchWrapperService.getAll(customJewelryUrl);
      const customJewelryData = respData ? Object.values(respData) : [];
      const sortedData = helperFunctions.sortByField([...customJewelryData]);
      resolve(sortedData);
    } catch (e) {
      reject(e);
    } finally {
      dispatch(setCustomJewelryLoader(false));
    }
  });
};

const deleteCustomJewelry = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { customJewelryId } = sanitizeObject(params);
      if (customJewelryId) {
        const customJewelryData = await fetchWrapperService.findOne(customJewelryUrl, {
          id: customJewelryId,
        });
        if (customJewelryData) {
          await fetchWrapperService._delete(`${customJewelryUrl}/${customJewelryId}`);
          //delete file
          if (customJewelryData.image) {
            deleteFile(customJewelryUrl, customJewelryData.image);
          }

          resolve(true);
        } else {
          reject(new Error('Custom Jewelry not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const customJewelryService = {
  getAllCustomJewelryList,
  deleteCustomJewelry,
};
