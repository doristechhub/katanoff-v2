import { uid } from 'uid';
import {
  fetchWrapperService,
  menuSubCategoriesUrl,
  productTypeUrl,
  sanitizeObject,
  isValidFileType,
  isValidFileSize,
  uploadFile,
  deleteFile,
  validateImageResolution,
} from '../_helpers';
import { menuCategoryService } from './menuCategory.service';
import fileSettings from 'src/_utils/fileSettings';
import { IMAGE_RESOLUTIONS } from 'src/_helpers/constants';

const getAllMenuSubCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(menuSubCategoriesUrl);
      const tempSubTypeData = respData ? Object.values(respData) : [];
      const menuCategoryData = await menuCategoryService.getAllMenuCategory();
      const menuSubCategoryData = tempSubTypeData
        .map((SubType) => {
          const findedItem = menuCategoryData.find(
            (category) => category.id === SubType.categoryId
          );
          return {
            ...SubType,
            categoryName: findedItem?.title || '',
          };
        })
        .sort((a, b) => {
          if (a.categoryId === b.categoryId) {
            return (a.position || 0) - (b.position || 0);
          }
          return a.categoryId.localeCompare(b.categoryId);
        });
      resolve(menuSubCategoryData);
    } catch (e) {
      reject(e);
    }
  });
};

const sanitizeAndValidateInput = (params) => {
  const sanitized = sanitizeObject(params);
  sanitized.title = sanitized?.title?.trim() || null;
  sanitized.categoryId = sanitized?.categoryId?.trim() || null;
  sanitized.position = sanitized?.position ? parseInt(sanitized.position, 10) : null;
  sanitized.desktopBannerFile =
    sanitized?.desktopBannerFile && typeof sanitized?.desktopBannerFile === 'object'
      ? [sanitized?.desktopBannerFile]
      : [];
  sanitized.mobileBannerFile =
    sanitized?.mobileBannerFile && typeof sanitized?.mobileBannerFile === 'object'
      ? [sanitized?.mobileBannerFile]
      : [];
  return sanitized;
};

const validatePosition = async (categoryId, position, excludeSubCategoryIds = []) => {
  if (!position) return;
  const allSubCategories = await getAllMenuSubCategory();
  const conflictingSubCategory = allSubCategories.find(
    (subCategory) =>
      subCategory.categoryId === categoryId &&
      subCategory.position === position &&
      !excludeSubCategoryIds.includes(subCategory.id)
  );
  if (conflictingSubCategory) {
    throw new Error(`Position ${position} is already taken for this category`);
  }
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

  const fileNames = await uploadFile(menuSubCategoriesUrl, filesPayload);
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
        deleteFile(menuSubCategoriesUrl, url).catch((e) => {
          console.warn(`Failed to delete file ${url}: ${e.message}`);
        })
      )
    );
  }
};

const insertMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      const { title, categoryId, position, desktopBannerFile, mobileBannerFile } =
        sanitizeAndValidateInput(params);

      if (!title || !categoryId) {
        return reject(new Error('Title and category ID are required'));
      }

      const allSubCategoryData = await getAllMenuSubCategory();
      if (
        allSubCategoryData.find(
          (x) => x?.categoryId === categoryId && x?.title?.toLowerCase() === title?.toLowerCase()
        )
      ) {
        return reject(new Error('Title already exists for this category'));
      }

      let finalPosition = position;
      if (!finalPosition) {
        const categorySubCategories = allSubCategoryData.filter((x) => x.categoryId === categoryId);
        const maxPosition = categorySubCategories.reduce(
          (max, sub) => Math.max(max, sub.position || 0),
          0
        );
        finalPosition = maxPosition + 1;
      } else {
        await validatePosition(categoryId, finalPosition);
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
        title,
        categoryId,
        position: finalPosition,
        createdDate: Date.now(),
        desktopBannerImage: desktopBannerUrl,
        mobileBannerImage: mobileBannerUrl,
      };

      const createPattern = {
        url: `${menuSubCategoriesUrl}/${uuid}`,
        insertPattern,
      };

      fetchWrapperService
        .create(createPattern)
        .then(() => resolve(insertPattern))
        .catch((e) => {
          deleteFiles([desktopBannerUrl, mobileBannerUrl]);
          reject(new Error('An error occurred during menu subcategory creation.'));
        });
    } catch (e) {
      reject(e);
    }
  });
};

const updateMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        subCategoryId,
        title,
        categoryId,
        position,
        desktopBannerFile,
        mobileBannerFile,
        deletedDesktopBannerImage,
        deletedMobileBannerImage,
      } = sanitizeAndValidateInput(params);

      if (!subCategoryId || !title) {
        return reject(new Error('Subcategory ID and title are required'));
      }

      const subCategoryData = await fetchWrapperService.findOne(menuSubCategoriesUrl, {
        id: subCategoryId,
      });
      if (!subCategoryData) {
        return reject(new Error('Menu subcategory not found'));
      }

      const allSubCategoryData = await getAllMenuSubCategory();
      const duplicateData = allSubCategoryData?.filter(
        (x) =>
          x?.categoryId === (categoryId || subCategoryData?.categoryId) &&
          x?.title?.toLowerCase() === title?.toLowerCase() &&
          x?.id !== subCategoryId
      );
      if (duplicateData?.length) {
        return reject(new Error('Title already exists for this category'));
      }

      if (position !== null && position !== subCategoryData.position) {
        await validatePosition(categoryId || subCategoryData.categoryId, position, [subCategoryId]);
      }

      let desktopBannerImage = subCategoryData?.desktopBannerImage || null;
      if (deletedDesktopBannerImage && desktopBannerImage === deletedDesktopBannerImage) {
        desktopBannerImage = null;
      }
      let mobileBannerImage = subCategoryData?.mobileBannerImage || null;
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
        categoryId: categoryId || subCategoryData?.categoryId,
        position: position !== null ? position : subCategoryData.position,
        desktopBannerImage: desktopBannerUrl || desktopBannerImage,
        mobileBannerImage: mobileBannerUrl || mobileBannerImage,
      };

      const updatePattern = {
        url: `${menuSubCategoriesUrl}/${subCategoryId}`,
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

const deleteMenuSubCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { subCategoryId } = sanitizeObject(params);
      if (!subCategoryId) {
        return reject(new Error('Invalid ID'));
      }

      const subCategoryData = await fetchWrapperService.findOne(menuSubCategoriesUrl, {
        id: subCategoryId,
      });
      if (!subCategoryData) {
        return reject(new Error('Menu subcategory not found'));
      }

      const productTypeData = await getAllProductTypesBySubCategoryId(subCategoryId);
      if (productTypeData?.length) {
        return reject(new Error('Menu subcategory cannot be deleted because it has product types'));
      }

      await fetchWrapperService._delete(`${menuSubCategoriesUrl}/${subCategoryId}`);

      await deleteFiles([subCategoryData.desktopBannerImage, subCategoryData.mobileBannerImage]);

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductTypesBySubCategoryId = (subCategoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: productTypeUrl,
        key: 'subCategoryId',
        value: subCategoryId,
      };
      const productTypeData = await fetchWrapperService.find(findPattern);
      resolve(productTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

const updateMenuSubCategoryPosition = (positions) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!Array.isArray(positions) || !positions.length) {
        return reject(new Error('Invalid positions data'));
      }

      // Validate that all subcategories belong to the same category
      const allSubCategories = await getAllMenuSubCategory();
      const categoryIds = new Set(
        positions.map((pos) => {
          const subCategory = allSubCategories.find((sub) => sub.id === pos.subCategoryId);
          return subCategory?.categoryId;
        })
      );
      if (categoryIds.size !== 1) {
        return reject(new Error('All subcategories must belong to the same category'));
      }

      const categoryId = [...categoryIds][0];
      if (!categoryId) {
        return reject(new Error('Category ID not found for subcategories'));
      }

      // Validate positions
      const positionSet = new Set();
      const subCategoryIds = positions.map((pos) => pos.subCategoryId);
      for (const { subCategoryId, position } of positions) {
        if (!subCategoryId || !position) {
          return reject(new Error('Invalid subcategory ID or position'));
        }
        const subCategoryData = allSubCategories.find((sub) => sub.id === subCategoryId);
        if (!subCategoryData) {
          return reject(new Error(`Subcategory ${subCategoryId} not found`));
        }
        if (positionSet.has(position)) {
          return reject(new Error(`Duplicate position ${position} in update`));
        }
        positionSet.add(position);
        // Validate position, excluding all subcategories in this update batch
        await validatePosition(categoryId, position, subCategoryIds);
      }

      // Update positions
      const updatePromises = positions.map(({ subCategoryId, position }) => {
        const payload = { position };
        const updatePattern = {
          url: `${menuSubCategoriesUrl}/${subCategoryId}`,
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

export const menuSubCategoryService = {
  getAllMenuSubCategory,
  insertMenuSubCategory,
  updateMenuSubCategory,
  deleteMenuSubCategory,
  updateMenuSubCategoryPosition,
};
