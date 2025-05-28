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

const getAllReturnsList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(returnsUrl);
      const returnsData = respData ? Object.values(respData) : [];
      resolve(returnsData);
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
      returnId = sanitizeValue(returnId) ? returnId.trim() : null;
      if (returnId) {
        const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
          id: returnId,
        });

        if (returnDetail) {
          const allActiveProductsData = await productService.getAllActiveProducts();
          const customizationType = await customizationTypeService.getAllCustomizationTypes();
          const customizationSubType =
            await customizationSubTypeService.getAllCustomizationSubTypes();
          const allDiamondShapeList = await diamondShapeService.getAllDiamondShape();

          const customizations = {
            customizationType,
            customizationSubType,
          };
          if (returnDetail?.userId) {
            const adminAndUsersData = await authenticationService.getAllUserAndAdmin();
            const findedUserData = adminAndUsersData.find(
              (item) => item.id === returnDetail.userId
            );
            if (findedUserData) {
              returnDetail.createdBy = findedUserData.name;
            }
          }
          returnDetail.products = returnDetail.products.map((returnProductItem) => {
            const findedProduct = allActiveProductsData.find(
              (product) => product.id === returnProductItem.productId
            );
            if (findedProduct) {
              const variationArray = returnProductItem.variations.map((variItem) => {
                const findedCustomizationType = customizations.customizationSubType.find(
                  (x) => x.id === variItem.variationTypeId
                );
                return {
                  ...variItem,
                  variationName: customizations.customizationType.find(
                    (x) => x.id === variItem.variationId
                  ).title,
                  variationTypeName: findedCustomizationType.title,
                };
              });
              const foundedShape = allDiamondShapeList?.find(
                (shape) => shape.id === returnProductItem?.diamondDetail?.shapeId
              );

              return {
                ...returnProductItem,
                productName: findedProduct.productName,
                productImage: findedProduct.images[0].image,
                variations: variationArray,
                diamondDetail: returnProductItem?.diamondDetail
                  ? {
                      ...returnProductItem?.diamondDetail,
                      shapeName: foundedShape?.title,
                    }
                  : undefined,
              };
            }
            return orderProductItem;
          });
          resolve(returnDetail);
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

const validateKeys = (objects, keys) =>
  keys.every((key) => helperFunctions.isValidKeyName(objects, key));

const hasInvalidProductsKey = (products) => {
  const requiredProductKeys = ['productId', 'unitAmount', 'returnQuantity', 'variations'];
  const requiredVariationKeys = ['variationId', 'variationTypeId'];
  const requiredDiamondKeys = ['shapeId', 'caratWeight', 'clarity', 'color', 'price'];

  const isInvalidProduct = !validateKeys(products, requiredProductKeys);
  const isInvalidVariation = !validateKeys(products[0]?.variations || [], requiredVariationKeys);

  const diamondDetail = products[0]?.diamondDetail;
  const isInvalidDiamond = diamondDetail && !validateKeys([diamondDetail], requiredDiamondKeys);

  return isInvalidProduct || isInvalidVariation || isInvalidDiamond;
};

export const getProductsArray = (products) =>
  products.map((product) => {
    const { productPrice, returnQuantity, diamondDetail } = product;
    const diamondPrice = diamondDetail?.price || 0;
    const unitAmount = (productPrice + diamondPrice) * returnQuantity;

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
        price: diamondPrice,
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
          orderProduct.diamondDetail.color === product.diamondDetail.color &&
          orderProduct.diamondDetail.price === product.diamondDetail.price
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

      if (orderStatus !== 'delivered' || !helperFunctions.isReturnValid(deliveryDate)) {
        reject(
          new Error(
            "Since your order hasn't been delivered or has exceeded the 15-day limit, you're unable to initiate a return request"
          )
        );
        return;
      }

      const returnFindPattern = {
        url: returnsUrl,
        key: 'orderId',
        value: orderId,
      };
      const matchedReturns = await fetchWrapperService.find(returnFindPattern);

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

      if (!hasActiveReturns) {
        reject(
          new Error(
            'Unable to initiate return: Either an active return request is pending, approved, or received, or the return request limit has been exceeded.'
          )
        );
        return;
      }

      if (hasInvalidProductsKey(products)) {
        reject(new Error('products data not valid'));
        return;
      }
      const productsArray = getProductsArray(products);
      if (!validateProducts(productsArray, orderProducts)) {
        reject(new Error('At least one product is invalid'));
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
  approveReturnRequest,
  receivedReturn,
  refundPaymentForReturn,
  getAllReturnRefundList,
};
