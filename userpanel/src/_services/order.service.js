import axios from "axios";
import {
  fetchWrapperService,
  GOLD_COLOR,
  GOLD_COLOR_MAP,
  helperFunctions,
  ordersUrl,
  productsUrl,
  sanitizeObject,
  sanitizeValue,
} from "../_helper";
import { productService } from "./product.service";
import { authenticationService } from "./authentication.service";
// import { handleCancelOrderError } from "../store/actions/orderActions";
import { returnService } from "./return.service";
import { diamondShapeService } from "./diamondShape.service";

const getAllOrdersWithoutLogin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(ordersUrl);
      const orderData = respData ? Object.values(respData) : [];
      resolve(orderData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      if (userData) {
        const findPattern = {
          url: ordersUrl,
          key: "userId",
          value: userData.id,
        };
        const orderData = await fetchWrapperService.find(findPattern);
        const finalOrderData = orderData.filter(
          (item) => item.paymentStatus !== "pending"
        );

        const userReturnsData = await returnService.getUserReturnsList();
        const updatedOrderData = finalOrderData.map((order) => {
          const matchedReturns = userReturnsData.filter(
            (returnOrder) => returnOrder.orderId === order.id
          );
          const isPendingOrApprovedOrReceivedReturnsCount =
            matchedReturns.filter((returnOrder) =>
              ["pending", "approved", "received"].includes(returnOrder.status)
            ).length;

          const rejectedCount = matchedReturns.filter(
            (returnOrder) => returnOrder.status === "rejected"
          ).length;
          const hasActiveReturns =
            isPendingOrApprovedOrReceivedReturnsCount ||
            (rejectedCount > 0 && rejectedCount > 2)
              ? false
              : true;
          return {
            ...order,
            hasActiveReturns: hasActiveReturns,
          };
        });
        resolve(helperFunctions.sortByField(updatedOrderData));
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetailByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = sanitizeValue(orderId) ? orderId.trim() : null;
      if (orderId) {
        const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
          id: orderId,
        });

        if (orderDetail) {
          const currentUser = helperFunctions.getCurrentUser();
          // if (currentUser?.id !== orderDetail?.userId) {
          //   reject(new Error("unAuthorized"));
          //   return;
          // }
          const productFindPattern = {
            url: productsUrl,
            key: "active",
            value: true,
          };
          const allActiveProductsData = await fetchWrapperService.find(
            productFindPattern
          );
          const customizations = await productService.getAllCustomizations();
          const diamondShapeList =
            await diamondShapeService.getAllDiamondShapes();

          if (orderDetail?.cancelledBy) {
            const adminAndUsersData =
              await authenticationService.getAllUserAndAdmin();
            const findedUserData = adminAndUsersData.find(
              (item) => item.id === orderDetail.cancelledBy
            );
            if (findedUserData) {
              orderDetail.cancelledByName = findedUserData.name;
            }
          }
          orderDetail.products = orderDetail.products.map((orderProductItem) =>
            processOrderProductItem({
              orderProductItem,
              allActiveProductsData,
              customizations,
              diamondShapeList,
            })
          );

          resolve(orderDetail);
        } else {
          reject(new Error("Order does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};
const trackOrderByOrderNumberAndEmail = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Sanitize inputs
      let { orderNumber, email } = sanitizeObject(params);
      orderNumber = orderNumber ? orderNumber.trim() : null;
      email = email ? email.trim().toLowerCase() : null;

      if (!orderNumber || !email) {
        reject(new Error("Invalid order number or email"));
        return;
      }

      // Fetch order by orderNumber
      const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
        orderNumber,
      });

      if (!orderDetail) {
        reject(new Error("Order does not exist"));
        return;
      }

      // Verify email matches the order's shipping address email
      if (orderDetail.shippingAddress?.email?.toLowerCase() !== email) {
        reject(new Error("Unauthorized: Email does not match order"));
        return;
      }

      // Fetch additional data for cancelled orders
      if (orderDetail?.cancelledBy) {
        const adminAndUsersData =
          await authenticationService.getAllUserAndAdmin();
        const findedUserData = adminAndUsersData.find(
          (item) => item.id === orderDetail.cancelledBy
        );
        if (findedUserData) {
          orderDetail.cancelledByName = findedUserData.name;
        }
      }
      const productFindPattern = {
        url: productsUrl,
        key: "active",
        value: true,
      };
      const allActiveProductsData = await fetchWrapperService.find(
        productFindPattern
      );
      const customizations = await productService.getAllCustomizations();
      const diamondShapeList = await diamondShapeService.getAllDiamondShapes();

      orderDetail.products = orderDetail.products.map((orderProductItem) =>
        processOrderProductItem({
          orderProductItem,
          allActiveProductsData,
          customizations,
          diamondShapeList,
        })
      );

      resolve(orderDetail);
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrder = async (payload, abortController) => {
  try {
    if (payload) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        "/order/cancelOrder",
        sanitizeObject(payload),
        { signal }
      );
      if (response) {
        return response.data;
      }
      return false;
    }
  } catch (error) {
    console.log("error :", error);
    return false;
  }
};

