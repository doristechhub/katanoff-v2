import {
  fetchWrapperService,
  helperFunctions,
  sanitizeValue,
  productsUrl,
  customizationUrl,
  sanitizeObject,
} from "../_helper";
import { GOLD_COLOR, GOLD_TYPES } from "../_helper/constants";
import { collectionService } from "./collection.service";
import { customizeService } from "./customize.service";
import { diamondShapeService } from "./diamondShape.service";
import { homeService } from "./home.service";
import { settingStyleService } from "./settingStyle.service";

const getAllActiveProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: productsUrl,
        key: "active",
        value: true,
      };
      const tempActiveProductData = await fetchWrapperService.find(findPattern);
      const customizations = await productService.getAllCustomizations();
      const collectionData = await collectionService.getAllCollection();
      const settingStyleData = await settingStyleService.getAllSettingStyles();
      const diamondShapeList = await diamondShapeService.getAllDiamondShapes();
      const menuData = await homeService.getAllMenuData();

      const activeProductData = tempActiveProductData?.map((product) => {
        const subCategoryIds = product?.subCategoryIds || [];

        return {
          ...product,
          collectionNames: product?.collectionIds?.map(
            (id) =>
              collectionData.find((collection) => collection?.id === id)?.title
          ),
          settingStyleNamesWithImg:
            product?.settingStyleIds?.map((id) =>
              settingStyleData.find((style) => style?.id === id)
            ) || [],

          diamondFilters: product.isDiamondFilter
            ? {
                ...product?.diamondFilters,
                diamondShapes: product?.diamondFilters.diamondShapeIds?.map(
                  (shapeId) => {
                    const foundedShape = diamondShapeList?.find(
                      (shape) => shape?.id === shapeId
                    );
                    return {
                      title: foundedShape?.title,
                      image: foundedShape?.image,
                      id: foundedShape?.id,
                    };
                  }
                ),
              }
            : product?.diamondFilters,
          categoryName: menuData.categories.find(
            (category) => category.id === product.categoryId
          )?.title,
          subCategoryNames: subCategoryIds?.length
            ? subCategoryIds
                .map(
                  (id) =>
                    menuData?.subCategories?.find(
                      (subCategory) => subCategory?.id === id
                    )?.title
                )
                ?.filter(Boolean)
            : [],
          ...(product.productTypeIds?.length > 0 && {
            productTypeNames: product.productTypeIds.map(
              (id) =>
                menuData.productTypes.find(
                  (productType) => productType?.id === id
                )?.title
            ),
          }),
          variations: helperFunctions.getVariationsArray(
            product.variations,
            customizations
          ),
        };
      });
      resolve(activeProductData);
    } catch (e) {
      reject(e);
    }
  });
};

const getActiveProductsByIds = (productIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(productIds) || !productIds.length) {
        resolve([]);
        return;
      }

      const productsByIds = await fetchWrapperService.getItemsByIds({
        url: productsUrl,
        itemIds: productIds,
      });

      const diamondShapeList = await diamondShapeService.getAllDiamondShapes();

      const activeProductsByIds = productsByIds
        .filter((product) => product?.active)
        .map((product) => {
          const diamondShapes = product.isDiamondFilter
            ? product?.diamondFilters?.diamondShapeIds?.map((shapeId) => {
                const foundedShape = diamondShapeList?.find(
                  (shape) => shape?.id === shapeId
                );
                if (!foundedShape) {
                  return {
                    title: "Unknown Shape",
                    image: null,
                    id: shapeId,
                  };
                }
                return {
                  title: foundedShape?.title,
                  image: foundedShape?.image,
                  id: foundedShape?.id,
                };
              }) || []
            : [];

          return {
            ...product,
            diamondFilters: product.isDiamondFilter
              ? {
                  ...product?.diamondFilters,
                  diamondShapes,
                }
              : product?.diamondFilters || {},
          };
        });

      resolve(activeProductsByIds);
    } catch (e) {
      reject(e);
    }
  });
};

