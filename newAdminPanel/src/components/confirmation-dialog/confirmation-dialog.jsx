import { memo } from 'react';

import Dialog from '../dialog';
import { Button, LoadingButton } from '../button';
import { StyledDialogActions, StyledDialogContent, StyledDialogTitle } from '../dialog/styles';

// ----------------------------------------------------------------------

const ConfirmationDialog = ({
  open,
  setOpen,
  children,
  loading,
  handleConfirm,
  confirmButtonText = 'Confirm',
}) => {
  return (
    <>
      <Dialog open={open} handleOpen={() => setOpen(true)} handleClose={() => setOpen(false)}>
        <StyledDialogTitle>Confirmation</StyledDialogTitle>
        <StyledDialogContent>{children}</StyledDialogContent>
        <StyledDialogActions>
          <Button variant="outlined" disabled={loading} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <LoadingButton variant="contained" onClick={handleConfirm} loading={loading}>
            {confirmButtonText}
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(ConfirmationDialog);
