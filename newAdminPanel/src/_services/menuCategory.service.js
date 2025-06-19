import { uid } from 'uid';
import {
  fetchWrapperService,
  menuCategoriesUrl,
  menuSubCategoriesUrl,
  menuUrl,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
  validateImageResolution,
} from '../_helpers';
import fileSettings from 'src/_utils/fileSettings';
import { IMAGE_RESOLUTIONS } from 'src/_helpers/constants';

const getAllMenuCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(menuCategoriesUrl);
      const menuCategoryData = respData ? Object.values(respData) : [];
      resolve(menuCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMenuItems = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const menuData = await fetchWrapperService.getAll(menuUrl);
      const categories = menuData?.categories ? Object.values(menuData.categories) : [];
      const subCategories = menuData?.subCategories ? Object.values(menuData.subCategories) : [];
      const productType = menuData?.productType ? Object.values(menuData.productType) : [];
      resolve({ categories, subCategories, productType });
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

  const fileNames = await uploadFile(menuCategoriesUrl, filesPayload);
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
        deleteFile(menuCategoriesUrl, url).catch((e) => {
          console.warn(`Failed to delete file ${url}: ${e.message}`);
        })
      )
    );
  }
};

const insertMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      const { title, desktopBannerFile, mobileBannerFile } = sanitizeAndValidateInput(params);

      if (!title) {
        return reject(new Error('Title is required'));
      }

      const menuCategoriesList = await getAllMenuCategory();
      if (menuCategoriesList.find((cItem) => cItem.title?.toLowerCase() === title?.toLowerCase())) {
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

      const maxPosition = menuCategoriesList.reduce(
        (max, item) => Math.max(item?.position || 0, max),
        0
      );
      const insertPattern = {
        id: uuid,
        title,
        position: maxPosition + 1,
        createdDate: Date.now(),
        desktopBannerImage: desktopBannerUrl,
        mobileBannerImage: mobileBannerUrl,
      };

      const createPattern = {
        url: `${menuCategoriesUrl}/${uuid}`,
        insertPattern,
      };

      fetchWrapperService
        .create(createPattern)
        .then(() => resolve(insertPattern))
        .catch((e) => {
          deleteFiles([desktopBannerUrl, mobileBannerUrl]);
          reject(new Error('An error occurred during menuCategory creation.'));
        });
    } catch (e) {
      reject(e);
    }
  });
};

const updateMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        categoryId,
        title,
        position,
        desktopBannerFile,
        mobileBannerFile,
        deletedDesktopBannerImage,
        deletedMobileBannerImage,
      } = sanitizeAndValidateInput(params);

      if (!categoryId || !title) {
        return reject(new Error('Category ID and title are required'));
      }

      const categoryData = await fetchWrapperService.findOne(menuCategoriesUrl, { id: categoryId });
      if (!categoryData) {
        return reject(new Error('Menu category not found'));
      }
      const menuCategoriesList = await getAllMenuCategory();

      const duplicateCheck = menuCategoriesList.filter(
        (cItem) => cItem.title?.toLowerCase() === title?.toLowerCase() && cItem?.id !== categoryId
      );
      if (duplicateCheck?.length) {
        return reject(new Error('Title already exists'));
      }

      let desktopBannerImage = categoryData.desktopBannerImage || null;
      if (deletedDesktopBannerImage && desktopBannerImage === deletedDesktopBannerImage) {
        desktopBannerImage = null;
      }
      let mobileBannerImage = categoryData.mobileBannerImage || null;
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
        position: position ? Number(position) : categoryData.position,
        desktopBannerImage: desktopBannerUrl || desktopBannerImage,
        mobileBannerImage: mobileBannerUrl || mobileBannerImage,
      };

      const updatePattern = {
        url: `${menuCategoriesUrl}/${categoryId}`,
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

const deleteMenuCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { categoryId } = sanitizeObject(params);
      if (!categoryId) {
        return reject(new Error('Invalid Id'));
      }

      const categoryData = await fetchWrapperService.findOne(menuCategoriesUrl, { id: categoryId });
      if (!categoryData) {
        return reject(new Error('Menu category not found'));
      }

      const subCategoryData = await getAllMenuSubCategoryByCategoryId(categoryId);
      if (subCategoryData?.length) {
        return reject(new Error('Menu category cannot be deleted because it has child categories'));
      }

      await fetchWrapperService._delete(`${menuCategoriesUrl}/${categoryId}`);

      await deleteFiles([categoryData.desktopBannerImage, categoryData.mobileBannerImage]);

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllMenuSubCategoryByCategoryId = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: menuSubCategoriesUrl,
        key: 'categoryId',
        value: categoryId,
      };
      const subCategoryData = await fetchWrapperService.find(findPattern);
      resolve(subCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

export const menuCategoryService = {
  getAllMenuCategory,
  getAllMenuItems,
  insertMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
};