const getLatestProducts = (length = 8) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allActiveProductsData = await getAllActiveProducts();
      const latestProduct = helperFunctions
        .sortByField(allActiveProductsData)
        .slice(0, length)
        .map((product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            productName: product.productName,
            whiteGoldThumbnailImage: product?.whiteGoldThumbnailImage,
            yellowGoldThumbnailImage: product?.yellowGoldThumbnailImage,
            roseGoldThumbnailImage: product?.roseGoldThumbnailImage,
            whiteGoldImages: product?.whiteGoldImages,
            yellowGoldImages: product?.yellowGoldImages,
            roseGoldImages: product?.roseGoldImages,
            id: product.id,
            basePrice: helperFunctions?.roundOffPrice(price),
            baseSellingPrice: helperFunctions?.getSellingPrice({
              price,
              discount: product.discount,
            }),
            discount: product.discount,
            goldTypeVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_TYPES?.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_COLOR?.toLowerCase()
            )?.variationTypes,
          };
        });
      resolve(latestProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCustomizations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const customizationData = await fetchWrapperService.getAll(
        customizationUrl
      );
      const customizationType = customizationData?.customizationType
        ? Object.values(customizationData?.customizationType)
        : [];
      const customizationSubType = customizationData?.customizationSubType
        ? Object.values(customizationData?.customizationSubType)
        : [];
      resolve({ customizationType, customizationSubType });
    } catch (e) {
      reject(e);
    }
  });
};

const getCollectionsTypeWiseProduct = (
  collectionType,
  collectionTitle,
  parentCategory = null,
  parentMainCategory = null
) => {
  return new Promise(async (resolve, reject) => {
    try {
      collectionType = sanitizeValue(collectionType)
        ? collectionType.trim()
        : null;
      collectionTitle = sanitizeValue(collectionTitle)
        ? collectionTitle.trim()
        : null;
      if (!collectionType || !collectionTitle) {
        reject(new Error("Invalid Data"));
        return;
      }
      const allActiveProductsData = await getAllActiveProducts();
      let filteredData = [];

      if (collectionType === "categories") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item?.categoryName?.toLowerCase() === collectionTitle?.toLowerCase()
        );
      } else if (collectionType === "subCategories") {
        // Filter by subcategory name
        let subCategoryFilter = allActiveProductsData.filter((item) =>
          item?.subCategoryNames?.some(
            (name) => name?.toLowerCase() === collectionTitle?.toLowerCase()
          )
        );

        // If parentMainCategory is provided, further filter by category
        if (parentMainCategory) {
          subCategoryFilter = subCategoryFilter.filter(
            (item) =>
              item?.categoryName?.toLowerCase() ===
              parentMainCategory?.toLowerCase()
          );
        }

        filteredData = subCategoryFilter;
      } else if (collectionType === "productTypes") {
        // First filter by product type
        let productTypeFilter = allActiveProductsData.filter(
          (item) =>
            item.productTypeNames?.length &&
            item.productTypeNames.some(
              (name) => name?.toLowerCase() === collectionTitle?.toLowerCase()
            )
        );

        // If parentCategory (subcategory) is provided, further filter by subcategory
        if (parentCategory) {
          productTypeFilter = productTypeFilter.filter((item) =>
            item?.subCategoryNames?.some(
              (name) => name?.toLowerCase() === parentCategory?.toLowerCase()
            )
          );
        }

        // If parentMainCategory (main category) is provided, further filter by category
        if (parentMainCategory) {
          productTypeFilter = productTypeFilter.filter(
            (item) =>
              item?.categoryName?.toLowerCase() ===
              parentMainCategory?.toLowerCase()
          );
        }

        filteredData = productTypeFilter;
      } else if (collectionType === "collection") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item?.collectionNames?.length &&
            item?.collectionNames?.some(
              (name) => name?.toLowerCase() === collectionTitle?.toLowerCase()
            )
        );
      }

      const collectionTypeWiseProductsList = helperFunctions
        .sortByField(filteredData)
        .map((product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            productName: product.productName,
            isDiamondFilter: product?.isDiamondFilter || false,
            whiteGoldThumbnailImage: product?.whiteGoldThumbnailImage,
            yellowGoldThumbnailImage: product?.yellowGoldThumbnailImage,
            roseGoldThumbnailImage: product?.roseGoldThumbnailImage,
            whiteGoldImages: product?.whiteGoldImages,
            yellowGoldImages: product?.yellowGoldImages,
            roseGoldImages: product?.roseGoldImages,
            id: product.id,
            gender: product.gender,
            basePrice: helperFunctions?.roundOffPrice(price),
            baseSellingPrice: helperFunctions.getSellingPrice({
              price,
              discount: product.discount,
            }),
            discount: product.discount,
            variations: product.variations,
            createdDate: product.createdDate,
            goldTypeVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_TYPES?.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_COLOR?.toLowerCase()
            )?.variationTypes,
            settingStyleNamesWithImg: product?.settingStyleNamesWithImg,
            // Add category and subcategory info for debugging/reference
            categoryName: product.categoryName,
            subCategoryNames: product.subCategoryNames,
            productTypeNames: product.productTypeNames,
          };
        });
      resolve(collectionTypeWiseProductsList);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Retrieves banner images for a specific collection type and title
 * @param {Object} params - Parameters for fetching banners
 * @param {string} params.collectionCategory - Type of collection (categories, subCategories, productTypes, collection)
 * @param {string} params.collectionName - Title of the collection
 * @param {string} [params.parentSubCategory] - Parent subcategory (for productTypes)
 * @param {string} [params.parentMainCategory] - Parent main category (for subCategories/productTypes)
 * @returns {Promise<{desktop: string, mobile: string}>} Banner images for desktop and mobile
 * @throws {Error} If required parameters are invalid or data fetching fails
 */
