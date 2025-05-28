import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import { FileDrop } from 'src/components/file-drop';
import { approveReturn } from 'src/actions/returnActions';
import { Button, LoadingButton } from 'src/components/button';
import { setSelectedApproveReturn, initApproveReturn } from 'src/store/slices/returnSlice';
import { Alert, Typography } from '@mui/material';
import { setSelectedOrder } from 'src/store/slices/ordersSlice';
// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  previewImage: Yup.array()
    .max(1, 'Max limit is 1!')
    .of(
      Yup.object().shape({
        type: Yup.string().required(),
        mimeType: Yup.string().required(),
        image: Yup.string().required('At least one image or pdf is required'),
      })
    ),
});

// ----------------------------------------------------------------------

const ApproveOrUpdateReturnDialog = ({
  setOpen,
  loadData,
  openReturnDialog,
  selectedReturnId,
  setOpenReturnDialog,
}) => {
  const dispatch = useDispatch();

  const { returnList, crudReturnLoading, selectedApproveReturn } = useSelector(
    ({ returns }) => returns
  );
  const item = returnList?.find((x) => x?.id === selectedReturnId);

  const handleApproveOrUpdate = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        returnId: selectedReturnId,
        imageFile: val?.imageFile?.length ? val.imageFile[0] : undefined,
        deleteShippingLabel: val?.deleteUploadedShippingLabel[0]?.image,
      };
      let res = await dispatch(approveReturn(payload));
      if (res) {
        dispatch(setSelectedOrder({}));
        dispatch(setSelectedApproveReturn(initApproveReturn));
        loadData();
        setOpenReturnDialog(false);
        resetForm();
        if (setOpen) setOpen(null);
      }
    },
    [selectedReturnId]
  );

  const approveFormik = useFormik({
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleApproveOrUpdate,
    initialValues: selectedApproveReturn,
  });

  const closeReturnPopup = useCallback(() => {
    setOpenReturnDialog(false);
    dispatch(setSelectedApproveReturn(initApproveReturn));
    approveFormik.resetForm();
  }, []);

  return (
    <>
      <Dialog
        open={openReturnDialog}
        handleClose={closeReturnPopup}
        handleOpen={() => setOpenReturnDialog(true)}
      >
        <StyledDialogTitle>
          {item?.status === 'approved' ? 'Update Shipping Label' : 'Approve Return Request'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 'medium' }}>
            Shipping Label
          </Typography>
          <FileDrop
            mediaLimit={1}
            fileKey={'imageFile'}
            formik={approveFormik}
            productId={selectedReturnId}
            mediaType={'pdf&image'}
            previewKey={'previewImage'}
            deleteKey={'deleteUploadedShippingLabel'}
            loading={crudReturnLoading}
          />
          <Alert severity="info" sx={{ my: 1 }}>
            <p>Before Approving a Request</p>
            <p variant="body2">Ensure you have shipping label document or image.</p>
          </Alert>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeReturnPopup} disabled={crudReturnLoading} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={crudReturnLoading}
            onClick={approveFormik.handleSubmit}
          >
            {item?.status === 'approved' ? 'Update' : 'Approve'}
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(ApproveOrUpdateReturnDialog);
