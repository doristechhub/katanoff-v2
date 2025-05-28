import { uid } from 'uid';
import { collectionUrl, fetchWrapperService, productsUrl, sanitizeObject } from '../_helpers';
import { productService } from './product.service';

const getAllCollection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(collectionUrl);
      const collectionData = respData ? Object.values(respData) : [];
      resolve(collectionData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (title && uuid) {
        const collectionData = await fetchWrapperService.findOne(collectionUrl, { title: title });
        if (!collectionData) {
          const insertPattern = {
            id: uuid,
            title: title,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${collectionUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during collection creation.'));
            });
        } else {
          reject(new Error('title already exists'));
        }
      } else {
        reject(new Error('title is required'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { collectionId, title } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (collectionId && title) {
        const collectionData = await fetchWrapperService.findOne(collectionUrl, {
          id: collectionId,
        });
        if (collectionData) {
          const findPattern = {
            id: collectionId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            collectionUrl,
            findPattern
          );
          if (!duplicateData.length) {
            const payload = {
              title: title,
            };
            const updatePattern = {
              url: `${collectionUrl}/${collectionId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update collection.'));
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('collection not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { collectionId } = sanitizeObject(params);
      if (collectionId) {
        const collectionData = await fetchWrapperService.findOne(collectionUrl, {
          id: collectionId,
        });
        if (collectionData) {
          const productData = await getAllProductsByCollectionId(collectionId);
          if (!productData?.length) {
            await fetchWrapperService._delete(`${collectionUrl}/${collectionId}`);
            resolve(true);
          } else {
            reject(new Error('collection can not delete Because it has products'));
          }
        } else {
          reject(new Error('customization Type not found!'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductsByCollectionId = (collectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productData = await productService.getAllProductsWithPagging();
      const foundProducts = productData.filter((product) =>
        product?.collectionIds?.some((id) => id === collectionId)
      );
      resolve(foundProducts);
    } catch (e) {
      reject(e);
    }
  });
};

export const collectionService = {
  getAllCollection,
  insertCollection,
  updateCollection,
  deleteCollection,
};
