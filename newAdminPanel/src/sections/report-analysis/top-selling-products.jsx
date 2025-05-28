import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useCallback, useEffect, useState } from 'react';

import {
  Box,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  setTopSellingDateRange,
  setTopSellingPriceRange,
  setTopSellingCurrentPage,
  setTopSellingFilteredItems,
} from 'src/store/slices/reportAndAnalysisSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import { helperFunctions } from 'src/_helpers';
import Scrollbar from 'src/components/scrollbar';
import { getTopSellingProductsData } from 'src/_services/reportAndAnalysis.service';

import VariationLabel from './variation-label';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

// ----------------------------------------------------------------------

const TopSellingProducts = ({ topSellingRef, contentToPrint }) => {
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeProduct, setActiveProduct] = useState({});
  const [viewProductDetailDialog, setViewProductDetailDialog] = useState(false);

  let {
    filterBy,
    searchValue,
    topSellingLimit,
    topSellingLoader,
    selectedVariation,
    topSellingDateRange,
    topSellingPriceRange,
    topSellingCurrentPage,
    topSellingProductsList,
    topSellingFilteredItems,
  } = useSelector(({ reportAndAnalysis }) => reportAndAnalysis);

  useEffect(() => {
    let filteredItems = topSellingProductsList?.slice(
      topSellingCurrentPage * rowsPerPage,
      topSellingCurrentPage * rowsPerPage + rowsPerPage
    );
    dispatch(setTopSellingFilteredItems(filteredItems));
  }, [topSellingProductsList, topSellingCurrentPage, rowsPerPage, rowsPerPage]);

  const isDateSearchDisabled =
    !topSellingDateRange?.startDate ||
    !topSellingDateRange?.endDate ||
    topSellingDateRange?.endDate < topSellingDateRange?.startDate;

  const isPriceSearchDisabled =
    (topSellingPriceRange.minPrice !== null &&
      topSellingPriceRange.maxPrice !== null &&
      topSellingPriceRange.minPrice > topSellingPriceRange.maxPrice) ||
    (topSellingPriceRange.minPrice !== null && topSellingPriceRange.maxPrice === null) ||
    (topSellingPriceRange.minPrice === null && topSellingPriceRange.maxPrice !== null);
  const isSearchDisabled = isDateSearchDisabled || isPriceSearchDisabled;

  const getTopSellingProducts = useCallback(
    (selectedTopSellingLimit) => {
      if (isSearchDisabled) {
        return;
      }
      let payload = {
        limit: selectedTopSellingLimit.value,
      };
      payload.fromDate = moment(topSellingDateRange?.startDate).format('MM-DD-YYYY');
      if (!isDateSearchDisabled) {
        payload.toDate = moment(topSellingDateRange?.endDate).format('MM-DD-YYYY');
      }
      if (!isPriceSearchDisabled) {
        payload.minPrice = topSellingPriceRange.minPrice;
        payload.maxPrice = topSellingPriceRange.maxPrice;
      }
      if (filterBy && searchValue) {
        payload.filterBy = filterBy;
        payload.searchValue = searchValue;
        payload.selectedVariation = selectedVariation;
      }
      dispatch(setTopSellingCurrentPage(0));
      dispatch(getTopSellingProductsData(payload));
    },
    [
      filterBy,
      searchValue,
      isSearchDisabled,
      selectedVariation,
      topSellingDateRange,
      topSellingPriceRange,
      isDateSearchDisabled,
      isPriceSearchDisabled,
    ]
  );

  const loadData = useCallback(() => {
    getTopSellingProducts(topSellingLimit);
  }, [topSellingLimit]);

  useEffect(() => {
    loadData();
    return () => dispatch(setTopSellingCurrentPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setTopSellingCurrentPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setTopSellingCurrentPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const clearFilter = useCallback(() => {
    const dateRange = helperFunctions.getWeeksRange();
    dispatch(setTopSellingDateRange(dateRange));
    getTopSellingProducts(topSellingLimit);
    dispatch(setTopSellingPriceRange({ minPrice: null, maxPrice: null }));
  }, []);

  const handlePriceChange = useCallback(
    (e, field) => {
      const value = e.target.value;
      dispatch(
        setTopSellingPriceRange({
          ...topSellingPriceRange,
          [field]: value !== '' ? parseFloat(value) : null,
        })
      );
    },
    [topSellingPriceRange]
  );

  const handleDateChange = useCallback(
    (key, val) => {
      dispatch(
        setTopSellingDateRange({
          ...topSellingDateRange,
          [key]: val,
        })
      );

      if (
        key === 'startDate' &&
        topSellingDateRange?.endDate &&
        val > topSellingDateRange?.endDate
      ) {
        dispatch(
          setTopSellingDateRange({
            ...topSellingDateRange,
            endDate: null,
          })
        );
      } else if (
        key === 'endDate' &&
        topSellingDateRange?.startDate &&
        val < topSellingDateRange?.startDate
      ) {
        dispatch(
          setTopSellingDateRange({
            ...topSellingDateRange,
            startDate: null,
          })
        );
      }
    },
    [topSellingDateRange]
  );

  const closeProductDetailDialog = useCallback(() => {
    setViewProductDetailDialog(false);
    setActiveProduct({});
  }, []);

  return (
    <>
      {topSellingLoader ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
          <Stack my={2} mx={2} gap={2} direction="row" flexWrap={'wrap'} alignItems="center">
            <TextField
              type="number"
              placeholder="Min Price"
              value={topSellingPriceRange?.minPrice || ''}
              onChange={(e) => handlePriceChange(e, 'minPrice')}
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
              sx={{ padding: 0, width: window.innerWidth >= 567 ? '200px' : '100%', pt: '8px' }}
            />
            <TextField
              type="number"
              placeholder="Max Price"
              value={topSellingPriceRange?.maxPrice || ''}
              onChange={(e) => handlePriceChange(e, 'maxPrice')}
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
              sx={{ padding: 0, width: window.innerWidth >= 567 ? '200px' : '100%', pt: '8px' }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="Start Date"
                  value={topSellingDateRange?.startDate}
                  maxDate={topSellingDateRange?.endDate}
                  onChange={(e) => handleDateChange('startDate', e)}
                  sx={{ width: window.innerWidth >= 567 ? '200px' : '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  label="End Date"
                  value={topSellingDateRange?.endDate}
                  minDate={topSellingDateRange?.startDate}
                  onChange={(e) => handleDateChange('endDate', e)}
                  sx={{ width: window.innerWidth >= 567 ? '200px' : '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Stack sx={{ mt: '8px' }} flexDirection={'row'} gap={1}>
              <IconButton onClick={clearFilter} sx={{ color: 'warning.main' }}>
                <Iconify icon="material-symbols:filter-alt-off-rounded" />
              </IconButton>
              <IconButton
                ref={topSellingRef}
                disabled={isSearchDisabled}
                onClick={() => getTopSellingProducts(topSellingLimit)}
                sx={{ color: isSearchDisabled ? 'default.main' : 'secondary.main' }}
              >
                <Iconify icon="iconamoon:search-duotone" width={20} />
              </IconButton>
            </Stack>
          </Stack>
          <Box ref={contentToPrint}>
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Variations</TableCell>
                      <TableCell>Sold QTY</TableCell>
                      <TableCell>Total $</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {topSellingFilteredItems?.length
                      ? topSellingFilteredItems?.map((x, i) => (
                          <TableRow key={`product-${i}`}>
                            <TableCell>{x?.srNo}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  width: '50px',
                                  height: '50px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <ProgressiveImg
                                  src={x?.productImage}
                                  alt={x?.productName}
                                  title={x?.productName}
                                  customClassName="w-full h-full rounded-md"
                                  // placeHolderClassName={'h-[75px]'}
                                />
                              </Box>
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: '200px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setViewProductDetailDialog(true);
                                setActiveProduct(x);
                              }}
                            >
                              {x?.productName}
                            </TableCell>
                            <TableCell>{x?.sku}</TableCell>
                            <TableCell sx={{ minWidth: '200px', display: 'flex' }}>
                              {x?.variations?.map((y) => (
                                <VariationLabel
                                  data={y}
                                  key={`variation-${y?.variationName}-type-${y?.variationTypeName}`}
                                />
                              ))}
                            </TableCell>
                            <TableCell>{x?.soldQuantity}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{x?.totalSalesAmount}</TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              {!topSellingFilteredItems?.length ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                >
                  No Data
                </Typography>
              ) : null}
            </Scrollbar>
          </Box>
        </>
      )}

      {topSellingProductsList?.length > 5 ? (
        <TablePagination
          component="div"
          rowsPerPage={rowsPerPage}
          page={topSellingCurrentPage}
          onPageChange={handleChangePage}
          count={topSellingProductsList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, topSellingProductsList?.length]}
        />
      ) : null}

      {/* View Product Detail Dialog */}
      {viewProductDetailDialog && (
        <Dialog
          fullWidth
          maxWidth={'sm'}
          open={viewProductDetailDialog}
          handleClose={closeProductDetailDialog}
          handleOpen={() => setViewProductDetailDialog(true)}
        >
          <StyledDialogTitle>Product Detail</StyledDialogTitle>
          <StyledDialogContent sx={{ color: 'text.secondary' }}>
            <Grid container spacing={2} mb={1}>
              <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  alt={activeProduct?.productName}
                  src={activeProduct?.productImage}
                  style={{ width: '300px', height: '300px', objectFit: 'contain' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid xs={12}>
                {getTypoGraphy('Title')}
                {activeProduct?.productName}
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid xs={12}>
                {getTypoGraphy('Variations')}
                <Box sx={{ display: 'flex' }}>
                  {activeProduct?.variations?.map((x) => (
                    <VariationLabel
                      data={x}
                      key={`variation-${x?.variationName}-type-${x?.variationTypeName}`}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid xs={12} sm={4}>
                {getTypoGraphy('Order Number')}
                {activeProduct?.orderNumber}
              </Grid>
              <Grid xs={12} sm={4}>
                <Box mb={1}>
                  {getTypoGraphy('Sold QTY')}
                  {activeProduct?.soldQuantity}
                </Box>
              </Grid>
              <Grid xs={12} sm={4}>
                <Box mb={1}>
                  {getTypoGraphy('SKU')}
                  {activeProduct?.sku}
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid xs={12} sm={4}>
                <Box mb={1}>
                  {getTypoGraphy('Available QTY')}
                  {activeProduct?.availableQuantity}
                </Box>
              </Grid>
              <Grid xs={12} sm={4}>
                <Box mb={1}>
                  {getTypoGraphy('Unit Amount')}${activeProduct?.unitAmount}
                </Box>
              </Grid>
              <Grid xs={12} sm={4}>
                <Box mb={1}>
                  {getTypoGraphy('Total Sales Amount')}${activeProduct?.unitAmount}
                </Box>
              </Grid>
            </Grid>
            {getTypoGraphy('Customers')}
            <Scrollbar sx={{ maxHeight: '500px' }}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {activeProduct?.customerDetail?.length
                      ? activeProduct?.customerDetail?.map((x, i) => (
                          <TableRow key={`product-${i}`}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>
                              {x?.firstName} {x?.lastName}
                            </TableCell>
                            <TableCell>{x?.email}</TableCell>
                          </TableRow>
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button onClick={closeProductDetailDialog} variant={'contained'}>
              Close
            </Button>
          </StyledDialogActions>
        </Dialog>
      )}
    </>
  );
};

export default memo(TopSellingProducts);
