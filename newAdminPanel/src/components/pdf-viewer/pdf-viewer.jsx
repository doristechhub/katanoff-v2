import PDF from 'react-pdf-js';
import { memo, useCallback, useState } from 'react';

import { Box, Stack } from '@mui/material';

import { Button } from '../button';

// ----------------------------------------------------------------------

const PdfViewer = ({ pdf }) => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(null);

  const onDocumentComplete = useCallback((numPages) => {
    setPages(numPages);
  }, []);

  const onDocumentError = useCallback((err) => {
    console.error('pdf viewer error:', err);
  }, []);

  const onPage = useCallback(
    (type) => {
      let newPage = type ? page + 1 : page - 1;

      if (newPage > pages) {
        newPage = 1;
      } else if (newPage < 1) {
        newPage = pages;
      }
      setPage(newPage);
    },
    [page, pages]
  );

  const footer = (
    <Stack
      mt={'10px'}
      width={'100%'}
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Button onClick={() => onPage(0)} disabled={page === 1} variant="contained" size="small">
        Previous
      </Button>
      <div>
        <span style={{ textAlign: 'center' }}>
          Page {page} of {pages}
        </span>
      </div>
      <Button onClick={() => onPage(1)} disabled={page === pages} variant="contained" size="small">
        Next
      </Button>
    </Stack>
  );

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '300px',
          overflow: 'auto',
        }}
      >
        <PDF
          file={pdf}
          page={page}
          onDocumentError={onDocumentError}
          onDocumentComplete={onDocumentComplete}
        />
      </Box>
      {footer}
    </>
  );
};

export default memo(PdfViewer);
