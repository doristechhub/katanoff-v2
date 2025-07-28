import {
  getDatabase,
  ref,
  child,
  get,
  set,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import {
  cmsApp,
  amsApp,
  productsApp,
  cartsApp,
  ordersApp,
  reviewAndRatingApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  getAppCheckToken,
  storageApp,
  defaultApp,
  returnsApp,
} from "../firebase";
import { helperFunctions } from "./helperFunctions";
import {
  addressUrl,
  adminUrl,
  appointmentsUrl,
  brandSliderUrl,
  cartsUrl,
  collectionUrl,
  settingStyleUrl,
  diamondShapeUrl,
  customJewelryUrl,
  customizationUrl,
  menuUrl,
  ordersUrl,
  productSliderUrl,
  productsUrl,
  recentlyViewedUrl,
  returnsUrl,
  reviewAndRatingUrl,
  showCaseBannerUrl,
  storageUrl,
  subscribersUrl,
  userUrl,
  discountsUrl,
  customizedProductSettingsUrl,
} from "./environment";

// Get the default database instance
// const db = getDatabase(defaultApp);

const getDBFromUrl = (url) => {
  if ([userUrl, addressUrl, recentlyViewedUrl].includes(url)) {
    return getDatabase(cmsApp);
  } else if (
    [
      adminUrl,
      menuUrl,
      collectionUrl,
      settingStyleUrl,
      diamondShapeUrl,
      customizationUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
      discountsUrl,
      customizedProductSettingsUrl,
    ].includes(url)
  ) {
    return getDatabase(amsApp);
  } else if ([cartsUrl].includes(url)) {
    return getDatabase(cartsApp);
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
    return getDatabase(defaultApp);
  }
};

const getAppFromUrl = (url) => {
  if ([userUrl, addressUrl, recentlyViewedUrl].includes(url)) {
    return cmsApp;
  } else if (
    [
      adminUrl,
      menuUrl,
      collectionUrl,
      settingStyleUrl,
      diamondShapeUrl,
      customizationUrl,
      showCaseBannerUrl,
      productSliderUrl,
      brandSliderUrl,
      discountsUrl,
      customizedProductSettingsUrl,
    ].includes(url)
  ) {
    return amsApp;
  } else if ([cartsUrl].includes(url)) {
    return cartsApp;
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
        reject(new Error("Invalid Data"));
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
        reject(new Error("Invalid Data"));
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

export const fetchWrapperService = {
  getAll,
  create,
  findOne,
  find,
  _delete,
  _update,
  getAppFromUrl,
  getItemsByIds,
};
