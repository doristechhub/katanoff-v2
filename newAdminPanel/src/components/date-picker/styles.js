import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';

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
