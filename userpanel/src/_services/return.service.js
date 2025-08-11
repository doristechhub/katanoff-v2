import { uid } from "uid";
import axios from "axios";
import {
  fetchWrapperService,
  GOLD_COLOR,
  GOLD_COLOR_MAP,
  helperFunctions,
  ordersUrl,
  productsUrl,
  returnsUrl,
  sanitizeObject,
  sanitizeValue,
} from "../_helper";
import { productService } from "./product.service";
import { authenticationService } from "./authentication.service";
import { diamondShapeService } from "./diamondShape.service";

const validateKeys = (objects, keys) =>
  keys.every((key) => helperFunctions.isValidKeyName(objects, key));

const hasInvalidProductsKey = (products) => {
  if (!Array.isArray(products) || products.length === 0) return true;

  const requiredProductKeys = [
    "productId",
    "unitAmount",
    "returnQuantity",
    "variations",
  ];
  const requiredVariationKeys = ["variationId", "variationTypeId"];
  const requiredDiamondKeys = ["shapeId", "caratWeight", "clarity", "color"];

  const isInvalidProduct = !validateKeys(products, requiredProductKeys);
  const isInvalidVariation = !validateKeys(
    products[0]?.variations || [],
    requiredVariationKeys
  );

  const diamondDetail = products[0]?.diamondDetail;
  const isInvalidDiamond =
    diamondDetail && !validateKeys([diamondDetail], requiredDiamondKeys);

  return isInvalidProduct || isInvalidVariation || isInvalidDiamond;
};

export const getProductsArray = (products) =>
  products.map((product) => {
    const { productPrice, returnQuantity, diamondDetail } = product;
    const unitAmount = Number(productPrice) * Number(returnQuantity);

    const mappedProduct = {
      productId: product.productId,
      returnQuantity: Number(returnQuantity),
      productPrice: Number(productPrice),
      unitAmount,
      variations: product.variations.map(
        ({ variationId, variationTypeId }) => ({
          variationId,
          variationTypeId,
        })
      ),
    };

    if (diamondDetail) {
      mappedProduct.diamondDetail = {
        shapeId: diamondDetail.shapeId,
        caratWeight: Number(diamondDetail.caratWeight),
        clarity: diamondDetail.clarity,
        color: diamondDetail.color,
      };
    }

    return mappedProduct;
  });

const validateProducts = (products, orderProducts) =>
  products.every((product) => {
    const match = orderProducts.find(
      (orderProduct) =>
        orderProduct.productId === product.productId &&
        helperFunctions.areArraysEqual(
          orderProduct.variations,
          product.variations
        )
    );
    return (
      match &&
      Number(product.returnQuantity) > 0 &&
      Number(product.returnQuantity) <= Number(match.cartQuantity)
    );
  });

const insertReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { orderId, products, returnRequestReason } = sanitizeObject(params);
      orderId = orderId?.trim() || null;
      returnRequestReason = returnRequestReason?.trim() || null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("Unauthorized: User not authenticated"));
        return;
      }

      if (!orderId || !returnRequestReason || !Array.isArray(products)) {
        reject(new Error("Invalid input data"));
        return;
      }

      const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });

      if (!orderDetail) {
        reject(new Error("Order does not exist"));
        return;
      }

      const {
        orderStatus,
        deliveryDate,
        returnRequestIds,
        products: orderProducts,
        orderNumber,
      } = orderDetail;

      if (orderStatus !== "delivered") {
        reject(new Error("Order must be delivered to initiate a return"));
        return;
      }

      if (!helperFunctions.isReturnValid(deliveryDate)) {
        reject(new Error("Return period has expired (15-day limit)"));
        return;
      }

      const matchedReturns = await returnService.getReturnsByOrderId(orderId);
      const activeReturns = matchedReturns.filter((returnOrder) =>
        ["pending", "approved", "received"].includes(returnOrder.status)
      ).length;

      const rejectedCount = matchedReturns.filter(
        (returnOrder) => returnOrder.status === "rejected"
      ).length;

      if (activeReturns > 0 || rejectedCount > 2) {
        reject(
          new Error(
            "Cannot initiate return: Active return exists or return limit exceeded"
          )
        );
        return;
      }

      if (hasInvalidProductsKey(products)) {
        reject(new Error("Invalid product data structure"));
        return;
      }

      const productsArray = getProductsArray(products);
      if (!validateProducts(productsArray, orderProducts)) {
        reject(new Error("Invalid product or quantity in return request"));
        return;
      }

      const { subTotal, discount, salesTax, returnRequestAmount } =
        helperFunctions?.calcReturnPayment(productsArray, orderDetail);
      if (
        (subTotal && isNaN(subTotal)) ||
        (discount && isNaN(discount)) ||
        (salesTax && isNaN(salesTax)) ||
        (returnRequestAmount && isNaN(returnRequestAmount))
      ) {
        reject(new Error("Invalid data"));
        return;
      }

      const uuid = uid();
      const insertPattern = {
        id: uuid,
        orderId,
        userId: userData.id,
        orderNumber,
        products: productsArray,
        returnRequestReason,
        status: "pending",
        returnPaymentStatus: "pending",
        createdDate: Date.now(),
        updatedDate: Date.now(),
        subTotal,
        discount,
        salesTax,
        returnRequestAmount,
      };

      const createPattern = {
        url: `${returnsUrl}/${uuid}`,
        insertPattern,
      };

      await fetchWrapperService.create(createPattern);

      // Update order with return request ID
      const prevReturnReqIds = returnRequestIds?.length ? returnRequestIds : [];
      const orderUpdatePayload = {
        returnRequestIds: [...prevReturnReqIds, insertPattern.id],
      };
      await fetchWrapperService._update({
        url: `${ordersUrl}/${orderId}`,
        payload: orderUpdatePayload,
      });

      resolve(createPattern);
    } catch (e) {
      reject(new Error(`Failed to create return request: ${e?.message}`));
    }
  });
};

