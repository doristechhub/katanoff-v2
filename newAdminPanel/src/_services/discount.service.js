import { uid } from 'uid';
import moment from 'moment';
import { fetchWrapperService, sanitizeObject, discountsUrl } from '../_helpers';
import {
  DATE_FORMAT,
  APPLICATION_METHODS,
  DISCOUNT_DETAILS_TYPES,
  DISCOUNT_TYPES,
  ELIGIBILITY_TYPES,
  PURCHASE_TYPES,
} from 'src/_helpers/constants';
import axios from 'axios';

const getAllDiscounts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(discountsUrl);
      const discountData = respData ? Object.values(respData) : [];
      resolve(discountData);
    } catch (e) {
      reject(e);
    }
  });
};

const getSingleDiscount = (discountId) => {
  return new Promise(async (resolve, reject) => {
    try {
      discountId = sanitizeObject({ discountId }).discountId?.trim() || null;

      if (discountId) {
        const discountData = await fetchWrapperService.findOne(discountsUrl, {
          id: discountId,
        });
        if (discountData) {
          resolve(discountData);
        } else {
          reject(new Error('Discount does not exist'));
        }
      } else {
        reject(new Error('Invalid Id'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const sanitizeAndValidateInput = (params) => {
  const sanitized = sanitizeObject(params);
  sanitized.name = sanitized.name?.trim() || null;
  sanitized.promoCode = sanitized.promoCode?.trim() || null;
  sanitized.discountType = sanitized.discountType?.trim() || 'Order Discount';
  sanitized.applicationMethod = sanitized.applicationMethod?.trim() || 'Code';
  sanitized.purchaseMode = sanitized.purchaseMode?.trim() || 'One-Time';
  sanitized.customerEligibility = sanitized.customerEligibility?.trim() || 'Everyone';
  sanitized.minimumOrderValue = Number(sanitized.minimumOrderValue) || 0;
  sanitized.discountDetails = {
    type: sanitized.discountDetails?.type?.trim() || 'Percentage',
    amount: Number(sanitized.discountDetails?.amount) || 0,
  };
  sanitized.dateRange = {
    beginsAt: sanitized.dateRange?.beginsAt?.trim() || null,
    expiresAt: sanitized.dateRange?.expiresAt?.trim() || null,
  };
  return sanitized;
};

const validateDiscountInput = (params) => {
  const {
    name,
    discountType,
    applicationMethod,
    promoCode,
    discountDetails,
    dateRange,
    purchaseMode,
    customerEligibility,
    minimumOrderValue,
  } = params;

  if (!name) throw new Error('Discount name is required');
  if (!discountType || !DISCOUNT_TYPES?.map((x) => x?.value)?.includes(discountType)) {
    throw new Error('Invalid discount type');
  }
  if (
    !applicationMethod ||
    !APPLICATION_METHODS?.map((x) => x?.value)?.includes(applicationMethod)
  ) {
    throw new Error('Invalid application method');
  }
  if (applicationMethod === 'Code' && !promoCode) {
    throw new Error('Promo code is required for code-based discounts');
  }
  if (
    !discountDetails?.type ||
    !DISCOUNT_DETAILS_TYPES?.map((x) => x?.value)?.includes(discountDetails.type)
  ) {
    throw new Error('Invalid discount details type');
  }
  if (discountDetails.amount <= 0) {
    throw new Error('Discount amount must be greater than 0');
  }
  if (discountDetails.type === 'Percentage' && discountDetails.amount > 100) {
    throw new Error('Percentage discount cannot exceed 100%');
  }
  if (!dateRange?.beginsAt) {
    throw new Error('Discount start date is required');
  }

  // Validate date format
  if (!moment(dateRange.beginsAt, DATE_FORMAT, true).isValid()) {
    throw new Error(`Start date must be in format ${DATE_FORMAT}`);
  }
  const beginsAtMoment = moment(dateRange.beginsAt, DATE_FORMAT);

  if (dateRange.expiresAt) {
    if (!moment(dateRange.expiresAt, DATE_FORMAT, true).isValid()) {
      throw new Error(`Expiry date must be in format ${DATE_FORMAT}`);
    }
    const expiresAtMoment = moment(dateRange.expiresAt, DATE_FORMAT);
    if (expiresAtMoment.isBefore(beginsAtMoment)) {
      throw new Error('Expiry date and time must be the same as or after start date and time');
    }
  }

  if (!purchaseMode || !PURCHASE_TYPES?.map((x) => x?.value)?.includes(purchaseMode)) {
    throw new Error('Invalid purchase mode');
  }
  if (
    !customerEligibility ||
    !ELIGIBILITY_TYPES?.map((x) => x?.value)?.includes(customerEligibility)
  ) {
    throw new Error('Invalid customer eligibility');
  }
  if (minimumOrderValue < 0) {
    throw new Error('Minimum order value cannot be negative');
  }
};

const insertDiscount = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      const sanitizedParams = sanitizeAndValidateInput(params);
      validateDiscountInput(sanitizedParams);

      const { name, promoCode } = sanitizedParams;
      const discountList = await getAllDiscounts();

      if (discountList.find((d) => d.name?.toLowerCase() === name?.toLowerCase())) {
        return reject(new Error('Discount name already exists'));
      }
      if (
        promoCode &&
        discountList.find((d) => d.promoCode?.toLowerCase() === promoCode?.toLowerCase())
      ) {
        return reject(new Error('Promo code already exists'));
      }

      const insertPattern = {
        id: uuid,
        createdDate: new Date(),
        name,
        discountType: sanitizedParams.discountType,
        applicationMethod: sanitizedParams.applicationMethod,
        promoCode: sanitizedParams.applicationMethod === 'Code' ? promoCode : null,
        discountDetails: sanitizedParams.discountDetails,
        purchaseMode: sanitizedParams.purchaseMode,
        customerEligibility: sanitizedParams.customerEligibility,
        minimumOrderValue: sanitizedParams.minimumOrderValue,
        dateRange: sanitizedParams.dateRange,
      };

      const createPattern = {
        url: `${discountsUrl}/${uuid}`,
        insertPattern,
      };

      await fetchWrapperService.create(createPattern);
      axios.post('/discounts/notify-users', sanitizeObject(insertPattern));
      resolve(insertPattern);
    } catch (e) {
      reject(e);
    }
  });
};

const updateDiscount = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sanitizedParams = sanitizeAndValidateInput(params);
      const { discountId, name, promoCode } = sanitizedParams;

      if (!discountId) return reject(new Error('Discount ID is required'));
      validateDiscountInput(sanitizedParams);

      const discountData = await fetchWrapperService.findOne(discountsUrl, { id: discountId });
      if (!discountData) return reject(new Error('Discount not found'));

      const discountList = await getAllDiscounts();
      const duplicateName = discountList.find(
        (d) => d.name?.toLowerCase() === name?.toLowerCase() && d.id !== discountId
      );
      if (duplicateName) return reject(new Error('Discount name already exists'));

      if (promoCode) {
        const duplicatePromo = discountList.find(
          (d) => d.promoCode?.toLowerCase() === promoCode?.toLowerCase() && d.id !== discountId
        );
        if (duplicatePromo) return reject(new Error('Promo code already exists'));
      }

      const payload = {
        name,
        discountType: sanitizedParams.discountType,
        applicationMethod: sanitizedParams.applicationMethod,
        promoCode: sanitizedParams.applicationMethod === 'Code' ? promoCode : null,
        discountDetails: sanitizedParams.discountDetails,
        purchaseMode: sanitizedParams.purchaseMode,
        customerEligibility: sanitizedParams.customerEligibility,
        minimumOrderValue: sanitizedParams.minimumOrderValue,
        dateRange: sanitizedParams.dateRange,
      };

      const updatePattern = {
        url: `${discountsUrl}/${discountId}`,
        payload,
      };

      await fetchWrapperService._update(updatePattern);
      resolve(payload);
    } catch (e) {
      reject(e);
    }
  });
};