const deleteOrder = async (orderId) => {
  try {
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    if (orderId) {
      const response = await axios.delete(`/order/${orderId}`);
      return { success: true, data: response?.data };
    }
    return { success: false, message: "OrderId not found" };
  } catch (error) {
    return { success: false, message: error?.message };
  }
};

const downloadOrderInvoice = async (orderNumber) => {
  try {
    orderNumber = sanitizeValue(orderNumber) ? orderNumber.trim() : null;
    if (orderNumber) {
      const response = await axios.post(
        "/order/generateOrderInovice",
        { orderNumber },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `order-${orderNumber}.pdf`; // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        message: "Invoice downloaded successfully",
      };
    }
    return { success: false, message: "Order number not found" };
  } catch (error) {
    console.error("Error downloading Invoice:", error);
    return {
      success: false,
      message: error?.message || "Failed to download Invoice",
    };
  }
};

const verifyOrder = async (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = sanitizeValue(orderId) ? orderId.trim() : null;
      if (orderId) {
        const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
          id: orderId,
        });
        if (orderDetail) {
          resolve({ success: true, orderDetail });
        } else {
          resolve({ success: false, message: "Order does not exist" });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

// const getTopSellingProducts = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const respData = await fetchWrapperService.getAll(ordersUrl);
//       const orderData = respData ? Object.values(respData) : [];
//       let filteredOrders = orderData.filter((order) => {
//         return order.paymentStatus === "success";
//       });

//       const productMap = new Map();

//       filteredOrders.forEach((order) => {
//         order.products.forEach((product) => {
//           const { productId } = product;

//           // Create a unique identifier for the product including its variations
//           const productKey = `${productId}`;
//           // Check if the product is already in the map, if not, initialize it
//           if (!productMap.has(productKey)) {
//             productMap.set(productKey, {
//               productId,
//             });
//           }

//           // Increment the total quantity sold for this product
//           const existingProduct = productMap.get(productKey);
//           productMap.set(productKey, existingProduct);
//         });
//       });

//       const filteredProducts = [...productMap.values()];

//       const tempTopSellingProductsList = filteredProducts.sort(
//         (a, b) => b.soldQuantity - a.soldQuantity
//       );

//       const topN = 20;
//       const topSellingProducts = tempTopSellingProductsList.slice(0, topN);
//       const allActiveProductsData = await productService.getAllActiveProducts();

//       const convertedTopSellingProducts = topSellingProducts
//         .map((sellingProductItem) => {
//           const foundProduct = allActiveProductsData.find(
//             (product) => product.id === sellingProductItem.productId
//           );
//           if (!foundProduct) return null;

//           const { price = 0 } = helperFunctions.getMinPriceVariCombo(
//             foundProduct?.variComboWithQuantity
//           );

//           return {
//             ...foundProduct,
//             basePrice: price,
//             baseSellingPrice: helperFunctions.getSellingPrice({
//               price,
//               discount:foundProduct.discount
//             }),
//             discount: foundProduct.discount,
//             goldTypeVariations: foundProduct?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
//             )?.variationTypes,
//             goldColorVariations: foundProduct?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
//             )?.variationTypes,
//           };
//         })
//         .filter((item) => item !== null);
//       resolve(convertedTopSellingProducts);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const processOrderProductItem = ({
  orderProductItem,
  allActiveProductsData,
  customizations,
  diamondShapeList,
}) => {
  const findedProduct = allActiveProductsData.find(
    (product) => product.id === orderProductItem.productId
  );

  if (!findedProduct) {
    return orderProductItem;
  }

  const variationArray = orderProductItem.variations.map((variItem) => {
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
  const diamondDetail = orderProductItem?.diamondDetail
    ? {
        ...orderProductItem?.diamondDetail,
        shapeName: diamondShapeList?.find(
          (shape) => shape.id === orderProductItem?.diamondDetail?.shapeId
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
    ...orderProductItem,
    productSku: findedProduct.saltSKU,
    productName: findedProduct.productName,
    productImage: thumbnailImage,
    totalCaratWeight: findedProduct?.totalCaratWeight,
    variations: variationArray,
    diamondDetail,
  };
};

export const orderService = {
  getAllOrderList,
  getOrderDetailByOrderId,
  cancelOrder,
  deleteOrder,
  trackOrderByOrderNumberAndEmail,
  verifyOrder,
  getAllOrdersWithoutLogin,
  downloadOrderInvoice,
};
