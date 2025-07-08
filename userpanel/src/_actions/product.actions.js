import {
  setCollectionTypeProductList,
  setLatestProductList,
  setProductDetail,
  setProductLoading,
  setRecentlyProductLoading,
  setRecentlyViewProductList,
  setUniqueFilterOptions,
  setProductMessage,
  setSearchedProductList,
  setSelectedPrices,
  setSearchResults,
  setBannerLoading,
  setBanners,
} from "@/store/slices/productSlice";
import { productService, recentlyViewedService } from "@/_services";
import {
  ENGAGEMENT_RINGS,
  messageType,
  WEDDING_RINGS,
} from "@/_helper/constants";
import {
  setEngagementHeaderLoader,
  setEngagementHeaderUniqueFilterOptions,
  setWeddingHeaderLoader,
  setWeddingHeaderUniqueFilterOptions,
} from "@/store/slices/commonSlice";

export const fetchLatestProductList = (length) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));

      const latestProductList = await productService.getLatestProducts(length);
      if (latestProductList) {
        dispatch(setLatestProductList(latestProductList));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const fetchWeddingCollectionsTypeWiseProduct = () => {
  return async (dispatch) => {
    try {
      dispatch(setWeddingHeaderUniqueFilterOptions([]));
      dispatch(setWeddingHeaderLoader(true));

      const WeddingCollectionProducts =
        await productService.getCollectionsTypeWiseProduct(
          "collection",
          WEDDING_RINGS
        );
      if (WeddingCollectionProducts) {
        const tempUniqueFilterOptions = getUniqueFilterOptions(
          WeddingCollectionProducts
        );
        const uniqueFilterOptions = { ...tempUniqueFilterOptions };
        dispatch(setWeddingHeaderUniqueFilterOptions(uniqueFilterOptions));

        dispatch(setWeddingHeaderLoader(false));
      }
    } catch (e) {
      dispatch(setWeddingHeaderUniqueFilterOptions([]));
      dispatch(setWeddingHeaderLoader(true));
    } finally {
      dispatch(setWeddingHeaderLoader(false));
    }
  };
};

export const fetchEngagementCollectionsTypeWiseProduct = () => {
  return async (dispatch) => {
    try {
      dispatch(setEngagementHeaderUniqueFilterOptions([]));
      dispatch(setEngagementHeaderLoader(true));

      const engagementCollectionProducts =
        await productService.getCollectionsTypeWiseProduct(
          "collection",
          ENGAGEMENT_RINGS
        );
      if (engagementCollectionProducts) {
        const tempUniqueFilterOptions = getUniqueFilterOptions(
          engagementCollectionProducts
        );
        const uniqueFilterOptions = { ...tempUniqueFilterOptions };
        dispatch(setEngagementHeaderUniqueFilterOptions(uniqueFilterOptions));

        dispatch(setEngagementHeaderLoader(false));
      }
    } catch (e) {
      dispatch(setEngagementHeaderUniqueFilterOptions([]));
      dispatch(setEngagementHeaderLoader(true));
    } finally {
      dispatch(setEngagementHeaderLoader(false));
    }
  };
};

/**
 * Resets all initial state for product collections
 * @param {Function} dispatch - Redux dispatch function
 */
const resetAllInit = (dispatch) => {
  const uniqueFilterOptions = getUniqueFilterOptions([]);
  dispatch(setUniqueFilterOptions(uniqueFilterOptions));
  dispatch(setSelectedPrices(uniqueFilterOptions?.availablePriceRange ?? []));
  dispatch(setCollectionTypeProductList([]));
  dispatch(setProductLoading(false));
};

/**
 * Fetches products based on collection type and updates Redux state
 * @param {string} collectionType - Type of collection
 * @param {string} collectionTitle - Title of the collection
 * @param {string} [parentCategory] - Parent category (optional)
 * @param {string} [parentMainCategory] - Parent main category (optional)
 * @returns {Function} Redux thunk action
 */
export const fetchCollectionsTypeWiseProduct = (
  collectionType,
  collectionTitle,
  parentCategory = null,
  parentMainCategory = null
) => {
  return async (dispatch) => {
    // Input validation
    if (!collectionType || !collectionTitle) {
      dispatch(setProductLoading(false));
      throw new Error("Collection type and title are required");
    }

    try {
      dispatch(setProductLoading(true));
      const products = await productService.getCollectionsTypeWiseProduct(
        collectionType,
        collectionTitle,
        parentCategory,
        parentMainCategory
      );

      if (Array.isArray(products) && products.length > 0) {
        const uniqueFilterOptions = getUniqueFilterOptions(products);
        dispatch(setUniqueFilterOptions(uniqueFilterOptions));
        dispatch(
          setSelectedPrices(uniqueFilterOptions?.availablePriceRange ?? [])
        );
        dispatch(setCollectionTypeProductList(products));
      } else {
        resetAllInit(dispatch);
      }
    } catch (error) {
      console.error(
        `Error fetching products for ${collectionType}/${collectionTitle}:`,
        error
      );
      resetAllInit(dispatch);
      throw new Error(`Failed to fetch products: ${error.message}`);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const fetchCollectionBannersAction = ({
  collectionCategory,
  collectionName,
  parentSubCategory,
  parentMainCategory,
}) => {
  return async (dispatch) => {
    try {
      dispatch(setBannerLoading(true));
      const banners = await productService?.fetchCollectionBanners({
        collectionCategory,
        collectionName,
        parentSubCategory,
        parentMainCategory,
      });

      if (banners && (banners.desktop || banners.mobile)) {
        dispatch(setBanners(banners));
      } else {
        dispatch(setBanners({ desktop: "", mobile: "" }));
      }
    } catch (error) {
      console.error("Error in fetchCollectionBannersAction:", error);
      dispatch(setBanners({ desktop: "", mobile: "" }));
    } finally {
      dispatch(setBannerLoading(false));
    }
  };
};

export const fetchProductDetailByProductName = (productName) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProductDetail({}));
      dispatch(setProductLoading(true));
      dispatch(setProductMessage({ message: "", type: "" }));

      const productDetail = await productService.getSingleProduct(productName);

      if (productDetail) {
        dispatch(setProductDetail(productDetail));
        dispatch(setProductLoading(false));
        return productDetail;
      }
    } catch (e) {
      const errorMessage = e?.message || "Something went wrong";
      dispatch(setProductDetail({}));
      dispatch(
        setProductMessage({
          message: errorMessage || "Unable to fetch product by name",
          type: messageType.ERROR,
        })
      );
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

// export const fetchReletedProducts = (productName) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.START_LOADING,
//         loaderId: "fetchDataLoader",
//       });

//       const reletedProductsList = await productService.getReletedProducts(
//         productName
//       );
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//       if (reletedProductsList) {
//         dispatch({
//           type: actionTypes.FETCH_RELETED_PRODUCT,
//           reletedProductsList,
//         });
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_RELETED_PRODUCT,
//         reletedProductsList: [],
//       });
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//     }
//   };
// };

const getUniqueSettingStyles = (styles) => {
  return Array.from(new Set(styles.map((item) => item.title))).map((title) => {
    const { image, id } = styles.find((item) => item.title === title) || {};
    return { title, value: id, image };
  });
};

export const getUniqueFilterOptions = (productList) => {
  const uniqueVariations = new Map();
  const tempSettingStyles = [];
  const uniqueShapeIds = new Set();
  const uniqueDiamondShapes = [];
  const tempPriceRange = [];
  const uniqueGenders = new Set();

  // For gender-based filtering
  const maleVariations = new Map();
  const femaleVariations = new Map();
  const tempMaleSettingStyles = [];
  const tempFemaleSettingStyles = [];

  // Helper to add variations to a map (deduplication)
  const addVariationsToMap = (variations, map) => {
    variations.forEach(({ variationId, variationName, variationTypes }) => {
      if (!map.has(variationId)) {
        map.set(variationId, {
          variationName,
          variationId,
          variationTypes: new Map(
            variationTypes.map((type) => [
              type.variationTypeId,
              {
                variationTypeName: type.variationTypeName,
                variationTypeId: type.variationTypeId,
                variationTypeHexCode: type.variationTypeHexCode ?? undefined,
                variationTypeImage: type.variationTypeImage ?? undefined,
              },
            ])
          ),
        });
      } else {
        const existingVariation = map.get(variationId);
        variationTypes.forEach((type) => {
          if (!existingVariation.variationTypes.has(type.variationTypeId)) {
            existingVariation.variationTypes.set(type.variationTypeId, {
              variationTypeName: type.variationTypeName,
              variationTypeId: type.variationTypeId,
              variationTypeHexCode: type.variationTypeHexCode ?? undefined,
              variationTypeImage: type.variationTypeImage ?? undefined,
            });
          }
        });
      }
    });
  };

  // Helper to add setting styles uniquely to an array (by title)
  const addSettingStyles = (stylesArray, targetArray) => {
    stylesArray.forEach((style) => {
      if (!targetArray.find((s) => s.title === style.title)) {
        targetArray.push(style);
      }
    });
  };

  productList.forEach((product) => {
    // Collect all setting styles for global filters
    const settingStyles = product?.settingStyleNamesWithImg;
    if (settingStyles?.length) {
      tempSettingStyles.push(...settingStyles);
    }

    // Collect variations for global filters
    addVariationsToMap(product.variations, uniqueVariations);

    // Handle diamond shapes
    if (
      product.isDiamondFilter &&
      product.diamondFilters?.diamondShapes?.length
    ) {
      product.diamondFilters.diamondShapes.forEach((shape) => {
        if (!uniqueShapeIds.has(shape.id)) {
          uniqueShapeIds.add(shape.id);
          uniqueDiamondShapes.push(shape);
        }
      });
    }
    tempPriceRange.push(product?.baseSellingPrice || 0);

    // Collect unique genders
    const gender = product.gender?.toLowerCase() || "";
    if (gender) {
      uniqueGenders.add(gender);
    }

    // Handle gender-based splitting
    if (gender === "male" || gender === "unisex") {
      addVariationsToMap(product.variations, maleVariations);
      if (settingStyles?.length)
        addSettingStyles(settingStyles, tempMaleSettingStyles);
    }
    if (gender === "female" || gender === "unisex") {
      addVariationsToMap(product.variations, femaleVariations);
      if (settingStyles?.length)
        addSettingStyles(settingStyles, tempFemaleSettingStyles);
    }
  });

  // Convert maps to arrays for global filters
  const variationsArray = Array.from(uniqueVariations.values()).map(
    (variation) => ({
      ...variation,
      variationTypes: Array.from(variation.variationTypes.values()),
    })
  );

  // Convert male/female variations maps to arrays
  const maleVariationsArray = Array.from(maleVariations.values()).map(
    (variation) => ({
      ...variation,
      variationTypes: Array.from(variation.variationTypes.values()),
    })
  );
  const femaleVariationsArray = Array.from(femaleVariations.values()).map(
    (variation) => ({
      ...variation,
      variationTypes: Array.from(variation.variationTypes.values()),
    })
  );

  // Price range
  const minPrice = tempPriceRange.length ? Math.min(...tempPriceRange) : 0;
  const maxPrice = tempPriceRange.length ? Math.max(...tempPriceRange) : 0;

  return {
    uniqueVariations: variationsArray,
    uniqueSettingStyles: getUniqueSettingStyles(tempSettingStyles),
    uniqueDiamondShapes,
    availablePriceRange: [minPrice, maxPrice],
    uniqueGenders: Array.from(uniqueGenders), // Add unique genders
    maleFilters: {
      variations: maleVariationsArray,
      settingStyles: getUniqueSettingStyles(tempMaleSettingStyles),
    },
    femaleFilters: {
      variations: femaleVariationsArray,
      settingStyles: getUniqueSettingStyles(tempFemaleSettingStyles),
    },
  };
};

export const fetchRecentlyViewedProducts = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRecentlyProductLoading(true));
      const recentlyViewedProductsList =
        await recentlyViewedService.getAllRecentlyViewedWithProduct();

      if (recentlyViewedProductsList) {
        dispatch(setRecentlyViewProductList(recentlyViewedProductsList));
      }
    } catch (e) {
      dispatch(setRecentlyViewProductList([]));
    } finally {
      dispatch(setRecentlyProductLoading(false));
    }
  };
};

