import { memo } from 'react';

import { Box, Stack } from '@mui/material';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

const VariationLabel = ({ data, ...other }) => {
  return (
    <Stack
      flexWrap={'wrap'}
      sx={{
        m: '5px',
        fontSize: '12px',
        borderRadius: '5px',
        width: 'fit-content',
        boxShadow: '0 0 2px 0 rgba(145, 158, 171, 0.08),0 12px 24px -4px rgba(145, 158, 171, 0.18)',
        ...other,
      }}
    >
      <Box
        sx={{
          margin: 0,
          fontWeight: 600,
          fontSize: '11px',
          padding: '0 10px',
          textAlign: 'center',
          borderRadius: '10px',
          backgroundColor: 'white',
        }}
      >
        {data?.variationName}
      </Box>
      <Label
        color={'success'}
        sx={{
          padding: '5px',
        }}
      >
        {data?.variationTypeName}
      </Label>
    </Stack>
  );
};

export default memo(VariationLabel);
