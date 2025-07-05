import { fetchWrapperService, ordersUrl, sanitizeObject, sanitizeValue } from '../_helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import { productService } from './product.service';
import { customizationTypeService } from './customizationType.service';
import { customizationSubTypeService } from './customizationSubType.service';
import { authenticationService } from './authentication.service';
import moment from 'moment';
import { usersService } from './users.service';
import { helperFunctions } from '../_helpers/helperFunctions';
import { refundStatuses, setOrderRefundLoader } from '../store/slices/refundSlice';
import { diamondShapeService } from './diamondShape.service';
import { returnService } from './return.service';
import { GOLD_COLOR_MAP } from 'src/_helpers/constants';

// const getAllOrderList = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const respData = await fetchWrapperService.getAll(ordersUrl);
//       const orderData = respData ? Object.values(respData) : [];
//       const finalOrderData = orderData.filter((item) => item.paymentStatus !== 'pending');
//       const userReturnsData = await returnService.getAllReturnsList();
//       const updatedOrderData = finalOrderData.map((order) => {
//         const matchedReturns = userReturnsData.filter(
//           (returnOrder) => returnOrder.orderId === order.id
//         );
//         const isPendingOrApprovedOrReceivedReturnsCount = matchedReturns.filter((returnOrder) =>
//           ['pending', 'approved', 'received'].includes(returnOrder.status)
//         ).length;

