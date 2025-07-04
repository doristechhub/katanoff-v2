import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, FormHelperText, TextField } from '@mui/material';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Textarea from 'src/components/textarea';
import { getTypoGraphy } from './returns-list';
import { refundReturn } from 'src/actions/returnActions';
import { Button, LoadingButton } from 'src/components/button';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

const RefundReturnsDialog = ({
  setOpen,
  loadData,
  openRefundDialog,
  selectedReturnId,
  setOpenRefundDialog,
}) => {
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const { selectedReturn, refundReturnLoading, selectedRefundReturn } = useSelector(
    ({ returns }) => returns
  );

  useEffect(() => {
    return () => clearAbortController();
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const handleRefund = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        returnId: selectedReturnId,
        refundAmount: val?.refundAmount,
        refundDescription: val?.refundDescription,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      let res = await dispatch(refundReturn(payload, abortControllerRef.current));
      if (res) {
        loadData();
        setOpenRefundDialog(false);
        resetForm();
        if (setOpen) setOpen(null);
      }
    },
    [selectedReturnId, abortControllerRef]
  );

  const maxAmount = useMemo(
    () => Number(selectedReturn?.returnRequestAmount?.toFixed(2)),
    [selectedReturn]
  );
  const refundValidationSchema = Yup.object().shape({
    refundAmount: Yup.number()
      .max(maxAmount, `Max refund amount must be less or equal to ${maxAmount}`)
      .required('Refund Amount is required')
      .positive('Refund Amount must be positive'),
    refundDescription: Yup.string(),
  });

  const refundFormik = useFormik({
    onSubmit: handleRefund,
    enableReinitialize: true,
    initialValues: selectedRefundReturn,
    validationSchema: refundValidationSchema,
  });

  return (
    <>
      <Dialog
        open={openRefundDialog}
        handleOpen={() => setOpenRefundDialog(true)}
        handleClose={() => setOpenRefundDialog(false)}
      >
        <StyledDialogTitle>Refund Payment</StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            sx={{
              mt: '10px',
              width: '100%',
              minWidth: '300px',
            }}
            type="number"
            label="Amount"
            name="refundAmount"
            onBlur={refundFormik.handleBlur}
            onChange={refundFormik.handleChange}
            value={refundFormik.values?.refundAmount || ''}
            error={!!(refundFormik.touched?.refundAmount && refundFormik.errors?.refundAmount)}
            helperText={
              refundFormik.touched?.refundAmount && refundFormik.errors?.refundAmount
                ? refundFormik.errors?.refundAmount
                : ''
            }
          />

          <Box sx={{ mt: 1 }}>
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
              onBlur={refundFormik.handleBlur}
              onChange={refundFormik.handleChange}
              value={refundFormik.values?.refundDescription || ''}
            />
            {refundFormik.touched?.refundDescription && refundFormik.errors?.refundDescription ? (
              <FormHelperText
                error={
                  !!(
                    refundFormik.touched?.refundDescription &&
                    refundFormik.errors?.refundDescription
                  )
                }
              >
                {refundFormik.errors?.refundDescription}
              </FormHelperText>
            ) : null}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            variant="outlined"
            disabled={refundReturnLoading}
            onClick={() => {
              setOpenRefundDialog(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={refundReturnLoading}
            onClick={refundFormik.handleSubmit}
          >
            Refund Payment
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(RefundReturnsDialog);
