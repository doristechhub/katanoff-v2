const { amsDbInstance } = require("../firebase");

const diamondShapeUrl = process.env.DIAMOND_SHAPE_URL;

const exportFunction = {};

exportFunction.getAllDiamondShapes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const snapshot = await amsDbInstance
        .ref(`${diamondShapeUrl}`)
        .once("value");
      const diamondShapeData = snapshot?.exists()
        ? Object.values(snapshot.val())
        : [];
      resolve(diamondShapeData);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
