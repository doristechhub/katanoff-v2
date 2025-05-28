import { fetchWrapperService, helperFunctions, menuUrl } from "@/_helper";

export const getAllMenuData = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await fetchWrapperService.getAll(menuUrl);
      const categories = menuData?.categories
        ? Object.values(menuData?.categories)
        : [];
      const subCategories = menuData?.subCategories
        ? Object.values(menuData?.subCategories)
        : [];
      const productTypes = menuData?.productType
        ? Object.values(menuData?.productType)
        : [];
      resolve({ categories, subCategories, productTypes });
    } catch (e) {
      reject(e);
    }
  });
};


// export const getAllSearchListingByValue = (params) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let { searchValue } = sanitizeObject(params);
//       searchValue = searchValue ? searchValue.trim() : null;
//       if (searchValue) {
//         const allActiveProductsData =
//           await productService.getAllActiveProducts();

//         const searchResults = allActiveProductsData.filter((product) => {
//           const fieldsToSearch = [
//             product.categoryName,
//             product.subCategoryName,
//             product.sku,
//             product.saltSKU,
//             product.productName,
//           ];

//           if (
//             product.productTypeNames &&
//             Array.isArray(product.productTypeNames)
//           ) {
//             product.productTypeNames.forEach((productTypeName) => {
//               fieldsToSearch.push(productTypeName);
//             });
//           }

//           if (product.variations && Array.isArray(product.variations)) {
//             product.variations.forEach((variation) => {
//               fieldsToSearch.push(variation.variationName);
//               variation.variationTypes.forEach((variationType) => {
//                 fieldsToSearch.push(variationType.variationTypeName);
//               });
//             });
//           }
//           if (
//             product.collectionNames &&
//             Array.isArray(product.collectionNames)
//           ) {
//             product.collectionNames.forEach((collection) => {
//               fieldsToSearch.push(collection);
//             });
//           }

//           // Check if any field contains the search term (case-insensitive)
//           return fieldsToSearch.some((field) =>
//             field
//               ? field.toLowerCase().includes(searchValue.toLowerCase())
//               : false
//           );
//         });
//         const updatedSearchResults = searchResults.map((product) => {
//           const { price = 0 } = helperFunctions.getMinPriceVariCombo(
//             product.variComboWithQuantity
//           );
//           return {
//             ...product,
//             basePrice: price,
//             baseSellingPrice: helperFunctions.getSellingPrice({
//               price,
//               discount:product.discount
//             }),
//             discount: product.discount,
//             goldTypeVariations: product?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
//             )?.variationTypes,
//             goldColorVariations: product?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
//             )?.variationTypes,
//           };
//         });
//         resolve(updatedSearchResults);
//       } else {
//         reject(new Error("Invalid Data"));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

export const getAllMenuList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await getAllMenuData();

      // Modified to include parent subcategory information in product type links
      const subCategoryWiseProductType = (subCategoryId, subCategoryTitle, categoryTitle) => {
        return menuData.productTypes
          .filter((productType) => productType.subCategoryId === subCategoryId)
          .map((productType) => {
            const type = "productTypes";

            // Generate link with parentCategory and parentMainCategory query parameters
            const encodedProductType = helperFunctions.stringReplacedWithUnderScore(
              productType?.title
            );
            const encodedSubCategory = encodeURIComponent(subCategoryTitle);
            const encodedCategory = encodeURIComponent(categoryTitle);

            return {
              id: productType.id,
              type,
              title: productType.title,
              href: `/collections/${type}/${encodedProductType}?parentCategory=${encodedSubCategory}&parentMainCategory=${encodedCategory}`,
              parentCategory: subCategoryTitle, // Store parent category for reference
              parentMainCategory: categoryTitle // Store main category for reference
            };
          });
      };

      const categoryWiseSubCategory = (categoryId, categoryTitle) => {
        return menuData.subCategories
          .filter((subCategory) => subCategory.categoryId === categoryId)
          .map((subCategory) => {
            const type = "subCategories";
            const encodedSubCategory = helperFunctions.stringReplacedWithUnderScore(
              subCategory?.title
            );
            const encodedCategory = encodeURIComponent(categoryTitle);

            return {
              id: subCategory.id,
              type,
              title: subCategory.title,
              href: `/collections/${type}/${encodedSubCategory}?parentMainCategory=${encodedCategory}`,
              parentMainCategory: categoryTitle, // Store main category for reference
              // Pass the subcategory title and category title to the product types generation function
              productTypes: subCategoryWiseProductType(subCategory.id, subCategory.title, categoryTitle),
            };
          });
      };

      const sortedCategories = menuData.categories.sort(
        (a, b) => a.position - b.position
      );

      const menuList = sortedCategories.map((category) => {
        const type = "categories";
        return {
          id: category.id,
          type,
          title: category.title,
          href: `/collections/${type}/${helperFunctions.stringReplacedWithUnderScore(
            category?.title
          )}`,
          subCategories: categoryWiseSubCategory(category.id, category.title),
        };
      });

      resolve(menuList);
    } catch (e) {
      reject(e);
    }
  });
};
export const homeService = {
  getAllMenuList,
  getAllMenuData,
  // getAllSearchListingByValue,
};
