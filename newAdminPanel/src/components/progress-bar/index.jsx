import { memo, useEffect, useState } from 'react';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const ProgressBar = memo(({ file }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file) {
      let timeout = setInterval(() => {
        setProgress((prev) => {
          if (prev !== 100) return prev + 1;
          return prev;
        });
      }, 10);
      return () => clearInterval(timeout);
    }
  }, [file]);

  return (
    <Stack sx={{ width: '100%' }} mb={2} gap={1}>
      <Stack flexDirection={'row'} alignItems={'center'} gap={1}>
        <Iconify icon={'vscode-icons:file-type-excel2'} width={25} />
        <Typography variant="subtitle1">{file?.name}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={progress} />
    </Stack>
  );
});

export default ProgressBar;
