import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { Box, Link, Card, Stack, Divider, Typography } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Label from 'src/components/label';
import { grey } from 'src/theme/palette';
import Dialog from 'src/components/dialog';
import Spinner from 'src/components/spinner';
import NoData from 'src/components/no-data';
import Iconify from 'src/components/iconify';
import { helperFunctions } from 'src/_helpers';
import { fCurrency } from 'src/utils/format-number';
import { Button, LoadingButton } from 'src/components/button';
import { getSingleReturnById, recievedReturn } from 'src/actions/returnActions';
import {
  setRefundReturnMessage,
  setSelectedApproveReturn,
  setSelectedRefundReturn,
} from 'src/store/slices/returnSlice';

import RejectReturnDialog from './../returns/returns-reject-dialog';
import RefundReturnsDialog from '../returns/returns-refund-dialog';
import ApproveReturnDialog from './../returns/returns-approve-dialog';
import ProgressiveImg from 'src/components/progressive-img';
import AnimatedAlert from 'src/components/alert/AnimatedAlert';
import { initMessageObj } from 'src/_helpers/constants';
import { useAlertTimeout } from 'src/hooks/user-alert-timeout';

// ----------------------------------------------------------------------

const font14 = { fontSize: '14px' };
const sxPrimaryColor = { color: 'text.primary' };
const sx = { width: '200px', color: 'text.secondary', flexShrink: 0 };

// ----------------------------------------------------------------------