const toggleDiscountStatus = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sanitizedParams = sanitizeObject(params);
      const { discountIds, action } = sanitizedParams;

      // Validate input
      if (!discountIds || !Array.isArray(discountIds) || discountIds.length === 0) {
        return reject(new Error('Discount IDs array is required and cannot be empty'));
      }
      if (!action || !['Activate', 'Deactivate'].includes(action)) {
        return reject(new Error('Action must be either Activate or Deactivate'));
      }

      // Remove duplicates and invalid IDs
      const uniqueDiscountIds = [...new Set(discountIds)].filter(
        (id) => id && typeof id === 'string' && id.trim()
      );
      if (uniqueDiscountIds.length === 0) {
        return reject(new Error('No valid discount IDs provided'));
      }

      const currentTime = moment().format(DATE_FORMAT);
      const updatedDiscounts = [];
      const errors = [];
      let changedCount = 0;

      // Process each discount
      for (const discountId of uniqueDiscountIds) {
        try {
          const discountData = await fetchWrapperService.findOne(discountsUrl, { id: discountId });
          if (!discountData) {
            errors.push(`Discount not found for ID: ${discountId}`);
            continue;
          }

          const beginsAt = discountData.dateRange.beginsAt
            ? moment(discountData.dateRange.beginsAt, DATE_FORMAT, true)
            : null;
          const expiresAt = discountData.dateRange.expiresAt
            ? moment(discountData.dateRange.expiresAt, DATE_FORMAT, true)
            : null;
          const now = moment();

          let isScheduled = beginsAt?.isValid() && now.isBefore(beginsAt);
          let isExpired = expiresAt?.isValid() && now.isSameOrAfter(expiresAt);
          let isActive = beginsAt?.isValid() && now.isSameOrAfter(beginsAt) && !isExpired;

          let newBeginsAt = discountData?.dateRange?.beginsAt;
          let newExpiresAt = discountData?.dateRange?.expiresAt || null;
          let changed = false;

          if (action === 'Activate') {
            if (isScheduled) {
              // Set beginsAt to current time for scheduled discounts
              newBeginsAt = currentTime;
              changed = true;
            }
            if (isExpired) {
              // Clear expiration for expired discounts
              newExpiresAt = null;
              changed = true;
            }
          } else if (action === 'Deactivate') {
            if (isActive) {
              // Set current time as expiration for active discounts
              newExpiresAt = currentTime;
              changed = true;
            }
          }

          const payload = {
            ...discountData,
            dateRange: {
              beginsAt: newBeginsAt,
              expiresAt: newExpiresAt,
            },
          };

          if (changed) {
            const updatePattern = {
              url: `${discountsUrl}/${discountId}`,
              payload,
            };
            await fetchWrapperService._update(updatePattern);
            changedCount++;
          }
          updatedDiscounts.push(payload);
        } catch (e) {
          errors.push(`Failed to update discount ${discountId}: ${e.message}`);
        }
      }

      const actionVerb = action === 'Activate' ? 'activated' : 'deactivated';
      if (errors.length > 0) {
        // Return partial success with errors
        resolve({
          updatedDiscounts,
          errors,
          message: `${changedCount} discount${changedCount !== 1 ? 's' : ''} ${actionVerb}, ${errors.length} error${errors.length !== 1 ? 's' : ''} occurred`,
        });
      } else if (changedCount === 0) {
        resolve({
          updatedDiscounts,
          message: `No discounts ${actionVerb}`,
        });
      } else {
        resolve({
          updatedDiscounts,
          message: `${changedCount > 1 ? changedCount : ''} Discount${changedCount !== 1 ? 's' : ''} ${actionVerb}`,
        });
      }
    } catch (e) {
      reject(new Error(`Failed to process discounts: ${e.message}`));
    }
  });
};

const deleteDiscount = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { discountId } = sanitizeObject(params);
      if (!discountId) return reject(new Error('Discount ID is required'));

      const discountData = await fetchWrapperService.findOne(discountsUrl, { id: discountId });
      if (!discountData) return reject(new Error('Discount not found'));

      await fetchWrapperService._delete(`${discountsUrl}/${discountId}`);
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};

export const discountService = {
  getAllDiscounts,
  getSingleDiscount,
  insertDiscount,
  updateDiscount,
  toggleDiscountStatus,
  deleteDiscount,
};
