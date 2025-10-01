import {
  getDatabase,
  child,
  get,
  set,
  ref,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';

import {
  cmsApp,
  amsApp,
  productsApp,
  ordersApp,
  reviewAndRatingApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  getAppCheckToken,
  storageApp,
  defaultApp,
  returnsApp,
} from '../firebase';
import { helperFunctions } from './helperFunctions';
import {
  adminUrl,
  appointmentsUrl,
  brandSliderUrl,
  collectionUrl,
  settingStyleUrl,
  diamondShapeUrl,
  settingsUrl,
  customProductsSettingsUrl,
  priceMultiplierUrl,
  customJewelryUrl,
  customizationSubTypeUrl,
  customizationTypeUrl,
  customizationUrl,
  menuCategoriesUrl,
  discountsUrl,
  menuSubCategoriesUrl,
  menuUrl,
  ordersUrl,
  productSliderUrl,
  productTypeUrl,
  productsUrl,
  reviewAndRatingUrl,
  showCaseBannerUrl,
  subscribersUrl,
  userUrl,
  storageUrl,
  returnsUrl,
  contactsUrl,
} from './environment';

// Get the default database instance
// const db = getDatabase(defaultApp);

const getDBFromUrl = (url) => {
  if ([userUrl, contactsUrl].includes(url)) {
    return getDatabase(cmsApp);
  } else if (
    [
      adminUrl,
      menuUrl,
      menuCategoriesUrl,
      menuSubCategoriesUrl,
      productTypeUrl,
      customizationUrl,
      customizationTypeUrl,
      customizationSubTypeUrl,
      collectionUrl,
      settingStyleUrl,
      diamondShapeUrl,
      settingsUrl,
      customProductsSettingsUrl,
      priceMultiplierUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
      discountsUrl,
    ].includes(url)
  ) {
    return getDatabase(amsApp);
  } else if ([productsUrl].includes(url)) {
    return getDatabase(productsApp);
  } else if ([ordersUrl].includes(url)) {
    return getDatabase(ordersApp);
  } else if ([reviewAndRatingUrl].includes(url)) {
    return getDatabase(reviewAndRatingApp);
  } else if ([appointmentsUrl].includes(url)) {
    return getDatabase(appointmentApp);
  } else if ([customJewelryUrl].includes(url)) {
    return getDatabase(customJewelryApp);
  } else if ([subscribersUrl].includes(url)) {
    return getDatabase(subscribersApp);
  } else if ([returnsUrl].includes(url)) {
    return getDatabase(returnsApp);
  } else {
    getDatabase(defaultApp);
  }
};

const getAppFromUrl = (url) => {
  if ([userUrl, contactsUrl].includes(url)) {
    return cmsApp;
  } else if (
    [
      adminUrl,
      menuUrl,
      menuCategoriesUrl,
      menuSubCategoriesUrl,
      productTypeUrl,
      customizationUrl,
      customizationTypeUrl,
      customizationSubTypeUrl,
      collectionUrl,
      settingStyleUrl,
      diamondShapeUrl,
      settingsUrl,
      customProductsSettingsUrl,
      priceMultiplierUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
      discountsUrl,
    ].includes(url)
  ) {
    return amsApp;
  } else if ([productsUrl].includes(url)) {
    return productsApp;
  } else if ([ordersUrl].includes(url)) {
    return ordersApp;
  } else if ([reviewAndRatingUrl].includes(url)) {
    return reviewAndRatingApp;
  } else if ([appointmentsUrl].includes(url)) {
    return appointmentApp;
  } else if ([customJewelryUrl].includes(url)) {
    return customJewelryApp;
  } else if ([subscribersUrl].includes(url)) {
    return subscribersApp;
  } else if ([returnsUrl].includes(url)) {
    return returnsApp;
  } else if ([storageUrl].includes(url)) {
    return storageApp;
  } else {
    return defaultApp;
  }
};

const getAll = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(url);
      onValue(
        ref(db, url),
        (snapshot) => {
          const data = snapshot.val();
          resolve(data);
          return;
        },
        (error) => {
          reject(error);
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const create = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { url, insertPattern } = params;
      if (url && insertPattern) {
        const parsedUrl = helperFunctions.removeLastSegment(url);
        // const token = await getAppCheckToken(parsedUrl);
        // if (!token) {
        //   reject(new Error("Token not found"));
        //   return;
        // }
        const db = getDBFromUrl(parsedUrl);
        set(ref(db, url), insertPattern);
        resolve(true);
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const _update = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { url, payload } = params;
      if (url && payload) {
        const parsedUrl = helperFunctions.removeLastSegment(url);
        // const token = await getAppCheckToken(parsedUrl);
        // if (!token) {
        //   reject(new Error("Token not found"));
        //   return;
        // }
        const db = getDBFromUrl(parsedUrl);
        update(ref(db, url), payload);
        resolve(true);
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const _delete = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedUrl = helperFunctions.removeLastSegment(url);
      // const token = await getAppCheckToken(parsedUrl);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(parsedUrl);
      remove(ref(db, url));
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

const findOne = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keyValuePairs = Object.keys(findPattern).map((key) => ({
        key,
        value: findPattern[key],
      }));
      const data = await getOrderByChildWithEqualto(url, keyValuePairs[0]);
      const findedData = data.length ? data[0] : null;
      resolve(findedData);
    } catch (e) {
      reject(e);
    }
  });
};

const find = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, key, value } = findPattern;
      const data = await getOrderByChildWithEqualto(url, { key, value });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

