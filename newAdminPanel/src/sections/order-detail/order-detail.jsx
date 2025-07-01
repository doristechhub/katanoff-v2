import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { Box, Card, Stack, Divider, Typography } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Label from 'src/components/label';
import { grey } from 'src/theme/palette';
import Dialog from 'src/components/dialog';
import NoData from 'src/components/no-data';
import Spinner from 'src/components/spinner';
import Iconify from 'src/components/iconify';
import { helperFunctions } from 'src/_helpers';
import { fCurrency } from 'src/utils/format-number';
import { Button, LoadingButton } from 'src/components/button';
import { setSelectedOrderStatus } from 'src/store/slices/ordersSlice';
import { deleteOrder, getSingleOrderById } from 'src/actions/ordersActions';

import CancelOrderDialog from '../orders/order-cancel-dialog';
import RefundOrderDialog from '../orders/refund-order-dialog';
import UpdateStatusOrderDialog from '../orders/order-update-status-dialog';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const font14 = { fontSize: '14px' };
const sxPrimaryColor = { color: 'text.primary' };
const sx = { width: '100px', color: 'text.secondary', flexShrink: 0 };

// ----------------------------------------------------------------------

const OrderDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const abortControllerRef = useRef(null);

  const [cancelDailog, setCancelDailog] = useState(false);
  const [refundDailog, setRefundDailog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false);

  const { ordersLoading, selectedOrder, orderRefundLoader, crudOrdersLoading, cancelOrderLoading } =
    useSelector(({ orders }) => orders);

  const loadData = useCallback(() => {
    dispatch(getSingleOrderById(orderId));
  }, [orderId]);

  useEffect(() => {
    loadData();
    return () => clearAbortController();
  }, [orderId]);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const handleDelete = useCallback(async () => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    const res = await dispatch(deleteOrder(orderId, abortControllerRef.current));
    if (res) {
      navigate('/orders/list');
      setDeleteConfirmationDialog(false);
    }
  }, [orderId, abortControllerRef]);

  return (
    <>
      {ordersLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        Object.keys(selectedOrder)?.length !== 0 && (
          <>
            <Container sx={{ height: '100%' }}>
              <Stack
                gap={2}
                flexWrap={'wrap'}
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Stack direction={'row'} alignItems={'center'} gap={2} flexWrap={'wrap'}>
                  <Typography variant="h4">Order #{selectedOrder?.orderNumber}</Typography>{' '}
                  <Label
                    color={helperFunctions.getStatusBg(selectedOrder?.orderStatus) || 'success'}
                  >
                    {selectedOrder?.orderStatus}
                  </Label>
                </Stack>
                <Box>
                  {selectedOrder?.paymentStatus === 'pending' ? (
                    <Button
                      color="error"
                      sx={{ mr: '10px' }}
                      variant={'outlined'}
                      disabled={crudOrdersLoading}
                      onClick={() => setDeleteConfirmationDialog(true)}
                      startIcon={<Iconify icon="mdi:archive-cancel" />}
                    >
                      Delete
                    </Button>
                  ) : null}
                  {['pending', 'confirmed'].includes(selectedOrder?.orderStatus) &&
                  selectedOrder?.paymentStatus === 'success' ? (
                    <Button
                      color="error"
                      sx={{ mr: '10px' }}
                      variant={'outlined'}
                      disabled={cancelOrderLoading}
                      onClick={() => setCancelDailog(true)}
                      startIcon={<Iconify icon="mdi:archive-cancel" />}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  {['failed_refund', 'refund_initialization_failed', 'cancelled_refund'].includes(
                    selectedOrder?.paymentStatus
                  ) && ['confirmed', 'cancelled'].includes(selectedOrder?.orderStatus) ? (
                    <Button
                      color="success"
                      sx={{ mr: '10px' }}
                      variant={'outlined'}
                      disabled={orderRefundLoader}
                      onClick={() => setRefundDailog(true)}
                      startIcon={<Iconify icon="ri:refund-2-fill" />}
                    >
                      Refund
                    </Button>
                  ) : null}
                  {['pending', 'confirmed', 'shipped', 'delivered'].includes(
                    selectedOrder?.orderStatus
                  ) && selectedOrder?.paymentStatus === 'success' ? (
                    <Button
                      color="info"
                      variant={'outlined'}
                      disabled={crudOrdersLoading}
                      startIcon={<Iconify icon="ic:round-update" />}
                      onClick={() => {
                        setOpenOrderDialog(true);
                        const payload = {
                          status: selectedOrder?.orderStatus,
                          trackingNumber:
                            selectedOrder?.orderStatus === 'shipped'
                              ? selectedOrder?.trackingNumber
                              : '',
                        };
                        setValues(payload);
                        setSelectedOrderStatus(payload);
                      }}
                    >
                      Update
                    </Button>
                  ) : null}
                </Box>
              </Stack>
              <Typography mt={1} variant="body2" color={'grey.600'}>
                {moment(selectedOrder?.createdDate)?.format('MM-DD-YYYY hh:mm a')}{' '}
              </Typography>
              <Stack
                sx={{ height: '99%', display: 'flex', justifyContent: 'space-between', mt: 3 }}
              >
                <Grid container spacing={3}>
                  <Grid xs={12} lg={8}>
                    <Card
                      sx={{
                        p: 2,
                        borderRadius: 2,
                      }}
                      spacing={2}
                      component={Stack}
                    >
                      <Typography variant="h6">Detail</Typography>
                      <Stack sx={{ overflowX: 'auto' }}>
                        {selectedOrder?.products?.map((x, i) => (
                          <React.Fragment key={`product-${i}`}>
                            <Stack
                              gap={2}
                              direction={'row'}
                              flexWrap={'noWrap'}
                              // alignItems={'center'}
                            >
                              <Box sx={{ width: '80px', height: '80px', flexShrink: 0 }}>
                                <Box
                                  sx={{
                                    p: 0.5,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 2,
                                    border: `1px dashed ${grey[200]}`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                >
                                  <ProgressiveImg
                                    src={x?.productImage}
                                    alt={'product-img'}
                                    title={'product-img'}
                                    customClassName="w-full h-full rounded-md"
                                  />
                                </Box>
                              </Box>

                              <Box minWidth={'250px'} width={'100%'}>
                                {x?.productName}
                                <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                                  {x?.variations?.map((y, j) => (
                                    <Stack key={`variations-${j}`}>
                                      <Typography variant="caption">{y?.variationName}</Typography>
                                      <Label
                                        color={'default'}
                                        sx={{ width: 'fit-content', fontSize: '11px' }}
                                      >
                                        {y?.variationTypeName}
                                      </Label>
                                    </Stack>
                                  ))}
                                </Stack>
                                <Box sx={{ fontSize: '12px' }} mt={1}>
                                  {fCurrency(x?.productPrice)} {''}
                                  per item
                                </Box>
                                {x?.diamondDetail ? (
                                  <>
                                    <Typography variant="subtitle2" mt={2}>
                                      Diamond Detail
                                    </Typography>
                                    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                                      {helperFunctions
                                        .getDiamondDetailArray(x?.diamondDetail)
                                        .map(({ label, value }, index) => {
                                          return (
                                            <Stack key={`dia-${index}`}>
                                              <Typography variant="caption">{label}</Typography>
                                              <Label
                                                color={'default'}
                                                sx={{ width: 'fit-content', fontSize: '11px' }}
                                              >
                                                {value}
                                              </Label>
                                            </Stack>
                                          );
                                        })}
                                    </Stack>
                                  </>
                                ) : null}
                              </Box>
                              <Stack direction={'row'} alignItems={'center'} sx={font14}>
                                <Box width={'60px'}>x{x?.cartQuantity}</Box>
                                <Typography
                                  sx={font14}
                                  width={'100px'}
                                  textAlign={'end'}
                                  variant="subtitle1"
                                >
                                  {fCurrency(x?.unitAmount)}
                                </Typography>
                              </Stack>
                            </Stack>
                            <Divider
                              style={{ minWidth: 'calc(550px)' }}
                              sx={{ borderStyle: 'dashed', mt: 1, mb: 1 }}
                            />
                          </React.Fragment>
                        ))}
                        <Stack alignItems={'end'} my={2} sx={{ minWidth: '550px' }}>
                          <Stack direction={'row'} width={'200px'} justifyContent={'space-between'}>
                            <Box sx={font14}>SubTotal </Box>
                            <Typography variant="subtitle1" sx={font14}>
                              {selectedOrder?.discount
                                ? fCurrency(selectedOrder?.subTotal + selectedOrder?.discount)
                                : fCurrency(selectedOrder?.subTotal)}
                            </Typography>
                          </Stack>
                          {selectedOrder?.discount > 0 && (
                            <Stack
                              mt={2}
                              width="250px"
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Box sx={font14}>
                                Promo Discount{' '}
                                {selectedOrder?.promoCode ? `(${selectedOrder.promoCode})` : ''}
                              </Box>
                              <Typography variant="subtitle1" sx={font14}>
                                -{fCurrency(selectedOrder?.discount)}
                              </Typography>
                            </Stack>
                          )}
                          <Stack
                            mt={2}
                            width={'200px'}
                            direction={'row'}
                            justifyContent={'space-between'}
                          >
                            <Box sx={font14}>Shipping</Box>
                            <Typography variant="subtitle1" sx={font14}>
                              {fCurrency(selectedOrder?.shippingCharge)}
                            </Typography>
                          </Stack>
                          <Stack
                            mt={2}
                            width={'200px'}
                            direction={'row'}
                            justifyContent={'space-between'}
                          >
                            <Box sx={font14}>Taxes</Box>
                            <Typography variant="subtitle1" sx={font14}>
                              {fCurrency(selectedOrder?.salesTax)}
                            </Typography>
                          </Stack>
                          <Stack
                            mt={2}
                            width={'200px'}
                            direction={'row'}
                            justifyContent={'space-between'}
                          >
                            <Typography variant="subtitle1">Total</Typography>
                            <Typography variant="subtitle1">
                              {fCurrency(selectedOrder?.total)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid xs={12} lg={4}>
                    <Card
                      spacing={2}
                      component={Stack}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <Stack
                        gap={2}
                        sx={{
                          p: 2,
                          mt: `0 !important`,
                        }}
                      >
                        <Typography variant="h6">Shipping</Typography>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Name </Box>
                          <Box sx={sxPrimaryColor}>{selectedOrder?.shippingAddress?.name}</Box>
                        </Stack>

                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Address </Box>
                          <Box sx={sxPrimaryColor}>
                            {selectedOrder?.shippingAddress?.apartment
                              ? selectedOrder?.shippingAddress?.apartment
                              : null}{' '}
                            {selectedOrder?.shippingAddress?.address}
                            {', '}
                            {selectedOrder?.shippingAddress?.city}
                            {', '}
                            {selectedOrder?.shippingAddress?.country}
                            {', '}
                            {selectedOrder?.shippingAddress?.pinCode}
                          </Box>
                        </Stack>

                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Mobile </Box>
                          <Box sx={sxPrimaryColor}>{selectedOrder?.shippingAddress?.mobile}</Box>
                        </Stack>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Email </Box>
                          <Box sx={sxPrimaryColor}>{selectedOrder?.shippingAddress?.email}</Box>
                        </Stack>
                        {selectedOrder?.trackingNumber ? (
                          <Stack direction={'row'} sx={font14} gap={1}>
                            <Box sx={sx}>Tracking Number</Box>
                            <Box sx={sxPrimaryColor}>{selectedOrder?.trackingNumber}</Box>
                          </Stack>
                        ) : null}
                      </Stack>
                      <Divider
                        sx={{
                          mt: `0 !important`,
                          borderStyle: 'dashed',
                        }}
                      />

                      <Stack
                        gap={2}
                        sx={{
                          p: 2,
                          mt: `0 !important`,
                        }}
                      >
                        <Typography variant="h6">Payment</Typography>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Status </Box>
                          <Label
                            color={
                              helperFunctions.getStatusBg(selectedOrder?.paymentStatus) || 'success'
                            }
                          >
                            {selectedOrder?.paymentStatus}
                          </Label>
                        </Stack>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Payment Method </Box>
                          <Box sx={sxPrimaryColor}>
                            {helperFunctions?.capitalizeCamelCase(selectedOrder?.paymentMethod)}
                          </Box>
                        </Stack>
                        {selectedOrder?.paymentMethod === 'paypal' ? (
                          <>
                            {selectedOrder?.paypalCaptureId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Capture ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.paypalCaptureId}</Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.paypalOrderId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Order ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.paypalOrderId}</Box>
                              </Stack>
                            ) : null}

                            {selectedOrder?.paypalRefundId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Refund ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.paypalRefundId}</Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.paypalRefundFailureReason ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Refund Failure Reason </Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedOrder?.paypalRefundFailureReason}
                                </Box>
                              </Stack>
                            ) : null}
                          </>
                        ) : null}
                        {selectedOrder?.paymentMethod === 'stripe' ? (
                          <>
                            {selectedOrder?.stripePaymentIntentId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Payment Intent ID </Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedOrder?.stripePaymentIntentId}
                                </Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.stripeCustomerId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Customer ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.stripeCustomerId}</Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.stripeARNNumber ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe ARN Number </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.stripeARNNumber}</Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.stripeRefundId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Refund ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.stripeRefundId}</Box>
                              </Stack>
                            ) : null}
                            {selectedOrder?.stripeRefundFailureReason ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Refund Failure Reason</Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedOrder?.stripeRefundFailureReason}
                                </Box>
                              </Stack>
                            ) : null}
                          </>
                        ) : null}
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sxPrimaryColor}>
                            {selectedOrder?.billingAddress ? (
                              <>
                                <p sx={sx}>Billing Address </p>
                                {`${selectedOrder?.billingAddress?.line1},${selectedOrder?.billingAddress?.line2 ? `${selectedOrder?.billingAddress?.line2},` : ''}${selectedOrder?.billingAddress?.city},${selectedOrder?.billingAddress?.state},${selectedOrder?.billingAddress?.country} - ${selectedOrder?.billingAddress?.postal_code}`}
                              </>
                            ) : null}
                          </Box>
                        </Stack>
                      </Stack>

                      {selectedOrder?.orderStatus === 'cancelled' ? (
                        <>
                          <Divider sx={{ borderStyle: 'dashed', mt: `0 !important` }} />

                          <Stack
                            gap={2}
                            sx={{
                              p: 2,
                              mt: `0 !important`,
                            }}
                          >
                            <Typography variant="h6">Cancelled</Typography>

                            <Stack direction={'row'} sx={font14} gap={1}>
                              <Box sx={sx}>Cancelled By</Box>
                              <Box sx={sxPrimaryColor}>{selectedOrder?.cancelledByName}</Box>
                            </Stack>
                            <Stack direction={'row'} sx={font14} gap={1}>
                              <Box sx={sx}>Reason</Box>
                              <Box sx={sxPrimaryColor}>{selectedOrder?.cancelReason}</Box>
                            </Stack>
                            {selectedOrder?.refundDescription ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Refund Description</Box>
                                <Box sx={sxPrimaryColor}>{selectedOrder?.refundDescription}</Box>
                              </Stack>
                            ) : null}
                          </Stack>
                        </>
                      ) : null}
                    </Card>
                  </Grid>
                </Grid>
              </Stack>

              {/* Cancel Order Status */}
              {cancelDailog ? (
                <CancelOrderDialog
                  loadData={loadData}
                  selectedOrderId={orderId}
                  cancelDailog={cancelDailog}
                  setCancelDailog={setCancelDailog}
                />
              ) : null}

              {/* Update Order Status */}
              {openOrderDialog ? (
                <UpdateStatusOrderDialog
                  loadData={loadData}
                  selectedOrderId={orderId}
                  openOrderDialog={openOrderDialog}
                  setOpenOrderDialog={setOpenOrderDialog}
                />
              ) : null}

              {refundDailog ? (
                <RefundOrderDialog
                  loadData={loadData}
                  selectedOrderId={orderId}
                  refundDailog={refundDailog}
                  setRefundDailog={setRefundDailog}
                />
              ) : null}

              {/* Confirmation dialog for Delete Order */}
              {deleteConfirmationDialog && (
                <Dialog
                  open={deleteConfirmationDialog}
                  handleOpen={() => setDeleteConfirmationDialog(true)}
                  handleClose={() => setDeleteConfirmationDialog(false)}
                >
                  <StyledDialogTitle>Confirmation</StyledDialogTitle>
                  <StyledDialogContent>Do you want to delete this order?</StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      disabled={crudOrdersLoading}
                      onClick={() => setDeleteConfirmationDialog(false)}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleDelete}
                      loading={crudOrdersLoading}
                    >
                      Confirm
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>
              )}
            </Container>
          </>
        )
      )}
      {Object.keys(selectedOrder)?.length === 0 && !ordersLoading && (
        <NoData>No Order found</NoData>
      )}
    </>
  );
};

export default OrderDetail;
