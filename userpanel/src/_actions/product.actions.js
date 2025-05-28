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
} from "@/store/slices/productSlice";
import { productService, recentlyViewedService } from "@/_services";
import { messageType } from "@/_helper/constants";

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

export const fetchCollectionsTypeWiseProduct = (
  collectionType,
  collectionTitle, parentCategory, parentMainCategory
) => {
  return async (dispatch) => {
    try {
      dispatch(setCollectionTypeProductList([]));
      dispatch(setProductLoading(true));
      const collectionsTypeWiseProductList =
        await productService.getCollectionsTypeWiseProduct(
          collectionType,
          collectionTitle, parentCategory,
          parentMainCategory
        );
      if (collectionsTypeWiseProductList) {
        const tempUniqueFilterOptions = getUniqueFilterOptions(
          collectionsTypeWiseProductList
        );
        const uniqueFilterOptions = { ...tempUniqueFilterOptions };
        dispatch(setUniqueFilterOptions(uniqueFilterOptions));
        dispatch(setSelectedPrices(uniqueFilterOptions?.availablePriceRange));
        dispatch(setCollectionTypeProductList(collectionsTypeWiseProductList));
        dispatch(setProductLoading(false));
      }
    } catch (e) {
      dispatch(setCollectionTypeProductList([]));
    } finally {
      dispatch(setProductLoading(false));
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


export const getUniqueFilterOptions = (productList) => {
  const uniqueVariations = new Map(); // Use Map for O(1) lookups
  const tempSettingStyles = [];
  const uniqueShapeIds = new Set(); // For unique diamond shapes
  const uniqueDiamondShapes = []; // To store unique diamond shapes
  const tempPriceRange = [];

  // Process each product
  productList.forEach((product) => {
    // Handle setting styles
    const settingStyles = product?.settingStyleNamesWithImg;
    if (settingStyles?.length) {
      tempSettingStyles.push(...settingStyles);
    }

    // Handle variations
    product.variations.forEach((variation) => {
      const { variationId, variationName, variationTypes } = variation;

      if (!uniqueVariations.has(variationId)) {
        // New variation: initialize with mapped variation types
        uniqueVariations.set(variationId, {
          variationName,
          variationId,
          variationTypes: new Map(
            variationTypes?.map((type) => [
              type.variationTypeId,
              {
                variationTypeName: type.variationTypeName,
                variationTypeId: type.variationTypeId,
                variationTypeHexCode: type.variationTypeHexCode ?? undefined,
              },
            ])
          ),
        });
      } else {
        // Existing variation: add new variation types
        const existingVariation = uniqueVariations.get(variationId);
        variationTypes.forEach((type) => {
          if (!existingVariation.variationTypes.has(type.variationTypeId)) {
            existingVariation.variationTypes.set(type.variationTypeId, {
              variationTypeName: type.variationTypeName,
              variationTypeId: type.variationTypeId,
              variationTypeHexCode: type.variationTypeHexCode ?? undefined,
            });
          }
        });
      }
    });

    // Handle diamond shapes (if present in product)
    if (product.isDiamondFilter && product.diamondFilters?.diamondShapes?.length) {
      product.diamondFilters.diamondShapes.forEach((shape) => {
        if (!uniqueShapeIds.has(shape.id)) {
          uniqueShapeIds.add(shape.id);
          uniqueDiamondShapes.push(shape);
        }
      });
    }
    tempPriceRange.push(product?.baseSellingPrice || 0)
  });

  // Convert uniqueVariations Map to array
  const variationsArray = Array.from(uniqueVariations.values()).map(
    (variation) => ({
      ...variation,
      variationTypes: Array.from(variation.variationTypes.values()),
    })
  );

  // Process unique setting styles with Set for uniqueness
  const uniqueSettingStyles = Array.from(
    new Set(tempSettingStyles.map((item) => item.title))
  ).map((title) => {
    const { image, id } =
      tempSettingStyles.find((item) => item.title === title) || {};
    return { title, value: id, image };
  });

  // Get the minimum and maximum price for the availablePriceRange

  const minPrice = tempPriceRange?.length ? Math.min(...tempPriceRange) : 0;
  const maxPrice = tempPriceRange?.length ? Math.max(...tempPriceRange) : 0;

  return {
    uniqueVariations: variationsArray,
    uniqueSettingStyles,
    uniqueDiamondShapes, // Include unique diamond shapes
    availablePriceRange: [minPrice, maxPrice],
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
      const productData = await productService.getSingleProductDataById({ productId });

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
      dispatch(setSearchedProductList([]));
      return [];
    }
    // set searched product list to redux store
    dispatch(setSearchedProductList(response));
    return response;
  } catch (error) {
    console.error("Search fetch error:", error);
    return [];
  } finally {
    dispatch(setProductLoading(false));
  }
};