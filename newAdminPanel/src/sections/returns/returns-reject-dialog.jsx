import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FormHelperText } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Textarea from 'src/components/textarea';
import { getTypoGraphy } from './returns-list';
import { rejectReturn } from 'src/actions/returnActions';
import { Button, LoadingButton } from 'src/components/button';
import { initRejectReturn, setSelectedRejectReturn } from 'src/store/slices/returnSlice';
// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  adminNote: Yup.string().required('Reason is Required'),
});

// ----------------------------------------------------------------------

const RejectReturnDialog = ({
  loadData,
  handlePopup,
  rejectDailog,
  setRejectDailog,
  selectedReturnId,
}) => {
  const dispatch = useDispatch();

  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => clearAbortController();
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const { rejectReturnLoading, selectedRejectReturn } = useSelector(({ returns }) => returns);

  const handleReject = useCallback(
    async (val, { resetForm }) => {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }

      const res = await dispatch(
        rejectReturn(
          {
            returnId: selectedReturnId,
            adminNote: val?.adminNote,
          },
          abortControllerRef.current
        )
      );
      if (res) {
        loadData();
        resetForm();
        if (handlePopup) handlePopup();
        dispatch(setSelectedRejectReturn(initRejectReturn));
        setRejectDailog(false);
      }
    },
    [selectedReturnId, abortControllerRef]
  );

  const rejectFormik = useFormik({
    validationSchema,
    onSubmit: handleReject,
    enableReinitialize: true,
    initialValues: selectedRejectReturn,
  });

  const closeRejectPopup = useCallback(() => {
    dispatch(setSelectedRejectReturn(initRejectReturn));
    setRejectDailog(false);
  }, []);

  return (
    <>
      <Dialog
        open={rejectDailog}
        handleClose={closeRejectPopup}
        handleOpen={() => setRejectDailog(true)}
      >
        <StyledDialogTitle>Reject Return</StyledDialogTitle>
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
            name="adminNote"
            label="Admin Note"
            onBlur={rejectFormik.handleBlur}
            onChange={rejectFormik.handleChange}
            value={rejectFormik.values?.adminNote || ''}
          />
          {rejectFormik.touched?.adminNote && rejectFormik.errors?.adminNote ? (
            <FormHelperText
              error={!!(rejectFormik.touched?.adminNote && rejectFormik.errors?.adminNote)}
            >
              {rejectFormik.errors?.adminNote}
            </FormHelperText>
          ) : null}
        </StyledDialogContent>
        <StyledDialogActions>
          <Button variant="outlined" disabled={rejectReturnLoading} onClick={closeRejectPopup}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={rejectReturnLoading}
            onClick={rejectFormik.handleSubmit}
          >
            Submit
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(RejectReturnDialog);
