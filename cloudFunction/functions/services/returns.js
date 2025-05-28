const uid = require("uid");
const { returnsDbInstance } = require("../firebase");
const { getCurrentDate } = require("../helpers/common");

const returnsUrl = process.env.RETURNS_URL;
const exportFunction = {};

exportFunction.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const returnsRef = returnsDbInstance.ref(`${returnsUrl}`);
      const snapshot = await returnsRef.once("value");
      const returnsList = snapshot.exists()
        ? Object.values(snapshot.val())
        : [];
      resolve(returnsList);
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
      const returnsRef = returnsDbInstance.ref(`${returnsUrl}/${params.id}`);

      await returnsRef.set(params);
      resolve(params);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.find = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, value } = findPattern;

      const returnsRef = returnsDbInstance.ref(`${returnsUrl}`);
      const snapshot = await returnsRef
        .orderByChild(key)
        .equalTo(value)
        .once("value");
      const data = snapshot.exists() ? Object.values(snapshot.val()) : [];
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnId } = findPattern;
      const returnsRef = returnsDbInstance.ref(`${returnsUrl}/${returnId}`);
      const snapshot = await returnsRef.once("value");
      const returnsData = snapshot.exists() ? snapshot.val() : null;
      resolve(returnsData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.deleteOne = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnId } = findPattern;
      await returnsDbInstance.ref(`${returnsUrl}/${returnId}`).remove();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOneAndUpdate = (findPattern, updatePattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { returnId } = findPattern;
      await returnsDbInstance
        .ref(`${returnsUrl}/${returnId}`)
        .update(updatePattern);

      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
