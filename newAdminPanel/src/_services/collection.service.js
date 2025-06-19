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
} from '../_helpers';
import fileSettings from 'src/_utils/fileSettings';
import { productService } from './product.service';
import { IMAGE_RESOLUTIONS } from 'src/_helpers/constants';

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

const sanitizeAndValidateInput = (params) => {
  const sanitized = sanitizeObject(params);
  sanitized.title = sanitized.title?.trim() || null;
  sanitized.desktopBannerFile =
    sanitized.desktopBannerFile && typeof sanitized.desktopBannerFile === 'object'
      ? [sanitized.desktopBannerFile]
      : [];
  sanitized.mobileBannerFile =
    sanitized.mobileBannerFile && typeof sanitized.mobileBannerFile === 'object'
      ? [sanitized.mobileBannerFile]
      : [];
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
        `${name.charAt(0).toUpperCase() + name.slice(1)} banner must be ${resolution.width}x${resolution.height}`
      );
    }
  }
};

const uploadFiles = async (filesPayload, desktopBannerFile, mobileBannerFile) => {
  if (!filesPayload.length) return { desktopBannerUrl: '', mobileBannerUrl: '' };

  const categoryIndices = {
    desktopBanner: { start: 0, length: desktopBannerFile.length },
    mobileBanner: { start: desktopBannerFile.length, length: mobileBannerFile.length },
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

const insertCollection = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      const { title, desktopBannerFile, mobileBannerFile } = sanitizeAndValidateInput(params);

      if (!title) {
        return reject(new Error('Title is required'));
      }

      const collectionsList = await getAllCollection();

      if (collectionsList.find((cItem) => cItem.title?.toLowerCase() === title?.toLowerCase())) {
        return reject(new Error('Title already exists'));
      }

      await validateFiles(desktopBannerFile, 'IMAGE_FILE_NAME', 'desktop');
      await validateFiles(mobileBannerFile, 'IMAGE_FILE_NAME', 'mobile');

      const filesPayload = [...desktopBannerFile, ...mobileBannerFile];
      const { desktopBannerUrl, mobileBannerUrl } = await uploadFiles(
        filesPayload,
        desktopBannerFile,
        mobileBannerFile
      ).catch((e) => {
        throw new Error('An error occurred during banner image uploading.');
      });

      const insertPattern = {
        id: uuid,
        title: title,
        createdDate: Date.now(),
        updatedDate: Date.now(),
        desktopBannerImage: desktopBannerUrl,
        mobileBannerImage: mobileBannerUrl,
      };

      const createPattern = {
        url: `${collectionUrl}/${uuid}`,
        insertPattern: insertPattern,
      };

      fetchWrapperService
        .create(createPattern)
        .then(() => resolve(insertPattern))
        .catch((e) => {
          deleteFiles([desktopBannerUrl, mobileBannerUrl]);
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
        desktopBannerFile,
        mobileBannerFile,
        deletedDesktopBannerImage,
        deletedMobileBannerImage,
      } = sanitizeAndValidateInput(params);

      if (!collectionId || !title) {
        return reject(new Error('Collection ID and title are required'));
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

      let desktopBannerImage = collectionData.desktopBannerImage || null;
      if (deletedDesktopBannerImage && desktopBannerImage === deletedDesktopBannerImage) {
        desktopBannerImage = null;
      }
      let mobileBannerImage = collectionData.mobileBannerImage || null;
      if (deletedMobileBannerImage && mobileBannerImage === deletedMobileBannerImage) {
        mobileBannerImage = null;
      }

      await validateFiles(desktopBannerFile, 'IMAGE_FILE_NAME', 'desktop');
      await validateFiles(mobileBannerFile, 'IMAGE_FILE_NAME', 'mobile');

      const filesPayload = [...desktopBannerFile, ...mobileBannerFile];
      const { desktopBannerUrl, mobileBannerUrl } = await uploadFiles(
        filesPayload,
        desktopBannerFile,
        mobileBannerFile
      ).catch((e) => {
        throw new Error(`File upload failed: ${e.message}`);
      });

      const payload = {
        title,
        desktopBannerImage: desktopBannerUrl || desktopBannerImage,
        mobileBannerImage: mobileBannerUrl || mobileBannerImage,
      };

      const updatePattern = {
        url: `${collectionUrl}/${collectionId}`,
        payload,
      };

      await fetchWrapperService._update(updatePattern).catch(async (e) => {
        await deleteFiles([desktopBannerUrl, mobileBannerUrl]);
        throw new Error(`Update failed: ${e.message}`);
      });

      await deleteFiles([deletedDesktopBannerImage, deletedMobileBannerImage]);

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
        return reject(new Error('Collection cannot be deleted because it has products'));
      }

      await fetchWrapperService._delete(`${collectionUrl}/${collectionId}`);

      await deleteFiles([collectionData.desktopBannerImage, collectionData.mobileBannerImage]);

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

export const collectionService = {
  getAllCollection,
  insertCollection,
  updateCollection,
  deleteCollection,
};
