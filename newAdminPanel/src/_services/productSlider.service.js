import { uid } from 'uid';
import { fetchWrapperService, productSliderUrl, productsUrl, sanitizeObject } from '../_helpers';
import { productService } from './product.service';
import { helperFunctions } from '../_helpers/helperFunctions';

const getAllProductSlider = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(productSliderUrl);
      const productSliderData = respData ? Object.values(respData) : [];
      resolve(productSliderData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductSlidersWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productSliderData = await getAllProductSlider();
      const respProductData = await fetchWrapperService.getAll(productsUrl);
      const productData = respProductData ? Object.values(respProductData) : [];

      if (productSliderData.length && productData.length) {
        const productSliderWithProduct = [];
        productSliderData.map((sliderItem) => {
          const findedProduct = productData.find((product) => product.id === sliderItem.productId);
          if (findedProduct) {
            const obj = {
              ...sliderItem,
              productName: findedProduct.productName,
              productImage: findedProduct?.yellowGoldThumbnailImage,
              shortDescription: findedProduct?.shortDescription,
            };
            productSliderWithProduct.push(obj);
          }
        });

        resolve(productSliderWithProduct);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const insertProductSlider = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { selectedProducts } = sanitizeObject(params);
      selectedProducts = Array.isArray(selectedProducts) ? selectedProducts : [];
      const isValidProductId = helperFunctions.isValidKeyName(selectedProducts, 'productId');

      if (selectedProducts.length && isValidProductId) {
        const allActiveProductData = await productService.getAllActiveProducts();
        const tempArray = selectedProducts.map((x) => x.productId);

        const matchedProducts = allActiveProductData.filter((productItem) =>
          tempArray.includes(productItem.id)
        );

        const isAllSelectedproductsActive =
          matchedProducts.length === selectedProducts.length ? true : false;
        if (!isAllSelectedproductsActive) {
          reject(new Error('Invalid Products! (Only active products are allowed!)'));
          return;
        }

        const productSliderData = await getAllProductSlider();
        const alreadyExitsData = productSliderData.filter((sliderItem) =>
          tempArray.includes(sliderItem.productId)
        );
        if (alreadyExitsData.length) {
          reject(new Error('Product already exits for adding product slider'));
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
            url: `${productSliderUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          await fetchWrapperService.create(createPattern);
          if (selectedProducts.length === i + 1) {
            resolve();
          }
        }
      } else {
        reject(new Error('Invalid data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProductSlider = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { productSliderId } = sanitizeObject(params);
      if (productSliderId) {
        const productSliderData = await fetchWrapperService.findOne(productSliderUrl, {
          id: productSliderId,
        });
        if (productSliderData) {
          await fetchWrapperService._delete(`${productSliderUrl}/${productSliderId}`);
          resolve();
        } else {
          reject(new Error('product slider not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const productSliderService = {
  getAllProductSlider,
  getAllProductSlidersWithProduct,
  insertProductSlider,
  deleteProductSlider,
};
