import { useFormik } from 'formik';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';

import { approveReturn } from 'src/actions/returnActions';
import { setSelectedApproveReturn, initApproveReturn } from 'src/store/slices/returnSlice';
import { setSelectedOrder } from 'src/store/slices/ordersSlice';
import ConfirmationDialog from 'src/components/confirmation-dialog';

const ApproveReturnDialog = ({
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
    async (_, { resetForm }) => {
      const payload = { returnId: selectedReturnId };
      const res = await dispatch(approveReturn(payload));

      if (res) {
        dispatch(setSelectedOrder({}));
        dispatch(setSelectedApproveReturn(initApproveReturn));
        loadData();
        setOpenReturnDialog(false);
        resetForm();
        if (setOpen) setOpen(null);
      }
    },
    [dispatch, selectedReturnId, loadData, setOpenReturnDialog, setOpen]
  );

  const approveFormik = useFormik({
    enableReinitialize: true,
    onSubmit: handleApproveOrUpdate,
    initialValues: selectedApproveReturn,
  });

  return (
    <ConfirmationDialog
      open={openReturnDialog}
      setOpen={setOpenReturnDialog}
      loading={crudReturnLoading}
      handleConfirm={approveFormik.handleSubmit}
      confirmButtonText="Approve"
    >
      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
        Are you sure you want to approve this return request?
      </Typography>
    </ConfirmationDialog>
  );
};

export default memo(ApproveReturnDialog);
