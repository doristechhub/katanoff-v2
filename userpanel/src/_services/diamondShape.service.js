import { diamondShapeUrl, fetchWrapperService } from "../_helper";

const getAllDiamondShapes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(diamondShapeUrl);
      const diamondShapeData = respData ? Object.values(respData) : [];
      resolve(diamondShapeData);
    } catch (e) {
      reject(e);
    }
  });
};

export const diamondShapeService = {
  getAllDiamondShapes,
};
