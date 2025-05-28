import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { error, info, success, warning } from 'src/theme/palette';

// ----------------------------------------------------------------------

export const StyledButton = styled(Button)(({ theme }) => {
  return {
    padding: '6px 12px',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.grey[800],

    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    },
    '&.MuiButton-text': {
      padding: '5px 12px',
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[300]}`,

      '&:hover': {
        backgroundColor: theme.palette.grey[200],
        boxShadow: `${theme.palette.grey[900]} 0px 0px 0px 1.5px`,
      },
    },
    '&.MuiButton-outlined': {
      backgroundColor: 'white',
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[300]}`,

      '&:hover': {
        backgroundColor: theme.palette.grey[200],
        boxShadow: `${theme.palette.grey[900]} 0px 0px 0px 1.5px`,
      },
    },
    '&.MuiButton-colorError': {
      color: 'white',
      backgroundColor: error.main,
      '&:hover': {
        backgroundColor: error.light,
        boxShadow: `${theme.palette.error.main} 0px 0px 0px 1.5px`,
      },
    },
    '&.MuiButton-colorSuccess': {
      color: 'white',
      backgroundColor: success.main,
      '&:hover': {
        backgroundColor: success.light,
        boxShadow: `${theme.palette.success.main} 0px 0px 0px 1.5px`,
      },
    },
    '&.MuiButton-colorInfo': {
      color: 'white',
      backgroundColor: info.main,
      '&:hover': {
        backgroundColor: info.light,
        boxShadow: `${theme.palette.info.main} 0px 0px 0px 1.5px`,
      },
    },
    '&.MuiButton-colorWarning': {
      color: 'white',
      backgroundColor: warning.main,
      '&:hover': {
        backgroundColor: warning.light,
        boxShadow: `${theme.palette.warning.main} 0px 0px 0px 1.5px`,
      },
    },
  };
});

export const StyledLoadingButton = styled(LoadingButton)(({ theme }) => {
  return {
    padding: '6px 12px',
    '&.MuiButton-text': {
      padding: '5px 12px',
      color: theme.palette.grey[800],
      border: `1px solid ${theme.palette.grey[300]}`,

      '&:hover': {
        backgroundColor: theme.palette.grey[200],
        boxShadow: `${theme.palette.grey[900]} 0px 0px 0px 1.5px`,
      },
    },

    '&.MuiButton-contained': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.grey[800],
      '&:hover': {
        backgroundColor: theme.palette.grey[700],
      },
    },

    '&.Mui-disabled': {
      backgroundColor: theme.palette.grey[700],
    },

    '&.MuiLoadingButton-loading': {
      color: theme.palette.grey[700],
      backgroundColor: theme.palette.grey[700],
    },
  };
});