const getUserReturnsList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("Unauthorized: User not authenticated"));
        return;
      }

      const findPattern = {
        url: returnsUrl,
        key: "userId",
        value: userData.id,
      };
      const returnsData = await fetchWrapperService.find(findPattern);
      resolve(helperFunctions.sortByField(returnsData));
    } catch (e) {
      reject(new Error(`Failed to fetch user returns: ${e?.message}`));
    }
  });
};

const cancelReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId, cancelReason } = sanitizeObject(params);
      returnId = returnId?.trim() || null;
      cancelReason = cancelReason?.trim() || null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("Unauthorized: User not authenticated"));
        return;
      }

      if (!returnId || !cancelReason) {
        reject(new Error("Invalid return ID or cancel reason"));
        return;
      }

      const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
        id: returnId,
      });

      if (!returnDetail) {
        reject(new Error("Return request does not exist"));
        return;
      }

      const { status, returnPaymentStatus } = returnDetail;
      if (status === "cancelled") {
        reject(new Error("Return request is already cancelled"));
        return;
      }

      if (returnPaymentStatus !== "pending" || status !== "pending") {
        reject(
          new Error(
            `Cannot cancel return: Current status is ${status} and payment status is ${returnPaymentStatus}`
          )
        );
        return;
      }

      const payload = {
        status: "cancelled",
        cancelReason,
        updatedDate: Date.now(),
      };
      const updatePattern = {
        url: `${returnsUrl}/${returnId}`,
        payload,
      };

      await fetchWrapperService._update(updatePattern);
      resolve(updatePattern);
    } catch (e) {
      reject(new Error(`Failed to cancel return request: ${e?.message}`));
    }
  });
};

const deleteReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId } = sanitizeObject(params);
      returnId = returnId?.trim() || null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("Unauthorized: User not authenticated"));
        return;
      }

      if (!returnId) {
        reject(new Error("Invalid return ID"));
        return;
      }

      const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
        id: returnId,
      });

      if (!returnDetail) {
        reject(new Error("Return request does not exist"));
        return;
      }

      const { orderId, status, returnPaymentStatus } = returnDetail;
      if (returnPaymentStatus !== "pending" || status !== "pending") {
        reject(
          new Error(
            `Cannot delete return: Current status is ${status} and payment status is ${returnPaymentStatus}`
          )
        );
        return;
      }

      await fetchWrapperService._delete(`${returnsUrl}/${returnId}`);

      // Update order to remove return request ID
      const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });

      if (orderDetail) {
        const { returnRequestIds } = orderDetail;
        const newReturnReqIds =
          returnRequestIds?.filter((id) => id !== returnId) || [];
        await fetchWrapperService._update({
          url: `${ordersUrl}/${orderId}`,
          payload: { returnRequestIds: newReturnReqIds },
        });
      }

      resolve(true);
    } catch (e) {
      reject(new Error(`Failed to delete return request: ${e?.message}`));
    }
  });
};

const getReturnsByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = sanitizeValue(orderId)?.trim() || null;
      if (!orderId) {
        reject(new Error("Invalid order ID"));
        return;
      }

      const findPattern = {
        url: returnsUrl,
        key: "orderId",
        value: orderId,
      };
      const orderWiseReturnsData = await fetchWrapperService.find(findPattern);
      resolve(orderWiseReturnsData);
      return orderWiseReturnsData;
    } catch (e) {
      reject(new Error(`Failed to fetch returns for order: ${e?.message}`));
    }
  });
};

