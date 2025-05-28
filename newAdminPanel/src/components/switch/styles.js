import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledSwitch = styled(Switch)(({ theme }) => {
  return {
    width: '53px',
    padding: '8px',
    '.MuiSwitch-track': {
      borderRadius: '14px',
    },

    '.MuiSwitch-switchBase': {
      padding: '11px',
      '&.Mui-checked': {
        transform: 'translateX(15px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
        },
      },
      '.MuiSwitch-thumb': {
        width: '16px',
        height: '16px',
        backgroundColor: 'white',
      },
    },
  };
});