//         const rejectedCount = matchedReturns.filter(
//           (returnOrder) => returnOrder.status === 'rejected'
//         ).length;
//         const hasActiveReturns =
//           isPendingOrApprovedOrReceivedReturnsCount || (rejectedCount > 0 && rejectedCount > 2)
//             ? false
//             : true;
//         return {
//           ...order,
//           hasActiveReturns: hasActiveReturns,
//         };
//       });
//       resolve(helperFunctions.sortByField(updatedOrderData));
//       resolve(orderData);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const getAllOrderList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(ordersUrl);
      const orderData = respData ? Object.values(respData) : [];

      // Remove the filtering of 'paymentStatus: pending'
      // If you still want to apply some filter, adjust the logic accordingly

      const userReturnsData = await returnService.getAllReturnsList();

      const updatedOrderData = orderData.map((order) => {
        const matchedReturns = userReturnsData.filter(
          (returnOrder) => returnOrder.orderId === order.id
        );
        const isPendingOrApprovedOrReceivedReturnsCount = matchedReturns.filter((returnOrder) =>
          ['pending', 'approved', 'received'].includes(returnOrder.status)
        ).length;

        const rejectedCount = matchedReturns.filter(
          (returnOrder) => returnOrder.status === 'rejected'
        ).length;

        const hasActiveReturns =
          isPendingOrApprovedOrReceivedReturnsCount || (rejectedCount > 0 && rejectedCount > 2)
            ? false
            : true;

        return {
          ...order,
          hasActiveReturns: hasActiveReturns,
        };
      });

      resolve(helperFunctions.sortByField(updatedOrderData));
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetailByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const trimmedOrderId = sanitizeValue(orderId)?.trim();
      if (!trimmedOrderId) return reject(new Error('Invalid data'));

      const orderDetail = await fetchWrapperService.findOne(ordersUrl, { id: trimmedOrderId });
      if (!orderDetail) return reject(new Error('Order does not exist'));

      const [allActiveProductsData, customizationTypes, customizationSubTypes, diamondShapes] =
        await Promise.all([
          productService.getAllActiveProducts(),
          customizationTypeService.getAllCustomizationTypes(),
          customizationSubTypeService.getAllCustomizationSubTypes(),
          diamondShapeService.getAllDiamondShape(),
        ]);

      if (orderDetail.cancelledBy) {
        const users = await authenticationService.getAllUserAndAdmin();
        const user = users.find((u) => u.id === orderDetail.cancelledBy);
        if (user) orderDetail.cancelledByName = user.name;
      }

      orderDetail.products = orderDetail.products.map((orderProductItem) => {
        const product = allActiveProductsData.find((p) => p.id === orderProductItem.productId);
        if (!product) return orderProductItem;

        const variations = orderProductItem.variations.map((v) => ({
          ...v,
          variationName: customizationTypes.find((t) => t.id === v.variationId)?.title,
          variationTypeName: customizationSubTypes.find((s) => s.id === v.variationTypeId)?.title,
        }));

        const goldColor = variations
          .find((v) => v.variationName === 'Gold Color')
          ?.variationTypeName?.toLowerCase();
        const thumbnailField = GOLD_COLOR_MAP[goldColor] || 'yellowGoldThumbnailImage';
        const thumbnailImage = product[thumbnailField];

        const perQuantityDiscountAmount = Number(
          helperFunctions?.splitDiscountAmongProducts({
            quantityWiseProductPrice: orderProductItem.productPrice,
            subTotal: orderDetail.subTotal,
            discountAmount: orderDetail.discount,
          })
        );

        const perQuantitySalesTaxAmount = Number(
          helperFunctions?.splitTaxAmongProducts({
            quantityWiseProductPrice: orderProductItem.productPrice,
            subTotal: orderDetail.subTotal,
            discountAmount: orderDetail.discount,
            totalTaxAmount: orderDetail.salesTax,
          })
        );

        return {
          ...orderProductItem,
          productName: product.productName,
          productImage: thumbnailImage,
          variations,
          perQuantityDiscountAmount,
          perQuantitySalesTaxAmount,
          diamondDetail: orderProductItem.diamondDetail
            ? {
                ...orderProductItem.diamondDetail,
                shapeName: diamondShapes.find(
                  (s) => s.id === orderProductItem.diamondDetail.shapeId
                )?.title,
              }
            : undefined,
        };
      });

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
      const response = await axios.post('/order/cancelOrder', sanitizeObject(payload), { signal });
      const { status, message } = response.data;

      if (status === 200) {
        toast.success(message || 'Order has been cancelled successfully');
        return response.data;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const deleteOrder = async (orderId, abortController) => {
  try {
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;

    if (orderId) {
      const signal = abortController && abortController.signal;
      const response = await axios.delete(`/order/${orderId}`, { signal });
      const { status, message } = response.data;

      if (status === 200) {
        toast.success('Your order has been deleted');
        return response.data;
      } else {
        toast.error(message);
        return false;
      }
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const updateOrderStatus = async (payload, abortController) => {
  try {
    if (Object.values(payload).length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post('/order/updateOrderStatus', sanitizeObject(payload), {
        signal,
      });
      const { status, message } = response.data;

      if (status === 200) {
        toast.success('Your order status has been updated successfully');
        return response.data;
      } else {
        toast.error(message);
        return false;
      }
    } else {
      toast.error('Something went wrong!');
      return false;
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

const isValidDateRange = (fromDate, toDate) => {
  const startDate = moment(fromDate, 'MM-DD-YYYY');
  const endDate = moment(toDate, 'MM-DD-YYYY');
  if (startDate.isAfter(endDate)) {
    return false;
  }
  return true;
};

const getFormattedSelectedVariationsArray = (variaionsOfArray) => {
  return variaionsOfArray.map((variation) => {
    return {
      variationId: variation.variationId,
      variationTypeId: variation.variationTypeId,
    };
  });
};

const getDateRangeWiseOrderStatusCount = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { fromDate, toDate, filterBy, searchValue, selectedVariation } = sanitizeObject(params);

      filterBy = filterBy ? filterBy.trim() : null;
      searchValue = searchValue ? searchValue.trim() : null;
      selectedVariation = Array.isArray(selectedVariation) ? selectedVariation : [];

      if (selectedVariation.length) {
        selectedVariation = getFormattedSelectedVariationsArray(selectedVariation);
      }
      fromDate = moment(fromDate, 'MM-DD-YYYY');
      toDate = moment(toDate, 'MM-DD-YYYY');

      const isValidFromDate = moment(fromDate, 'MM-DD-YYYY').isValid();
      const isValidToDate = moment(toDate, 'MM-DD-YYYY').isValid();
      if (!isValidFromDate || !isValidToDate) {
        reject(
          new Error("Invalid date range. Please ensure both 'from' and 'to' dates are valid.")
        );
        return;
      }
      if (!isValidDateRange(fromDate, toDate)) {
        reject(
          new Error(
            "Invalid date range! Ensure the 'from' date comes before or is the same as the 'to' date."
          )
        );
        return;
      }
      const orderData = await getAllOrderList();
      let filteredOrders = orderData.filter((order) => {
        const orderDate = moment(order.updatedDate).format('MM-DD-YYYY');
        const formatedOrderDate = moment(orderDate, 'MM-DD-YYYY');
        return formatedOrderDate.isBetween(fromDate, toDate, null, '[]');
      });

      if (filterBy === 'user' && searchValue) {
        const filteredUsers = await usersService.getUsersByName(searchValue);

        const filteredUsersIds = filteredUsers.map((user) => user.id);
        filteredOrders = filteredOrders.filter((order) => filteredUsersIds.includes(order.userId));
      } else if (filterBy === 'product' && searchValue) {
        const filteredProducts = await productService.searchProducts(searchValue);
        const filteredProductsIds = filteredProducts.map((product) => product.id);
        filteredOrders = filteredOrders
          .map((order) => {
            if (order.products.some((product) => filteredProductsIds.includes(product.productId))) {
              if (selectedVariation.length) {
                return {
                  ...order,
                  products: order.products.filter((x) => {
                    const isMatchedProductIdandVariation =
                      filteredProductsIds.includes(x.productId) &&
                      (selectedVariation.length === 0 ||
                        x.variations.some((variation) =>
                          selectedVariation.some(
                            (selVariation) =>
                              selVariation.variationId === variation.variationId &&
                              selVariation.variationTypeId === variation.variationTypeId
                          )
                        ));
                    return isMatchedProductIdandVariation;
                  }),
                };
              } else {
                return {
                  ...order,
                  products: order.products.filter((x) => filteredProductsIds.includes(x.productId)),
                };
              }
            }
            return false;
          })
          .filter((x) => x && x.products.length);
      }

      const statusCounts = {};
      filteredOrders.forEach((order) => {
        const status = order.orderStatus;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const orderStatusCountList = Object.keys(statusCounts).map((status) => ({
        name: status,
        count: statusCounts[status],
      }));

      const allStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      allStatuses.forEach((status) => {
        if (!statusCounts.hasOwnProperty(status)) {
          orderStatusCountList.push({ name: status, count: 0 });
        }
      });

      orderStatusCountList.sort((a, b) => a.name.localeCompare(b.name));

      resolve(orderStatusCountList);
    } catch (e) {
      reject(e);
    }
  });
};

const getSalesComparisionData = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { year, filterBy, searchValue, selectedVariation } = sanitizeObject(params);

      year = year ? Number(year) : 0;
      filterBy = filterBy ? filterBy.trim() : null;
      searchValue = searchValue ? searchValue.trim() : null;
      selectedVariation = Array.isArray(selectedVariation) ? selectedVariation : [];
      if (selectedVariation.length) {
        selectedVariation = getFormattedSelectedVariationsArray(selectedVariation);
      }

      const orderData = await getAllOrderList();

      let filteredOrders = orderData.filter((order) => {
        const orderDate = new Date(order.updatedDate);
        const orderYear = orderDate.getFullYear();

        return (
          (!year || orderYear === year) &&
          (order.paymentStatus === 'success' || order.paymentStatus === 'refunded')
        );
      });

      if (filterBy === 'user' && searchValue) {
        const filteredUsers = await usersService.getUsersByName(searchValue);

        const filteredUsersIds = filteredUsers.map((user) => user.id);
        filteredOrders = filteredOrders.filter((order) => filteredUsersIds.includes(order.userId));
      } else if (filterBy === 'product' && searchValue) {
        const filteredProducts = await productService.searchProducts(searchValue);
        const filteredProductsIds = filteredProducts.map((product) => product.id);
        filteredOrders = filteredOrders
          .map((order) => {
            if (order.products.some((product) => filteredProductsIds.includes(product.productId))) {
              if (selectedVariation.length) {
                return {
                  ...order,
                  products: order.products.filter((x) => {
                    const isMatchedProductIdandVariation =
                      filteredProductsIds.includes(x.productId) &&
                      (selectedVariation.length === 0 ||
                        x.variations.some((variation) =>
                          selectedVariation.some(
                            (selVariation) =>
                              selVariation.variationId === variation.variationId &&
                              selVariation.variationTypeId === variation.variationTypeId
                          )
                        ));
                    return isMatchedProductIdandVariation;
                  }),
                };
              } else {
                return {
                  ...order,
                  products: order.products.filter((x) => filteredProductsIds.includes(x.productId)),
                };
              }
            }
            return false;
          })
          .filter((x) => x && x.products.length);
      }
      const salesGraphData = {
        timePeriodList: [],
        salesAmountList: [],
        refundAmountList: [],
      };

      if (year) {
        const monthlySalesAmounts = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };

        const monthlyRefundAmounts = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };

        filteredOrders.forEach((order) => {
          const orderDate = moment(order.updatedDate);
          const monthName = orderDate.format('MMM');
          const paymentStatus = order.paymentStatus;
          if (filterBy === 'product') {
            order.products.forEach((product) => {
              if (paymentStatus === 'success') {
                monthlySalesAmounts[monthName] += product.unitAmount;
              } else if (paymentStatus === 'refunded') {
                monthlyRefundAmounts[monthName] += product.unitAmount;
              }
            });
          } else {
            if (paymentStatus === 'success') {
              monthlySalesAmounts[monthName] += order.total;
            } else if (paymentStatus === 'refunded') {
              monthlyRefundAmounts[monthName] += order.total;
            }
          }
        });
        salesGraphData.timePeriodList = Object.keys(monthlySalesAmounts);
        salesGraphData.salesAmountList = Object.values(monthlySalesAmounts)?.map((amount) => {
          return parseFloat(helperFunctions.toFixedNumber(amount));
        });
        salesGraphData.refundAmountList = Object.values(monthlyRefundAmounts);
      } else {
        const yearSalesAmounts = {};
        const yearRefundAmounts = {};
        filteredOrders.forEach((order) => {
          const orderDate = new Date(order.updatedDate);
          const yearName = orderDate.getFullYear();
          yearSalesAmounts[yearName] = 0;
          yearRefundAmounts[yearName] = 0;
        });

        filteredOrders.forEach((order) => {
          const orderDate = new Date(order.updatedDate);
          const yearName = orderDate.getFullYear();
          const paymentStatus = order.paymentStatus;
          if (filterBy === 'product') {
            order.products.forEach((product) => {
              if (paymentStatus === 'success') {
                yearSalesAmounts[yearName] += product.unitAmount;
              } else if (paymentStatus === 'refunded') {
                yearRefundAmounts[yearName] += product.unitAmount;
              }
            });
          } else {
            if (paymentStatus === 'success') {
              yearSalesAmounts[yearName] += order.total;
            } else if (paymentStatus === 'refunded') {
              yearRefundAmounts[yearName] += order.total;
            }
          }
        });

        salesGraphData.timePeriodList = Object.keys(yearSalesAmounts);
        salesGraphData.salesAmountList = Object.values(yearSalesAmounts)?.map((amount) => {
          return parseFloat(helperFunctions.toFixedNumber(amount));
        });
        salesGraphData.refundAmountList = Object.values(yearRefundAmounts);
      }
      resolve(salesGraphData);
    } catch (e) {
      reject(e);
    }
  });
};

