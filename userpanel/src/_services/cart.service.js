import { uid } from "uid";
import {
  cartsUrl,
  fetchWrapperService,
  helperFunctions,
  productsUrl,
  sanitizeObject,
} from "../_helper";
import { productService } from "./product.service";
import {
  GOLD_COLOR,
  GOLD_COLOR_MAP,
  GOLD_TYPES,
  LENGTH,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  RING_SIZE,
} from "@/_helper/constants";
import { customizeService } from "./customize.service";

const filterActiveCartItems = async ({ cartData, activeProductIds, userData = null, allActiveProductsData = [] }) => {
  if (!Array.isArray(cartData) || !Array.isArray(activeProductIds)) {
    console.warn(
      "Invalid cartData or activeProductIds, returning empty array."
    );
    return [];
  }

  let updatedActiveProductIds = [...activeProductIds];
  const customProductSettingsData = await customizeService?.fetchCustomizeProductSettings();

  const filteredCartData = cartData.filter((cartItem) => {
    if (!updatedActiveProductIds.includes(cartItem.productId)) {
      return false;
    }

    const findedProduct = allActiveProductsData.find(
      (product) => product && product.id === cartItem.productId
    );

    if (!findedProduct) {
      updatedActiveProductIds = updatedActiveProductIds.filter((id) => id !== cartItem.productId);
      return false;
    }

    const cartItemDiamondDetail = cartItem?.diamondDetail;

    if (cartItemDiamondDetail && !findedProduct?.isDiamondFilter) {
      updatedActiveProductIds = updatedActiveProductIds.filter((id) => id !== cartItem.productId);
      return false;
    }

    if (cartItemDiamondDetail && findedProduct?.isDiamondFilter) {
      const { caratWeight, clarity, color, shapeId } = cartItemDiamondDetail;
      const { caratWeightRange, diamondShapeIds } = findedProduct?.diamondFilters || {};

      if (
        caratWeightRange &&
        (caratWeight < caratWeightRange.min || caratWeight > caratWeightRange.max)
      ) {
        updatedActiveProductIds = updatedActiveProductIds?.filter((id) => id !== cartItem?.productId);
        return false;
      }

      const clarityExists = customProductSettingsData?.diamondClarities?.some(
        (clarityOption) => clarityOption?.compatibleOptions?.includes(clarity)
      );
      if (!clarityExists) {
        updatedActiveProductIds = updatedActiveProductIds?.filter((id) => id !== cartItem?.productId);
        return false;
      }

      const colorExists = customProductSettingsData?.diamondColors?.some(
        (colorOption) => colorOption?.compatibleOptions?.includes(color)
      );
      if (!colorExists) {
        updatedActiveProductIds = updatedActiveProductIds?.filter((id) => id !== cartItem?.productId);
        return false;
      }

      if (shapeId && diamondShapeIds && !diamondShapeIds.includes(shapeId)) {
        updatedActiveProductIds = updatedActiveProductIds?.filter((id) => id !== cartItem?.productId);
        return false;
      }

    }
    return true;
  });

  const inactiveCartItems = cartData.filter(
    (item) => !updatedActiveProductIds.includes(item.productId)
  );

  if (userData && inactiveCartItems.length > 0) {
    // For logged-in users, delete inactive items from the database
    inactiveCartItems.forEach(async (item) => {
      try {
        await fetchWrapperService._delete(`${cartsUrl}/${item.id}`);
      } catch (err) {
        console.error(
          `Error deleting cart item ${item.id} from database:`,
          err.message
        );
      }
    });
  }

  // Filter and return only active cart items
  return filteredCartData;
};

const getAllCartWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      const customizeProductSettingsData =
        await customizeService?.fetchCustomizeProductSettings();
      let cartData = [];
      if (userData) {
        const findPattern = {
          url: cartsUrl,
          key: "userId",
          value: userData.id,
        };
        cartData = await fetchWrapperService?.find(findPattern);
      } else {
        cartData = getCartItemOnOffline();
      }

      const allActiveProductsData =
        await productService?.getActiveProductsByIds(
          cartData?.map((cartItem) => cartItem?.productId)
        );

      const activeProductIds = allActiveProductsData?.map((p) => p?.id);
      cartData = await filterActiveCartItems({ cartData, activeProductIds, userData, allActiveProductsData });

      // Update localStorage for non-logged-in users
      if (!userData) {
        localStorage.setItem("cart", JSON.stringify(cartData));
      }

      const customizations = await productService.getAllCustomizations();

      const cartDataWithProduct = cartData.map((cartItem) => {
        const findedProduct = allActiveProductsData.find(
          (product) => product.id === cartItem.productId
        );

        if (findedProduct) {
          // Enrich variations with names
          const variationArray = cartItem.variations.map((variItem) => {
            const findedCustomizationType =
              customizations.customizationSubType.find(
                (x) => x.id === variItem.variationTypeId
              );
            return {
              ...variItem,
              variationName:
                customizations.customizationType.find(
                  (x) => x.id === variItem.variationId
                )?.title || "Unknown",
              variationTypeName: findedCustomizationType?.title || "Unknown",
            };
          });

          let price = 0;
          let quantity = 0;

          // Handle customized products (with diamondDetail)
          const cartItemDiamondDetail = cartItem?.diamondDetail;
          if (cartItemDiamondDetail && findedProduct?.isDiamondFilter) {
            try {
              const customProductDetail = {
                netWeight: findedProduct?.netWeight,
                sideDiamondWeight: findedProduct?.sideDiamondWeight,
              };

              const centerDiamondDetail = {
                caratWeight: cartItemDiamondDetail?.caratWeight,
                clarity: cartItemDiamondDetail?.clarity,
                color: cartItemDiamondDetail?.color,
              };

              price = helperFunctions.calculateCustomizedProductPrice({
                centerDiamondDetail,
                productDetail: customProductDetail,
                customizeProductSettingsData: customizeProductSettingsData,
              });
              quantity = MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT;
            } catch (err) {
              console.error(
                "Error calculating custom product or diamond price:",
                err.message
              );
              price = 0;
              quantity = 0;
            }
          } else {
            const variCombo = helperFunctions.getVariComboPriceQty(
              findedProduct.variComboWithQuantity,
              variationArray
            );
            price = variCombo.price || 0;
            quantity = variCombo.quantity || 0;
          }

          const sellingPrice = helperFunctions.getSellingPrice({
            price,
            discount: findedProduct.discount,
            isCustomized: !!cartItem?.diamondDetail,
          });

          const diamondDetail = cartItem?.diamondDetail
            ? {
              ...cartItem?.diamondDetail,
              shapeName: findedProduct?.diamondFilters?.diamondShapes?.find(
                (shape) => shape?.id === cartItem?.diamondDetail?.shapeId
              )?.title,
            }
            : null;

          const goldColor = variationArray
            .find((v) => v.variationName === GOLD_COLOR)
            ?.variationTypeName?.toLowerCase();
          const thumbnailField =
            GOLD_COLOR_MAP[goldColor] || "yellowGoldThumbnailImage";
          const thumbnailImage = findedProduct[thumbnailField];
          return {
            ...cartItem,
            productSku: findedProduct.saltSKU,
            productName: findedProduct.productName,
            productImage: thumbnailImage,
            productQuantity: quantity,
            productSellingPrice: helperFunctions?.roundOffPrice(sellingPrice),
            productBasePrice: helperFunctions?.roundOffPrice(price),
            quantityWisePrice: helperFunctions?.roundOffPrice(
              price * cartItem.quantity
            ),
            quantityWiseSellingPrice: helperFunctions?.roundOffPrice(
              sellingPrice * cartItem.quantity
            ),
            productDiscountPerc: findedProduct.discount || 0,
            variations: variationArray,
            netWeight: findedProduct?.netWeight,
            totalCaratWeight: findedProduct?.totalCaratWeight,
            diamondDetail,
          };
        } else {
          return cartItem; // Return as-is if product not found
        }
      });

      resolve(cartDataWithProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const insertProductIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { productId, quantity, variations, diamondDetail } =
        sanitizeObject(params);

      productId = productId ? productId.trim() : null;
      quantity = quantity ? Number(quantity) : 0;
      variations = Array.isArray(variations) ? variations : [];
      diamondDetail = diamondDetail || null; // Handle optional diamondDetail

      if (!productId || !variations.length || !quantity || !uuid) {
        reject(new Error("Invalid Data"));
        return;
      }

      // Fetch product data
      const productData = await fetchWrapperService.findOne(productsUrl, {
        id: productId,
      });

      if (!productData) {
        reject(new Error("Product data not found!"));
        return;
      }

      // Validate variations
      if (!isValidVariationsArray({ productVariations: productData.variations, selectedVariations: variations, diamondDetail })) {
        reject(
          new Error(
            "Invalid variation or variation does not exist in this product"
          )
        );
        return;
      }

      // Validate quantity for non-customized products
      if (!diamondDetail) {
        const variCombo = helperFunctions.getVariComboPriceQty(
          productData.variComboWithQuantity,
          variations
        );
        const availableQty = variCombo.quantity;
        if (quantity <= 0 || quantity > availableQty) {
          reject(new Error("Invalid cart quantity!"));
          return;
        }
      }

      // Handle customized product (diamondDetail present)
      if (diamondDetail) {
        // Validate diamondDetail structure
        const { shapeId, caratWeight, clarity, color } = diamondDetail;
        if (!shapeId || !caratWeight || !clarity || !color) {
          reject(new Error("Invalid diamond detail parameters"));
          return;
        }

        // Validate against product's diamondFilters
        if (!productData.isDiamondFilter) {
          reject(new Error("Product does not support diamond customization"));
          return;
        }

        const { diamondShapeIds, caratWeightRange } =
          productData.diamondFilters;
        if (!diamondShapeIds.includes(shapeId)) {
          reject(new Error("Invalid diamond shape for this product"));
          return;
        }
        if (
          caratWeight < caratWeightRange.min ||
          caratWeight > caratWeightRange.max
        ) {
          reject(new Error("Invalid carat weight for this product"));
          return;
        }

        if (quantity <= 0) {
          reject(new Error("Invalid cart quantity!"));
          return;
        }
      }

      // Check for duplicate cart items
      const cartData = await cartService.getAllCartWithProduct();
      const filteredData = cartData.filter((cartItem) => {
        if (cartItem.productId === productId) {
          const variationsMatch = variations.every((variant) =>
            cartItem.variations.some(
              (itemVariant) =>
                itemVariant.variationId === variant.variationId &&
                itemVariant.variationTypeId === variant.variationTypeId
            )
          );
          if (variationsMatch && diamondDetail && cartItem?.diamondDetail) {
            // For customized products, check if diamondDetail matches
            return (
              cartItem?.diamondDetail?.shapeId === diamondDetail?.shapeId &&
              cartItem?.diamondDetail?.caratWeight ===
              diamondDetail?.caratWeight &&
              cartItem?.diamondDetail?.clarity === diamondDetail?.clarity &&
              cartItem?.diamondDetail?.color === diamondDetail?.color
            );
          }
          return variationsMatch && !diamondDetail && !cartItem?.diamondDetail;
        }
        return false;
      });

      if (filteredData.length) {
        reject(new Error("Product already exists in cart"));
        return;
      }

      // Prepare cart item
      let insertPattern = {
        id: uuid,
        productId,
        quantity,
        variations,
        createdDate: Date.now(),
        updatedDate: Date.now(),
      };

      if (diamondDetail) {
        delete diamondDetail.price;
        insertPattern.diamondDetail = diamondDetail;
      }

      const userData = helperFunctions.getCurrentUser();
      if (userData) {
        insertPattern.userId = userData.id;
        const createPattern = {
          url: `${cartsUrl}/${uuid}`,
          insertPattern,
        };
        fetchWrapperService
          .create(createPattern)
          .then((response) => {
            resolve(insertPattern);
          })
          .catch((e) => {
            reject(new Error("An error occurred during cart creation."));
          });
      } else {
        localStorage.setItem(
          "cart",
          JSON.stringify([...cartData, insertPattern])
        );
        resolve(insertPattern);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const insertMultipleProductsIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { cartData } = sanitizeObject(params);
      cartData = Array.isArray(cartData) ? cartData : [];
      const userData = helperFunctions.getCurrentUser();
      const createdOrUpdateCartData = [];

      if (!userData) {
        reject(new Error("Unauthorized"));
        return;
      }

      if (!cartData.length) {
        reject(new Error("Invalid Data"));
        return;
      }

      for (let i = 0; i < cartData.length; i++) {
        const element = cartData[i];

        let { productId, quantity, variations, diamondDetail } =
          sanitizeObject(element);

        // Sanitize inputs
        productId = productId ? productId.trim() : null;
        quantity = quantity ? Number(quantity) : 0;
        variations = Array.isArray(variations) ? variations : [];
        diamondDetail = diamondDetail || null;

        // Validate basic inputs
        if (!productId || !variations.length || !quantity) {
          sendResponse();
          continue;
        }

        // Fetch product data
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });

        if (!productData) {
          sendResponse();
          continue;
        }

        // Validate variations
        if (!isValidVariationsArray({ productVariations: productData.variations, selectedVariations: variations, diamondDetail })) {
          sendResponse();
          continue;
        }

        // Validate quantity for non-customized products
        let availableQty = 0;
        if (!diamondDetail) {
          const variCombo = helperFunctions.getVariComboPriceQty(
            productData.variComboWithQuantity,
            variations
          );
          availableQty = variCombo.quantity;
          if (quantity <= 0 || quantity > availableQty) {
            sendResponse();
            continue;
          }
        }

        // Handle customized product (diamondDetail present)
        if (diamondDetail) {
          // Validate diamondDetail structure
          const { shapeId, caratWeight, clarity, color } = diamondDetail;

          if (!shapeId || !caratWeight || !clarity || !color) {
            sendResponse();
            continue;
          }

          // Validate against product's diamondFilters
          if (!productData.isDiamondFilter) {
            sendResponse();
            continue;
          }

          const { diamondShapeIds, caratWeightRange } =
            productData.diamondFilters;
          if (!diamondShapeIds.includes(shapeId)) {
            sendResponse();
            continue;
          }
          if (
            caratWeight < caratWeightRange.min ||
            caratWeight > caratWeightRange.max
          ) {
            sendResponse();
            continue;
          }

          // Validate quantity for customized products

          if (quantity <= 0 || quantity > MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT) {
            sendResponse();
            continue;
          }
        }

        // Check for duplicate cart items
        const userWiseCartData = await cartService.getAllCartWithProduct();
        const filteredData = userWiseCartData.filter((cartItem) => {
          if (cartItem.productId === productId) {
            const variationsMatch = variations.every((variant) =>
              cartItem.variations.some(
                (itemVariant) =>
                  itemVariant.variationId === variant.variationId &&
                  itemVariant.variationTypeId === variant.variationTypeId
              )
            );
            if (variationsMatch && diamondDetail && cartItem?.diamondDetail) {
              return (
                cartItem?.diamondDetail?.shapeId === diamondDetail?.shapeId &&
                cartItem?.diamondDetail?.caratWeight ===
                diamondDetail?.caratWeight &&
                cartItem?.diamondDetail?.clarity === diamondDetail?.clarity &&
                cartItem?.diamondDetail?.color === diamondDetail?.color
              );
            }
            return (
              variationsMatch && !diamondDetail && !cartItem?.diamondDetail
            );
          }
          return false;
        });

        if (filteredData.length) {
          // Update existing cart item
          const cartId = filteredData[0].id;
          const existingQuantity = Number(filteredData[0].quantity);
          const requestedQuantity = Number(quantity);
          let newQuantity = existingQuantity + requestedQuantity;

          // Validate total quantity against max limit
          if (!diamondDetail) {
            // Non-customized product: use variCombo quantity
            if (newQuantity > availableQty) {
              newQuantity = availableQty; // Cap at available quantity
            }
          } else {
            // Customized product: use MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT
            if (newQuantity > MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT) {
              newQuantity = MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT; // Cap at max allowed for custom products
            }
          }
          if (newQuantity <= 0) {
            sendResponse();
            continue;
          }

          const payload = {
            quantity: newQuantity,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${cartsUrl}/${cartId}`,
            payload: payload,
          };
          try {
            await fetchWrapperService._update(updatePattern);
            const updatedData = {
              ...filteredData[0],
              quantity: newQuantity,
              updatedDate: Date.now(),
            };
            createdOrUpdateCartData.push(updatedData);
          } catch (e) {
            // Skip to next item on error
          }
        } else {
          // Create new cart item
          const uuid = uid();
          let insertPattern = {
            id: uuid,
            userId: userData.id,
            productId,
            quantity,
            variations,
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };
          if (diamondDetail) {
            insertPattern.diamondDetail = diamondDetail;
          }

          const createPattern = {
            url: `${cartsUrl}/${uuid}`,
            insertPattern,
          };
          try {
            await fetchWrapperService.create(createPattern);
            createdOrUpdateCartData.push(insertPattern);
          } catch (e) {
            // Skip to next item on error
          }
        }

        function sendResponse() {
          if (i === cartData.length - 1) {
            resolve({ createdOrUpdateCartData });
          }
        }

        sendResponse();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductQuantityIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { cartId, quantity } = sanitizeObject(params);

      cartId = cartId ? cartId.trim() : null;
      quantity = quantity ? Number(quantity) : 0;

      if (cartId && quantity) {
        const allCartData = await cartService.getAllCartWithProduct();
        const index = allCartData.findIndex(
          (cartItem) => cartItem.id === cartId
        );
        const cartDetail = allCartData[index];
        if (cartDetail) {
          if (
            quantity <= 0 ||
            quantity > 5 ||
            quantity > cartDetail.productQuantity
          ) {
            reject(new Error("Invalid cart quantity!"));
            return;
          }
          const userData = helperFunctions.getCurrentUser();
          if (userData) {
            const cartId = cartDetail.id;
            const payload = {
              quantity: quantity,
            };
            const updatePattern = {
              url: `${cartsUrl}/${cartId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error("An error occurred during update cart."));
              });
          } else {
            allCartData[index].quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(allCartData));
            resolve(true);
          }
        } else {
          reject(new Error("cart data not found!"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const removeProductIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { cartId } = sanitizeObject(params);
      if (cartId) {
        const allCartData = await cartService.getAllCartWithProduct();
        const cartDetail = allCartData.find(
          (cartItem) => cartItem.id === cartId
        );
        if (cartDetail) {
          const userData = helperFunctions.getCurrentUser();
          if (userData) {
            // remove cart into firebase
            await fetchWrapperService._delete(`${cartsUrl}/${cartId}`);
            resolve(true);
          } else {
            const newCartData = allCartData.filter((x) => x.id !== cartId);
            localStorage.setItem("cart", JSON.stringify(newCartData));
            if (!getCartItemOnOffline().length) {
              localStorage.removeItem("cart");
            }
            resolve(true);
          }
        } else {
          reject(new Error("cart not found!"));
        }
      } else {
        reject(new Error("Invalid Id"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getCartItemOnOffline = () => {
  const localStorageCart = JSON.parse(localStorage.getItem("cart"));
  return localStorageCart ? localStorageCart : [];
};

const isValidVariationsArray = async ({
  productVariations,
  selectedVariations,
  diamondDetail
}) => {
  if (!Array.isArray(selectedVariations) || !selectedVariations?.length) {
    return false;
  }

  const customizations = await productService?.getAllCustomizations();
  const enrichedProductVariations = helperFunctions?.addNamesToVariationsArray(productVariations, customizations);
  const enrichedSelectedVariations = helperFunctions?.addNamesToVariationsArray(selectedVariations, customizations);

  // Constants for diamond-required variation names
  const requiredForDiamond = [GOLD_COLOR, GOLD_TYPES, RING_SIZE, LENGTH];

  // Helper to check variation match
  const variationsMatch = (required, selected) =>
    required.every((req) =>
      selected.some(
        (sel) =>
          sel.variationId === req.variationId &&
          sel.variationTypeId === req.variationTypeId
      )
    );

  if (diamondDetail) {
    // Filter only the variations that are in the required list
    const requiredProductVars = enrichedProductVariations?.filter((pv) =>
      requiredForDiamond?.includes(pv.variationName)
    );
    const requiredSelectedVars = enrichedSelectedVariations?.filter((sv) =>
      requiredForDiamond?.includes(sv.variationName)
    );

    return (
      requiredProductVars.length === requiredSelectedVars.length &&
      variationsMatch(requiredProductVars, requiredSelectedVars)
    );
  }

  return (
    enrichedProductVariations.length === enrichedSelectedVariations.length &&
    variationsMatch(enrichedProductVariations, enrichedSelectedVariations)
  );
};


export const cartService = {
  getAllCartWithProduct,
  insertProductIntoCart,
  insertMultipleProductsIntoCart,
  updateProductQuantityIntoCart,
  removeProductIntoCart,
};
