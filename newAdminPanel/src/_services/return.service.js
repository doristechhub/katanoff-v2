import { uid } from 'uid';
import axios from 'axios';
import {
  deleteFile,
  fetchWrapperService,
  helperFunctions,
  isValidFileSize,
  isValidFileType,
  ordersUrl,
  returnsUrl,
  sanitizeObject,
  sanitizeValue,
  uploadFile,
} from '../_helpers';
import { toast } from 'react-toastify';
import { authenticationService } from './authentication.service';
import { customizationSubTypeService } from './customizationSubType.service';
import { customizationTypeService } from './customizationType.service';
import { productService } from './product.service';
import fileSettings from '../_utils/fileSettings';
import { refundStatuses } from 'src/store/slices/refundSlice';
import { diamondShapeService } from './diamondShape.service';
import { GOLD_COLOR_MAP } from 'src/_helpers/constants';

const getAllReturnsList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch data concurrently
      const [returnsResp, ordersResp] = await Promise.all([
        fetchWrapperService.getAll(returnsUrl),
        fetchWrapperService.getAll(ordersUrl),
      ]);
      const returnsData = returnsResp ? Object.values(returnsResp) : [];
      const ordersData = ordersResp ? Object.values(ordersResp) : [];

      // Create Map for O(1) lookup
      const ordersByOrderNumber = new Map(
        ordersData
          ?.map((order) => [order.orderNumber, order.paymentMethod])
          ?.filter(([orderNumber]) => orderNumber)
      );

      // Transform returns with payment method
      const convertedReturnsData = returnsData?.map((returnItem) => ({
        ...returnItem,
        paymentMethod: ordersByOrderNumber.get(returnItem.orderNumber) ?? null,
      }));
      resolve(convertedReturnsData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllReturnRefundList = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const returnData = await getAllReturnsList();
      const refundFilteredReturns = returnData.filter((returnItem) =>
        refundStatuses?.some((y) => y?.value === returnItem.returnPaymentStatus)
      );
      const sortedData = helperFunctions.sortByField([...refundFilteredReturns]);
      resolve(sortedData);
    } catch (e) {
      reject(e);
    }
  });
};