const fetchCollectionBanners = async ({
  collectionCategory,
  collectionName,
  parentSubCategory = null,
  parentMainCategory = null,
}) => {
  // Input sanitization and validation
  const sanitizeValue = (value) => typeof value === "string" && value.trim();
  const sanitizedInputs = {
    category: sanitizeValue(collectionCategory)
      ? collectionCategory?.trim()?.toLowerCase()
      : null,
    name: sanitizeValue(collectionName)
      ? collectionName?.trim()?.toLowerCase()
      : null,
    parentSubCat: sanitizeValue(parentSubCategory)
      ? parentSubCategory?.trim()?.toLowerCase()
      : null,
    parentMainCat: sanitizeValue(parentMainCategory)
      ? parentMainCategory?.trim()?.toLowerCase()
      : null,
  };

  const { category, name, parentSubCat, parentMainCat } = sanitizedInputs;

  if (!category || !name) {
    throw new Error("Collection category and name are required");
  }

  if (
    !["categories", "subcategories", "producttypes", "collection"].includes(
      category
    )
  ) {
    throw new Error(`Invalid collection category: ${category}`);
  }

  // Default banner object
  const defaultBanners = { desktop: "", mobile: "" };

  try {
    // Fetch data concurrently
    const [menuData, collectionsData] = await Promise.all([
      homeService.getAllMenuData(),
      collectionService.getAllCollection(),
    ]);

    const findCategory = (categories, title) =>
      categories?.find((item) => item?.title?.toLowerCase() === title);

    switch (category) {
      case "categories": {
        const categoryItem = findCategory(menuData?.categories, name);
        return {
          desktop: categoryItem?.desktopBannerImage ?? "",
          mobile: categoryItem?.mobileBannerImage ?? "",
        };
      }

      case "subcategories": {
        if (!parentMainCat) {
          throw new Error("Parent main category required for subCategories");
        }
        const relatedCategory = findCategory(
          menuData?.categories,
          parentMainCat
        );
        if (!relatedCategory) return defaultBanners;

        const subcategory = menuData?.subCategories?.find(
          (item) =>
            item?.title?.toLowerCase() === name &&
            item?.categoryId === relatedCategory?.id
        );
        return {
          desktop: subcategory?.desktopBannerImage ?? "",
          mobile: subcategory?.mobileBannerImage ?? "",
        };
      }

      case "producttypes": {
        if (!parentMainCat || !parentSubCat) {
          throw new Error(
            "Parent main category and subcategory required for productTypes"
          );
        }

        const relatedCategory = findCategory(
          menuData?.categories,
          parentMainCat
        );
        if (!relatedCategory) return defaultBanners;

        const relatedSubCategory = menuData?.subCategories?.find(
          (item) =>
            item?.title?.toLowerCase() === parentSubCat &&
            item?.categoryId === relatedCategory?.id
        );
        if (!relatedSubCategory) return defaultBanners;

        const productType = menuData?.productTypes?.find(
          (item) =>
            item?.title?.toLowerCase() === name &&
            item?.categoryId === relatedSubCategory?.categoryId &&
            item?.subCategoryId === relatedSubCategory?.id
        );
        if (!productType) return defaultBanners;

        const relatedSubcategory = menuData?.subCategories?.find(
          (item) => item?.id === productType?.subCategoryId
        );
        return {
          desktop: relatedSubcategory?.desktopBannerImage ?? "",
          mobile: relatedSubcategory?.mobileBannerImage ?? "",
        };
      }

      case "collection": {
        const collection = findCategory(collectionsData, name);
        return {
          desktop: collection?.desktopBannerImage ?? "",
          mobile: collection?.mobileBannerImage ?? "",
        };
      }

      default:
        return defaultBanners;
    }
  } catch (error) {
    console.error(`Error fetching banners for ${category}/${name}:`, error);
    throw new Error(`Failed to fetch banners: ${error.message}`);
  }
};

