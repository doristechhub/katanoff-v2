import {
  fetchWrapperService,
  helperFunctions,
  sanitizeObject,
} from "../_helper";
import { GOLD_COLOR, GOLD_TYPES } from "../_helper/constants";
import { productService } from "./product.service";

const menuBaseUrl = process.env.REACT_APP_MENU;

const getAllMenuData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await fetchWrapperService.getAll(menuBaseUrl);
      const categories = menuData.categories
        ? Object.values(menuData.categories)
        : [];
      const subCategories = menuData.subCategories
        ? Object.values(menuData.subCategories)
        : [];
      const productTypes = menuData.productType
        ? Object.values(menuData.productType)
        : [];

      resolve({ categories, subCategories, productTypes });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMenuList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await getAllMenuData();

      const subCategoryWiseProductType = (subCategoryId) => {
        return menuData.productTypes
          .filter((productType) => productType.subCategoryId === subCategoryId)
          .map((productType) => {
            return {
              type: "productTypes",
              title: productType.title,
              id: productType.id,
            };
          });
      };
      const categoryWiseSubCategory = (categoryId) => {
        return menuData.subCategories
          .filter((subCategory) => subCategory.categoryId === categoryId)
          .map((subCategory) => {
            return {
              type: "subCategories",
              title: subCategory.title,
              id: subCategory.id,
              productTypes: subCategoryWiseProductType(subCategory.id),
            };
          });
      };
      const menuList = menuData.categories.map((category) => {
        return {
          type: "categories",
          title: category.title,
          id: category.id,
          subCategories: categoryWiseSubCategory(category.id),
        };
      });
      resolve(menuList);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllSearchListingByValue = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { searchValue } = sanitizeObject(params);
      searchValue = searchValue ? searchValue.trim() : null;
      if (searchValue) {
        const allActiveProductsData =
          await productService.getAllActiveProducts();
        const searchResults = allActiveProductsData.filter((product) => {
          const fieldsToSearch = [
            product.categoryName,
            product.subCategoryName,
            product.productTypeName,
            product.productName,
          ];
          if (product.variations && Array.isArray(product.variations)) {
            product.variations.forEach((variation) => {
              fieldsToSearch.push(variation.variationName);
              variation.variationTypes.forEach((variationType) => {
                fieldsToSearch.push(variationType.variationTypeName);
              });
            });
          }
          // Check if any field contains the search term (case-insensitive)
          return fieldsToSearch.some((field) =>
            field
              ? field.toLowerCase().includes(searchValue.toLowerCase())
              : false
          );
        });
        const updatedSearchResults = searchResults.map((product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            ...product,
            basePrice: price,
            baseSellingPrice: helperFunctions.getSellingPrice(
              price,
              product.discount
            ),
            discount: product.discount,
            goldTypeVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
            )?.variationTypes,
          };
        });
        resolve(updatedSearchResults);
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const homeService = {
  getAllMenuList,
  getAllMenuData,
  getAllSearchListingByValue,
};
