import * as XLSX from 'xlsx';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';
import { Card, Container, Paper, Stack, Typography, alpha } from '@mui/material';

import {
  setImportFromExcel,
  setImportedFilesData,
  setImportExcelLoading,
  setExcelProductsMappedArr,
} from 'src/store/slices/productSlice';
import Iconify from 'src/components/iconify';
import CustomStepper from 'src/components/stepper';
import ProgressBar from 'src/components/progress-bar';
import { Button, LoadingButton } from 'src/components/button';

import { givenData } from './import-excel-map-columns';
import filesFolder from '../../../public/assets/illustrations/files.svg';
import { generateExcel } from 'src/_helpers/generateExcel';
import { ACCEPTED_FILE_TYPES } from 'src/_helpers';

// ----------------------------------------------------------------------

const steps = ['Upload File', 'Map Columns', 'Confirm Import'];

// ----------------------------------------------------------------------

const ImportFromExcelFirst = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { importFromExcel, importedFilesData, importExcelLoading } = useSelector(
    ({ product }) => product
  );

  const onDrop = useCallback((files) => {
    const fileType = files[0].type;
    if (fileType && ACCEPTED_FILE_TYPES.includes(fileType)) {
      const fNames = Object.keys(files)?.map((name) => {
        return {
          file: files[0],
          name: files[name].name,
          icon: files[name].name.split('.')[1]?.toUpperCase().trim(),
        };
      });
      dispatch(setImportFromExcel(fNames));
    } else {
      toast.error('file type not supported');
    }
  });

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
  });

  const onDownloadSample = useCallback(async (e) => {
    const tempArray = givenData.map((item) => ({
      [item.label]: '',
    }));
    await generateExcel(tempArray, 'sample');
  }, []);

  const loadData = useCallback(async () => {
    return new Promise((res) => {
      try {
        const excelData = importFromExcel?.[0]?.file;

        const reader = new FileReader();

        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          // Access the first sheet in the workbook
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          // Convert the worksheet to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
          /**
           * Remove empty array(row)
           */
          let updated = jsonData?.filter((x) => x?.length > 0);

          /**
           * input - {2D Array}
           * return - {2D Array}
           * Map to create same length of arrays;
           */

          updated = updated?.map((_, i) =>
            updated?.[0]?.map((_, j) => (!updated[i][j] ? null : updated[i][j]))
          );

          /**
           * input - {2D Array, keyArray}
           * return - {2D Array}
           * Filter unwanted keys from header and push into new array
           * else create filtered header array
           */

          const header = [];
          const valueHeader = [];
          const unWantedKeys = [];
          for (let i = 0; i < updated[0]?.length; i++) {
            const index = givenData?.findIndex((y) => y?.label === updated?.[0]?.[i]);
            if (index === -1) {
              unWantedKeys.push(i);
            } else {
              header.push(givenData?.[index]?.label);
              valueHeader.push(givenData?.[index]?.value);
            }
          }

          /**
           * input - {2D Array's 1st array ele, keyArray}
           * return - {Header Array}
           * Generate filtered header array
           */

          const tableBody = updated?.slice(1)?.map((x) => {
            return x?.filter((_, j) => !unWantedKeys.includes(j));
          });

          let finalArr = [header, ...tableBody];
          if (header?.length && tableBody?.length && valueHeader?.length) {
            dispatch(setExcelProductsMappedArr([valueHeader, ...tableBody])); // modified 2d array
            dispatch(setImportedFilesData(finalArr)); // original header with updated body 2d array
            res(true);
          } else {
            toast.error('Please provide valid excel data!');
            res(false);
          }
        };

        reader.onerror = () => {
          res(false);
        };

        reader.readAsArrayBuffer(excelData);
      } catch (e) {
        console.log('Error reading Excel file:', e);
        toast.error('Error reading Excel file');
        res(false);
      }
    });
  }, [dispatch, importFromExcel, navigate]);

  const onNext = useCallback(async () => {
    if (importFromExcel?.length > 0) {
      dispatch(setImportExcelLoading(true));

      const res = await loadData();
      if (res) navigate('/product/import-product-map-columns');

      dispatch(setImportExcelLoading(false));
    }
  }, [importFromExcel, importedFilesData]);

  return (
    <>
      <Container>
        <Card sx={{}}>
          <Box sx={{ borderBottom: `2px dashed ${grey[300]}`, p: 5 }}>
            <CustomStepper activeStep={0} steps={steps} />
          </Box>
          <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', my: 3 }}>
            <Typography variant="subtitle1">Upload File </Typography>
          </Box>
          <Box sx={{ px: 5 }}>
            <Box
              sx={{
                pointerEvents: false ? 'none' : '',
                borderRadius: 1,
              }}
              {...getRootProps({ className: 'dropzone' })}
            >
              <Paper
                variant="outlined"
                sx={{
                  py: 2.5,
                  cursor: 'pointer',
                  textAlign: 'center',
                  borderStyle: 'dashed',
                  borderColor: isDragActive ? 'primary.light' : '',
                  backgroundColor: isDragActive ? 'primary.light' : grey[100],
                  ':hover': { opacity: 0.8, transition: 'all 0.5s ease' },
                }}
              >
                <input
                  type="file"
                  name={'file'}
                  label={'file'}
                  disabled={false}
                  accept={ACCEPTED_FILE_TYPES}
                  {...getInputProps()}
                />
                <Box
                  sx={{
                    p: 1,
                    width: '200px',
                    objectFit: 'contain',
                  }}
                  component="img"
                  src={filesFolder}
                  alt={'Files Folder Drop'}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    px: 2,
                    mt: 2,
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  Drag & Drop or Choose files XLSX or CSV
                </Typography>
              </Paper>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Note: You can import a maximum of 10 products at a time.
            </Typography>
            {importFromExcel?.length ? (
              <Box
                sx={{
                  px: 1,
                  py: 2,
                  my: 2,
                  borderRadius: 1,
                  border: `1px dashed ${alpha(grey[600], 0.16)}`,
                }}
              >
                {importFromExcel?.map((file, i) => (
                  <ProgressBar key={i} file={file} />
                ))}
              </Box>
            ) : null}
            <Stack flexDirection={'row'} justifyContent={'space-between'} mb={3} mt={6} gap={2}>
              <Button
                color="success"
                variant="contained"
                onClick={onDownloadSample}
                startIcon={<Iconify icon={'vscode-icons:file-type-excel'} width={25} />}
              >
                Download Sample
              </Button>
              <Stack flexDirection={'row'} justifyContent={'space-between'} gap={2}>
                <Button
                  variant="outlined"
                  disabled={importExcelLoading}
                  onClick={() => {
                    navigate('/product');
                    dispatch(setImportFromExcel([]));
                  }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  onClick={onNext}
                  variant="contained"
                  loading={importExcelLoading}
                  disabled={importExcelLoading || !importFromExcel?.length}
                >
                  Next
                </LoadingButton>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default ImportFromExcelFirst;
