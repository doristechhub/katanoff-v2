import { memo } from 'react';

import { styled } from '@mui/material/styles';
import { Pagination as MUIPagination } from '@mui/material';

// ----------------------------------------------------------------------

const Pagination = styled(MUIPagination)(({ theme }) => ({
  '.MuiPagination-ul': {
    '.MuiPaginationItem-root': {
      '&.Mui-selected': {
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.grey[800],
        },
      },
    },
  },
}));

export default memo(Pagination);
