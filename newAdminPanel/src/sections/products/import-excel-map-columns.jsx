import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Card,
  Table,
  Stack,
  Alert,
  TableRow,
  MenuItem,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';

import {
  setImportFromExcel,
  setImportedFilesData,
  setImportSampleHeadersData,
} from 'src/store/slices/productSlice';
import Iconify from 'src/components/iconify';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import CustomStepper from 'src/components/stepper';

// ----------------------------------------------------------------------

const steps = ['Upload File', 'Map Columns', 'Confirm Import'];

// Important used in step 2 and 3
export const givenData = [
  {
    label: 'Product Name',
    value: 'productName',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'SKU',
    value: 'sku',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Gross Wt (g)',
    value: 'grossWeight',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Net Wt (g)',
    value: 'netWeight',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Center Dia Wt (ctw)',
    value: 'centerDiamondWeight',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Side Dia Wt (ctw)',
    value: 'sideDiamondWeight',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Total Carat Wt (ctw)',
    value: 'totalCaratWeight',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Discount (%)',
    value: 'discount',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Category Name',
    value: 'categoryName',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Sub Categories',
    value: 'subCategoryNames',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Product Types',
    value: 'productTypeNames',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Collections',
    value: 'collectionNames',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Setting Styles',
    value: 'settingStyleNames',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Gender',
    value: 'gender',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Length',
    value: 'Length',
    type: 'number',
    isRequired: false,
  },
  {
    label: 'Length Unit',
    value: 'lengthUnit',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Width',
    value: 'width',
    type: 'number',
    isRequired: false,
  },
  {
    label: 'Width Unit',
    value: 'widthUnit',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Short Description',
    value: 'shortDescription',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Description',
    value: 'description',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Variations',
    value: 'variations',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Specifications',
    value: 'specifications',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Rose Gold Thumbnail',
    value: 'roseGoldThumbnailImage',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Rose Gold Images',
    value: 'roseGoldImages',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Rose Gold Video',
    value: 'roseGoldVideo',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Yellow Gold Thumbnail',
    value: 'yellowGoldThumbnailImage',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Yellow Gold Images',
    value: 'yellowGoldImages',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'Yellow Gold Video',
    value: 'yellowGoldVideo',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'White Gold Thumbnail',
    value: 'whiteGoldThumbnailImage',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'White Gold Images',
    value: 'whiteGoldImages',
    type: 'string',
    isRequired: true,
  },
  {
    label: 'White Gold Video',
    value: 'whiteGoldVideo',
    type: 'string',
    isRequired: false,
  },
  {
    label: 'Specifications',
    value: 'specifications',
    type: 'string',
    isRequired: false,
  },

  // {
  //   label: 'Is Diamond Filter',
  //   value: 'isDiamondFilter',
  //   type: 'boolean',
  //   isRequired: false,
  // },
  // {
  //   label: 'Diamond Shapes',
  //   value: 'diamondFilters.diamondShapeNames',
  //   type: 'array',
  //   isRequired: false,
  // },
  // {
  //   label: 'Carat Weight Range Min',
  //   value: 'diamondFilters.caratWeightRange.min',
  //   type: 'number',
  //   isRequired: false,
  // },
  // {
  //   label: 'Carat Weight Range Max',
  //   value: 'diamondFilters.caratWeightRange.max',
  //   type: 'number',
  //   isRequired: false,
  // },
  // {
  //   label: 'Price Calculation Mode',
  //   value: 'priceCalculationMode',
  //   type: 'string',
  //   isRequired: false,
  // },
];

// ----------------------------------------------------------------------