const getReturnDetailByReturnId = (returnId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const trimmedReturnId = sanitizeValue(returnId)?.trim();
      if (!trimmedReturnId) return reject(new Error('Invalid return ID'));

      const returnDetail = await fetchWrapperService.findOne(returnsUrl, { id: trimmedReturnId });
      if (!returnDetail) return reject(new Error('Return does not exist'));

      const [orders, products, customizationTypes, customizationSubTypes, diamondShapes, users] =
        await Promise.all([
          fetchWrapperService.getAll(ordersUrl).catch(() => ({})),
          productService.getAllActiveProducts().catch(() => []),
          customizationTypeService.getAllCustomizationTypes().catch(() => []),
          customizationSubTypeService.getAllCustomizationSubTypes().catch(() => []),
          diamondShapeService.getAllDiamondShape().catch(() => []),
          authenticationService.getAllUserAndAdmin().catch(() => []),
        ]);

      // Match order and set payment method
      const matchedOrder = Object.values(orders).find(
        (order) => order?.orderNumber === returnDetail?.orderNumber
      );
      if (matchedOrder) {
        returnDetail.paymentMethod = matchedOrder.paymentMethod || null;
      }

      // Set createdBy from user data
      if (returnDetail?.userId) {
        const user = users.find((u) => u?.id === returnDetail.userId);
        if (user) returnDetail.createdBy = user.name || 'Unknown';
      }

      // Process products
      returnDetail.products = (returnDetail.products || []).map((item) => {
        const product = products.find((p) => p?.id === item?.productId);
        if (!product)
          return {
            ...item,
            productName: null,
            productImage: null,
            variations: item.variations || [],
          };

        const variations = (item.variations || []).map((v) => ({
          ...v,
          variationName:
            customizationTypes.find((t) => t?.id === v?.variationId)?.title || 'Unknown',
          variationTypeName:
            customizationSubTypes.find((s) => s?.id === v?.variationTypeId)?.title || 'Unknown',
        }));

        const goldColor = variations
          .find((v) => v.variationName === 'Gold Color')
          ?.variationTypeName?.toLowerCase();
        const thumbnailField = GOLD_COLOR_MAP[goldColor] || 'yellowGoldThumbnailImage';
        const thumbnailImage = product[thumbnailField];
        const subTotalWithDiscount = matchedOrder.subTotal + matchedOrder.discount;

        const perQuantityDiscountAmount = Number(
          helperFunctions?.splitDiscountAmongProducts({
            quantityWiseProductPrice: item.productPrice,
            subTotal: subTotalWithDiscount,
            discountAmount: returnDetail.discount,
          })
        );

        const perQuantitySalesTaxAmount = Number(
          helperFunctions?.splitTaxAmongProducts({
            quantityWiseProductPrice: item.productPrice,
            subTotal: subTotalWithDiscount,
            discountAmount: returnDetail.discount,
            totalTaxAmount: returnDetail.salesTax,
          })
        );
        console.log('perQuantityDiscountAmount :>> ', perQuantityDiscountAmount);
        return {
          ...item,
          productName: product.productName || 'Unknown',
          productImage: thumbnailImage,
          perQuantityDiscountAmount,
          perQuantitySalesTaxAmount,
          variations,
          diamondDetail: item?.diamondDetail
            ? {
              ...item.diamondDetail,
              shapeName:
                diamondShapes.find((s) => s?.id === item.diamondDetail?.shapeId)?.title ||
                'Unknown',
            }
            : undefined,
        };
      });

      resolve(returnDetail);
    } catch (e) {
      reject(new Error(`Failed to fetch return details: ${e.message}`));
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

const validateKeys = (objects, keys) =>
  keys.every((key) => helperFunctions.isValidKeyName(objects, key));

const hasInvalidProductsKey = (products) => {
  const requiredProductKeys = ['productId', 'unitAmount', 'returnQuantity', 'variations'];
  const requiredVariationKeys = ['variationId', 'variationTypeId'];
  const requiredDiamondKeys = ['shapeId', 'caratWeight', 'clarity', 'color'];

  const isInvalidProduct = !validateKeys(products, requiredProductKeys);
  const isInvalidVariation = !validateKeys(products[0]?.variations || [], requiredVariationKeys);

  const diamondDetail = products[0]?.diamondDetail;
  const isInvalidDiamond = diamondDetail && !validateKeys([diamondDetail], requiredDiamondKeys);

  return isInvalidProduct || isInvalidVariation || isInvalidDiamond;
};

export const getProductsArray = (products) =>
  products.map((product) => {
    const { productPrice, returnQuantity, diamondDetail } = product;
    const unitAmount = productPrice * returnQuantity;

    const mappedProduct = {
      productId: product.productId,
      returnQuantity,
      productPrice,
      unitAmount,
      variations: product.variations.map(({ variationId, variationTypeId }) => ({
        variationId,
        variationTypeId,
      })),
    };

    if (diamondDetail) {
      mappedProduct.diamondDetail = {
        shapeId: diamondDetail.shapeId,
        caratWeight: diamondDetail.caratWeight,
        clarity: diamondDetail.clarity,
        color: diamondDetail.color,
      };
    }

    return mappedProduct;
  });

const validateProducts = (products, orderProducts) =>
  products.every((product) => {
    const match = orderProducts.find((orderProduct) => {
      // Check if productId and variations match
      const isProductMatch =
        orderProduct.productId === product.productId &&
        helperFunctions.areArraysEqual(orderProduct.variations, product.variations);

      // If diamondDetail exists in product, verify it matches
      if (product.diamondDetail) {
        return (
          isProductMatch &&
          orderProduct.diamondDetail &&
          orderProduct.diamondDetail.shapeId === product.diamondDetail.shapeId &&
          orderProduct.diamondDetail.caratWeight === product.diamondDetail.caratWeight &&
          orderProduct.diamondDetail.clarity === product.diamondDetail.clarity &&
          orderProduct.diamondDetail.color === product.diamondDetail.color
        );
      }

      return isProductMatch;
    });

    return match && product.returnQuantity > 0 && product.returnQuantity <= match.cartQuantity;
  });

const createApprovedReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { orderId, products, imageFile, returnRequestReason } = sanitizeObject(params);

      orderId = orderId ? orderId?.trim() : null;
      returnRequestReason = returnRequestReason ? returnRequestReason?.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error('unAuthorized'));
        return;
      }

      if (!orderId || !returnRequestReason) {
        reject(new Error('Invalid Data'));
        return;
      }

      const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });
      if (!orderDetail) {
        reject(new Error('Order does not exist'));
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
        (returnOrder) => returnOrder.status === 'rejected'
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

      let uploadedImage = '';

      if (imageFile.length) {
        if (imageFile.length > fileSettings.RETURN_IMAGE_FILE_LIMIT) {
          reject(
            new Error(
              `You can only ${fileSettings.RETURN_IMAGE_FILE_LIMIT} image or pdf upload here`
            )
          );
          return;
        }

        const imageValidFileType = isValidFileType(fileSettings.IMAGE_AND_PDF_FILE_NAME, imageFile);
        if (!imageValidFileType) {
          reject(new Error('Invalid file! (Only PNG, JPG, JPEG, WEBP, PDF files are allowed!)'));
          return;
        }

        const imageValidFileSize = isValidFileSize(fileSettings.IMAGE_AND_PDF_FILE_NAME, imageFile);
        if (!imageValidFileSize) {
          reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
          return;
        }

        const filesPayload = [...imageFile];
        await uploadFile(returnsUrl, filesPayload)
          .then((fileNames) => {
            uploadedImage = fileNames[0];
          })
          .catch((e) => {
            reject(new Error('An error occurred during image uploading.'));
          });
      }
      const { subTotal, discount, salesTax, serviceFees, returnRequestAmount } =
        helperFunctions?.calcReturnPayment(productsArray, orderDetail);
      if (subTotal && isNaN(subTotal) || discount && isNaN(discount) || salesTax && isNaN(salesTax) || serviceFees && isNaN(serviceFees) || returnRequestAmount && isNaN(returnRequestAmount)) {
        reject(new Error('Invalid data'));
        return;
      }

      const uuid = uid();
      let insertPattern = {
        id: uuid,
        orderId,
        orderNumber: orderNumber,
        products: productsArray,
        returnRequestReason,
        status: 'approved',
        returnPaymentStatus: 'pending',
        shippingLabel: imageFile.length ? uploadedImage : '',
        createdDate: Date.now(),
        updatedDate: Date.now(),
        subTotal,
        discount,
        salesTax,
        serviceFees,
        returnRequestAmount
      };
      if (orderDetail?.userId) {
        insertPattern.userId = orderDetail.userId;
      }
      const createPattern = {
        url: `${returnsUrl}/${uuid}`,
        insertPattern,
      };

      fetchWrapperService
        .create(createPattern)
        .then((response) => {
          //update order for returnRequestIds
          const prevReturnReqIds = returnRequestIds?.length ? returnRequestIds : [];
          const orderUpdatePayload = {
            returnRequestIds: [...prevReturnReqIds, insertPattern.id],
          };
          const orderUpdatePattern = {
            url: `${ordersUrl}/${orderId}`,
            payload: orderUpdatePayload,
          };
          fetchWrapperService._update(orderUpdatePattern);
          axios.post(
            '/returns/sendReturnStatusMail',
            sanitizeObject({ returnId: insertPattern.id })
          );
          resolve(createPattern);
        })
        .catch((e) => {
          reject(new Error('An error occurred during creating a new return request.'));
          // whenever an error occurs for approved return request the uploaded file is deleted
          if (uploadedImage) {
            deleteFile(returnsUrl, uploadedImage);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
};

const rejectReturn = async (payload, abortController) => {
  try {
    if (payload) {
      const signal = abortController && abortController.signal;
      const response = await axios.post('/returns/rejectReturn', sanitizeObject(payload), {
        signal,
      });
      const { status, message } = response.data;

      if (status === 200) {
        toast.success(message || 'Return has been rejected successfully');
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

// const approveReturnRequest = async (params) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let { returnId, imageFile } = sanitizeObject(params);
//       returnId = returnId ? returnId.trim() : null;
//       imageFile = typeof imageFile === 'object' ? [imageFile] : [];
//       if (returnId) {
//         const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
//           id: returnId,
//         });
//         if (returnDetail) {
//           const { status, returnPaymentStatus, shippingLabel } = returnDetail;
//           // if (!shippingLabel && status === 'approved') {
//           //   reject(new Error('return status already exits!'));
//           //   return;
//           // }
//           if (!shippingLabel && (returnPaymentStatus !== 'pending' || status !== 'pending')) {
//             reject(
//               new Error(
//                 `You cannot approve return as the return payment status is ${returnPaymentStatus} and return status is ${status}`
//               )
//             );
//             return;
//           }
//           if (shippingLabel && (returnPaymentStatus !== 'pending' || status !== 'approved')) {
//             reject(
//               new Error(
//                 `You cannot update shipping label as the return payment status is ${returnPaymentStatus} and return status is ${status}`
//               )
//             );
//             return;
//           }
//           if (!shippingLabel && !imageFile.length) {
//             reject(new Error(`Image or pdf is required`));
//             return;
//           }
//           if (
//             !shippingLabel &&
//             imageFile.length &&
//             imageFile.length > fileSettings.RETURN_IMAGE_FILE_LIMIT
//           ) {
//             reject(
//               new Error(
//                 `You can only ${fileSettings.RETURN_IMAGE_FILE_LIMIT} image or pdf upload here`
//               )
//             );
//             return;
//           }

//           let uploadedImage = '';

//           if (imageFile.length) {
//             const imageValidFileType = isValidFileType(
//               fileSettings.IMAGE_AND_PDF_FILE_NAME,
//               imageFile
//             );
//             if (!imageValidFileType) {
//               reject(
//                 new Error('Invalid file! (Only PNG, JPG, JPEG, WEBP, PDF files are allowed!)')
//               );
//               return;
//             }

//             const imageValidFileSize = isValidFileSize(
//               fileSettings.IMAGE_AND_PDF_FILE_NAME,
//               imageFile
//             );
//             if (!imageValidFileSize) {
//               reject(new Error('Invalid File Size! (Only 5 MB are allowed!)'));
//               return;
//             }

//             const filesPayload = [...imageFile];
//             await uploadFile(returnsUrl, filesPayload)
//               .then((fileNames) => {
//                 uploadedImage = fileNames[0];
//               })
//               .catch((e) => {
//                 reject(new Error('An error occurred during image uploading.'));
//               });
//           }

//           let deleteShippingLabel = '';
//           if (shippingLabel && imageFile.length) {
//             deleteShippingLabel = shippingLabel;
//           }

//           const payload = {
//             shippingLabel: imageFile.length ? uploadedImage : shippingLabel ?? '',
//             status: 'approved',
//             updatedDate: Date.now(),
//           };
//           const updatePattern = {
//             url: `${returnsUrl}/${returnId}`,
//             payload: payload,
//           };
//           fetchWrapperService
//             ._update(updatePattern)
//             .then((response) => {
//               // Whenever a new file is uploaded for a shipping label, the old file will be deleted.
//               if (deleteShippingLabel) {
//                 deleteFile(returnsUrl, deleteShippingLabel);
//               }
//               resolve(true);
//               // integrate send mail fuctionality
//               axios.post('/returns/sendReturnStatusMail', sanitizeObject({ returnId: returnId }));
//             })
//             .catch((e) => {
//               reject(new Error('An error occurred during approved return request.'));
//               // whenever an error occurs for approved return request the uploaded file is deleted
//               if (uploadedImage) {
//                 deleteFile(returnsUrl, uploadedImage);
//               }
//             });
//           // update request
//         } else {
//           reject(new Error('Return does not exist'));
//         }
//       } else {
//         reject(new Error('Invalid data'));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const approveReturnRequest = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId, imageFile, deleteShippingLabel } = sanitizeObject(params);
      returnId = returnId ? returnId.trim() : null;
      imageFile = typeof imageFile === 'object' ? [imageFile] : [];
      deleteShippingLabel = deleteShippingLabel ? deleteShippingLabel.trim() : null;

      if (!returnId) {
        reject(new Error('Invalid data'));
        return;
      }

      const returnDetail = await fetchWrapperService.findOne(returnsUrl, { id: returnId });

      if (!returnDetail) {
        reject(new Error('Return does not exist'));
        return;
      }

      const { status, returnPaymentStatus, shippingLabel } = returnDetail;

      const hasFile = imageFile.length > 0;

      // Only validate file if one is uploaded
      if (hasFile) {
        if (imageFile.length > fileSettings.RETURN_IMAGE_FILE_LIMIT) {
          reject(
            new Error(
              `You can only upload ${fileSettings.RETURN_IMAGE_FILE_LIMIT} image or PDF file(s).`
            )
          );
          return;
        }

        const validType = isValidFileType(fileSettings.IMAGE_AND_PDF_FILE_NAME, imageFile);
        const validSize = isValidFileSize(fileSettings.IMAGE_AND_PDF_FILE_NAME, imageFile);

        if (!validType) {
          reject(new Error('Invalid file! (Only PNG, JPG, JPEG, WEBP, PDF files are allowed!)'));
          return;
        }
        if (!validSize) {
          reject(new Error('Invalid File Size! (Only 5 MB allowed!)'));
          return;
        }
      }

      let uploadedImage = '';
      if (hasFile) {
        try {
          const fileNames = await uploadFile(returnsUrl, [...imageFile]);
          uploadedImage = fileNames[0];
        } catch {
          reject(new Error('An error occurred during image uploading.'));
          return;
        }
      }

      const payload = {
        shippingLabel: hasFile ? uploadedImage : deleteShippingLabel ? '' : shippingLabel ?? '',
        status: 'approved',
        updatedDate: Date.now(),
      };

      const updatePattern = {
        url: `${returnsUrl}/${returnId}`,
        payload,
      };

      fetchWrapperService
        ._update(updatePattern)
        .then(() => {
          if (deleteShippingLabel) {
            deleteFile(returnsUrl, deleteShippingLabel);
          }

          axios.post('/returns/sendReturnStatusMail', sanitizeObject({ returnId }));
          resolve(true);
        })
        .catch((e) => {
          if (uploadedImage) {
            deleteFile(returnsUrl, uploadedImage);
          }
          reject(new Error('An error occurred during approved return request.'));
        });
    } catch (e) {
      reject(e);
    }
  });
};

const receivedReturn = async (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId, returnStatus } = sanitizeObject(params);
      returnId = returnId ? returnId.trim() : null;
      returnStatus = returnStatus ? returnStatus.trim() : null;
      if (returnId && returnStatus) {
        const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
          id: returnId,
        });
        if (returnDetail) {
          const { products, status, returnPaymentStatus } = returnDetail;
          if (status === returnStatus) {
            reject(new Error('return status already exits!'));
            return;
          }
          if (returnPaymentStatus === 'pending' && status === 'approved') {
            const payload = {
              status: 'received',
              updatedDate: Date.now(),
            };
            const updatePattern = {
              url: `${returnsUrl}/${returnId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
                // integrate send mail fuctionality
                axios.post('/returns/sendReturnStatusMail', sanitizeObject({ returnId: returnId }));
                // update product Qty
                productService.updateProductQtyForReturn(products);
              })
              .catch((e) => {
                reject(new Error('An error occurred during approved return request.'));
              });
          } else {
            reject(
              new Error(
                `You cannot receive return as the return payment status is ${returnPaymentStatus} and return status is ${status}`
              )
            );
          }
        } else {
          reject(new Error('Return does not exist'));
        }
      } else {
        reject(new Error('Invalid data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const refundPaymentForReturn = async (payload, abortController) => {
  try {
    if (Object.values(payload).length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        '/returns/refundPaymentForReturn',
        sanitizeObject(payload),
        {
          signal,
        }
      );
      const { status, message } = response.data;

      if (status === 200) {
        toast.success('Refund payment successfully');
        return response.data;
      } else if (status === 302) {
        toast.error(message);
        return true;
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

export const returnService = {
  getAllReturnsList,
  getReturnDetailByReturnId,
  createApprovedReturnRequest,
  rejectReturn,
  getReturnsByOrderId,
  approveReturnRequest,
  receivedReturn,
  refundPaymentForReturn,
  getAllReturnRefundList,
};
