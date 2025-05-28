import { initializeApp } from "firebase/app";
import {
  firebaseConfig,
  databaseUrls,
  reCaptchaSiteKey,
} from "./_helper/environment";
import {
  ReCaptchaEnterpriseProvider,
  getToken,
  initializeAppCheck,
} from "firebase/app-check";
import { fetchWrapperService } from "./_helper";
import { getStorage } from "firebase/storage";

const { apiKey, authDomain, projectId, messagingSenderId, appId } =
  firebaseConfig;

const {
  defaultDbUrl,
  cmsDbUrl,
  amsDbUrl,
  productsDbUrl,
  cartsDbUrl,
  ordersDbUrl,
  reviewAndRatingsDbUrl,
  storageDbUrl,
  appointmentDbUrl,
  subscribersDbUrl,
  customJewelryDbUrl,
  returnsDbUrl,
} = databaseUrls;

const defaultConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  // databaseURL: defaultDbUrl,
  projectId: projectId,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

// const defaultApp = initializeApp(defaultConfig);

const defaultApp = initializeApp({
  ...defaultConfig,
  databaseURL: defaultDbUrl,
});

const cmsApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: cmsDbUrl,
  },
  "cmsApp"
);

const amsApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: amsDbUrl,
  },
  "amsApp"
);

const productsApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: productsDbUrl,
  },
  "productsApp"
);

const cartsApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: cartsDbUrl,
  },
  "cartsApp"
);

const ordersApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: ordersDbUrl,
  },
  "ordersApp"
);

const reviewAndRatingApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: reviewAndRatingsDbUrl,
  },
  "reviewAndRatingApp"
);

const storageApp = initializeApp(
  {
    ...defaultConfig,
    storageBucket: storageDbUrl,
  },
  "storageApp"
);

const appointmentApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: appointmentDbUrl,
  },
  "appointmentApp"
);

const subscribersApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: subscribersDbUrl,
  },
  "subscribersApp"
);

const customJewelryApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: customJewelryDbUrl,
  },
  "customJewelryApp"
);
const returnsApp = initializeApp(
  {
    ...defaultConfig,
    databaseURL: returnsDbUrl,
  },
  "returnsApp"
);

const getAppCheckToken = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const app = fetchWrapperService.getAppFromUrl(url);
      const appCheckInstance = initializeAppCheckWithRecaptchaEnterprise(app);
      const token = await getToken(appCheckInstance, true);
      resolve(token);
    } catch (error) {
      if (error?.code === "appCheck/fetch-status-error") {
        reject(new Error("App attestation failed."));
        return;
      }
      reject(error);
    }
  });
};

const initializeAppCheckWithRecaptchaEnterprise = (app) => {
  if (!app || typeof app !== "object") {
    throw new Error("Invalid Firebase app object provided");
  }

  if (!reCaptchaSiteKey || typeof reCaptchaSiteKey !== "string") {
    throw new Error("Invalid reCAPTCHA Enterprise site key provided");
  }

  // Initialize App Check with reCAPTCHA Enterprise provider
  return initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(reCaptchaSiteKey),
    isTokenAutoRefreshEnabled: true, // Enable automatic token refresh
  });
};

const storage = getStorage(storageApp);

export {
  defaultApp,
  cmsApp,
  amsApp,
  productsApp,
  cartsApp,
  ordersApp,
  reviewAndRatingApp,
  storageApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  returnsApp,
  storage,
  getAppCheckToken,
};