const ImportExcelMapColumns = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [dropDownList, setDropDownList] = useState(givenData);

  const { importedFilesData, importFromExcel, importSampleHeadersData } = useSelector(
    ({ product }) => product
  );

  useEffect(() => {
    if (importFromExcel?.length === 0) {
      navigate('/product/import-from-excel-first');
    }
  }, [importFromExcel]);

  const loadRequiredData = useCallback(() => {
    let newArr = [];
    for (let i = 0; i < importedFilesData[0]?.length; i++) {
      const matchedHeaderKey = givenData?.find((x) => x?.label === importedFilesData?.[0]?.[i]);
      newArr.push({
        id: i,
        importedHeader: importedFilesData?.[0]?.[i] || '',
        systemHeader: matchedHeaderKey?.value || '',
        sample: importedFilesData?.[1]?.[i] || '',
      });
    }

    const tempArr = newArr?.map((x) => x?.systemHeader);
    const filtered = givenData?.filter((x) => !tempArr.includes(x?.value));

    setDropDownList(filtered);
    dispatch(setImportSampleHeadersData(newArr));
  }, [importedFilesData, givenData]);

  useEffect(() => {
    if (importedFilesData?.length) loadRequiredData();
  }, []);

  const handleChange = useCallback(
    (val, itemId) => {
      let list = [...JSON.parse(JSON.stringify(importSampleHeadersData))];
      list[itemId].systemHeader = val;
      dispatch(setImportSampleHeadersData(list));

      let updatedParty = [...importedFilesData[0]];
      let tableData = importedFilesData?.slice(1);
      const foundItem = givenData?.find((x) => x.value === val);
      updatedParty[itemId] = foundItem?.label;

      updatedParty = [updatedParty, ...tableData];
      dispatch(setImportedFilesData(updatedParty));
      const filtered = dropDownList?.filter((x) => val !== x?.value);
      setDropDownList(filtered);
    },
    [importSampleHeadersData, dispatch, dropDownList, importedFilesData]
  );

  const remove = useCallback(
    (val, index) => {
      let list = [...JSON.parse(JSON.stringify(importSampleHeadersData))];
      if (index >= 0) {
        list[index].systemHeader = '';
        dispatch(setImportSampleHeadersData(list));
        let removedEle = givenData?.find((y) => y?.value === val);
        setDropDownList([...dropDownList, removedEle]);
      }
    },
    [importSampleHeadersData, givenData, dropDownList]
  );

  const hasUnmappedColumns = useMemo(() => {
    // Only required fields must be mapped
    const requiredFields = givenData.filter((x) => x?.isRequired).map((x) => x?.value);

    return requiredFields.some(
      (field) => !importSampleHeadersData?.some((x) => x?.systemHeader === field)
    );
  }, [importSampleHeadersData, givenData]);

  const getUnmatchedItems = useMemo(() => {
    if (importSampleHeadersData?.length) {
      // Only required fields need to be checked
      return givenData
        ?.filter((item) => {
          if (!item.isRequired) return false;
          const isMatched = importSampleHeadersData?.some((x) => x?.systemHeader === item?.value);
          return !isMatched;
        })
        .map((x) => x?.label);
    }
    return [];
  }, [importSampleHeadersData, givenData]);

  const getMissingRequiredFields = useMemo(() => {
    const requiredFields = givenData
      .filter((field) => field.isRequired)
      .map((field) => field.value);

    return importSampleHeadersData
      .filter((header) => requiredFields.includes(header.systemHeader) && !header.sample)
      .map((header) => header.importedHeader);
  }, [importSampleHeadersData, givenData]);

  return (
    <>
      <Container>
        <Card>
          <Box sx={{ borderBottom: `2px dashed ${grey[300]}`, p: 5 }}>
            <CustomStepper activeStep={1} steps={steps} />
          </Box>
          <Box sx={{ width: 1, my: 3, textAlign: 'center' }}>
            <Typography variant="subtitle1">Columns Mapper</Typography>
            <Typography variant="body2">
              Map your columns with headers present in the system
            </Typography>
          </Box>

          {(!!hasUnmappedColumns && getUnmatchedItems?.length) ||
          getMissingRequiredFields?.length ? (
            <AnimatePresence>
              <motion.div
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  y: 0,
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
                layoutId={String(getUnmatchedItems?.length || getMissingRequiredFields?.length)}
              >
                <Alert severity="error" sx={{ m: 2 }}>
                  {getUnmatchedItems?.length ? (
                    <p>Please add required headers ⇒ {getUnmatchedItems?.join(', ')}</p>
                  ) : null}
                  {getMissingRequiredFields?.length ? (
                    <p>Missing required fields value ⇒ {getMissingRequiredFields?.join(', ')}</p>
                  ) : null}
                </Alert>
              </motion.div>
            </AnimatePresence>
          ) : null}

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Imported Header</TableCell>
                    <TableCell>System Header</TableCell>
                    <TableCell>Sample</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {importSampleHeadersData?.length
                    ? importSampleHeadersData?.map((x, i) => (
                        <TableRow key={`importted-product-${i}`}>
                          <TableCell>
                            <TextField
                              size="small"
                              name="title"
                              disabled={true}
                              sx={{
                                width: 1,
                              }}
                              value={x?.importedHeader || ''}
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction={'row'}>
                              <TextField
                                select
                                sx={{
                                  width: 1,
                                }}
                                size="small"
                                value={x?.systemHeader || ''}
                                onChange={(e) => handleChange(e.target.value, x?.id)}
                              >
                                {[
                                  ...(x?.systemHeader
                                    ? givenData?.filter(
                                        (y) =>
                                          y.value === x?.systemHeader ||
                                          getUnmatchedItems.includes(y.label)
                                      )
                                    : givenData?.filter((y) =>
                                        getUnmatchedItems.includes(y.label)
                                      )),
                                ]?.map((option) => (
                                  <MenuItem key={option?.value} value={option?.value}>
                                    {option?.label}
                                    {option?.isRequired ? (
                                      <span className="text-red-500">*</span>
                                    ) : null}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <IconButton
                                title="Back"
                                aria-label="Back"
                                onClick={() => remove(x?.systemHeader, i)}
                              >
                                <Iconify icon="ic:baseline-clear" width={20} />
                              </IconButton>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              disabled={true}
                              sx={{
                                width: 1,
                              }}
                              value={x?.sample || ''}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Stack flexDirection={'row'} justifyContent={'end'} my={2} gap={2} sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                navigate('/product');
                dispatch(setImportFromExcel([]));
                dispatch(setImportedFilesData([]));
                dispatch(setImportSampleHeadersData([]));
              }}
            >
              Cancel
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={hasUnmappedColumns || (getMissingRequiredFields?.length ? true : false)}
              onClick={() => navigate('/product/import-excel-confirm')}
            >
              Next
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default ImportExcelMapColumns;
