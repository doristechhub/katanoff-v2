import { Box, Stack, Typography } from '@mui/material';

import noData from '../../../public/assets/illustrations/nodata.webp';

// ----------------------------------------------------------------------

const NoData = ({ children }) => {
  return (
    <Stack
      sx={{
        mb: 7,
        mt: 0,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h3" sx={{ mb: 3 }}>
        No Data
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>{children}</Typography>
      <Box
        component="img"
        src={noData}
        sx={{
          height: 320,
          mt: 5,
        }}
      />
    </Stack>
  );
};

export default NoData;
