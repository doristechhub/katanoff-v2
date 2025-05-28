import { Dialog, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

export const StyledDialog = styled(Dialog)(({ theme }) => {
  return {
    '.MuiDialog-container': {
      '.MuiPaper-root': {
        borderRadius: 16,
      },
    },
  };
});

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => {
  return {
    padding: 24,
  };
});

export const StyledDialogContent = styled(DialogContent)(({ theme }) => {
  return {
    padding: '0 24px',
  };
});

export const StyledDialogActions = styled(DialogActions)(({ theme }) => {
  return {
    padding: 24,
  };
});