const getReturnDetailByReturnId = (returnId) => {
  return new Promise(async (resolve, reject) => {
    try {
      returnId = sanitizeValue(returnId)?.trim() || null;

      if (!returnId) {
        reject(new Error("Invalid return ID"));
        return;
      }

      const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
        id: returnId,
      });

      if (!returnDetail) {
        reject(new Error("Return request does not exist"));
        return;
      }

      // const currentUser = helperFunctions.getCurrentUser();
      // if (currentUser?.id !== returnDetail?.userId) {
      //   reject(
      //     new Error("Unauthorized: User does not own this return request")
      //   );
      //   return;
      // }
      if (returnDetail?.orderId) {
        const orderDetail = await fetchWrapperService?.findOne(ordersUrl, {
          id: returnDetail?.orderId,
        });

        if (orderDetail) {
          returnDetail.billingAddress = orderDetail?.billingAddress || null;
          returnDetail.shippingAddress = orderDetail?.shippingAddress || null;
        }
      }

      const productFindPattern = {
        url: productsUrl,
        key: "active",
        value: true,
      };
      const [allActiveProductsData, customizations, diamondShapeList] =
        await Promise.all([
          fetchWrapperService.find(productFindPattern),
          productService.getAllCustomizations(),
          diamondShapeService.getAllDiamondShapes(),
        ]);

      if (returnDetail?.userId) {
        const adminAndUsersData =
          await authenticationService.getAllUserAndAdmin();
        const findedUserData = adminAndUsersData.find(
          (item) => item.id === returnDetail.userId
        );
        if (findedUserData) {
          returnDetail.createdBy = findedUserData.name;
        }
      }

      returnDetail.products = returnDetail.products.map((returnProductItem) =>
        processReturnProductItem({
          returnProductItem,
          allActiveProductsData,
          customizations,
          diamondShapeList,
        })
      );

      resolve(returnDetail);
    } catch (e) {
      reject(new Error(`Failed to fetch return details: ${e?.message}`));
    }
  });
};

export const trackReturnByOrderNumberAndEmail = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { orderNumber, email } = sanitizeObject(params);
      orderNumber = orderNumber?.trim() || null;
      email = email?.trim().toLowerCase() || null;

      if (!orderNumber || !email) {
        reject(new Error("Invalid order number or email"));
        return;
      }

      const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
        orderNumber,
      });

      if (!orderDetail) {
        reject(new Error("Order does not exist"));
        return;
      }

      if (orderDetail.shippingAddress?.email?.toLowerCase() !== email) {
        reject(new Error("Unauthorized: Email does not match order"));
        return;
      }

      const returnFindPattern = {
        url: returnsUrl,
        key: "orderId",
        value: orderDetail.id,
      };
      const returnDetails = await fetchWrapperService.find(returnFindPattern);

      if (!returnDetails?.length) {
        reject(new Error("No return requests found for this order"));
        return;
      }

      const [allActiveProductsData, customizations, diamondShapeList] =
        await Promise.all([
          fetchWrapperService.find({
            url: productsUrl,
            key: "active",
            value: true,
          }),
          productService.getAllCustomizations(),
          diamondShapeService.getAllDiamondShapes(),
        ]);

      const enrichedReturns = returnDetails.map((returnItem) => ({
        ...returnItem,
        products: returnItem.products?.map((product) =>
          processReturnProductItem({
            returnProductItem: product,
            allActiveProductsData,
            customizations,
            diamondShapeList,
          })
        ),
      }));

      resolve(helperFunctions.sortByField(enrichedReturns, "createdDate"));
    } catch (e) {
      reject(new Error(`Failed to track return: ${e?.message}`));
    }
  });
};

const processReturnProductItem = ({
  returnProductItem,
  allActiveProductsData,
  customizations,
  diamondShapeList,
}) => {
  const findedProduct = allActiveProductsData.find(
    (product) => product.id === returnProductItem.productId
  );

  if (!findedProduct) {
    return returnProductItem;
  }

  const variationArray = returnProductItem.variations.map((variItem) => {
    const findedCustomizationType = customizations.customizationSubType.find(
      (x) => x.id === variItem.variationTypeId
    );
    return {
      ...variItem,
      variationName: customizations.customizationType.find(
        (x) => x.id === variItem.variationId
      )?.title,
      variationTypeName: findedCustomizationType?.title,
    };
  });

  const diamondDetail = returnProductItem?.diamondDetail
    ? {
        ...returnProductItem?.diamondDetail,
        shapeName: diamondShapeList?.find(
          (shape) => shape.id === returnProductItem?.diamondDetail?.shapeId
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
    ...returnProductItem,
    productName: findedProduct.productName,
    productImage: thumbnailImage,
    totalCaratWeight: findedProduct?.totalCaratWeight,
    variations: variationArray,
    diamondDetail,
  };
};

const downloadReturnInvoice = async ({ returnId, orderNumber }) => {
  try {
    returnId = sanitizeValue(returnId) ? returnId.trim() : null;
    orderNumber = sanitizeValue(orderNumber) ? orderNumber.trim() : null;
    if (returnId) {
      const response = await axios.post(
        "/returns/generateReturnInovice",
        { returnId },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Return-${orderNumber}.pdf`; // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: "Invoice downloaded successfully" };
    }
    return { success: false, message: "ReturnId not found" };
  } catch (error) {
    console.error("Error downloading Invoice:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to download Invoice",
    };
  }
};

export const returnService = {
  insertReturnRequest,
  getUserReturnsList,
  cancelReturnRequest,
  deleteReturnRequest,
  getReturnsByOrderId,
  getReturnDetailByReturnId,
  trackReturnByOrderNumberAndEmail,
  downloadReturnInvoice,
};