export const addUpdateRecentlyViewedProducts = (params) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRecentlyProductLoading(true));

      await recentlyViewedService.addUpdateRecentlyViewed(params);

      const recentlyViewedProductsList =
        await recentlyViewedService.getAllRecentlyViewedWithProduct();

      if (recentlyViewedProductsList) {
        dispatch(setRecentlyViewProductList(recentlyViewedProductsList));
      }
    } catch (e) {
      dispatch(setRecentlyViewProductList([]));
    } finally {
      dispatch(setRecentlyProductLoading(false));
    }
  };
};

export const fetchSingleProductDataById = (productId) => {
  return async (dispatch) => {
    dispatch(setProductLoading(true));
    dispatch(setProductDetail({}));
    dispatch(setProductMessage({ message: "", type: "" }));

    try {
      const productData = await productService.getSingleProductDataById({
        productId,
      });

      dispatch(setProductDetail(productData));
      return productData;
    } catch (error) {
      dispatch(
        setProductMessage({
          message: error.message || "Something went wrong",
          type: messageType.ERROR,
        })
      );
      return null;
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const fetchSearchedProducts = (params) => async (dispatch) => {
  try {
    dispatch(setProductLoading(true));
    const response = await productService.searchProducts(params);
    if (!response) {
      return [];
    }
    return response;
  } catch (error) {
    console.error("Search fetch error:", error);
    return [];
  } finally {
    dispatch(setProductLoading(false));
  }
};
