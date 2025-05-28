import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Box,
  Card,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  CardHeader,
  FormHelperText,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'src/components/iconify';
import { getCustomizationSubTypeList, getCustomizationTypeList } from 'src/actions';

import {
  setFilterBy,
  setPrintLoader,
  setSearchValue,
  setDownloadPdfLoader,
  setSelectedVariation,
  setExportToExcelLoader,
} from 'src/store/slices/reportAndAnalysisSlice';
import SalesChart from './sales-chart';
import OrderStatusPieChart from './orders-chart';
import { LoadingButton } from 'src/components/button';
import TopSellingProducts from './top-selling-products';
import { getSalesComparisionData } from 'src/_services/reportAndAnalysis.service';

import VariationLabel from './variation-label';
import AddVariationsDialog from './add-variations-dialog';
import { generateExcel } from 'src/_helpers/generateExcel';
import { generateTopSellingPDF } from 'src/_helpers/generatePdf';

import { useReactToPrint } from 'react-to-print';

// ----------------------------------------------------------------------

const ReportAnalysis = () => {
  const pieRef = useRef();
  const topSellingRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contentToPrint = useRef(null);

  const [searchError, setSearchError] = useState(false);
  const [filterByError, setFilterByError] = useState(false);
  const [openAddVariationDialog, setOpenAddVariationDialog] = useState(false);

  let { filterBy, searchValue, selectedVariation, selectedYearSalesComp } = useSelector(
    ({ reportAndAnalysis }) => reportAndAnalysis
  );

  const { customizationTypeLoading } = useSelector(({ customization }) => customization);

  useEffect(() => {
    dispatch(getCustomizationTypeList());
    dispatch(getCustomizationSubTypeList());
  }, []);

  const handleFilterChange = useCallback(
    (e) => {
      const selectedFilter = e.target.value;
      dispatch(setFilterBy(selectedFilter === filterBy ? '' : selectedFilter));
      setSearchError(false);
      setFilterByError(false);
      dispatch(setSelectedVariation([]));
    },
    [filterBy]
  );

  const handleSearchChange = useCallback((e) => {
    let val = e.target.value;
    val = val ? val?.trim() : '';
    dispatch(setSearchValue(val));
    setSearchError(false);
    setFilterByError(false);
  }, []);

  const handleSearch = useCallback(() => {
    if (filterBy && !searchValue) {
      setSearchError(true);
      return;
    }
    if (!filterBy && searchValue) {
      setFilterByError(true);
      return;
    }

    pieRef?.current?.click();
    topSellingRef?.current?.click();
    if (selectedYearSalesComp?.value || selectedYearSalesComp?.value === 0) {
      let payload = {
        selectedVariation,
        filterBy: filterBy,
        searchValue: searchValue,
        year: selectedYearSalesComp.value,
      };
      dispatch(getSalesComparisionData(payload));
    }
  }, [selectedYearSalesComp, filterBy, searchValue, selectedVariation, topSellingRef, pieRef]);

  const handleRemove = useCallback(
    (index) => {
      let list = [...selectedVariation];
      list = list?.filter((_, i) => i !== index);
      dispatch(setSelectedVariation(list));
    },
    [selectedVariation]
  );

  return (
    <Container maxWidth="xl">
      <Stack
        gap={1}
        flexWrap={'wrap'}
        flexDirection={'row'}
        // alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography variant="h4">Report & Analysis</Typography>
        <Stack flexDirection={'row'} gap={1} alignItems={'center'} flexWrap={'wrap'}>
          <Stack>
            <Box>
              <FormControlLabel
                label={'User'}
                htmlFor="user"
                sx={{ flexGrow: 1, m: 0 }}
                control={
                  <Checkbox
                    id="user"
                    value={'user'}
                    checked={filterBy === 'user'}
                    onChange={handleFilterChange}
                  />
                }
              />
              <FormControlLabel
                label={'Product'}
                htmlFor="product"
                sx={{ flexGrow: 1, m: 0 }}
                control={
                  <Checkbox
                    id="product"
                    value={'product'}
                    onChange={handleFilterChange}
                    checked={filterBy === 'product'}
                  />
                }
              />
            </Box>
          </Stack>

          <TextField
            size="small"
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            title={filterBy === 'user' ? 'User' : 'Product Name or SKU'}
            placeholder={filterBy === 'user' ? 'User' : 'Product Name or SKU'}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ padding: 0, width: window.innerWidth >= 567 ? '200px' : '100%' }}
          />
          <IconButton
            onClick={handleSearch}
            sx={{
              height: 'fit-content',
              color: 'secondary.main',
            }}
          >
            <Iconify icon="iconamoon:search-duotone" width={20} />
          </IconButton>
        </Stack>
      </Stack>
      <Stack justifyContent={'end'} flexDirection={'row'} mb={3}>
        {searchError ? (
          <FormHelperText error={true} sx={{ m: 0 }}>
            Search Text Required
          </FormHelperText>
        ) : null}
        {filterByError ? (
          <FormHelperText error={filterByError} sx={{ m: 0 }}>
            Select User or Product
          </FormHelperText>
        ) : null}
      </Stack>

      {filterBy === 'product' ? (
        <Stack
          mb={1}
          gap={1}
          width={'100%'}
          direction={'row'}
          alignItems={'center'}
          justifyContent={'end'}
        >
          {selectedVariation?.length
            ? selectedVariation?.map((x, i) => (
                <Box
                  sx={{ display: 'flex', position: 'relative' }}
                  key={`variation-${x?.variationName}-type-${x?.variationTypeName}`}
                >
                  <VariationLabel data={x} />
                  <Iconify
                    width={17}
                    color={'error.main'}
                    onClick={() => handleRemove(i)}
                    icon="material-symbols:cancel-rounded"
                    sx={{ position: 'absolute', right: -3, cursor: 'pointer' }}
                  />
                </Box>
              ))
            : null}
          {filterBy === 'product' ? (
            <LoadingButton
              sx={{ ml: 2, height: 'fit-content' }}
              variant="contained"
              startIcon={<AddIcon />}
              loading={customizationTypeLoading}
              onClick={() => setOpenAddVariationDialog(true)}
            >
              Variation
            </LoadingButton>
          ) : null}
        </Stack>
      ) : null}

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <OrderStatusPieChart pieRef={pieRef} />
        </Grid>

        <Grid xs={12} md={8}>
          <SalesChart />
        </Grid>

        <Grid xs={12}>
          <Card>
            <CardHeader
              title={'Top Selling Products'}
              action={<Actions contentToPrint={contentToPrint} />}
            />
            <TopSellingProducts topSellingRef={topSellingRef} contentToPrint={contentToPrint} />
          </Card>
        </Grid>
      </Grid>
      {openAddVariationDialog ? (
        <AddVariationsDialog
          openAddVariationDialog={openAddVariationDialog}
          setOpenAddVariationDialog={setOpenAddVariationDialog}
        />
      ) : null}
    </Container>
  );
};

