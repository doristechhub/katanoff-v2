import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import NoData from 'src/components/no-data';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { getDashboardData } from 'src/_services';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';

// ----------------------------------------------------------------------

export default function AppView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashLoader, dashboardDetail } = useSelector(({ dashboard }) => dashboard);

  useEffect(() => {
    dispatch(getDashboardData());
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      {dashLoader ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : Object.keys(dashboardDetail)?.length ? (
        <>
          <Grid container spacing={3} mb={2}>
            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                color="info"
                title="Users"
                onClick={() => navigate('/user')}
                total={dashboardDetail?.userCount || 0}
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                title="Orders"
                color="warning"
                onClick={() => navigate('/orders')}
                total={dashboardDetail?.orderCount || 0}
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                color="error"
                title="Products"
                onClick={() => navigate('/product')}
                total={dashboardDetail?.productCount || 0}
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                color="warning"
                title="Collections"
                onClick={() => navigate('/collection')}
                total={dashboardDetail?.collectionCount || 0}
                icon={
                  <Iconify
                    width={50}
                    color="#006097"
                    icon="material-symbols:collections-bookmark-rounded"
                  />
                }
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                color="warning"
                title="Custom Design Request"
                onClick={() => navigate('/custom-jewelry')}
                total={dashboardDetail?.customJewelryCount || 0}
                icon={<Iconify icon="simple-icons:customink" color="#82589F" width={50} />}
              />
            </Grid>
            <Grid xs={12} sm={6} md={4} xl={3}>
              <AppWidgetSummary
                color="warning"
                title="Discounts"
                onClick={() => navigate('/discounts')}
                total={dashboardDetail?.discountsCount || 0}
                icon={<Iconify width={80} color="#FF6B6B" icon="iconamoon:discount" />}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid xs={12} md={6} xl={4}>
              <AppTrafficBySite
                title="Order Status"
                navigate={() => navigate('/orders')}
                list={[
                  {
                    name: 'Pending',
                    icon: (
                      <Iconify
                        width={32}
                        color="#f1c40f"
                        className="mx-auto"
                        icon="ic:twotone-pending-actions"
                      />
                    ),
                    value: dashboardDetail?.pendingOrderCount || 0,
                  },
                  {
                    name: 'Confirmed',
                    icon: (
                      <Iconify
                        width={32}
                        color="#27ae60"
                        className="mx-auto"
                        icon="icon-park-solid:success"
                      />
                    ),
                    value: dashboardDetail?.confirmedOrderCount || 0,
                  },
                  {
                    name: 'Shipped',
                    icon: (
                      <Iconify
                        width={32}
                        color="#006097"
                        className="mx-auto"
                        icon="flat-color-icons:shipped"
                      />
                    ),
                    value: dashboardDetail?.shippedOrderCount || 0,
                  },
                  {
                    name: 'Delivered',
                    icon: (
                      <Iconify
                        width={32}
                        color="#1C9CEA" //#1C9CEA
                        className="mx-auto"
                        icon="mdi:package-delivered"
                      />
                    ),
                    value: dashboardDetail?.deliveredOrderCount || 0,
                  },
                  {
                    name: 'Cancelled',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="mdi:archive-cancel"
                      />
                    ),
                    value: dashboardDetail?.cancelledOrderCount || 0,
                  },
                ]}
              />
            </Grid>
            <Grid xs={12} md={6} xl={4}>
              <AppTrafficBySite
                title="Order Refund Status"
                navigate={() => navigate('/orders')}
                list={[
                  {
                    name: 'Pending',
                    icon: (
                      <Iconify
                        width={32}
                        color="#f1c40f"
                        className="mx-auto"
                        icon="ic:twotone-pending-actions"
                      />
                    ),
                    value: dashboardDetail?.orderPendingRefundCount || 0,
                  },
                  {
                    name: 'Failed',
                    icon: (
                      <Iconify
                        width={32}
                        color="secondary.main"
                        className="mx-auto"
                        icon="mingcute:alert-fill"
                      />
                    ),
                    value: dashboardDetail?.orderFailedRefundCount || 0,
                  },
                  {
                    name: 'Initialization Failed',
                    icon: (
                      <Iconify
                        width={32}
                        color="#006097"
                        className="mx-auto"
                        icon="fluent-emoji:dollar-banknote"
                      />
                    ),
                    value: dashboardDetail?.orderRefundInitializationFailedCount || 0,
                  },
                  {
                    name: 'Refunded',
                    icon: (
                      <Iconify
                        width={32}
                        color="#1C9CEA" //#1C9CEA
                        className="mx-auto"
                        icon="ri:refund-fill"
                      />
                    ),
                    value: dashboardDetail?.orderRefundedCount || 0,
                  },
                  {
                    name: 'Cancelled',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="mdi:archive-cancel"
                      />
                    ),
                    value: dashboardDetail?.orderCancelledRefundCount || 0,
                  },
                ]}
              />
            </Grid>
            <Grid xs={12} md={6} xl={4}>
              <AppTrafficBySite
                title="Return Status"
                navigate={() => navigate('/orders')}
                list={[
                  {
                    name: 'Pending',
                    icon: (
                      <Iconify
                        width={32}
                        color="#f1c40f"
                        className="mx-auto"
                        icon="ic:twotone-pending-actions"
                      />
                    ),
                    value: dashboardDetail?.pendingReturnCount || 0,
                  },
                  {
                    name: 'Approved',
                    icon: (
                      <Iconify
                        width={32}
                        color="#27ae60"
                        className="mx-auto"
                        icon="icon-park-solid:success"
                      />
                    ),
                    value: dashboardDetail?.approvedReturnCount || 0,
                  },
                  {
                    name: 'Rejected',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="fluent:text-change-reject-24-filled"
                      />
                    ),
                    value: dashboardDetail?.rejectedReturnCount || 0,
                  },
                  {
                    name: 'Received',
                    icon: (
                      <Iconify
                        width={32}
                        color="#1C9CEA"
                        className="mx-auto"
                        icon="icon-park-twotone:receive"
                      />
                    ),
                    value: dashboardDetail?.receivedReturnCount || 0,
                  },
                  {
                    name: 'Cancelled',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="mdi:archive-cancel"
                      />
                    ),
                    value: dashboardDetail?.cancelledReturnCount || 0,
                  },
                ]}
              />
            </Grid>
            <Grid xs={12} md={6} xl={4}>
              <AppTrafficBySite
                title="Return Refund Status"
                navigate={() => navigate('/orders')}
                list={[
                  {
                    name: 'Pending',
                    icon: (
                      <Iconify
                        width={32}
                        color="#f1c40f"
                        className="mx-auto"
                        icon="ic:twotone-pending-actions"
                      />
                    ),
                    value: dashboardDetail?.returnPendingRefundCount || 0,
                  },
                  {
                    name: 'Failed',
                    icon: (
                      <Iconify
                        width={32}
                        color="secondary.main"
                        className="mx-auto"
                        icon="mingcute:alert-fill"
                      />
                    ),
                    value: dashboardDetail?.returnFailedRefundCount || 0,
                  },
                  {
                    name: 'Cancelled',
                    icon: (
                      <Iconify
                        width={32}
                        color="pink.main"
                        // color="#006097"
                        className="mx-auto"
                        icon="fluent:calendar-cancel-16-filled"
                      />
                    ),
                    value: dashboardDetail?.returnCancelledRefundCount || 0,
                  },
                  {
                    name: 'Initialization Failed',
                    icon: (
                      <Iconify
                        width={32}
                        color="#1C9CEA" //#1C9CEA
                        className="mx-auto"
                        icon="fluent-emoji:dollar-banknote"
                      />
                    ),
                    value: dashboardDetail?.returnRefundInitializationFailedCount || 0,
                  },
                  {
                    name: 'Refund',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="mingcute:receive-money-fill"
                      />
                    ),
                    value: dashboardDetail?.returnRefundedCount || 0,
                  },
                ]}
              />
            </Grid>
            <Grid xs={12} md={6} xl={4}>
              <AppTrafficBySite
                title="Appointment"
                navigate={() => navigate('/appointment')}
                list={[
                  {
                    name: 'Pending',
                    icon: (
                      <Iconify
                        width={32}
                        color="#f1c40f"
                        className="mx-auto"
                        icon="ic:twotone-pending-actions"
                      />
                    ),
                    value: dashboardDetail?.pendingApptCount || 0,
                  },
                  {
                    name: 'Approved',
                    icon: (
                      <Iconify
                        width={32}
                        color="#27ae60"
                        className="mx-auto"
                        icon="icon-park-solid:success"
                      />
                    ),
                    value: dashboardDetail?.approvedApptCount || 0,
                  },
                  {
                    name: 'Rejected',
                    icon: (
                      <Iconify
                        width={32}
                        color="#e74c3c"
                        className="mx-auto"
                        icon="fluent:text-change-reject-24-filled"
                      />
                    ),
                    value: dashboardDetail?.rejectedApptCount || 0,
                  },
                ]}
              />
            </Grid>
          </Grid>
        </>
      ) : null}
      {!dashLoader && !Object.keys(dashboardDetail)?.length ? <NoData>No Data</NoData> : null}
    </Container>
  );
}
