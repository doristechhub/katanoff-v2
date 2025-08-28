import { uid } from 'uid';
import {
  collectionUrl,
  fetchWrapperService,
  productsUrl,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
  validateImageResolution,
  sanitizeValue,
} from '../_helpers';
import fileSettings from 'src/_utils/fileSettings';
import { productService } from './product.service';
import { IMAGE_RESOLUTIONS } from 'src/_helpers/constants';

const getAllCollection = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(collectionUrl);
      const collectionData = respData ? Object.values(respData) : [];
      const normalizedData = collectionData.map((item) => ({
        ...item,
        filterType: item?.filterType || 'setting_style',
      }));
      resolve(
        normalizedData.sort((a, b) => {
          if (a.type === b.type) {
            return (a.position || 0) - (b.position || 0);
          }
          return (a.type || '').localeCompare(b.type || '');
        })
      );
    } catch (e) {
      reject(e);
    }
  });
};

const getSingleCollection = (collectionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      collectionId = sanitizeValue(collectionId) ? collectionId.trim() : null;

      if (!collectionId) {
        return reject(new Error('Collection ID is required'));
      }

      const collectionData = await fetchWrapperService.findOne(collectionUrl, { id: collectionId });
      if (!collectionData) {
        return reject(new Error('Collection not found'));
      }

      const products = await getAllProductsByCollectionId(collectionId);
      const collectionWithProducts = {
        ...collectionData,
        filterType: collectionData?.filterType || 'setting_style',
        products,
      };

      resolve(collectionWithProducts);
    } catch (e) {
      reject(e);
    }
  });
};

const sanitizeAndValidateInput = (params) => {
  const sanitized = sanitizeObject(params);
  sanitized.title = sanitized.title?.trim() || null;
  sanitized.type = sanitized?.type?.trim() || null;
  sanitized.filterType = sanitized?.filterType?.trim() || 'setting_style';
  sanitized.position = sanitized?.position ? parseInt(sanitized.position, 10) : null;
  sanitized.desktopBannerFile =
    sanitized.desktopBannerFile && typeof sanitized.desktopBannerFile === 'object'
      ? [sanitized.desktopBannerFile]
      : [];
  sanitized.mobileBannerFile =
    sanitized.mobileBannerFile && typeof sanitized.mobileBannerFile === 'object'
      ? [sanitized.mobileBannerFile]
      : [];
  sanitized.thumbnailFile =
    sanitized.thumbnailFile && typeof sanitized.thumbnailFile === 'object'
      ? [sanitized.thumbnailFile]
      : [];
  sanitized.productIds = Array.isArray(sanitized.productIds) ? sanitized.productIds : [];
  return sanitized;
};

const validateFiles = async (files, type, name) => {
  if (files.length > fileSettings.BANNER_IMAGE_FILE_LIMIT) {
    throw new Error(`Maximum ${fileSettings.BANNER_IMAGE_FILE_LIMIT} ${name} banner image allowed`);
  }
  if (files.length) {
    if (!isValidFileType(fileSettings.IMAGE_FILE_NAME, files)) {
      throw new Error(`Invalid ${name} file type. Only JPG, JPEG, PNG, WEBP allowed`);
    }
    if (!isValidFileSize(fileSettings.IMAGE_FILE_NAME, files)) {
      throw new Error(
        `Invalid ${name} file size. Maximum ${fileSettings.MAX_FILE_SIZE_MB}MB allowed`
      );
    }
    const resolution = IMAGE_RESOLUTIONS[name.toUpperCase()];
    if (
      files[0] &&
      !(await validateImageResolution(files[0], resolution.width, resolution.height))
    ) {
      throw new Error(
        `${name.charAt(0).toUpperCase() + name.slice(1)} must be ${resolution.width}x${resolution.height}`
      );
    }
  }
};

const validatePosition = async (type, position, excludeCollectionIds = []) => {
  if (!position || !type) return;
  const allCollections = await getAllCollection();
  const conflictingCollection = allCollections.find(
    (collection) =>
      collection.type === type &&
      collection.position === position &&
      !excludeCollectionIds.includes(collection.id)
  );
  if (conflictingCollection) {
    throw new Error(`Position ${position} is already taken for this collection type`);
  }
};

const validateCollectionLimits = async (type, collectionId = null) => {
  if (!type || type === 'slider_grid') return; // No limit for null type or slider_grid
  const collections = await getAllCollection();
  const typeCounts = collections.reduce((acc, collection) => {
    if (collectionId && collection.id === collectionId) return acc; // Skip current collection during update
    acc[collection.type] = (acc[collection.type] || 0) + 1;
    return acc;
  }, {});

  if (type === 'two_grid' && typeCounts['two_grid'] >= 2) {
    throw new Error('Maximum of 2 collections allowed for two grid type');
  }
  if (type === 'three_grid' && typeCounts['three_grid'] >= 3) {
    throw new Error('Maximum of 3 collections allowed for three grid type');
  }
};