export default ReportAnalysis;

const Actions = ({ contentToPrint }) => {
  const dispatch = useDispatch();
  const {
    printLoader,
    topSellingLimit,
    topSellingLoader,
    downloadPdfLoader,
    exportToExcelLoader,
    topSellingDateRange,
    topSellingPriceRange,
    topSellingProductsList,
  } = useSelector(({ reportAndAnalysis }) => reportAndAnalysis);

  const exportToPdf = useCallback(async () => {
    const obj = {
      list: topSellingProductsList,
      limit: topSellingLimit?.value,
      dateRange: topSellingDateRange,
      priceRange: topSellingPriceRange,
    };
    dispatch(setDownloadPdfLoader(true));
    await generateTopSellingPDF(obj);
    dispatch(setDownloadPdfLoader(false));
  }, [topSellingProductsList, topSellingLimit, topSellingDateRange, topSellingPriceRange]);

  const exportToExcel = async () => {
    dispatch(setExportToExcelLoader(true));
    const currentItemsData = topSellingProductsList?.map((item) => ({
      'Product Name': item?.productName,
      SKU: item?.sku,
      Variations: item?.variations
        .map((variation) => `${variation?.variationName} - ${variation?.variationTypeName}`)
        .join(', '),
      'Sold Quantity': item?.soldQuantity,
      'Total Sales': item?.totalSalesAmount,
      'Product Image': item?.productImage,
    }));
    await generateExcel(currentItemsData, 'Top Selling Products');
    dispatch(setExportToExcelLoader(false));
  };

  const handlePrint = useReactToPrint({
    removeAfterPrint: true,
    onAfterPrint: () => dispatch(setPrintLoader(false)),
    onBeforePrint: () => dispatch(setPrintLoader(false)),
    // pageStyle: '@page{ size: landscape !important }',
  });

  return (
    <Stack sx={{ mt: '8px' }} flexDirection={'row'} gap={1}>
      <IconButton
        title="Download PDF"
        onClick={exportToPdf}
        sx={{ color: 'error.main' }}
        disabled={downloadPdfLoader || topSellingLoader || !topSellingProductsList.length}
      >
        {downloadPdfLoader ? (
          <Iconify icon="line-md:loading-twotone-loop" width={20} />
        ) : (
          <Iconify icon="fa6-solid:file-pdf" width={20} />
        )}
      </IconButton>
      <IconButton
        title="Export Excel"
        onClick={exportToExcel}
        sx={{ color: 'success.main' }}
        disabled={exportToExcelLoader || topSellingLoader || !topSellingProductsList.length}
      >
        {exportToExcelLoader ? (
          <Iconify icon="line-md:loading-twotone-loop" width={20} />
        ) : (
          <Iconify icon="file-icons:microsoft-excel" width={20} />
        )}
      </IconButton>
      {/* <IconButton
        title="Print"
        sx={{ color: 'primary.main' }}
        onClick={() =>
          handlePrint(null, () => {
            dispatch(setPrintLoader(true));
            let copyRef = contentToPrint?.current?.cloneNode(true);
            copyRef.style.padding = '20px';

            return copyRef;
          })
        }
        disabled={printLoader || topSellingLoader || !topSellingProductsList.length}
      >
        {printLoader ? (
          <Iconify icon="line-md:loading-twotone-loop" width={20} />
        ) : (
          <Iconify icon="f7:printer-fill" width={20} />
        )}
      </IconButton> */}
    </Stack>
  );
};