const ReturnDetail = () => {
  const dispatch = useDispatch();
  const { returnId } = useParams();
  const [rejectDailog, setRejectDailog] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [receivedConfirmationDialog, setReceivedConfirmationDialog] = useState(false);

  const {
    returnLoading,
    selectedReturn,
    crudReturnLoading,
    rejectReturnLoading,
    refundReturnLoading,
    refundReturnMessage,
    recievedReturnLoading,
  } = useSelector(({ returns }) => returns);

  useAlertTimeout(
    refundReturnMessage,
    () => dispatch(setRefundReturnMessage(initMessageObj)),
    6000
  );

  const loadData = useCallback(() => {
    dispatch(getSingleReturnById(returnId));
  }, [returnId]);

  useEffect(() => {
    loadData();
  }, [returnId]);

  const handleRecieved = useCallback(async () => {
    const payload = { returnId, returnStatus: 'received' };
    const res = await dispatch(recievedReturn(payload));
    if (res) {
      loadData();
      setReceivedConfirmationDialog(false);
    }
  }, [returnId]);

  const updateOrApproveReturnRequest = useCallback(() => {
    setOpenReturnDialog(true);

    if (selectedReturn?.shippingLabel) {
      const url = new URL(selectedReturn?.shippingLabel);
      const fileExtension = url.pathname.split('.').pop();

      const payload = [
        {
          type: 'old',
          mimeType: `${fileExtension === 'pdf' ? 'application' : 'image'}/${fileExtension}`,
          image: selectedReturn?.shippingLabel,
        },
      ];
      dispatch(
        setSelectedApproveReturn({
          imageFile: [],
          previewImage: payload,
          deleteUploadedShippingLabel: [],
        })
      );
    }
  }, [selectedReturn]);
  return (
    <>
      {returnLoading ? (
        <div className="flex justify-center selectedReturns-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        Object.keys(selectedReturn)?.length !== 0 && (
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
                  <Typography variant="h4">Return #{selectedReturn?.orderNumber}</Typography>{' '}
                  <Label color={helperFunctions.getStatusBg(selectedReturn?.status) || 'success'}>
                    {selectedReturn?.status}
                  </Label>
                </Stack>
                <Box>
                  {selectedReturn?.status === 'pending' &&
                  selectedReturn?.returnPaymentStatus === 'pending' ? (
                    <Button
                      size={'small'}
                      color="success"
                      sx={{ mr: '10px' }}
                      variant={'outlined'}
                      onClick={() => updateOrApproveReturnRequest(true)}
                      disabled={rejectReturnLoading || crudReturnLoading}
                      startIcon={<Iconify icon="icon-park-solid:success" />}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {selectedReturn?.status === 'pending' &&
                  selectedReturn?.returnPaymentStatus === 'pending' ? (
                    <Button
                      sx={{
                        mr: '10px',
                      }}
                      color="error"
                      size={'small'}
                      variant={'outlined'}
                      onClick={() => setRejectDailog(true)}
                      disabled={rejectReturnLoading || crudReturnLoading}
                      startIcon={<Iconify icon="material-symbols:cancel" />}
                    >
                      Reject
                    </Button>
                  ) : null}
                  {/* {selectedReturn?.status === 'approved' &&
                  selectedReturn?.returnPaymentStatus === 'pending' ? (
                    <Button
                      color="info"
                      size={'small'}
                      variant={'outlined'}
                      onClick={updateOrApproveReturnRequest}
                      startIcon={<Iconify icon="ic:round-update" />}
                      disabled={rejectReturnLoading || crudReturnLoading}
                    >
                      Update
                    </Button>
                  ) : null} */}
                  {selectedReturn?.status === 'approved' &&
                  selectedReturn?.returnPaymentStatus === 'pending' ? (
                    <Button
                      sx={{ ml: 1 }}
                      size={'small'}
                      color="warning"
                      variant={'outlined'}
                      onClick={() => setReceivedConfirmationDialog(true)}
                      startIcon={<Iconify icon="ri:folder-received-fill" />}
                      disabled={recievedReturnLoading || rejectReturnLoading || crudReturnLoading}
                    >
                      Received
                    </Button>
                  ) : null}
                  {selectedReturn?.status === 'received' &&
                  [
                    'pending',
                    'failed_refund',
                    'refund_initialization_failed',
                    'cancelled_refund',
                  ].includes(selectedReturn?.returnPaymentStatus) ? (
                    <Button
                      size={'small'}
                      color="success"
                      variant={'outlined'}
                      disabled={crudReturnLoading || refundReturnLoading}
                      startIcon={<Iconify icon="ri:refund-2-fill" />}
                      onClick={() => {
                        setOpenRefundDialog(true);
                        dispatch(
                          setSelectedRefundReturn({
                            refundAmount:
                              +helperFunctions.toFixedNumber(
                                selectedReturn?.refundAmount || selectedReturn?.returnRequestAmount
                              ) || '',
                            refundDescription: selectedReturn?.refundDescription || '',
                          })
                        );
                      }}
                    >
                      Refund
                    </Button>
                  ) : null}
                </Box>
              </Stack>
              <Typography mt={1} variant="body2" color={'grey.600'}>
                {moment(selectedReturn?.createdDate)?.format('MM-DD-YYYY hh:mm a')}{' '}
              </Typography>
              <AnimatedAlert
                messageObj={refundReturnMessage}
                onClose={() => dispatch(setRefundReturnMessage(initMessageObj))}
              />
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
                        {selectedReturn?.products?.map((x, i) => (
                          <React.Fragment key={`product-${i}`}>
                            <Stack
                              gap={2}
                              direction={'row'}
                              flexWrap={'noWrap'}
                              alignItems={'center'}
                            >
                              <Box sx={{ width: '75px', height: '75px', flexShrink: 0 }}>
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
                                    // placeHolderClassName={'h-[75px]'}
                                  />
                                </Box>
                              </Box>

                              <Box minWidth={'300px'} width={'100%'}>
                                {x?.productName || 'Unknown Product'}
                                {x?.variations?.length > 0 && (
                                  <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                                    {x?.variations
                                      ?.filter((y) => y?.variationName && y?.variationTypeName)
                                      .map((y, j) => (
                                        <Stack key={`variations-${j}`}>
                                          <Typography variant="caption">
                                            {y?.variationName || 'Unknown Variation'}{' '}
                                          </Typography>
                                          <Label
                                            color={'default'}
                                            sx={{ width: 'fit-content', fontSize: '11px' }}
                                          >
                                            {y?.variationTypeName || 'Unknown Type'}{' '}
                                          </Label>
                                        </Stack>
                                      ))}
                                  </Stack>
                                )}
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
                                <Box width={'60px'}>x{x?.returnQuantity}</Box>
                                <Stack direction={'column'} alignItems={'flex-end'} gap={0.5}>
                                  <Typography sx={font14} textAlign={'end'} variant="subtitle1">
                                    {fCurrency(x?.unitAmount)}
                                  </Typography>
                                  {x?.perQuantityDiscountAmount > 0 && (
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { sm: '120px' },
                                      }}
                                    >
                                      <Typography variant="caption" color="error.main">
                                        Discount:
                                      </Typography>
                                      <Typography variant="caption" color="error.main">
                                        -
                                        {fCurrency(x.perQuantityDiscountAmount * x?.returnQuantity)}
                                      </Typography>
                                    </Stack>
                                  )}
                                  {x?.perQuantitySalesTaxAmount > 0 && (
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      sx={{
                                        width: { xs: '100%', sm: 'auto' },
                                        minWidth: { sm: '120px' },
                                      }}
                                    >
                                      <Typography variant="caption" color="success.main">
                                        Tax:
                                      </Typography>
                                      <Typography variant="caption" color="success.main">
                                        +
                                        {fCurrency(x.perQuantitySalesTaxAmount * x?.returnQuantity)}
                                      </Typography>
                                    </Stack>
                                  )}
                                </Stack>
                              </Stack>
                            </Stack>
                            <Divider
                              style={{ minWidth: 'calc(550px)' }}
                              sx={{ borderStyle: 'dashed', mt: 1, mb: 1 }}
                            />
                          </React.Fragment>
                        ))}
                        <Stack alignItems={'end'} my={2} sx={{ minWidth: '550px' }}>
                          <Stack
                            gap={0.5}
                            sx={{
                              marginTop: 1,
                              textAlign: { xs: 'left', sm: 'right' },
                              width: '350px',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>Subtotal:</span>
                              <span>
                                {selectedReturn.subTotal > 0
                                  ? fCurrency(selectedReturn.subTotal)
                                  : 'N/A'}
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="error.main"
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>Discount:</span>
                              <span>
                                {selectedReturn.discount > 0
                                  ? `-${fCurrency(selectedReturn.discount)}`
                                  : 'N/A'}
                              </span>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="success.main"
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>Tax:</span>
                              <span>
                                {selectedReturn.salesTax > 0
                                  ? `+${fCurrency(selectedReturn.salesTax)}`
                                  : 'N/A'}
                              </span>
                            </Typography>
                            <Divider />
                            {Number(selectedReturn?.refundAmount) ===
                            Number(selectedReturn?.returnRequestAmount) ? (
                              // ✅ Full refund - only show refunded amount
                              <Typography
                                variant="caption"
                                marginTop={'10px'}
                                backgroundColor={'#F3F3F4'}
                                padding={'10px'}
                                borderRadius={'4px'}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem',
                                }}
                              >
                                <span>Refunded Amount:</span>
                                <span>{fCurrency(selectedReturn?.refundAmount)}</span>
                              </Typography>
                            ) : (
                              <>
                                {/* ✅ Estimated Total */}
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                  }}
                                >
                                  <span>Estimated Total:</span>
                                  <span>
                                    {selectedReturn?.returnRequestAmount > 0
                                      ? fCurrency(selectedReturn.returnRequestAmount)
                                      : 'N/A'}
                                  </span>
                                </Typography>

                                {/* ✅ Deducted Amount */}
                                {selectedReturn?.refundAmount > 0 && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontSize: '0.9rem',
                                      color: 'text.secondary',
                                    }}
                                  >
                                    <span>Deducted Amount:</span>
                                    <span>
                                      -
                                      {fCurrency(
                                        selectedReturn.returnRequestAmount -
                                          selectedReturn.refundAmount
                                      )}
                                    </span>
                                  </Typography>
                                )}

                                {/* ✅ Refunded Amount */}
                                {selectedReturn?.refundAmount > 0 && (
                                  <Typography
                                    marginTop={'10px'}
                                    variant="caption"
                                    backgroundColor={'#F3F3F4'}
                                    padding={'10px'}
                                    borderRadius={'4px'}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontWeight: 'bold',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    <span>Refunded Amount:</span>
                                    <span>{fCurrency(selectedReturn?.refundAmount)}</span>
                                  </Typography>
                                )}
                              </>
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1,
                                textAlign: 'right',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                              }}
                            >
                              * This amount is approximate. Final refund will be confirmed by admin.
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
                        <Typography variant="h6">Payment</Typography>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Status </Box>
                          <Label
                            color={
                              helperFunctions.getStatusBg(selectedReturn?.returnPaymentStatus) ||
                              'success'
                            }
                          >
                            {selectedReturn?.returnPaymentStatus}
                          </Label>
                        </Stack>
                        <Stack direction={'row'} sx={font14} gap={1}>
                          <Box sx={sx}>Payment Method </Box>
                          <Box sx={sxPrimaryColor}>
                            {helperFunctions?.capitalizeCamelCase(selectedReturn?.paymentMethod)}
                          </Box>
                        </Stack>
                        {selectedReturn?.paymentMethod === 'paypal' ? (
                          <>
                            {selectedReturn?.paypalCaptureId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Capture ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.paypalCaptureId}</Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.paypalOrderId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Order ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.paypalOrderId}</Box>
                              </Stack>
                            ) : null}

                            {selectedReturn?.paypalRefundId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Refund ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.paypalRefundId}</Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.paypalRefundFailureReason ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Paypal Refund Failure Reason </Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedReturn?.paypalRefundFailureReason}
                                </Box>
                              </Stack>
                            ) : null}
                          </>
                        ) : null}
                        {selectedReturn?.paymentMethod === 'stripe' ? (
                          <>
                            {selectedReturn?.stripePaymentIntentId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Payment Intent ID </Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedReturn?.stripePaymentIntentId}
                                </Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.stripeCustomerId ? (
                              <Stack direction={'row'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Customer ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.stripeCustomerId}</Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.stripeARNNumber ? (
                              <Stack direction={'column'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe ARN Number </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.stripeARNNumber}</Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.stripeRefundId ? (
                              <Stack direction={'column'} sx={font14} gap={1}>
                                <Box sx={sx}>Stripe Refund ID </Box>
                                <Box sx={sxPrimaryColor}>{selectedReturn?.stripeRefundId}</Box>
                              </Stack>
                            ) : null}
                            {selectedReturn?.stripeRefundFailureReason ? (
                              <Stack direction={'column'} sx={font14} gap={1}>
                                <Box sx={sx}>Refund Failure Reason</Box>
                                <Box sx={sxPrimaryColor}>
                                  {selectedReturn?.stripeRefundFailureReason}
                                </Box>
                              </Stack>
                            ) : null}
                          </>
                        ) : null}
                      </Stack>

                      <Divider sx={{ borderStyle: 'dashed', mt: `0 !important` }} />

                      <Stack
                        gap={2}
                        sx={{
                          p: 2,
                          mt: `0 !important`,
                        }}
                      >
                        {selectedReturn?.returnRequestReason ? (
                          <Stack direction={'column'} sx={font14} gap={1}>
                            <Box sx={sx}>Return Request Reason</Box>
                            <Box sx={sxPrimaryColor}>{selectedReturn?.returnRequestReason}</Box>
                          </Stack>
                        ) : null}
                        {selectedReturn?.adminNote ? (
                          <Stack direction={'column'} sx={font14} gap={1}>
                            <Box sx={sx}>Admin Note</Box>
                            <Box sx={sxPrimaryColor}>{selectedReturn?.adminNote}</Box>
                          </Stack>
                        ) : null}
                        {selectedReturn?.cancelReason ? (
                          <Stack direction={'column'} sx={font14} gap={1}>
                            <Box sx={sx}>Cancel Reason</Box>
                            <Box sx={sxPrimaryColor}>{selectedReturn?.cancelReason}</Box>
                          </Stack>
                        ) : null}
                        {selectedReturn?.shippingLabel ? (
                          <Stack direction={'row'} sx={font14} gap={1}>
                            <Box sx={sx}>Shipping Label</Box>
                            <Link
                              sx={{ ml: 0.5 }}
                              variant="body2"
                              target="_blank"
                              href={selectedReturn?.shippingLabel}
                            >
                              Open
                            </Link>
                            <Box sx={sxPrimaryColor}></Box>
                          </Stack>
                        ) : null}
                        {selectedReturn?.refundDescription ? (
                          <Stack direction={'column'} sx={font14} gap={1}>
                            <Box sx={sx}>Refund Description</Box>
                            <Box sx={sxPrimaryColor}>{selectedReturn?.refundDescription}</Box>
                          </Stack>
                        ) : null}
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Stack>

              {/* Refund dialog */}
              {openRefundDialog && (
                <RefundReturnsDialog
                  loadData={loadData}
                  selectedReturnId={returnId}
                  openRefundDialog={openRefundDialog}
                  setOpenRefundDialog={setOpenRefundDialog}
                />
              )}

              {/* Approve or Update Return Status */}
              {openReturnDialog ? (
                <ApproveReturnDialog
                  loadData={loadData}
                  selectedReturnId={returnId}
                  openReturnDialog={openReturnDialog}
                  setOpenReturnDialog={setOpenReturnDialog}
                />
              ) : null}

              {/* Reject Return Request */}
              {rejectDailog && (
                <RejectReturnDialog
                  loadData={loadData}
                  rejectDailog={rejectDailog}
                  selectedReturnId={returnId}
                  setRejectDailog={setRejectDailog}
                />
              )}

              {/* Confirmation dialog for Received Return */}
              {receivedConfirmationDialog && (
                <Dialog
                  open={receivedConfirmationDialog}
                  handleOpen={() => setReceivedConfirmationDialog(true)}
                  handleClose={() => setReceivedConfirmationDialog(false)}
                >
                  <StyledDialogTitle>Confirmation</StyledDialogTitle>
                  <StyledDialogContent>Do you received this parcel?</StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      disabled={recievedReturnLoading}
                      onClick={() => setReceivedConfirmationDialog(false)}
                    >
                      No
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleRecieved}
                      loading={recievedReturnLoading}
                    >
                      Yes, Received
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>
              )}
            </Container>
          </>
        )
      )}
      {Object.keys(selectedReturn)?.length === 0 && !returnLoading && (
        <NoData>No Return found</NoData>
      )}
    </>
  );
};

export default ReturnDetail;
