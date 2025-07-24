import {
  customizationSubTypeUrl,
  fetchWrapperService,
  priceMultiplierUrl,
  sanitizeObject,
} from '../_helpers';
import { customizationSubTypeService } from './customizationSubType.service';
import { productService } from './product.service';
import { v4 as uuidv4 } from 'uuid';

const fetchPriceMultiplier = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(priceMultiplierUrl);
      const fetchPriceMultiplier = respData ? respData?.priceMultiplier : null;
      resolve(fetchPriceMultiplier);
    } catch (e) {
      reject(e);
    }
  });
};

const upsertPriceMultiplier = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { priceMultiplier } = sanitizeObject(params);

      priceMultiplier =
        !isNaN(priceMultiplier) && priceMultiplier !== '' && priceMultiplier !== null
          ? Math.round(parseFloat(priceMultiplier) * 100) / 100
          : 0;
      if (priceMultiplier <= 0) {
        reject(new Error('Price multiplier must be a positive number'));
        return;
      }

      const payload = {
        priceMultiplier,
      };

      // Check if price multiplier exists
      const existingMultiplier = await fetchPriceMultiplier().catch(() => null);
      const exists = existingMultiplier !== null;

      const config = {
        url: priceMultiplierUrl,
        payload,
      };

      if (exists) {
        // Update existing price multiplier
        await fetchWrapperService
          ._update(config)
          .then(async () => {
            const allSubTypes = await customizationSubTypeService.getAllSubTypes();
            const allProducts = await productService.getAllProductsWithPagging();

            for (const product of allProducts) {
              await productService.updateSingleProductPrice({
                product,
                priceMultiplier,
                allSubTypes,
              });
            }

            resolve(priceMultiplier);
          })
          .catch(() => {
            reject(new Error('An error occurred during price multiplier update.'));
          });
      } else {
        // Create new price multiplier
        await fetchWrapperService
          .create({ url: priceMultiplierUrl, insertPattern: payload })
          .then(() => {
            resolve(priceMultiplier);
          })
          .catch(() => {
            reject(new Error('An error occurred during price multiplier creation.'));
          });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const settingsService = {
  fetchPriceMultiplier,
  upsertPriceMultiplier,
};
