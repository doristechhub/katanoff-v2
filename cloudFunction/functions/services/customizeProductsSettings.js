const { amsDbInstance } = require("../firebase");

const customizeProductSettingsUrl = process.env.CUSTOMIZE_PRODUCT_SETTINGS_URL;
const exportFunction = {};

exportFunction.getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const settingsRef = amsDbInstance?.ref(`${customizeProductSettingsUrl}`);
      const snapshot = await settingsRef?.once("value");
      const settingsData = snapshot.exists() ? snapshot.val() : {};
      resolve(settingsData);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
