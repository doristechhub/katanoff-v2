const { cartsDbInstance } = require("../firebase");

const cartUrl = process.env.CART_URL
const exportFunction = {};

exportFunction.find = (findPattern) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { key, value } = findPattern;

      const cartRef  = cartsDbInstance.ref(`${cartUrl}`)
      const snapshot = await cartRef.orderByChild(key).equalTo(value).once('value')
      const data = snapshot.exists() ? Object.values(snapshot.val()) : []
      resolve(data)
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.deleteOne = (
  findPattern
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { cartId } = findPattern

      await cartsDbInstance.ref(`${cartUrl}/${cartId}`).remove()

      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = exportFunction;