const getProcessProducts = async (singleProductData) => {
  try {
    const collectionData = await collectionService.getAllCollection();
    const settingStyleData = await settingStyleService.getAllSettingStyles();
    const menuData = await homeService.getAllMenuData();
    const customizations = await productService.getAllCustomizations();
    const diamondShapeList = await diamondShapeService.getAllDiamondShapes();

    let convertedProductData = singleProductData;

    // Normalize subCategoryIds array
    const subCategoryIds = convertedProductData?.subCategoryIds || [];

    convertedProductData.collectionNames =
      convertedProductData?.collectionIds?.map(
        (id) =>
          collectionData.find((collection) => collection?.id === id)?.title
      );

    // Map setting style data with images
    convertedProductData.settingStyleNamesWithImg =
      convertedProductData?.settingStyleIds?.map((id) =>
        settingStyleData.find((style) => style?.id === id)
      );

    // Map category name
    convertedProductData.categoryName = menuData.categories.find(
      (category) => category.id === convertedProductData.categoryId
    )?.title;

    convertedProductData.subCategoryNames = subCategoryIds.length
      ? subCategoryIds
          .map(
            (id) =>
              menuData.subCategories.find(
                (subCategory) => subCategory.id === id
              )?.title
          )
          .filter(Boolean)
      : [];

    if (convertedProductData?.productTypeIds?.length) {
      convertedProductData.productTypeNames =
        convertedProductData.productTypeIds
          .map(
            (id) =>
              menuData.productTypes.find(
                (productType) => productType?.id === id
              )?.title
          )
          .filter(Boolean);
    }

    // Handle variations
    convertedProductData.variations = helperFunctions.getVariationsArray(
      convertedProductData.variations,
      customizations
    );

    // Map diamond filters
    if (convertedProductData?.isDiamondFilter) {
      convertedProductData.diamondFilters = {
        ...convertedProductData?.diamondFilters,
        diamondShapes: convertedProductData?.diamondFilters?.diamondShapeIds
          ?.map((shapeId) => {
            const foundShape = diamondShapeList?.find(
              (shape) => shape?.id === shapeId
            );
            return foundShape
              ? {
                  title: foundShape?.title,
                  image: foundShape?.image,
                  id: foundShape?.id,
                }
              : null;
          })
          .filter(Boolean),
      };
    }

    return convertedProductData;
  } catch (error) {
    throw error;
  }
};

