const { areArraysEqual } = require("../helpers/areArraysEqual");
const { productsDbInstance, amsDbInstance } = require("../firebase");

const productUrl = process.env.PRODUCT_URL;
const customizationUrl = process.env.CUSTOMIZATION_URL;

const exportFunction = {};

exportFunction.getAllActiveProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productRef = productsDbInstance.ref(`${productUrl}`);
      const snapshot = await productRef
        .orderByChild("active")
        .equalTo(true)
        .once("value");
      const activeProductData = snapshot.exists()
        ? Object.values(snapshot.val())
        : [];
      resolve(activeProductData);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.getProductsByIds = (productIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(productIds) || !productIds.length) {
        resolve([]);
        return;
      }

      const productRef = productsDbInstance.ref(`${productUrl}`);
      const promises = productIds.map(async (productId) => {
        const snapshot = await productRef.child(productId).once("value");
        return snapshot.exists() ? snapshot.val() : null;
      });

      const products = (await Promise.all(promises)).filter(
        (product) => product !== null
      );
      resolve(products);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.getActiveProductsByIds = (productIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await exportFunction.getProductsByIds(productIds);
      const activeProducts = products.filter((product) => product.active);
      resolve(activeProducts);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.getAllCustomizations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await amsDbInstance
        .ref(`${customizationUrl}`)
        .once("value");
      const customizationData = snapshot.exists() ? snapshot.val() : [];
      const customizationType = customizationData.customizationType
        ? Object.values(customizationData.customizationType)
        : [];
      const customizationSubType = customizationData.customizationSubType
        ? Object.values(customizationData.customizationSubType)
        : [];
      resolve({ customizationType, customizationSubType });
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.findOneAndUpdate = (findPattern, updatePattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productId } = findPattern;
      await productsDbInstance
        .ref(`${productUrl}/${productId}`)
        .update(updatePattern);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.updateProductQty = async (products) => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeProductsList = await exportFunction.getAllActiveProducts();
      for (let i = 0; i < products.length; i++) {
        const orderProductItem = products[i];
        const findedProduct = activeProductsList.find(
          (product) => product.id === orderProductItem.productId
        );
        if (findedProduct) {
          const tempCombiArray = [...findedProduct.variComboWithQuantity];
          const index = tempCombiArray.findIndex((combination) =>
            areArraysEqual(combination.combination, orderProductItem.variations)
          );

          if (index !== -1) {
            tempCombiArray[index].quantity += orderProductItem.cartQuantity;
          }

          //execute update query
          const findPattern = {
            productId: findedProduct.id,
          };
          const updatePattern = {
            variComboWithQuantity: tempCombiArray,
          };
          await exportFunction.findOneAndUpdate(findPattern, updatePattern);
        }
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = exportFunction;
