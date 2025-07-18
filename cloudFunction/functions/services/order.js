const uid = require("uid");
const { ordersDbInstance } = require("../firebase");
const { getCurrentDate } = require("../helpers/common");

const orderUrl = process.env.ORDER_URL;
const exportFunction = {};

exportFunction.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderRef = ordersDbInstance.ref(`${orderUrl}`);
      const snapshot = await orderRef.once("value");
      const orderList = snapshot.exists() ? Object.values(snapshot.val()) : [];
      resolve(orderList);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.create = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid.uid();
      params.id = uuid;
      params.createdDate = getCurrentDate();
      params.updatedDate = getCurrentDate();
      const orderRef = ordersDbInstance.ref(`${orderUrl}/${params.id}`);
      await orderRef.set(params);
      resolve(params);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderId } = findPattern;
      const orderRef = ordersDbInstance.ref(`${orderUrl}/${orderId}`);
      const snapshot = await orderRef.once("value");
      const orderData = snapshot.exists() ? snapshot.val() : null;
      resolve(orderData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findByOrderNumber = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderNumber } = findPattern;

      const orderRef = ordersDbInstance.ref(`${orderUrl}`);
      const snapshot = await orderRef
        .orderByChild("orderNumber")
        .equalTo(orderNumber)
        .once("value");
      const orderData = snapshot.exists() ? Object.values(snapshot.val()) : [];
      const foundData = orderData.length ? orderData[0] : null;
      resolve(foundData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findByPaymentIntentId = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { paymentIntentId } = findPattern;

      const orderRef = ordersDbInstance.ref(`${orderUrl}`);
      const snapshot = await orderRef
        .orderByChild("stripePaymentIntentId")
        .equalTo(paymentIntentId)
        .once("value");
      const orderData = snapshot.exists() ? Object.values(snapshot.val()) : [];
      const foundData = orderData.length ? orderData[0] : null;
      resolve(foundData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findByPaypalOrderId = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { paypalOrderId } = findPattern;

      const orderRef = ordersDbInstance.ref(`${orderUrl}`);
      const snapshot = await orderRef
        .orderByChild("paypalOrderId")
        .equalTo(paypalOrderId)
        .once("value");
      const orderData = snapshot.exists() ? Object.values(snapshot.val()) : [];
      const foundData = orderData.length ? orderData[0] : null;
      resolve(foundData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.deleteOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderId } = findPattern;
      await ordersDbInstance.ref(`${orderUrl}/${orderId}`).remove();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOneAndUpdate = (findPattern, updatePattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderId } = findPattern;
      await ordersDbInstance
        .ref(`${orderUrl}/${orderId}`)
        .update(updatePattern);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.getOrdersByPromoCode = (promoCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderRef = ordersDbInstance.ref(`${orderUrl}`);
      const snapshot = await orderRef
        .orderByChild("promoCode")
        .equalTo(promoCode)
        .once("value");
      const orderList = snapshot.exists() ? Object.values(snapshot.val()) : [];
      resolve(orderList);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
