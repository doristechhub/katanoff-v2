import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FormHelperText, Typography } from '@mui/material';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Textarea from 'src/components/textarea';
import { Button, LoadingButton } from 'src/components/button';
import { orderRefundPayment } from 'src/actions/orderRefundActions';
import { initRefundPayment, setSelectedOrderRefund } from 'src/store/slices/refundSlice';

// ----------------------------------------------------------------------

export const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

const validationSchema = Yup.object().shape({
  refundDescription: Yup.string().required('Description is Required'),
});

// ----------------------------------------------------------------------

const RefundOrderDialog = ({
  loadData,
  handlePopup,
  refundDailog,
  setRefundDailog,
  selectedOrderId,
}) => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const { selectedOrderRefund, orderRefundPaymentLoading } = useSelector(({ refund }) => refund);

  useEffect(() => {
    return () => clearAbortController();
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const handleSubmit = useCallback(
    async (val, { resetForm }) => {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const res = await dispatch(
        orderRefundPayment(
          {
            orderId: selectedOrderId,
            refundDescription: val?.refundDescription,
          },
          abortControllerRef.current
        )
      );
      if (res) {
        loadData();
        resetForm();
        if (handlePopup) handlePopup();
        closeRefundPaymentPopup();
        setRefundDailog(false);
      }
    },
    [selectedOrderId, abortControllerRef]
  );

  const formik = useFormik({
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    initialValues: selectedOrderRefund,
  });

  const closeRefundPaymentPopup = useCallback(() => {
    setRefundDailog(false);
    formik.resetForm();
    dispatch(setSelectedOrderRefund(initRefundPayment));
  }, []);

  return (
    <>
      <Dialog
        open={refundDailog}
        handleClose={closeRefundPaymentPopup}
        handleOpen={() => setRefundDailog(true)}
      >
        <StyledDialogTitle>Refund Payment</StyledDialogTitle>
        <StyledDialogContent>
          {getTypoGraphy('Description')}
          <Textarea
            minRows={3}
            maxRows={4}
            sx={{
              mt: '10px',
              width: '100%',
              minWidth: '300px',
            }}
            label="Description"
            name="refundDescription"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values?.refundDescription || ''}
          />
          {formik.touched?.refundDescription && formik.errors?.refundDescription ? (
            <FormHelperText
              error={!!(formik.touched?.refundDescription && formik.errors?.refundDescription)}
            >
              {formik.errors?.refundDescription}
            </FormHelperText>
          ) : null}
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            variant="outlined"
            disabled={orderRefundPaymentLoading}
            onClick={closeRefundPaymentPopup}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={orderRefundPaymentLoading}
            onClick={formik.handleSubmit}
          >
            Submit
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(RefundOrderDialog);
