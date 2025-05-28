const uid = require("uid");
const { cmsDbInstance } = require("../firebase");
const { getCurrentDate } = require("../helpers/common");

const contactUrl = process.env.CONTACT_URL;
const exportFunction = {};

exportFunction.create = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid.uid();
      params.id = uuid;
      params.createdDate = getCurrentDate();
      params.updatedDate = getCurrentDate();

      const contacRef = cmsDbInstance.ref(`${contactUrl}/${params.id}`);
      await contacRef.set(params);
      resolve(params);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
