import { uid } from 'uid';
import { fetchWrapperService, productsUrl, sanitizeObject, showCaseBannerUrl } from '../_helpers';
import { productService } from './product.service';
import { helperFunctions } from '../_helpers/helperFunctions';

const getAllShowCaseBanner = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(showCaseBannerUrl);
      const showCaseBannerData = respData ? Object.values(respData) : [];
      resolve(showCaseBannerData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllShowCaseBannersWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const showCaseBannerData = await getAllShowCaseBanner();
      const productData = await productService.getAllProductsWithPagging();

      if (showCaseBannerData.length && productData.length) {
        const showCaseBannerWithProduct = [];
        showCaseBannerData.map((bannerItem) => {
          const findedProduct = productData
            .filter((x) => x.active)
            .find((product) => product.id === bannerItem.productId);
          if (findedProduct) {
            const obj = {
              ...bannerItem,
              discount: findedProduct.discount,
              basePrice: findedProduct.basePrice,
              baseSellingPrice: findedProduct.baseSellingPrice,
              productName: findedProduct.productName,
              active: findedProduct.active,
              productImage: findedProduct.images[0].image,
            };
            showCaseBannerWithProduct.push(obj);
          }
        });
        resolve(showCaseBannerWithProduct);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const insertShowCaseBanner = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { selectedProducts } = sanitizeObject(params);
      selectedProducts = Array.isArray(selectedProducts) ? selectedProducts : [];
      const isValidProductId = helperFunctions.isValidKeyName(selectedProducts, 'productId');

      if (selectedProducts.length && isValidProductId) {
        const tempArray = selectedProducts.map((x) => x.productId);

        const allActiveProductData = await productService.getAllActiveProducts();
        const matchedProducts = allActiveProductData.filter((productItem) =>
          tempArray.includes(productItem.id)
        );

        const isAllSelectedproductsActive =
          matchedProducts.length === selectedProducts.length ? true : false;
        if (!isAllSelectedproductsActive) {
          reject(new Error('Invalid Products! (Only active products are allowed!)'));
          return;
        }

        const showCaseBannerData = await getAllShowCaseBanner();
        if (showCaseBannerData.length + selectedProducts.length <= 2) {
          const alreadyExitsData = showCaseBannerData.filter((bannerItem) =>
            tempArray.includes(bannerItem.productId)
          );
          if (alreadyExitsData.length) {
            reject(new Error('Product already exits for adding show case banner'));
            return;
          }

          for (let i = 0; i < selectedProducts.length; i++) {
            const item = selectedProducts[i];
            const uuid = uid();
            const insertPattern = {
              id: uuid,
              productId: item.productId,
              createdDate: Date.now(),
            };
            const createPattern = {
              url: `${showCaseBannerUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            await fetchWrapperService.create(createPattern);
            if (selectedProducts.length === i + 1) {
              resolve(true);
            }
          }
        } else {
          reject(new Error('There is a two-banner limit for show case banner'));
        }
      } else {
        reject(new Error('Invalid data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteShowCaseBanner = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { showCaseBannerId } = sanitizeObject(params);
      if (showCaseBannerId) {
        const showCaseBannerData = await fetchWrapperService.findOne(showCaseBannerUrl, {
          id: showCaseBannerId,
        });
        if (showCaseBannerData) {
          await fetchWrapperService._delete(`${showCaseBannerUrl}/${showCaseBannerId}`);
          resolve(true);
        } else {
          reject(new Error('show case banner not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const showCaseBannerService = {
  getAllShowCaseBanner,
  getAllShowCaseBannersWithProduct,
  insertShowCaseBanner,
  deleteShowCaseBanner,
};