const uploadFiles = async (filesPayload, desktopBannerFile, mobileBannerFile, thumbnailsFile) => {
  if (!filesPayload.length) return { desktopBannerUrl: '', mobileBannerUrl: '', thumbnailUrl: '' };

  const categoryIndices = {
    desktopBanner: { start: 0, length: desktopBannerFile.length },
    mobileBanner: { start: desktopBannerFile.length, length: mobileBannerFile.length },
    thumbnail: {
      start: desktopBannerFile.length + mobileBannerFile.length,
      length: thumbnailsFile.length,
    },
  };

  const fileNames = await uploadFile(collectionUrl, filesPayload);
  if (fileNames.length !== filesPayload.length) {
    throw new Error(`Expected ${filesPayload.length} files, received ${fileNames.length}`);
  }

  return {
    desktopBannerUrl: categoryIndices.desktopBanner.length
      ? fileNames[categoryIndices.desktopBanner.start]
      : '',
    mobileBannerUrl: categoryIndices.mobileBanner.length
      ? fileNames[categoryIndices.mobileBanner.start]
      : '',
    thumbnailUrl: categoryIndices.thumbnail.length
      ? fileNames[categoryIndices.thumbnail.start]
      : '',
  };
};

const deleteFiles = async (urls) => {
  const filesToDelete = urls.filter(Boolean);
  if (filesToDelete.length) {
    await Promise.all(
      filesToDelete.map((url) =>
        deleteFile(collectionUrl, url).catch((e) => {
          console.warn(`Failed to delete file ${url}: ${e.message}`);
        })
      )
    );
  }
};

const updateProductCollections = async (productIds, collectionId, add = true) => {
  try {
    const products = await productService.getAllProductsWithPagging();
    const updatePromises = productIds.map(async (productId) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      let updatedCollectionIds = product.collectionIds ? [...product.collectionIds] : [];
      if (add) {
        if (!updatedCollectionIds.includes(collectionId)) {
          updatedCollectionIds.push(collectionId);
        }
      } else {
        updatedCollectionIds = updatedCollectionIds.filter((id) => id !== collectionId);
      }

      const updatePattern = {
        url: `${productsUrl}/${productId}`,
        payload: { collectionIds: updatedCollectionIds },
      };

      await fetchWrapperService._update(updatePattern);
    });

    await Promise.all(updatePromises);
  } catch (e) {
    throw new Error(`Failed to update product collections: ${e.message}`);
  }
};

const insertCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      const {
        title,
        type,
        filterType,
        position,
        desktopBannerFile,
        mobileBannerFile,
        thumbnailFile,
        productIds,
      } = sanitizeAndValidateInput(params);

      if (!title) {
        return reject(new Error('Title is required'));
      }

      if (type && !['slider_grid', 'two_grid', 'three_grid'].includes(type)) {
        return reject(
          new Error('Invalid collection type. Must be slider_grid, two_grid, or three_grid')
        );
      }

      if (!['setting_style', 'sub_categories', 'product_types'].includes(filterType)) {
        return reject(
          new Error('Invalid filter type. Must be setting_style, sub_categories, or product_types')
        );
      }

      const collectionsList = await getAllCollection();

      if (collectionsList.find((cItem) => cItem.title?.toLowerCase() === title?.toLowerCase())) {
        return reject(new Error('Title already exists'));
      }

      let finalPosition = position;
      if (!finalPosition) {
        const typeCollections = collectionsList.filter(
          (x) => x.type === type || (!x.type && !type)
        );
        const maxPosition = typeCollections.reduce(
          (max, col) => Math.max(max, col.position || 0),
          0
        );
        finalPosition = maxPosition + 1;
      } else if (type && finalPosition) {
        await validatePosition(type, finalPosition);
      }

      await validateCollectionLimits(type);

      await validateFiles(desktopBannerFile, 'IMAGE_FILE_NAME', 'desktop');
      await validateFiles(mobileBannerFile, 'IMAGE_FILE_NAME', 'mobile');
      if (type) {
        if (!thumbnailFile?.length) {
          return reject(
            new Error(
              `Thumbnail image is required for ${type === 'slider_grid' ? 'slider grid' : type === 'two_grid' ? 'two grid' : 'three grid'}`
            )
          );
        }
        await validateFiles(
          thumbnailFile,
          'IMAGE_FILE_NAME',
          type === 'slider_grid' ? 'SLIDER_GRID' : type === 'two_grid' ? 'TWO_GRID' : 'THREE_GRID'
        );
      }

      const filesPayload = [...desktopBannerFile, ...mobileBannerFile, ...thumbnailFile];
      const { desktopBannerUrl, mobileBannerUrl, thumbnailUrl } = await uploadFiles(
        filesPayload,
        desktopBannerFile,
        mobileBannerFile,
        thumbnailFile
      ).catch((e) => {
        throw new Error('An error occurred during image uploading.');
      });

      const insertPattern = {
        id: uuid,
        title: title,
        type: type || null,
        filterType: filterType || 'setting_style',
        position: finalPosition,
        createdDate: Date.now(),
        updatedDate: Date.now(),
        desktopBannerImage: desktopBannerUrl,
        mobileBannerImage: mobileBannerUrl,
        thumbnailImage: type ? thumbnailUrl : null,
      };

      const createPattern = {
        url: `${collectionUrl}/${uuid}`,
        insertPattern: insertPattern,
      };

      await fetchWrapperService
        .create(createPattern)
        .then(async () => {
          if (productIds.length > 0) {
            await updateProductCollections(productIds, uuid, true);
          }
          resolve(insertPattern);
        })
        .catch(async (e) => {
          await deleteFiles([desktopBannerUrl, mobileBannerUrl, thumbnailUrl]);
          reject(new Error('An error occurred during collection creation.'));
        });
    } catch (e) {
      reject(e);
    }
  });
};

const updateCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        collectionId,
        title,
        type,
        filterType,
        position,
        desktopBannerFile,
        mobileBannerFile,
        thumbnailFile,
        productIds,
        deletedDesktopBannerImage,
        deletedMobileBannerImage,
        deletedThumbnailImage,
      } = sanitizeAndValidateInput(params);

      if (!collectionId || !title) {
        return reject(new Error('Collection ID and title are required'));
      }

      if (type && !['slider_grid', 'two_grid', 'three_grid'].includes(type)) {
        return reject(
          new Error('Invalid collection type. Must be slider_grid, two_grid, or three_grid')
        );
      }

      if (!['setting_style', 'sub_categories', 'product_types'].includes(filterType)) {
        return reject(
          new Error('Invalid filter type. Must be setting_style, sub_categories, or product_types')
        );
      }

      const collectionData = await fetchWrapperService.findOne(collectionUrl, { id: collectionId });
      if (!collectionData) {
        return reject(new Error('Collection not found'));
      }

      const collectionsList = await getAllCollection();
      const duplicateCheck = collectionsList.filter(
        (cItem) => cItem.title?.toLowerCase() === title?.toLowerCase() && cItem?.id !== collectionId
      );
      if (duplicateCheck?.length) {
        return reject(new Error('Title already exists'));
      }

      if (type && position !== null && position !== collectionData.position) {
        await validatePosition(type, position, [collectionId]);
      }

      await validateCollectionLimits(type, collectionId);

      let desktopBannerImage = collectionData.desktopBannerImage || null;
      if (deletedDesktopBannerImage && desktopBannerImage === deletedDesktopBannerImage) {
        desktopBannerImage = null;
      }

      let mobileBannerImage = collectionData.mobileBannerImage || null;
      if (deletedMobileBannerImage && mobileBannerImage === deletedMobileBannerImage) {
        mobileBannerImage = null;
      }

      let thumbnailImage = collectionData.thumbnailImage || null;
      if (deletedThumbnailImage && thumbnailImage === deletedThumbnailImage) {
        thumbnailImage = null;
      }

      // ===== Thumbnail Validation Start =====
      if (type) {
        const readableType =
          type === 'slider_grid' ? 'slider grid' : type === 'two_grid' ? 'two grid' : 'three grid';

        const resolution = IMAGE_RESOLUTIONS[type.toUpperCase()];
        const typeChanged = type !== collectionData.type;

        const hasNewThumbnail = thumbnailFile?.length > 0;
        const hasExistingThumbnail = !!thumbnailImage;

        if (!hasNewThumbnail && !hasExistingThumbnail) {
          return reject(new Error(`Thumbnail image is required for ${readableType}`));
        }

        if (hasNewThumbnail) {
          await validateFiles(thumbnailFile, 'IMAGE_FILE_NAME', type.toUpperCase());
        } else if (typeChanged && hasExistingThumbnail) {
          const isValid = await validateImageResolution(
            thumbnailImage,
            resolution.width,
            resolution.height
          );
          if (!isValid) {
            return reject(
              new Error(
                `Existing thumbnail must match ${readableType} resolution: ${resolution.width}x${resolution.height}`
              )
            );
          }
        }
      } else {
        thumbnailImage = null; // type is null → thumbnail is not required
      }
      // ===== Thumbnail Validation End =====

      const filesPayload = [...desktopBannerFile, ...mobileBannerFile, ...thumbnailFile];
      const { desktopBannerUrl, mobileBannerUrl, thumbnailUrl } = await uploadFiles(
        filesPayload,
        desktopBannerFile,
        mobileBannerFile,
        thumbnailFile
      ).catch((e) => {
        throw new Error(`File upload failed: ${e.message}`);
      });

      // Fetch existing products
      const existingProducts = await getAllProductsByCollectionId(collectionId);
      const existingProductIds = existingProducts.map((p) => p.id);

      // Determine products to add or remove
      const productsToAdd = productIds.filter((id) => !existingProductIds.includes(id));
      const productsToRemove = existingProductIds.filter((id) => !productIds.includes(id));

      const payload = {
        title,
        type: type || null,
        filterType: filterType || 'setting_style',
        position: position ? position : collectionData?.position,
        desktopBannerImage: desktopBannerUrl || desktopBannerImage,
        mobileBannerImage: mobileBannerUrl || mobileBannerImage,
        thumbnailImage: type ? thumbnailUrl || thumbnailImage : null,
        updatedDate: Date.now(),
      };
      const updatePattern = {
        url: `${collectionUrl}/${collectionId}`,
        payload,
      };

      await fetchWrapperService._update(updatePattern).catch(async (e) => {
        await deleteFiles([desktopBannerUrl, mobileBannerUrl, thumbnailUrl]);
        throw new Error(`Update failed: ${e.message}`);
      });

      // Update product collections
      if (productsToAdd.length > 0) {
        await updateProductCollections(productsToAdd, collectionId, true);
      }
      if (productsToRemove.length > 0) {
        await updateProductCollections(productsToRemove, collectionId, false);
      }

      let removeThumbnailImage = deletedThumbnailImage;
      if (
        type !== collectionData.type &&
        !['slider_grid', 'two_grid', 'three_grid'].includes(type)
      ) {
        removeThumbnailImage = collectionData.thumbnailImage;
      }
      await deleteFiles([
        deletedDesktopBannerImage,
        deletedMobileBannerImage,
        removeThumbnailImage,
      ]);

      resolve(payload);
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { collectionId } = sanitizeObject(params);
      if (!collectionId) {
        return reject(new Error('Invalid Id'));
      }

      const collectionData = await fetchWrapperService.findOne(collectionUrl, { id: collectionId });
      if (!collectionData) {
        return reject(new Error('Collection not found'));
      }

      const productData = await getAllProductsByCollectionId(collectionId);
      if (productData?.length) {
        // return reject(new Error('Collection cannot be deleted because it has products'));
        // Remove collectionId from associated products
        const productIds = productData.map((p) => p.id);
        await updateProductCollections(productIds, collectionId, false);
      }

      await fetchWrapperService._delete(`${collectionUrl}/${collectionId}`);

      await deleteFiles([
        collectionData?.desktopBannerImage,
        collectionData?.mobileBannerImage,
        collectionData?.thumbnailImage,
      ]);

      resolve(true);
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

