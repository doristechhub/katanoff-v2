import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MenuItem, Stack, TextField } from '@mui/material';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Label from 'src/components/label';
import Dialog from 'src/components/dialog';
import { helperFunctions } from 'src/_helpers';
import { Button, LoadingButton } from 'src/components/button';
import { updateStatusOfOrder } from 'src/actions/ordersActions';
import { initRefundPayment } from 'src/store/slices/refundSlice';
import { orderStatusListForUpdate, setSelectedOrderStatus } from 'src/store/slices/ordersSlice';

const UpdateStatusOrderDialog = ({
  loadData,
  openOrderDialog,
  selectedOrderId,
  setOpenOrderDialog,
}) => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const { crudOrdersLoading, selectedOrderStatus } = useSelector(({ orders }) => orders);

  useEffect(() => {
    return () => clearAbortController(); // Cancel request on unmount/route change
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        orderId: selectedOrderId,
        orderStatus: val?.status,
        trackingNumber: val?.trackingNumber,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      let res = await dispatch(updateStatusOfOrder(payload, abortControllerRef.current));
      if (res) {
        loadData();
        setOpenOrderDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [selectedOrderId, abortControllerRef]
  );

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setValues } =
    useFormik({
      onSubmit,
      validationSchema: Yup.object().shape({
        status: Yup.string().required('Status is required'),
        trackingNumber:
          selectedOrderStatus?.status === 'shipped'
            ? Yup.string().required('Tracking number is required')
            : Yup.string(),
      }),
      enableReinitialize: true,
      initialValues: selectedOrderStatus,
    });

  const closeOrderPopup = useCallback(() => {
    setOpenOrderDialog(false);
    dispatch(setSelectedOrderStatus(initRefundPayment));
    resetForm();
  }, []);

  return (
    <>
      <Dialog
        open={openOrderDialog}
        handleClose={closeOrderPopup}
        handleOpen={() => setOpenOrderDialog(true)}
      >
        <StyledDialogTitle>Update Order Status</StyledDialogTitle>
        <StyledDialogContent>
          <Stack gap={1}>
            <TextField
              select
              sx={{
                mt: '8px',
                minWidth: '300px',
              }}
              name="status"
              onBlur={handleBlur}
              label="Order Status"
              onChange={(e) => {
                const val = e.target.value;
                handleChange(val);
                dispatch(setSelectedOrderStatus({ ...selectedOrderStatus, status: val }));
              }}
              value={values?.status || ''}
              error={!!(touched?.status && errors?.status)}
              helperText={touched?.status && errors?.status ? errors?.status : ''}
            >
              {orderStatusListForUpdate?.length > 0 ? (
                orderStatusListForUpdate?.map((x, i) => (
                  <MenuItem value={x?.value} key={`order-status-${i}`}>
                    <Label key={x?.label} color={helperFunctions.getStatusBg(x?.value)}>
                      {x?.label}
                    </Label>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Item</MenuItem>
              )}
            </TextField>
            {values?.status === 'shipped' ? (
              <TextField
                sx={{ mt: '8px' }}
                onBlur={handleBlur}
                name="trackingNumber"
                label="Tracking Number"
                onChange={handleChange}
                value={values?.trackingNumber}
                error={!!(touched?.trackingNumber && errors?.trackingNumber)}
                helperText={
                  touched?.trackingNumber && errors?.trackingNumber ? errors?.trackingNumber : ''
                }
              />
            ) : null}
          </Stack>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeOrderPopup} disabled={crudOrdersLoading} variant="outlined">
            Cancel
          </Button>
          <LoadingButton variant="contained" onClick={handleSubmit} loading={crudOrdersLoading}>
            Update
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(UpdateStatusOrderDialog);
