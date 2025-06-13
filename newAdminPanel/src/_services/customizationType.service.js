import { uid } from 'uid';
import {
  customizationSubTypeUrl,
  customizationTypeUrl,
  fetchWrapperService,
  sanitizeObject,
} from '../_helpers';
import { customizationSubTypeService } from './customizationSubType.service';
import {
  GOLD_TYPE,
  GOLD_COLOR,
  GOLD_TYPE_SUB_TYPES_LIST,
  GOLD_COLOR_SUB_TYPES_LIST,
} from 'src/_helpers/constants';

const getAllCustomizationTypes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(customizationTypeUrl);
      const customizationTypesData = respData ? Object.values(respData) : [];
      resolve(customizationTypesData);
    } catch (e) {
      reject(e);
    }
  });
};

const insertCustomizationType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { title } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (title && uuid) {
        const customizationTypesData = await fetchWrapperService.findOne(customizationTypeUrl, {
          title: title,
        });
        if (!customizationTypesData) {
          const insertPattern = {
            id: uuid,
            title: title,
            createdDate: Date.now(),
          };
          const createPattern = {
            url: `${customizationTypeUrl}/${uuid}`,
            insertPattern: insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              resolve(true);
            })
            .catch((e) => {
              reject(new Error('An error occurred during customizationType creation.'));
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

const updateCustomizationType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { customizationTypeId, title } = sanitizeObject(params);
      title = title ? title.trim() : null;
      if (customizationTypeId && title) {
        const customizationTypeData = await fetchWrapperService.findOne(customizationTypeUrl, {
          id: customizationTypeId,
        });
        if (customizationTypeData) {
          const findPattern = {
            id: customizationTypeId,
            key: 'title',
            value: title,
          };

          const duplicateData = await fetchWrapperService.findOneWithNotEqual(
            customizationTypeUrl,
            findPattern
          );
          if (!duplicateData.length) {
            const payload = {
              title: title,
            };
            const updatePattern = {
              url: `${customizationTypeUrl}/${customizationTypeId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error('An error occurred during update customizationType.'));
              });
          } else {
            reject(new Error('title already exists'));
          }
        } else {
          reject(new Error('customization Type not found!'));
        }
      } else {
        reject(new Error('Invalid Data'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCustomizationType = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { customizationTypeId } = sanitizeObject(params);
      if (customizationTypeId) {
        const customizationTypeData = await fetchWrapperService.findOne(customizationTypeUrl, {
          id: customizationTypeId,
        });
        if (customizationTypeData) {
          const customizationSubTypeData =
            await getAllCustomizationSubTypeByCustomizationId(customizationTypeId);
          if (!customizationSubTypeData?.length) {
            await fetchWrapperService._delete(`${customizationTypeUrl}/${customizationTypeId}`);
            resolve(true);
          } else {
            reject(new Error('Customization type can not delete Because it has child category'));
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

const getAllCustomizationSubTypeByCustomizationId = (customizationTypeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: customizationSubTypeUrl,
        key: 'customizationTypeId',
        value: customizationTypeId,
      };
      const customizationsSubTypeData = await fetchWrapperService.find(findPattern);
      resolve(customizationsSubTypeData);
    } catch (e) {
      reject(e);
    }
  });
};

const checkAndInsertCustomizationType = async (customizationType) => {
  const existingType = await fetchWrapperService.findOne(customizationTypeUrl, {
    title: customizationType.title,
  });
  if (!existingType) {
    await customizationTypeService.insertCustomizationType(customizationType);
  }
};

// const checkAndInsertCustomizationSubTypes = async (subTypes, customizationTypeId) => {
//   await Promise.all(
//     subTypes.map(async (subType) => {
//       const existingSubType = await fetchWrapperService.findOne(customizationSubTypeUrl, {
//         title: subType.title,
//       });
//       if (!existingSubType) {
//         await customizationSubTypeService.insertCustomizationSubType({
//           ...subType,
//           customizationTypeId,
//         });
//       }
//     })
//   );
// };

const checkAndInsertCustomizationSubTypes = async (subTypes, customizationTypeId) => {
  const insertedSubTypes = await Promise.all(
    subTypes.map(async (subType) => {
      const existingSubType = await fetchWrapperService.findOne(customizationSubTypeUrl, {
        title: subType.title,
      });

      if (!existingSubType) {
        const insertedSubType = await customizationSubTypeService.insertCustomizationSubType({
          ...subType,
          customizationTypeId,
        });
        return insertedSubType; // Collect inserted subType
      }
      return null; // Return null for existing ones
    })
  );

  return insertedSubTypes.filter(Boolean); // Remove null values
};

const createCommonCustomizations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const customizationsTypes = [GOLD_TYPE, GOLD_COLOR];
      await Promise.all(customizationsTypes.map((type) => checkAndInsertCustomizationType(type)));

      const foundedGoldType = await fetchWrapperService.findOne(customizationTypeUrl, GOLD_TYPE);
      const foundedGoldColor = await fetchWrapperService.findOne(customizationTypeUrl, GOLD_COLOR);

      await Promise.all([
        checkAndInsertCustomizationSubTypes(GOLD_TYPE_SUB_TYPES_LIST, foundedGoldType.id),
        checkAndInsertCustomizationSubTypes(GOLD_COLOR_SUB_TYPES_LIST, foundedGoldColor.id),
      ]);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

export const customizationTypeService = {
  getAllCustomizationTypes,
  insertCustomizationType,
  updateCustomizationType,
  deleteCustomizationType,
  createCommonCustomizations,
  checkAndInsertCustomizationSubTypes,
};