const updateCollectionPosition = (positions) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(positions) || !positions.length) {
        return reject(new Error('Invalid positions data'));
      }

      const allCollections = await getAllCollection();

      const types = new Set(
        positions.map((pos) => {
          const collection = allCollections.find((col) => col.id === pos.collectionId);
          return collection ? collection.type || 'default' : null;
        })
      );
      if (types.size !== 1 || ![...types][0]) {
        return reject(
          new Error('All collections must belong to the same type and have a valid type')
        );
      }

      const type = [...types][0];
      const collectionIds = positions.map((pos) => pos.collectionId);
      for (const { collectionId, position } of positions) {
        if (!collectionId || !position) {
          return reject(new Error('Invalid collection ID or position'));
        }
        const collectionData = allCollections.find((col) => col.id === collectionId);
        if (!collectionData) {
          return reject(new Error(`Collection ${collectionId} not found`));
        }
        await validatePosition(type, position, collectionIds);
      }

      const updatePromises = positions.map(({ collectionId, position }) => {
        const payload = { position };
        const updatePattern = {
          url: `${collectionUrl}/${collectionId}`,
          payload,
        };
        return fetchWrapperService._update(updatePattern);
      });

      await Promise.all(updatePromises);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

export const collectionService = {
  getAllCollection,
  getSingleCollection,
  insertCollection,
  updateCollection,
  deleteCollection,
  getAllProductsByCollectionId,
  updateCollectionPosition,
};
