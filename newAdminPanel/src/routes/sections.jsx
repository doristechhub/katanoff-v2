import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import ProtectedRoutes from 'src/guard/ProtectedRoutes';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const Review = lazy(() => import('src/pages/review'));
export const Orders = lazy(() => import('src/pages/orders'));
export const Returns = lazy(() => import('src/pages/returns'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const MenuPage = lazy(() => import('src/pages/menu/menu'));
export const Collection = lazy(() => import('src/pages/collection'));
export const AddCollectionPage = lazy(() => import('src/pages/collection/add'));
export const SettingStyle = lazy(() => import('src/pages/setting-style'));
export const DiamondShape = lazy(() => import('src/pages/diamond-shape'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const Permissions = lazy(() => import('src/pages/permissions'));
export const Refund = lazy(() => import('src/sections/orders/refund'));
export const Subscribers = lazy(() => import('src/pages/subscribers'));
export const SliderViewAddPage = lazy(() => import('src/pages/brands'));
export const OrdersDetail = lazy(() => import('src/pages/order-detail'));
export const ReturnRequest = lazy(() => import('src/pages/return-request'));
export const Unauthorized = lazy(() => import('src/pages/unauthorized'));
export const Appointments = lazy(() => import('src/pages/appointments'));
export const ReturnDetail = lazy(() => import('src/pages/return-detail'));
export const Customization = lazy(() => import('src/pages/customization'));
export const CustomJewelry = lazy(() => import('src/pages/custom-jewelry'));
export const OrderList = lazy(() => import('src/sections/orders/orderlist'));
export const ReportAnalysis = lazy(() => import('src/pages/report-analysis'));
export const ProductsPage = lazy(() => import('src/pages/products/products'));
export const AddProductPage = lazy(() => import('src/pages/products/add'));
export const DiscountsPage = lazy(() => import('src/pages/discounts/list'));
export const AddDiscountPage = lazy(() => import('src/pages/discounts/add'));
export const ForgetPassword = lazy(() => import('src/pages/forget-password'));
export const ShowCaseBanner = lazy(() => import('src/pages/showcase-banner'));
export const Contacts = lazy(() => import('src/pages/contacts'));
export const ReturnList = lazy(() => import('src/sections/returns/returns-list'));
export const ReturnRefund = lazy(() => import('src/sections/returns/return-refund'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            <ProtectedRoutes pageId={'dashboard'}>
              <IndexPage />
            </ProtectedRoutes>
          ),
          index: true,
        },

        {
          path: 'product',
          element: (
            <ProtectedRoutes pageId={'product'}>
              <ProductsPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/product/add',
          element: (
            <ProtectedRoutes pageId={'product'}>
              <AddProductPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/brand',
          element: (
            <ProtectedRoutes pageId={'slider'}>
              <SliderViewAddPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/menu',
          element: (
            <ProtectedRoutes pageId={'menu'}>
              <MenuPage />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: '/menu/category',
              element: (
                <ProtectedRoutes pageId={'menu'}>
                  <MenuPage />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/menu/subcategory',
              element: (
                <ProtectedRoutes pageId={'menu'}>
                  <MenuPage />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/menu/productType',
              element: (
                <ProtectedRoutes pageId={'menu'}>
                  <MenuPage />
                </ProtectedRoutes>
              ),
            },
          ],
        },
        {
          path: '/collection',
          element: (
            <ProtectedRoutes pageId={'collection'}>
              <Collection />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/collection/add',
          element: (
            <ProtectedRoutes pageId={'collection'}>
              <AddCollectionPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/settingStyle',
          element: (
            <ProtectedRoutes pageId={'settingStyle'}>
              <SettingStyle />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/diamondShape',
          element: (
            <ProtectedRoutes pageId={'diamondShape'}>
              <DiamondShape />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/customization',
          element: (
            <ProtectedRoutes pageId={'customization'}>
              <Customization />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: '/customization/type',
              element: (
                <ProtectedRoutes pageId={'customization'}>
                  <Customization />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/customization/subtype',
              element: (
                <ProtectedRoutes pageId={'customization'}>
                  <Customization />
                </ProtectedRoutes>
              ),
            },
          ],
        },
        {
          path: '/discounts',
          element: (
            <ProtectedRoutes pageId={'discounts'}>
              <DiscountsPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/discounts/add',
          element: (
            <ProtectedRoutes pageId={'discounts'}>
              <AddDiscountPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/showcase-banner',
          element: (
            <ProtectedRoutes pageId={'showcasebanner'}>
              <ShowCaseBanner />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/appointment',
          element: (
            <ProtectedRoutes pageId={'appointments'}>
              <Appointments />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/custom-jewelry',
          element: (
            <ProtectedRoutes pageId={'customJewelry'}>
              <CustomJewelry />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/review',
          element: (
            <ProtectedRoutes pageId={'review'}>
              <Review />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'user',
          element: (
            <ProtectedRoutes pageId={'users'}>
              <UserPage />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'subscribers',
          element: (
            <ProtectedRoutes pageId={'subscribers'}>
              <Subscribers />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'contacts',
          element: (
            <ProtectedRoutes pageId={'contacts'}>
              <Contacts />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'permissions',
          element: (
            <ProtectedRoutes pageId={'permissions'}>
              <Permissions />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'orders',
          element: (
            <ProtectedRoutes pageId={'orders'}>
              <Orders />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: '/orders/list',
              element: (
                <ProtectedRoutes pageId={'orders'}>
                  <OrderList />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/orders/refund',
              element: (
                <ProtectedRoutes pageId={'orders'}>
                  <Refund />
                </ProtectedRoutes>
              ),
            },
          ],
        },
        {
          path: '/orders/order-detail/:orderId',
          element: (
            <ProtectedRoutes pageId={'orders'}>
              <OrdersDetail />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/orders/return-request/:orderId',
          element: (
            <ProtectedRoutes pageId={'orders'}>
              <ReturnRequest />
            </ProtectedRoutes>
          ),
        },
        {
          path: 'returns',
          element: (
            <ProtectedRoutes pageId={'returns'}>
              <Returns />
            </ProtectedRoutes>
          ),
          children: [
            {
              path: '/returns/list',
              element: (
                <ProtectedRoutes pageId={'returns'}>
                  <ReturnList />
                </ProtectedRoutes>
              ),
            },
            {
              path: '/returns/refund',
              element: (
                <ProtectedRoutes pageId={'returns'}>
                  <ReturnRefund />
                </ProtectedRoutes>
              ),
            },
          ],
        },
        {
          path: '/returns/return-detail/:returnId',
          element: (
            <ProtectedRoutes pageId={'returns'}>
              <ReturnDetail />
            </ProtectedRoutes>
          ),
        },
        {
          path: '/report-analysis',
          element: (
            <ProtectedRoutes pageId={'report & analysis'}>
              <ReportAnalysis />
            </ProtectedRoutes>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'forget-password',
      element: <ForgetPassword />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
