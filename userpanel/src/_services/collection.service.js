import {
  collectionUrl,
  fetchWrapperService,
  helperFunctions,
  productsUrl,
} from "../_helper";
import { TOP_SELLING_PRODUCTS } from "../_helper/constants";

const getAllCollection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(collectionUrl);
      const collectionData = respData ? Object.values(respData) : [];
      resolve(collectionData);
    } catch (e) {
      reject(e);
    }
  });
};

const getCollectionsWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const collectionData = await getAllCollection();
      const findPattern = {
        url: productsUrl,
        key: "active",
        value: true,
      };
      const allActiveProductsData = await fetchWrapperService.find(findPattern);
      if (collectionData.length && allActiveProductsData.length) {
        const sortedProductData = helperFunctions.sortByField(
          allActiveProductsData
        );
        const nonTopSellingCollections = collectionData.filter(
          (x) => x?.title?.toLowerCase() !== TOP_SELLING_PRODUCTS?.toLowerCase()
        );
        // eslint-disable-next-line array-callback-return
        const collectionWithProduct = nonTopSellingCollections
          .map((collection) => {
            const findedProduct = sortedProductData?.find((product) =>
              product?.collectionIds?.some((id) => id === collection?.id)
            );
            if (findedProduct) {
              return {
                ...collection,
                productImage: findedProduct?.yellowGoldThumbnailImage,
                productId: findedProduct.id,
              };
            }
            return false;
          })
          .filter(Boolean);

        resolve(collectionWithProduct);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const collectionService = {
  getAllCollection,
  getCollectionsWithProduct,
};