const findMany = async (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, filterParams } = findPattern;
      const filterPromises = Object.keys(filterParams).map(async (key) => {
        const value = filterParams[key];
        const keyValuePairs = { key, value };
        return getOrderByChildWithEqualto(url, keyValuePairs);
      });
      const filteredDataArray = await Promise.all(filterPromises);
      const filteredData = filteredDataArray.flat();
      resolve(filteredData);
    } catch (e) {
      reject(e);
    }
  });
};

const findOneWithNotEqual = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, key, value } = findPattern;
      const data = await getOrderByChildWithEqualto(url, { key, value });
      const findedData = data.length
        ? data.filter((x) => x.id.toLowerCase() !== id.toLowerCase())
        : [];
      resolve(findedData);
    } catch (e) {
      reject(e);
    }
  });
};

const findManyWithNotEqual = async (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { url, id, filterParams } = findPattern;
      const filterPromises = Object.keys(filterParams).map(async (key) => {
        const value = filterParams[key];
        const keyValuePairs = { key, value };
        return getOrderByChildWithEqualto(url, keyValuePairs);
      });
      const filteredDataArray = await Promise.all(filterPromises);
      const filteredData = filteredDataArray.flat();
      const filteredDataWithNotEqual = filteredData.filter(
        (item) => item.id.toLowerCase() !== id.toLowerCase()
      );
      resolve(filteredDataWithNotEqual);
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderByChildWithEqualto = (url, findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, value } = findPattern;

      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }

      const db = getDBFromUrl(url);
      const findQuery = query(ref(db, url), orderByChild(key), equalTo(value));
      onValue(findQuery, (snapshot) => {
        const data = snapshot.exists() ? Object.values(snapshot.val()) : [];
        resolve(data);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getPaginatdData = (url, searchQuery = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      // const token = await getAppCheckToken(url);
      // if (!token) {
      //   reject(new Error("Token not found"));
      //   return;
      // }
      const db = getDBFromUrl(url);
      let listQuery = query(ref(db, url));
      if (searchQuery) {
      }
      onValue(listQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val());
          resolve(data);
        } else {
          resolve([]);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

// Generic function to fetch items by IDs from any database path
const getItemsByIds = async ({ url, itemIds }) => {
  try {
    // Validate inputs
    if (!url || !Array.isArray(itemIds) || itemIds.length === 0) {
      return [];
    }

    // Get database instance for the provided URL
    const db = getDBFromUrl(url);
    const itemRef = ref(db, url);

    // Fetch items concurrently
    const promises = itemIds.map(async (itemId) => {
      const snapshot = await get(child(itemRef, itemId));
      const item = snapshot.exists() ? { id: itemId, ...snapshot.val() } : null;
      return item;
    });

    // Filter out null results and return items
    const items = (await Promise.all(promises)).filter((item) => item !== null);
    return items;
  } catch (error) {
    console.error(`Error fetching items from ${url}:`, error);
    throw new Error(`Failed to fetch items from ${url}`);
  }
};

const createMany = (createPatterns) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createPromises = createPatterns.map(async (pattern) => {
        let { url, insertPattern } = pattern;
        if (url && insertPattern) {
          const parsedUrl = helperFunctions.removeLastSegment(url);
          // const token = await getAppCheckToken(parsedUrl);
          // if (!token) {
          //   throw new Error("Token not found");
          // }
          const db = getDBFromUrl(parsedUrl);
          return set(ref(db, url), insertPattern);
        } else {
          throw new Error('Invalid Data');
        }
      });
      await Promise.all(createPromises);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const updateMany = (updatePatterns) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatePromises = updatePatterns.map(async (pattern) => {
        let { url, payload } = pattern;
        if (url && payload) {
          const parsedUrl = helperFunctions.removeLastSegment(url);
          // const token = await getAppCheckToken(parsedUrl);
          // if (!token) {
          //   throw new Error("Token not found");
          // }
          const db = getDBFromUrl(parsedUrl);
          return update(ref(db, url), payload);
        } else {
          throw new Error('Invalid Data');
        }
      });
      await Promise.all(updatePromises);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMany = (urls) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletePromises = urls.map(async (url) => {
        const parsedUrl = helperFunctions.removeLastSegment(url);
        // const token = await getAppCheckToken(parsedUrl);
        // if (!token) {
        //   throw new Error("Token not found");
        // }
        const db = getDBFromUrl(parsedUrl);
        return remove(ref(db, url));
      });
      await Promise.all(deletePromises);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

export const fetchWrapperService = {
  getAll,
  create,
  findOne,
  find,
  findOneWithNotEqual,
  _delete,
  _update,
  getPaginatdData,
  findMany,
  findManyWithNotEqual,
  getAppFromUrl,
  getItemsByIds,
  createMany,
  updateMany,
  deleteMany,
};
