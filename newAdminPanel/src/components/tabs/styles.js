import { TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledTabList = styled(TabList)(({ theme }) => {
  return {
    '.MuiTab-root': {
      textAlign: 'left',
      alignItems: 'start',
      WebkitAlignItems: 'start',
      minWidth: '130px',
    },
    '.Mui-selected': {
      color: `${theme.palette.grey[900]} !important`,
    },
    '.MuiTabs-indicator': {
      backgroundColor: `${theme.palette.grey[900]}`,
    },
  };
});

export const StyledTab = styled(Tab)(({ theme }) => {
  return {};
});
