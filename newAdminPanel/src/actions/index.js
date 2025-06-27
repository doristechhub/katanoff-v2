import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export const toastError = (e) => toast.error(e.message || 'something went wrong');

// ----------------------------------------------------------------------

export * from './menuActions';
export * from './userActions';
export * from './brandActions';
export * from './productActions';
export * from './reviewsActions';
export * from './collectionActions';
export * from './settingStyleActions';
export * from './diamondShapeActions';
export * from './productTypeActions';
export * from './appointmentActions';
export * from './subscribersActions';
export * from './customJewelryActions';
export * from './showCaseBannerActions';
export * from './menuSubCategoryActions';
export * from './customizationTypeActions';
export * from './customizationSubTypeActions';
export * from './discountActions';
