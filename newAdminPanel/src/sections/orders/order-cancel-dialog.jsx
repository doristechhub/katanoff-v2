import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormHelperText, Typography } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Textarea from 'src/components/textarea';
import { cancelOrder } from 'src/actions/ordersActions';
import { Button, LoadingButton } from 'src/components/button';
import { initRefundPayment } from 'src/store/slices/refundSlice';
import { setSelectedCancelOrder } from 'src/store/slices/ordersSlice';

// ----------------------------------------------------------------------

const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

const validationSchema = Yup.object().shape({
  cancelReason: Yup.string().required('Reason is Required'),
});

// ----------------------------------------------------------------------

const CancelOrderDialog = ({
  loadData,
  handlePopup,
  cancelDailog,
  selectedOrderId,
  setCancelDailog,
}) => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef();

  const { cancelOrderLoading, selectedCancelOrder } = useSelector(({ orders }) => orders);

  useEffect(() => {
    return () => clearAbortController(); // Cancel request on unmount/route change
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const closeCancelPopup = useCallback(() => {
    setCancelDailog(false);
    dispatch(setSelectedCancelOrder(initRefundPayment));
  }, []);

  const handleCancel = useCallback(
    async (val, { resetForm }) => {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const res = await dispatch(
        cancelOrder(
          {
            orderId: selectedOrderId,
            cancelReason: val?.cancelReason,
          },
          abortControllerRef.current
        )
      );
      if (res) {
        loadData();
        resetForm();
        if (handlePopup) handlePopup();
        closeCancelPopup();
        setCancelDailog(false);
      }
    },
    [selectedOrderId, abortControllerRef]
  );

  const cancelFormik = useFormik({
    validationSchema,
    onSubmit: handleCancel,
    enableReinitialize: true,
    initialValues: selectedCancelOrder,
  });

  return (
    <Dialog
      open={cancelDailog}
      handleClose={closeCancelPopup}
      handleOpen={() => setCancelDailog(true)}
    >
      <StyledDialogTitle>Cancel Order</StyledDialogTitle>
      <StyledDialogContent>
        {getTypoGraphy('Reason')}
        <Textarea
          minRows={3}
          maxRows={4}
          sx={{
            mt: '10px',
            width: '100%',
            minWidth: '300px',
          }}
          label="Reason"
          name="cancelReason"
          onBlur={cancelFormik.handleBlur}
          onChange={cancelFormik.handleChange}
          value={cancelFormik.values?.cancelReason || ''}
        />
        {cancelFormik.touched?.cancelReason && cancelFormik.errors?.cancelReason ? (
          <FormHelperText
            error={!!(cancelFormik.touched?.cancelReason && cancelFormik.errors?.cancelReason)}
          >
            {cancelFormik.errors?.cancelReason}
          </FormHelperText>
        ) : null}
      </StyledDialogContent>
      <StyledDialogActions>
        <Button variant="outlined" disabled={cancelOrderLoading} onClick={closeCancelPopup}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={cancelOrderLoading}
          onClick={cancelFormik.handleSubmit}
        >
          Cancel Order
        </LoadingButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default CancelOrderDialog;
