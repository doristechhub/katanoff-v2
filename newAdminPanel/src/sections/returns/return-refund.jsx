import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Table,
  Popover,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  setSelectedReturn,
  setRefundReturnPage,
  setSelectedRefundReturn,
  setRefundReturnMessage,
} from 'src/store/slices/returnSlice';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { helperFunctions } from 'src/_helpers';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import { refundStatuses } from 'src/store/slices/refundSlice';
import { getReturnRefundList } from 'src/actions/returnActions';
import RefundReturnsDialog from '../returns/returns-refund-dialog';
import AnimatedAlert from 'src/components/alert/AnimatedAlert';
import { initMessageObj } from 'src/_helpers/constants';
import { useAlertTimeout } from 'src/hooks/user-alert-timeout';

// ----------------------------------------------------------------------

const ReturnRefund = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [selectedReturnRefundId, setSelectedReturnRefundId] = useState();
  const [filterByPaymentStatus, setFilterByPaymentStatus] = useState('all');
  const [filteredReturnRefundList, setFilteredReturnRefundList] = useState([]);

  const {
    refundReturnPage,
    returnRefundList,
    refundReturnLoading,
    refundReturnMessage,
    returnRefundLoader,
  } = useSelector(({ returns }) => returns);

  useAlertTimeout(
    refundReturnMessage,
    () => dispatch(setRefundReturnMessage(initMessageObj)),
    6000
  );

  useEffect(() => {
    let filteredItems = [...returnRefundList];

    // Combine filter conditions using a single filter function for efficiency
    const filterFunction = (item) => {
      const searchKey = searchedValue?.trim()?.toLowerCase(); // Preprocess search key once

      let start;
      let isIncludes;
      if (startDate && item?.createdDate) {
        let created = moment(item?.createdDate)?.format('MM-DD-YYYY');
        created = moment(created, 'MM-DD-YYYY');
        start = moment(startDate)?.format('MM-DD-YYYY');
        start = moment(start, 'MM-DD-YYYY');

        let end = endDate
          ? moment(endDate)?.format('MM-DD-YYYY')
          : moment(new Date())?.format('MM-DD-YYYY');
        end = moment(end, 'MM-DD-YYYY');
        isIncludes = start ? created?.isBetween(start, end, null, '[]') : false;
      }

      return (
        (!start || isIncludes) &&
        (!filterByPaymentStatus ||
          filterByPaymentStatus === 'all' ||
          item?.returnPaymentStatus?.toLowerCase() === filterByPaymentStatus?.toLowerCase()) &&
        (!searchedValue ||
          moment(item?.createdDate)
            ?.format('MM-DD-YYYY hh:mm a')
            ?.toLowerCase()
            .includes(searchKey) ||
          item?.orderNumber?.toLowerCase().includes(searchKey) ||
          item?.stripeRefundId?.toLowerCase().includes(searchKey) ||
          item?.stripeARNNumber?.toLowerCase().includes(searchKey) ||
          item?.stripeRefundFailureReason?.toLowerCase().includes(searchKey) ||
          item?.shippingAddress?.mobile?.toString().toLowerCase().includes(searchKey))
      );
    };

    filteredItems = filteredItems?.filter(filterFunction);
    setFilteredReturnRefundList(filteredItems);
    const paginatedItems = filteredItems?.slice(
      refundReturnPage * rowsPerPage,
      refundReturnPage * rowsPerPage + rowsPerPage
    );

    setFilteredItems(paginatedItems);
  }, [
    refundReturnPage,
    endDate,
    startDate,
    rowsPerPage,
    searchedValue,
    returnRefundList,
    filterByPaymentStatus,
  ]);

  const loadData = useCallback(() => {
    dispatch(getReturnRefundList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setRefundReturnPage(0));
  }, []);

  const searchValueHandler = useCallback((e) => {
    let value = e.target.value;
    setSearchedValue(value);
    dispatch(setRefundReturnPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setRefundReturnPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setRefundReturnPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (refundReturnLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedReturnRefundId();
      dispatch(setSelectedReturn({}));
    },
    [refundReturnLoading]
  );

  const handleView = useCallback(async () => {
    const returnItem = returnRefundList?.find((x) => x?.id === selectedReturnRefundId);
    if (returnItem) {
      dispatch(setSelectedReturn(returnItem));
      navigate(`/returns/return-detail/${selectedReturnRefundId}`);
    }
  }, [selectedReturnRefundId, returnRefundList]);

  const renderPopup = useMemo(() => {
    const item = returnRefundList?.find((x) => x?.id === selectedReturnRefundId);
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleView} disabled={refundReturnLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {['failed_refund', 'refund_initialization_failed', 'cancelled_refund'].includes(
          item?.returnPaymentStatus
        ) && ['received'].includes(item?.status) ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            disabled={refundReturnLoading}
            onClick={() => {
              setOpenRefundDialog(true);
              dispatch(setSelectedReturn(item));
              dispatch(
                setSelectedRefundReturn({
                  refundAmount:
                    +helperFunctions.toFixedNumber(
                      item?.refundAmount || item?.returnRequestAmount
                    ) || '',
                  refundDescription: item?.refundDescription || '',
                })
              );
            }}
          >
            {refundReturnLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Refund
              </Box>
            ) : (
              <>
                <Iconify icon="ri:refund-2-fill" sx={{ mr: 2 }} />
                Refund
              </>
            )}
          </MenuItem>
        ) : null}
      </Popover>
    ) : null;
  }, [open, returnRefundList, selectedReturnRefundId, refundReturnLoading]);

  const clearFilter = useCallback(() => {
    setEndDate(null);
    setStartDate(null);
    setSearchedValue('');
    setFilterByPaymentStatus('all');
  }, []);

  return (
    <>
      {returnRefundLoader ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
          <AnimatedAlert
            messageObj={refundReturnMessage}
            onClose={() => dispatch(setRefundReturnMessage(initMessageObj))}
          />
          <Stack my={2} mx={2} gap={2} direction="row" flexWrap={'wrap'} alignItems="center">
            <TextField
              type="search"
              placeholder="Search"
              value={searchedValue}
              onChange={searchValueHandler}
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
                  size="small"
                  value={startDate}
                  label="Start Date"
                  maxDate={endDate}
                  onChange={setStartDate}
                  sx={{ width: window.innerWidth >= 567 ? '200px' : '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
                  size="small"
                  value={endDate}
                  label="End Date"
                  minDate={startDate}
                  onChange={setEndDate}
                  sx={{ width: window.innerWidth >= 567 ? '200px' : '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <TextField
              select
              sx={{
                mt: '8px',
                minWidth: '150px',
              }}
              label="Payment Status"
              value={filterByPaymentStatus || 'all'}
              onChange={(e) => setFilterByPaymentStatus(e.target.value)}
            >
              {refundStatuses?.length > 0 ? (
                refundStatuses?.map((x, i) => (
                  <MenuItem value={x?.value} key={`filter-payment-status-${i}`}>
                    <Label
                      key={x?.label}
                      color={helperFunctions.getStatusBg(x?.value) || 'success'}
                    >
                      {x?.label}
                    </Label>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No Item</MenuItem>
              )}
            </TextField>
            <Button
              sx={{ mt: '8px' }}
              variant="contained"
              onClick={clearFilter}
              startIcon={<Iconify icon="tdesign:filter-clear" key={Math.random()} />}
            >
              Clear
            </Button>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Order Status</TableCell>
                    <TableCell>Refund Failure Reason</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredItems?.length
                    ? filteredItems?.map((x, i) => (
                        <TableRow key={`returned-order-refund-${i}`}>
                          <TableCell sx={{ width: '80px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.orderNumber}</TableCell>
                          <TableCell sx={{ minWidth: '180px' }}>
                            {moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')}
                          </TableCell>
                          <TableCell>
                            {helperFunctions?.capitalizeCamelCase(x?.paymentMethod)}
                          </TableCell>
                          <TableCell>
                            <Label
                              color={
                                helperFunctions.getStatusBg(x?.returnPaymentStatus) || 'success'
                              }
                            >
                              {x?.returnPaymentStatus}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <Label color={helperFunctions.getStatusBg(x?.status) || 'success'}>
                              {x?.status}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                height: 20,
                                minWidth: '250px',
                                overflow: 'hidden',
                                WebkitLineClamp: 1,
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {x?.stripeRefundFailureReason || (
                                <p style={{ textAlign: 'center', width: '100%' }}>-</p>
                              )}
                            </Box>
                          </TableCell>

                          <TableCell sx={{ width: '40px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedReturnRefundId(x?.id);
                              }}
                              icon="iconamoon:menu-kebab-vertical-bold"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
            {!filteredItems?.length ? (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
              >
                No Data
              </Typography>
            ) : null}
          </Scrollbar>
        </>
      )}

      {returnRefundList?.length > 5 ? (
        <TablePagination
          page={refundReturnPage}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredReturnRefundList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {/* Menu Popup */}
      {renderPopup}

      {/* Refund dialog */}
      {openRefundDialog && (
        <RefundReturnsDialog
          setOpen={setOpen}
          loadData={loadData}
          openRefundDialog={openRefundDialog}
          setOpenRefundDialog={setOpenRefundDialog}
          selectedReturnId={selectedReturnRefundId}
        />
      )}
    </>
  );
};

export default ReturnRefund;