const getTopSellingProducts = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let {
        limit,
        fromDate,
        toDate,
        filterBy,
        searchValue,
        selectedVariation,
        minPrice,
        maxPrice,
      } = sanitizeObject(params);

      limit = limit ? Number(limit) : 0;
      filterBy = filterBy ? filterBy.trim() : null;
      searchValue = searchValue ? searchValue.trim() : null;
      selectedVariation = Array.isArray(selectedVariation) ? selectedVariation : [];
      if (selectedVariation.length) {
        selectedVariation = getFormattedSelectedVariationsArray(selectedVariation);
      }
      fromDate = moment(fromDate, 'MM-DD-YYYY');
      toDate = moment(toDate, 'MM-DD-YYYY');

      const isValidFromDate = moment(fromDate, 'MM-DD-YYYY').isValid();
      const isValidToDate = moment(toDate, 'MM-DD-YYYY').isValid();
      if (!isValidFromDate || !isValidToDate) {
        reject(
          new Error("Invalid date range. Please ensure both 'from' and 'to' dates are valid.")
        );
        return;
      }

      if (!isValidDateRange(fromDate, toDate)) {
        reject(
          new Error(
            "Invalid date range! Ensure the 'from' date comes before or is the same as the 'to' date."
          )
        );
        return;
      }

      minPrice = helperFunctions.isValidNumber(minPrice) ? parseFloat(minPrice) : null;
      maxPrice = helperFunctions.isValidNumber(maxPrice) ? parseFloat(maxPrice) : null;

      if ((minPrice === null && maxPrice !== null) || (minPrice !== null && maxPrice === null)) {
        reject(new Error('Both minPrice and maxPrice must be provided together'));
        return;
      }

      if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
        reject(new Error('Invalid price range: minPrice should be less than or equal to maxPrice'));
        return;
      }

      const orderData = await getAllOrderList();
      let filteredOrders = orderData.filter((order) => {
        const orderDate = moment(order.updatedDate).format('MM-DD-YYYY');
        const formatedOrderDate = moment(orderDate, 'MM-DD-YYYY');
        return (
          formatedOrderDate.isBetween(fromDate, toDate, null, '[]') &&
          order.paymentStatus === 'success'
        );
      });

      if (filterBy === 'user' && searchValue) {
        const filteredUsers = await usersService.getUsersByName(searchValue);

        const filteredUsersIds = filteredUsers.map((user) => user.id);
        filteredOrders = filteredOrders.filter((order) => filteredUsersIds.includes(order.userId));
      } else if (filterBy === 'product' && searchValue) {
        const filteredProducts = await productService.searchProducts(searchValue);
        const filteredProductsIds = filteredProducts.map((product) => product.id);
        filteredOrders = filteredOrders
          .map((order) => {
            if (order.products.some((product) => filteredProductsIds.includes(product.productId))) {
              if (selectedVariation.length) {
                return {
                  ...order,
                  products: order.products.filter((x) => {
                    const isMatchedProductIdandVariation =
                      filteredProductsIds.includes(x.productId) &&
                      (selectedVariation.length === 0 ||
                        x.variations.some((variation) =>
                          selectedVariation.some(
                            (selVariation) =>
                              selVariation.variationId === variation.variationId &&
                              selVariation.variationTypeId === variation.variationTypeId
                          )
                        ));
                    return isMatchedProductIdandVariation;
                  }),
                };
              } else {
                return {
                  ...order,
                  products: order.products.filter((x) => filteredProductsIds.includes(x.productId)),
                };
              }
            }
            return false;
          })
          .filter((x) => x && x.products.length);
      }

      const productMap = new Map();

      filteredOrders.forEach((order) => {
        const { orderNumber } = order;
        order.products.forEach((product) => {
          const { productId, variations, cartQuantity, unitAmount } = product;

          // Create a unique identifier for the product including its variations
          const productKey = `${productId}-${variations
            .map((v) => v.variationId)
            .join('-')}-${variations.map((v) => v.variationTypeId).join('-')}`;
          // Check if the product is already in the map, if not, initialize it
          if (!productMap.has(productKey)) {
            productMap.set(productKey, {
              productId,
              variations,
              soldQuantity: 0,
              totalSalesAmount: 0,
              unitAmount: parseFloat(helperFunctions.toFixedNumber(unitAmount)),
              userId: order.userId,
              orderNumber,
            });
          }

          // Increment the total quantity sold for this product
          const existingProduct = productMap.get(productKey);
          existingProduct.soldQuantity += cartQuantity;
          existingProduct.totalSalesAmount = helperFunctions.toFixedNumber(
            parseFloat(existingProduct.totalSalesAmount) + parseFloat(unitAmount)
          );
          productMap.set(productKey, existingProduct);
        });
      });

      const filteredProducts = [...productMap.values()].filter((productItem) => {
        const { totalSalesAmount } = productItem;

        // Check if the product's totalSalesAmount is within the specified range
        return (
          (!minPrice || totalSalesAmount >= minPrice) && (!maxPrice || totalSalesAmount <= maxPrice)
        );
      });

      const tempTopSellingProductsList = filteredProducts.sort(
        (a, b) => b.soldQuantity - a.soldQuantity
      );

      const topN = limit ? limit : tempTopSellingProductsList.length;
      const topSellingProducts = tempTopSellingProductsList.slice(0, topN);

      const allActiveProductsData = await productService.getAllActiveProducts();
      const customizationType = await customizationTypeService.getAllCustomizationTypes();
      const customizationSubType = await customizationSubTypeService.getAllCustomizationSubTypes();

      const allUsersData = await usersService.getAllUserList();

      const convertedTopSellingProducts = topSellingProducts.map((sellingProductItem) => {
        const findedProduct = allActiveProductsData.find(
          (product) => product.id === sellingProductItem.productId
        );
        if (findedProduct) {
          const variationArray = sellingProductItem.variations.map((variItem) => {
            const findedCustomizationType = customizationSubType.find(
              (x) => x.id === variItem.variationTypeId
            );
            return {
              ...variItem,
              variationName: customizationType.find((x) => x.id === variItem.variationId).title,
              variationTypeName: findedCustomizationType?.title,
            };
          });
          const { quantity: availableQuantity } = helperFunctions.getPriceQty(
            findedProduct.variComboWithQuantity,
            sellingProductItem.variations
          );
          const goldColor = variationArray
            .find((v) => v.variationName === 'Gold Color')
            ?.variationTypeName?.toLowerCase();

          const thumbnailField = GOLD_COLOR_MAP[goldColor] || 'yellowGoldThumbnailImage';
          const thumbnailImage = findedProduct[thumbnailField];

          return {
            ...sellingProductItem,
            productName: findedProduct.productName,
            productImage: thumbnailImage,
            variations: variationArray,
            availableQuantity,
            sku: findedProduct.sku,
            customerDetail: allUsersData.filter((user) => user.id === sellingProductItem.userId),
          };
        }
        return sellingProductItem;
      });
      resolve(convertedTopSellingProducts);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllRefundList = () => async (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(setOrderRefundLoader(true));
      const orderData = await getAllOrderList();
      const refundFilteredOrders = orderData.filter((order) =>
        refundStatuses?.some((y) => y?.value === order.paymentStatus)
      );
      const sortedData = helperFunctions.sortByField([...refundFilteredOrders]);
      resolve(sortedData);
    } catch (e) {
      reject(e);
    } finally {
      dispatch(setOrderRefundLoader(false));
    }
  });
};

const refundPayment = async (payload, abortController) => {
  try {
    if (Object.values(payload).length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post('/order/refundPayment', sanitizeObject(payload), {
        signal,
      });
      const { status, message } = response.data;

      if (status === 200) {
        toast.success('Refund payment successfully');
        return response.data;
      } else if (status === 302) {
        toast.error(message);
        console.log('message', message);
        return false;
      } else {
        toast.error(message);
        return false;
      }
    } else {
      toast.error('Something went wrong!');
      return false;
    }
  } catch (error) {
    toast.error(error.message);
    return false;
  }
};

export const orderService = {
  getAllOrderList,
  getOrderDetailByOrderId,
  cancelOrder,
  deleteOrder,
  updateOrderStatus,
  getDateRangeWiseOrderStatusCount,
  getSalesComparisionData,
  getTopSellingProducts,
  getAllRefundList,
  refundPayment,
};