const getSingleProduct = (productName) => {
  return new Promise(async (resolve, reject) => {
    try {
      productName = sanitizeValue(productName) ? productName.trim() : null;
      if (productName) {
        const singleProductData = await fetchWrapperService.findOne(
          productsUrl,
          { productName }
        );
        if (singleProductData) {
          const processedProductData = await getProcessProducts(
            singleProductData
          );
          resolve(processedProductData);
        } else {
          reject(new Error("Product does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getReletedProducts = (productName) => {
  return new Promise(async (resolve, reject) => {
    try {
      productName = sanitizeValue(productName) ? productName.trim() : null;

      if (productName) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          productName,
        });

        if (productData) {
          const allActiveProductsData = await getAllActiveProducts();

          // Normalize productData subCategoryIds
          const productSubCategoryIds = productData?.subCategoryIds || [];

          const relatedProducts = allActiveProductsData?.filter(
            (x) =>
              x?.categoryId === productData?.categoryId &&
              x?.subCategoryIds?.some((id) =>
                productSubCategoryIds.includes(id)
              )
          );

          const reletedProductsWithoutCurrentProduct = relatedProducts?.filter(
            (product) =>
              product?.productName?.toLowerCase() !== productName?.toLowerCase()
          );

          const sortedReletedProductData = helperFunctions
            .sortByField(reletedProductsWithoutCurrentProduct)
            .slice(0, 8)
            .map((product) => {
              const { price = 0 } = helperFunctions.getMinPriceVariCombo(
                product.variComboWithQuantity
              );
              return {
                productName: product.productName,
                whiteGoldImages: product?.whiteGoldImages,
                yellowGoldImages: product?.yellowGoldImages,
                roseGoldImages: product?.roseGoldImages,
                whiteGoldThumbnailImage: product?.whiteGoldThumbnailImage,
                yellowGoldThumbnailImage: product?.yellowGoldThumbnailImage,
                roseGoldThumbnailImage: product?.roseGoldThumbnailImage,
                id: product.id,
                basePrice: helperFunctions?.roundOffPrice(price),
                baseSellingPrice: helperFunctions.getSellingPrice({
                  price,
                  discount: product.discount,
                }),
                discount: product.discount,
                goldTypeVariations: product?.variations?.find(
                  (x) =>
                    x?.variationName?.toLowerCase() ===
                    GOLD_TYPES?.toLowerCase()
                )?.variationTypes,
                goldColorVariations: product?.variations?.find(
                  (x) =>
                    x?.variationName?.toLowerCase() ===
                    GOLD_COLOR?.toLowerCase()
                )?.variationTypes,
              };
            });
          resolve(sortedReletedProductData);
        } else {
          reject(new Error("Product does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getFilteredDiamondProducts = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        diamondId,
        selectedProductTypes,
        selectedCollections,
        selectedSettingStyles,
        selectedVariations,
        priceRangeValues,
      } = params || {};

      let allActiveProductsData = await getAllActiveProducts();
      const diamondFilteredProducts = allActiveProductsData.filter(
        (x) => x?.isDiamondFilter
      );
      let filteredProducts = diamondFilteredProducts;
      if (diamondId) {
        const selectedDiamond = []?.find(
          (diamond) => Number(diamond.id) === Number(diamondId)
        );

        if (!selectedDiamond) {
          reject(new Error("Diamond not found"));
          return;
        }

        filteredProducts = diamondFilteredProducts.filter((product) => {
          const { diamondFilters } = product || {};

          const isCaratRangeValid =
            diamondFilters?.caratWeightRange &&
            (diamondFilters?.caratWeightRange.min <= selectedDiamond?.size ||
              diamondFilters?.caratWeightRange.max <= selectedDiamond?.size);

          const isShapeValid =
            diamondFilters?.diamondShapes?.length &&
            diamondFilters?.diamondShapes.some(
              (shape) =>
                shape?.title?.toLowerCase() ===
                selectedDiamond?.shape?.toLowerCase()
            );

          return isCaratRangeValid && isShapeValid;
        });
      }

      const tempProductTypes = [];
      const tempCollections = [];
      const tempSettingStyles = [];
      const tempPriceRange = [];
      const uniqueVariations = [];

      filteredProducts.forEach((element) => {
        const productTypeItems = element?.productTypeNames;
        const collectionItems = element?.collectionNames;
        const settingStylesItem = element?.settingStyleNamesWithImg;
        const variComboWithQtyItems = element?.variComboWithQuantity;
        const variationItems = element?.variations;
        if (productTypeItems?.length)
          tempProductTypes.push(...productTypeItems);

        if (collectionItems?.length) tempCollections.push(...collectionItems);
        if (settingStylesItem?.length)
          tempSettingStyles.push(...settingStylesItem);
        if (variComboWithQtyItems?.length) {
          const prices = variComboWithQtyItems.map((combo) => combo.price || 0);
          tempPriceRange.push(...prices);
        }
        variationItems.forEach((variation) => {
          let existingVariationIndex = uniqueVariations.findIndex(
            (item) => item.variationId === variation.variationId
          );

          if (existingVariationIndex === -1) {
            let newVariation = {
              variationName: variation.variationName,
              variationId: variation.variationId,
              type: variation.variationTypes[0]?.type,
              variationTypes: variation.variationTypes.map((variationType) => ({
                variationTypeName: variationType.variationTypeName,
                variationTypeId: variationType.variationTypeId,
                variationTypeHexCode: variationType?.variationTypeHexCode,
                variationTypeImage: variationType?.variationTypeImage,
              })),
            };

            uniqueVariations.push(newVariation);
          } else {
            variation.variationTypes.forEach((variationType) => {
              let existingTypeIndex = uniqueVariations[
                existingVariationIndex
              ].variationTypes.findIndex(
                (item) => item.variationTypeId === variationType.variationTypeId
              );
              if (existingTypeIndex === -1) {
                uniqueVariations[existingVariationIndex].variationTypes.push({
                  variationTypeName: variationType.variationTypeName,
                  variationTypeId: variationType.variationTypeId,
                  variationTypeHexCode: variationType?.variationTypeHexCode,
                  variationTypeImage: variationType?.variationTypeImage,
                });
              }
            });
          }
        });
      });

      const filteredDiamondProducts = helperFunctions
        .sortByField(filteredProducts)
        .filter((product) => {
          // Filter by product type
          const isProductTypeValid = selectedProductTypes?.length
            ? selectedProductTypes.some((type) =>
                product?.productTypeNames.includes(type?.value)
              )
            : true;

          // Filter by collection
          const isCollectionValid = selectedCollections?.length
            ? selectedCollections.some((collection) =>
                product?.collectionNames?.includes(collection?.value)
              )
            : true;

          // Filter by setting style
          const settingStyleNames = product?.settingStyleNamesWithImg?.map(
            (x) => x?.title
          );
          const isSettingStyleValid = selectedSettingStyles?.length
            ? selectedSettingStyles.some((style) =>
                settingStyleNames?.includes(style?.value)
              )
            : true;

          // Filter by variations
          const isVariationValid = selectedVariations?.length
            ? selectedVariations.every((selectedVariation) => {
                const productVariation = product?.variations?.find(
                  (v) =>
                    v?.variationName?.toLowerCase() ===
                    selectedVariation?.title?.toLowerCase()
                );

                if (!productVariation) return false;

                // Check if any selected value matches the product's variation types
                return selectedVariation.selectedValues.length
                  ? selectedVariation.selectedValues.some((selectedValue) =>
                      productVariation.variationTypes.some(
                        (variationType) =>
                          variationType?.variationTypeName?.toLowerCase() ===
                          selectedValue?.value?.toLowerCase()
                      )
                    )
                  : true;
              })
            : true;

          // Filter by price range
          const productPrices = product?.variComboWithQuantity.map(
            (combo) => combo.price || 0
          );
          const isPriceValid = priceRangeValues?.length
            ? productPrices.some(
                (price) =>
                  price >= (priceRangeValues[0] || 0) &&
                  price <= (priceRangeValues[1] || Infinity)
              )
            : true;

          return (
            product?.isDiamondFilter &&
            isProductTypeValid &&
            isCollectionValid &&
            isSettingStyleValid &&
            isVariationValid &&
            isPriceValid
          );
        });

      const processedDiamondProducts = filteredDiamondProducts.map(
        (product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            productName: product.productName,
            whiteGoldImages: product?.whiteGoldImages,
            yellowGoldImages: product?.yellowGoldImages,
            roseGoldImages: product?.roseGoldImages,
            whiteGoldThumbnailImage: product?.whiteGoldThumbnailImage,
            yellowGoldThumbnailImage: product?.yellowGoldThumbnailImage,
            roseGoldThumbnailImage: product?.roseGoldThumbnailImage,
            id: product.id,
            basePrice: helperFunctions?.roundOffPrice(price),
            baseSellingPrice: helperFunctions.getSellingPrice({
              price,
              discount: product.discount,
            }),
            discount: product.discount,
            goldTypeVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_TYPES?.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_COLOR?.toLowerCase()
            )?.variationTypes,
          };
        }
      );

      // Get the minimum and maximum price for the availablePriceRange
      const minPrice = Math.min(...tempPriceRange);
      const maxPrice = Math.max(...tempPriceRange);
      const uniqueSettingStyles = tempSettingStyles
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.title === item.title)
        )
        .map((x) => {
          return {
            title: x?.title,
            value: x?.title,
            image: x?.image,
          };
        });

      const metaData = {
        availablePriceRange: [minPrice, maxPrice],
        uniqueProductTypes: [...new Set(tempProductTypes)],
        uniqueCollections: [...new Set(tempCollections)],
        uniqueSettingStyles,
        uniqueVariations,
      };
      resolve({
        diamondProducts: processedDiamondProducts,
        metaData,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getSingleProductDataById = async ({ productId }) => {
  try {
    productId = sanitizeValue(productId) ? productId.trim() : null;

    if (!productId) {
      throw new Error("Invalid Data");
    }

    const productFindPattern = { id: productId };

    const singleProductData = await fetchWrapperService.findOne(
      productsUrl,
      productFindPattern
    );

    if (!singleProductData) {
      throw new Error("Product does not exist");
    }

    const processedProductData = await getProcessProducts(singleProductData);
    return processedProductData;
  } catch (error) {
    console.error("Error in getSingleProductDataById:", error);
    throw error;
  }
};

const fetchUniqueShapesAndCaratBounds = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const activeProducts = await getAllActiveProducts();

      const shapeIdSet = new Set();
      const distinctShapes = [];
      const minCaratValues = [];
      const maxCaratValues = [];

      activeProducts?.forEach((item) => {
        const itemShapes = item?.diamondFilters?.diamondShapes;
        if (item.isDiamondFilter) {
          // Collect unique shapes
          if (itemShapes?.length) {
            itemShapes?.forEach((shape) => {
              if (!shapeIdSet.has(shape.id)) {
                shapeIdSet.add(shape.id);
                distinctShapes.push(shape);
              }
            });
          }
          minCaratValues.push(item?.diamondFilters?.caratWeightRange?.min);
          maxCaratValues.push(item?.diamondFilters?.caratWeightRange?.max);
        }
      });

      // Calculate carat bounds
      const minCaratBound = minCaratValues.length
        ? Math.min(...minCaratValues)
        : 0;
      const maxCaratBound = maxCaratValues.length
        ? Math.max(...maxCaratValues)
        : 0;
      const caratBounds = [minCaratBound, maxCaratBound];

      resolve({ distinctShapes, caratBounds });
    } catch (error) {
      reject(error);
    }
  });
};

const getCustomizeProduct = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { caratWeight, diamondShapeId } = params || {};
      const allActiveProductsData = await getAllActiveProducts();
      const customizeProductSettingsData =
        await customizeService?.fetchCustomizeProductSettings();
      const filteredData = allActiveProductsData.filter((item) => {
        // Base filter: isDiamondFilter must be true
        if (!item.isDiamondFilter) return false;
        // Carat weight filter: check if caratWeight is within range
        if (caratWeight) {
          const { min = ALLOW_MIN_CARAT_WEIGHT, max = ALLOW_MAX_CARAT_WEIGHT } =
            item.diamondFilters?.caratWeightRange || {};
          if (caratWeight < min || caratWeight > max) return false;
        }

        // Diamond shape filter: check if diamondShapeId is in diamondShapeIds
        if (diamondShapeId) {
          if (!item.diamondFilters?.diamondShapeIds?.includes(diamondShapeId))
            return false;
        }

        return true;
      });

      const customizeProductList = helperFunctions
        ?.sortByField(filteredData)
        ?.map((product) => {
          // Price calculation: separate metal and side diamond prices
          const customProductDetails = helperFunctions?.getCustomProduct();

          const centerDiamondDetail = {
            caratWeight: customProductDetails?.diamondDetails?.caratWeight,
            clarity: customProductDetails?.diamondDetails?.clarity?.value,
            color: customProductDetails?.diamondDetails?.color?.value,
          };

          const totalBasePrice =
            helperFunctions?.calculateCustomizedProductPrice({
              centerDiamondDetail: centerDiamondDetail,
              productDetail: product,
              customizeProductSettingsData,
            });

          return {
            productName: product?.productName,
            isDiamondFilter: product?.isDiamondFilter || false,
            whiteGoldImages: product?.whiteGoldImages,
            yellowGoldImages: product?.yellowGoldImages,
            roseGoldImages: product?.roseGoldImages,
            whiteGoldThumbnailImage: product?.whiteGoldThumbnailImage,
            yellowGoldThumbnailImage: product?.yellowGoldThumbnailImage,
            roseGoldThumbnailImage: product?.roseGoldThumbnailImage,
            diamondFilters: product?.diamondFilters,
            id: product.id,
            basePrice: helperFunctions?.roundOffPrice(totalBasePrice),
            baseSellingPrice: helperFunctions?.roundOffPrice(totalBasePrice),
            variations: product.variations,
            createdDate: product.createdDate,
            goldTypeVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_TYPES?.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) =>
                x?.variationName?.toLowerCase() === GOLD_COLOR?.toLowerCase()
            )?.variationTypes,
            settingStyleNamesWithImg: product?.settingStyleNamesWithImg,
          };
        });
      resolve(customizeProductList);
    } catch (e) {
      reject(e);
    }
  });
};

