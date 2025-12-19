import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';

import {
  Card,
  Stack,
  Table,
  Alert,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';

import {
  setImportFromExcel,
  setImportedFilesData,
  setImportSampleHeadersData,
  setExcelProductsMappedArr,
  setCreateManyProductErrorMsg,
  setCrudProductLoading,
} from 'src/store/slices/productSlice';
import { Button, LoadingButton } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import CustomStepper from 'src/components/stepper';

import { givenData } from './import-excel-map-columns';
import { AnimatePresence, motion } from 'framer-motion';
import { createManyProductsFromExcel, toastError } from 'src/actions';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

const convertToTitleCase = (str) => {
  if (!str) return '';
  const words = str?.split('_');
  const convertedStr = words?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return convertedStr;
};

const steps = ['Upload File', 'Map Columns', 'Confirm Import'];

// ----------------------------------------------------------------------

const ImportExcelConfirm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    importFromExcel,
    importedFilesData,
    crudProductLoading,
    excelProductsMappedArr,
    importSampleHeadersData,
    createManyProductErrorMsg,
  } = useSelector(({ product }) => product);

  useEffect(() => {
    if (
      importSampleHeadersData?.length === 0 ||
      importFromExcel?.length === 0 ||
      excelProductsMappedArr?.length === 0 ||
      importedFilesData?.length === 0
    ) {
      navigate('/product/import-from-excel-first');
    }
  }, [importedFilesData, importFromExcel, importSampleHeadersData, excelProductsMappedArr]);

  useEffect(() => {
    dispatch(setCreateManyProductErrorMsg(''));
  }, []);

  const clearAllArrays = useCallback(() => {
    navigate('/product');
    setTimeout(() => {
      dispatch(setImportFromExcel([]));
      dispatch(setImportedFilesData([]));
      dispatch(setImportSampleHeadersData([]));
      dispatch(setExcelProductsMappedArr([]));
    }, 0);
  }, []);

  const getListIntoJsonFormat = useCallback(() => {
    // Early validation
    if (!importedFilesData?.length || !givenData?.length) {
      return [];
    }

    // Map headers to values from givenData
    const headers = importedFilesData[0]
      .map((hItem) => givenData.find((gItem) => gItem.label === hItem)?.value)
      .filter(Boolean);

    // Convert rows to JSON objects
    const jsonArray = importedFilesData
      .slice(1)
      .map((row) =>
        Object.fromEntries(headers.map((header, index) => [header, row[index] ?? null]))
      );

    // Use Map to track unique products by SKU or productName
    const productsMap = new Map();

    jsonArray.forEach((item) => {
      // if (!item?.productName || !item?.sku) return;

      // Transform item values based on field types
      const mappedItem = Object.fromEntries(
        Object.entries(item).map(([key, value]) => {
          const fieldType = givenData.find((field) => field.value === key)?.type;
          return [key, helperFunctions.convertValueByType(value, fieldType)];
        })
      );

      const {
        productName,
        sku,
        discount,
        collectionNames,
        settingStyleNames,
        categoryName,
        subCategoryNames,
        productTypeNames,
        gender,
        netWeight,
        grossWeight,
        totalCaratWeight,
        centerDiamondWeight,
        sideDiamondWeight,
        Length,
        lengthUnit,
        width,
        widthUnit,
        shortDescription,
        description,
        variations,
        specifications,
        thumbnail,
        images,
        video,
      } = mappedItem;

      // Parse variations
      const variationsArray = variations
        ? variations.split(' | ').map((variationString) => {
            const parts = variationString.split(': ').map((s) => s.trim());
            if (parts.length !== 2) {
              console.warn(`Invalid variation format: ${variationString}`);
              return { variationName: parts[0] || '', variationTypes: [] };
            }
            const [variationName, typesString] = parts;
            const variationTypes = typesString
              ? typesString.split('/').map((type) => ({ variationTypeName: type.trim() }))
              : [];
            return { variationName, variationTypes };
          })
        : [];

      // Parse specifications
      const specificationsArray = specifications
        ? specifications.split(' | ').map((specString) => {
            const parts = specString.split(': ').map((s) => s.trim());
            if (parts.length !== 2) {
              console.warn(`Invalid specification format: ${specString}`);
              return { title: parts[0] || '', description: '' };
            }
            const [title, description] = parts;
            return { title, description };
          })
        : [];

      const product = {
        productName,
        sku,
        discount,
        collectionNames: helperFunctions.splitAndTrim(collectionNames),
        settingStyleNames: helperFunctions.splitAndTrim(settingStyleNames),
        categoryName,
        subCategoryNames: helperFunctions.splitAndTrim(subCategoryNames),
        productTypeNames: helperFunctions.splitAndTrim(productTypeNames),
        gender,
        netWeight: netWeight || null,
        grossWeight: grossWeight || 0,
        totalCaratWeight: totalCaratWeight || 0,
        centerDiamondWeight: centerDiamondWeight || null,
        sideDiamondWeight: sideDiamondWeight || null,
        Length: Length || null,
        lengthUnit,
        width: width || null,
        widthUnit,
        shortDescription,
        description,
        variations: variationsArray,
        specifications: specificationsArray,
        thumbnail,
        images,
        video,
      };

      // Deduplication key
      const key = `${sku?.toUpperCase() || ''}:${productName?.toUpperCase() || ''}`;
      productsMap.set(key, product);
    });

    return Array.from(productsMap.values());
  }, [importedFilesData, givenData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        dispatch(setCrudProductLoading(true));

        const productsList = getListIntoJsonFormat();

        const res = await dispatch(createManyProductsFromExcel({ productsList }));
        if (res) {
          clearAllArrays();
        }
      } catch (e) {
        toastError(e);
      } finally {
        dispatch(setCrudProductLoading(false));
      }
    },
    [importedFilesData]
  );

  let tableBodyList = useMemo(() => importedFilesData?.slice(1), [importedFilesData])?.slice(0, 50);

  const renderTable = useMemo(() => {
    return tableBodyList?.length
      ? tableBodyList?.map((x, i) => {
          // let isDistinct =
          //   i !== 0 ? tableBodyList?.[i]?.[0] === tableBodyList?.[i - 1]?.[0] : false;
          const renderRow = (
            <TableRow key={`product-${i}`}>
              {x?.map((y, j) => {
                // const includeInput = Keys.includes(excelProductsMappedArr?.[0]?.[j]) && isDistinct;

                return (
                  <TableCell
                    key={`product-${i}-input-${j}`}
                    // sx={{ color: !includeInput && y ? 'black' : grey[300] }}
                  >
                    {/* {!includeInput ? (y ? y : importedFilesData[0]?.[j]) : null} */}
                    {y}
                  </TableCell>
                );
              })}
            </TableRow>
          );

          return renderRow;
        })
      : null;
  }, [tableBodyList, excelProductsMappedArr]);

  const displayRecordMessage = (totalRecords) => {
    if (totalRecords <= 50) {
      return `Showing all imported records (${totalRecords} records)`;
    } else {
      return `Showing all imported records (Top 50 / ${totalRecords} records)`;
    }
  };

  return (
    <>
      <Container maxWidth={'xl'}>
        <Card>
          <Box sx={{ borderBottom: `2px dashed ${grey[300]}`, p: 5 }}>
            <CustomStepper activeStep={2} steps={steps} />
          </Box>
          <Box sx={{ width: 1, my: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">Confirm Import</Typography>
            <Typography variant="body2">
              {displayRecordMessage(getListIntoJsonFormat()?.length)}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Scrollbar sx={{ maxHeight: '100vh' }}>
              <TableContainer sx={{ mb: 2, overflow: 'unset' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {importedFilesData?.[0]?.map((x, i) => (
                        <TableCell key={`imported-key-${i}`} sx={{ minWidth: '150px' }}>
                          {convertToTitleCase(x)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>{renderTable}</TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {createManyProductErrorMsg ? (
              <AnimatePresence>
                <motion.div
                  transition={{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }}
                  initial={{
                    y: 0,
                    opacity: 0,
                    scale: 0.8,
                  }}
                  animate={{
                    x: 0,
                    scale: 1,
                    opacity: 1,
                    borderRadius: 0,
                  }}
                  whileInView="visible"
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layoutId={createManyProductErrorMsg}
                >
                  <Stack
                    gap={2}
                    flexDirection={'row'}
                    justifyContent={'center'}
                    sx={{ px: 2, color: 'red' }}
                  >
                    <Alert severity="error" sx={{ m: 2 }}>
                      <p>{createManyProductErrorMsg?.message}</p>
                      {createManyProductErrorMsg?.data
                        ? createManyProductErrorMsg?.data.map((x, i) => {
                            return <p key={`err-${i}`}>{JSON.stringify(x)}</p>;
                          })
                        : null}
                    </Alert>
                  </Stack>
                </motion.div>
              </AnimatePresence>
            ) : null}

            <Alert severity="info" sx={{ m: 2 }}>
              <p>Before adding or updating a product:</p>
              <p>- Wrap the Description field in HTML tags.</p>
              <p>
                - Use ":" to separate the Variations field, "/" to separate its values, and "|" to
                separate different variation.
              </p>
            </Alert>

            <Stack flexDirection={'row'} justifyContent={'end'} gap={2} sx={{ p: 2 }}>
              <Button variant="outlined" onClick={clearAllArrays}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Previous
              </Button>
              <LoadingButton variant="contained" type="submit" loading={crudProductLoading}>
                Upload
              </LoadingButton>
            </Stack>
          </form>
        </Card>
      </Container>
    </>
  );
};

export default ImportExcelConfirm;
