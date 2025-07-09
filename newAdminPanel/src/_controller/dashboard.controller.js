import {
  appointmentsUrl,
  customizationSubTypeUrl,
  discountsUrl,
  fetchWrapperService,
  menuSubCategoriesUrl,
  productTypeUrl,
  userUrl,
} from '../_helpers';
import { returnService } from '../_services';
import { brandSliderService } from '../_services/brandSlider.service';
import { collectionService } from '../_services/collection.service';
import { customizationTypeService } from '../_services/customizationType.service';
import { menuCategoryService } from '../_services/menuCategory.service';
import { orderService } from '../_services/order.service';
import { productService } from '../_services/product.service';
import { productSliderService } from '../_services/productSlider.service';
import { showCaseBannerService } from '../_services/showCaseBanner.service';

const getAllDashboardCount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const cmsData = await fetchWrapperService.getAll(cmsUrl);
      const productData = await productService.getAllActiveProducts();
      const orderData = await orderService.getAllOrderList();
      const returnData = await returnService.getAllReturnsList();
      const usersData = await fetchWrapperService.getAll(userUrl);
      const menuCategoryData = await menuCategoryService.getAllMenuCategory();
      const subCategoryData = await fetchWrapperService.getAll(menuSubCategoriesUrl);
      const productTypeData = await fetchWrapperService.getAll(productTypeUrl);
      const discountsData = await fetchWrapperService.getAll(discountsUrl);
      const customizationTypeData = await customizationTypeService.getAllCustomizationTypes();
      const customizationSubTypeData = await fetchWrapperService.getAll(customizationSubTypeUrl);
      const collectionData = await collectionService.getAllCollection();
      const showCaseBannerData = await showCaseBannerService.getAllShowCaseBanner();
      const productSliderData = await productSliderService.getAllProductSlider();
      const brandSliderData = await brandSliderService.getAllBrandSlider();
      const apptRespData = await fetchWrapperService.getAll(appointmentsUrl);
      const customJewelryRespData = await fetchWrapperService.getAll(appointmentsUrl);
      const appointmentData = apptRespData ? Object.values(apptRespData) : [];
      const customJewelryCount = customJewelryRespData
        ? Object.values(customJewelryRespData).length
        : 0;

      const productCount = productData.length;
      const orderCount = orderData.length;

      let pendingOrderCount = 0;
      let confirmedOrderCount = 0;
      let shippedOrderCount = 0;
      let deliveredOrderCount = 0;
      let cancelledOrderCount = 0;
      let orderPendingRefundCount = 0;
      let orderFailedRefundCount = 0;
      let orderCancelledRefundCount = 0;
      let orderRefundInitializationFailedCount = 0;
      let orderRefundedCount = 0;

      orderData.forEach((order) => {
        switch (order.orderStatus) {
          case 'pending':
            pendingOrderCount++;
            break;
          case 'confirmed':
            confirmedOrderCount++;
            break;
          case 'shipped':
            shippedOrderCount++;
            break;
          case 'delivered':
            deliveredOrderCount++;
            break;
          case 'cancelled':
            cancelledOrderCount++;
            break;
          default:
            break;
        }

        switch (order.paymentStatus) {
          case 'pending_refund':
            orderPendingRefundCount++;
            break;
          case 'failed_refund':
            orderFailedRefundCount++;
            break;
          case 'cancelled_refund':
            orderCancelledRefundCount++;
            break;
          case 'refund_initialization_failed':
            orderRefundInitializationFailedCount++;
            break;
          case 'refunded':
            orderRefundedCount++;
            break;
          default:
            break;
        }
      });

      let pendingReturnCount = 0;
      let cancelledReturnCount = 0;
      let approvedReturnCount = 0;
      let rejectedReturnCount = 0;
      let receivedReturnCount = 0;

      let returnPendingRefundCount = 0;
      let returnFailedRefundCount = 0;
      let returnCancelledRefundCount = 0;
      let returnRefundInitializationFailedCount = 0;
      let returnRefundedCount = 0;

      returnData.forEach((returnItem) => {
        switch (returnItem.status) {
          case 'pending':
            pendingReturnCount++;
            break;
          case 'cancelled':
            cancelledReturnCount++;
            break;
          case 'approved':
            approvedReturnCount++;
            break;
          case 'rejected':
            rejectedReturnCount++;
            break;
          case 'received':
            receivedReturnCount++;
            break;
          default:
            break;
        }

        switch (returnItem.returnPaymentStatus) {
          case 'pending_refund':
            returnPendingRefundCount++;
            break;
          case 'failed_refund':
            returnFailedRefundCount++;
            break;
          case 'cancelled_refund':
            returnCancelledRefundCount++;
            break;
          case 'refund_initialization_failed':
            returnRefundInitializationFailedCount++;
            break;
          case 'refunded':
            returnRefundedCount++;
            break;
          default:
            break;
        }
      });

      let pendingApptCount = 0;
      let approvedApptCount = 0;
      let rejectedApptCount = 0;

      appointmentData.forEach((apptItem) => {
        switch (apptItem.appointmentStatus) {
          case 'pending':
            pendingApptCount++;
            break;
          case 'approved':
            approvedApptCount++;
            break;
          case 'rejected':
            rejectedApptCount++;
            break;
          default:
            break;
        }
      });

      const userCount = usersData ? Object.values(usersData).length : 0;
      const menuCategoryCount = menuCategoryData.length;
      const subCategoryCount = subCategoryData ? Object.values(subCategoryData).length : 0;
      const discountsCount = discountsData ? Object.values(discountsData).length : 0;
      const productTypeCount = productTypeData ? Object.values(productTypeData).length : 0;
      const customizationTypeCount = customizationTypeData.length;
      const customizationSubTypeCount = customizationSubTypeData
        ? Object.values(customizationSubTypeData).length
        : 0;

      const collectionCount = collectionData.length;
      const showCaseBannerCount = showCaseBannerData.length;
      const productSliderCount = productSliderData.length;
      const brandSliderCount = brandSliderData.length;
      const countData = {
        productCount,
        orderCount,
        pendingOrderCount,
        confirmedOrderCount,
        shippedOrderCount,
        deliveredOrderCount,
        cancelledOrderCount,
        userCount,
        menuCategoryCount,
        subCategoryCount,
        productTypeCount,
        customizationTypeCount,
        customizationSubTypeCount,
        collectionCount,
        showCaseBannerCount,
        productSliderCount,
        brandSliderCount,
        pendingApptCount,
        approvedApptCount,
        rejectedApptCount,
        customJewelryCount,
        discountsCount,

        orderPendingRefundCount,
        orderFailedRefundCount,
        orderCancelledRefundCount,
        orderRefundInitializationFailedCount,
        orderRefundedCount,

        pendingReturnCount,
        cancelledReturnCount,
        approvedReturnCount,
        rejectedReturnCount,
        receivedReturnCount,

        returnPendingRefundCount,
        returnFailedRefundCount,
        returnCancelledRefundCount,
        returnRefundInitializationFailedCount,
        returnRefundedCount,
      };
      resolve(countData);
    } catch (e) {
      reject(e);
    }
  });
};

export const dashboardController = {
  getAllDashboardCount,
};