const searchProducts = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { searchValue } = sanitizeObject(params);
      searchValue = searchValue ? searchValue.trim() : null;

      if (!searchValue) {
        return reject("Invalid Data");
      }

      // Normalize searchValue for non-ctw searches (remove "ctw" for partial matches)
      const normalizedSearchValue = searchValue?.toLowerCase();

      const allActiveProductsData = await productService.getAllActiveProducts();

      const searchResults = allActiveProductsData.filter((product) => {
        // Generate formatted name using helper function
        const formattedName = helperFunctions.formatProductNameWithCarat({
          caratWeight: product.totalCaratWeight,
          productName: product.productName,
        });

        const fieldsToSearch = [
          product.categoryName,
          product.sku,
          product.saltSKU,
          product.productName,
          formattedName,
        ];

        if (
          product.subCategoryNames &&
          Array.isArray(product.subCategoryNames)
        ) {
          product.subCategoryNames.forEach((subCategoryName) => {
            fieldsToSearch.push(subCategoryName);
          });
        }

        if (
          product.productTypeNames &&
          Array.isArray(product.productTypeNames)
        ) {
          product.productTypeNames.forEach((productTypeName) => {
            fieldsToSearch.push(productTypeName);
          });
        }

        if (product.variations && Array.isArray(product.variations)) {
          product.variations.forEach((variation) => {
            fieldsToSearch.push(variation.variationName);
            variation.variationTypes.forEach((variationType) => {
              fieldsToSearch.push(variationType.variationTypeName);
            });
          });
        }

        if (product.collectionNames && Array.isArray(product.collectionNames)) {
          product.collectionNames.forEach((collection) => {
            fieldsToSearch.push(collection);
          });
        }

        return fieldsToSearch.some((field) =>
          field ? field.toLowerCase().includes(normalizedSearchValue) : false
        );
      });

      const updatedSearchResults = searchResults.map((product) => {
        const { price = 0 } = helperFunctions.getMinPriceVariCombo(
          product.variComboWithQuantity
        );
        return {
          ...product,
          basePrice: helperFunctions?.roundOffPrice(price),
          baseSellingPrice: helperFunctions.getSellingPrice({
            price,
            discount: product?.discount,
          }),
          discount: product.discount,
          goldTypeVariations: product?.variations?.find(
            (x) => x?.variationName?.toLowerCase() === GOLD_TYPES?.toLowerCase()
          )?.variationTypes,
          goldColorVariations: product?.variations?.find(
            (x) => x?.variationName?.toLowerCase() === GOLD_COLOR?.toLowerCase()
          )?.variationTypes,
          caratWeight: product.totalCaratWeight,
        };
      });

      resolve(updatedSearchResults);
    } catch (e) {
      reject(e);
    }
  });
};

export const productService = {
  getAllActiveProducts,
  getActiveProductsByIds,
  getLatestProducts,
  getAllCustomizations,
  getCollectionsTypeWiseProduct,
  fetchCollectionBanners,
  getSingleProduct,
  getReletedProducts,
  getFilteredDiamondProducts,
  getSingleProductDataById,
  getProcessProducts,
  fetchUniqueShapesAndCaratBounds,
  getCustomizeProduct,
  searchProducts,
};
