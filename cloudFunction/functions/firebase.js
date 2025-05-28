const admin = require("firebase-admin");

const defaultConfig = {
  apiKey: "AIzaSyCFZyaoHDsd88H3LB8p0XHtZjFiRrY5ayc",
  authDomain: "katanoff-534f9.firebaseapp.com",
  // databaseURL: defaultDbUrl,
  projectId: "katanoff-534f9",
  messagingSenderId: "905493997232",
  appId: "1:905493997232:web:98735a72c9ef3b0c5f7d75",
};

const defaultApp = admin.initializeApp({
  ...defaultConfig,
  databaseURL: "https://katanoff-534f9-default-rtdb.firebaseio.com",
});

const cmsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-cms.firebaseio.com",
  },
  "cmsApp"
);

const amsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-ams.firebaseio.com",
  },
  "amsApp"
);

const productsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-products.firebaseio.com",
  },
  "productsApp"
);

const cartsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-carts.firebaseio.com",
  },
  "cartsApp"
);

const ordersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-orders.firebaseio.com",
  },
  "ordersApp"
);

const reviewAndRatingApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-reviewandrating.firebaseio.com",
  },
  "reviewAndRatingApp"
);

const appointmentApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-appointment.firebaseio.com",
  },
  "appointmentApp"
);

const customJewelryApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-customjewelry.firebaseio.com",
  },
  "customJewelryApp"
);

const subscribersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-subscribers.firebaseio.com",
  },
  "subscribersApp"
);

const returnsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://katanoff-returns.firebaseio.com",
  },
  "returnsApp"
);

const storageApp = admin.initializeApp(
  {
    ...defaultConfig,
    storageBucket: "gs://katanoff-534f9.firebasestorage.app",
  },
  "storageApp"
);

const defaultDbInstance = defaultApp.database();
const cmsDbInstance = cmsApp.database();
const amsDbInstance = amsApp.database();
const productsDbInstance = productsApp.database();
const cartsDbInstance = cartsApp.database();
const ordersDbInstance = ordersApp.database();
const returnsDbInstance = returnsApp.database();
const reviewAndRatingDbInstance = reviewAndRatingApp.database();
const appointmentDbInstance = appointmentApp.database();

module.exports = {
  defaultApp,
  cmsApp,
  amsApp,
  productsApp,
  cartsApp,
  ordersApp,
  reviewAndRatingApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  returnsApp,
  storageApp,
  defaultDbInstance,
  cmsDbInstance,
  amsDbInstance,
  productsDbInstance,
  cartsDbInstance,
  ordersDbInstance,
  reviewAndRatingDbInstance,
  appointmentDbInstance,
  returnsDbInstance,
};
