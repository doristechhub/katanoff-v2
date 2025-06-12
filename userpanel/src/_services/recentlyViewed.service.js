import { uid } from "uid";
import {
  fetchWrapperService,
  helperFunctions,
  productsUrl,
  recentlyViewedUrl,
  sanitizeObject,
} from "../_helper";
import { productService } from "./product.service";
import { GOLD_COLOR, GOLD_TYPES } from "../_helper/constants";

// const productsUrl = process.env.REACT_APP_PRODUCTS;
// const recentlyViewedUrl = process.env.REACT_APP_RECENTLY_VIEWED;

const getAllRecentlyViewedWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      let recentlyViewedData = [];
      if (userData) {
        const findPattern = {
          url: recentlyViewedUrl,
          key: "userId",
          value: userData.id,
        };
        recentlyViewedData = await fetchWrapperService.find(findPattern);
      } else {
        recentlyViewedData = getRecentlyViewedOnOffline();
      }

      const allActiveProductsData = await productService.getAllActiveProducts();
      const sortedRecentlyViewedData = helperFunctions
        .sortByField(recentlyViewedData, "updatedDate")
        .slice(0, 8)
        .map((recentlyViewedItem) => {
          const foundProduct = allActiveProductsData.find(
            (product) => product.id === recentlyViewedItem.productId
          );

          if (!foundProduct) return null;

          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            foundProduct?.variComboWithQuantity
          );
          return {
            id: recentlyViewedItem.id,
            productId: recentlyViewedItem.productId,
            productName: foundProduct?.productName,
            whiteGoldImages: foundProduct?.whiteGoldImages,
            yellowGoldImages: foundProduct?.yellowGoldImages,
            roseGoldImages: foundProduct?.roseGoldImages,
            whiteGoldThumbnailImage: foundProduct?.whiteGoldThumbnailImage,
            yellowGoldThumbnailImage: foundProduct?.yellowGoldThumbnailImage,
            roseGoldThumbnailImage: foundProduct?.roseGoldThumbnailImage,
            basePrice: price,
            baseSellingPrice: helperFunctions.getSellingPrice({
              price,
              discount: foundProduct.discount,
            }),
            discount: foundProduct.discount,
            createdDate: recentlyViewedItem.createdDate,
            updatedDate: recentlyViewedItem.updatedDate,
            goldTypeVariations: foundProduct?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
            )?.variationTypes,
            goldColorVariations: foundProduct?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
            )?.variationTypes,
          };
        })
        .filter((item) => item !== null);
      resolve(sortedRecentlyViewedData);
    } catch (e) {
      reject(e);
    }
  });
};

const getRecentlyViewedOnOffline = () => {
  return JSON.parse(sessionStorage.getItem("recentlyViewed")) || [];
};

const addUpdateRecentlyViewed = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { productName } = sanitizeObject(params);
      productName = productName ? productName.trim() : null;
      const uuid = uid();
      if (productName && uuid) {
        const productDetail = await fetchWrapperService.findOne(productsUrl, {
          productName,
        });

        if (productDetail) {
          let recentlyViewed =
            await recentlyViewedService.getAllRecentlyViewedWithProduct();

          recentlyViewed = recentlyViewed.map((item) => {
            return {
              id: item.id,
              productId: item.productId,
              createdDate: item.createdDate,
              updatedDate: item.updatedDate,
            };
          });

          const existingIndex = recentlyViewed.findIndex(
            (item) => item.productId === productDetail.id
          );

          let insertPattern = {
            id: uuid,
            productId: productDetail.id,
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };

          const userData = helperFunctions.getCurrentUser();

          if (userData) {
            insertPattern.userId = userData.id;
            const createPattern = {
              url: `${recentlyViewedUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            if (existingIndex === -1) {
              fetchWrapperService
                .create(createPattern)
                .then((response) => {
                  resolve(recentlyViewed);
                })
                .catch((e) => {
                  reject(
                    new Error(
                      "An error occurred during recently viewed creation."
                    )
                  );
                });
            } else {
              //update
              const payload = {
                updatedDate: Date.now(),
              };
              const recentlyViewedId = recentlyViewed[existingIndex].id;
              const updatePattern = {
                url: `${recentlyViewedUrl}/${recentlyViewedId}`,
                payload,
              };

              fetchWrapperService
                ._update(updatePattern)
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject(
                    new Error(
                      "An error occurred during update recently viewed."
                    )
                  );
                  return false;
                });
            }
          } else {
            if (existingIndex !== -1) {
              recentlyViewed.splice(existingIndex, 1);
            }
            recentlyViewed.unshift(insertPattern);

            if (recentlyViewed.length > 8) {
              recentlyViewed = recentlyViewed.slice(0, 8);
            }

            sessionStorage.setItem(
              "recentlyViewed",
              JSON.stringify(recentlyViewed)
            );
            resolve();
          }
        } else {
          reject(new Error("Product does not exist"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const recentlyViewedService = {
  getAllRecentlyViewedWithProduct,
  addUpdateRecentlyViewed,
};
