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

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { helperFunctions } from 'src/_helpers';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import { setSelectedOrder } from 'src/store/slices/ordersSlice';
import { getOrderRefundList } from 'src/actions/orderRefundActions';
import {
  refundStatuses,
  setOrderRefundPage,
  setOrderRefundPaymentMessage,
} from 'src/store/slices/refundSlice';

import RefundOrderDialog from './refund-order-dialog';
import AnimatedAlert from 'src/components/alert/AnimatedAlert';
import { initMessageObj } from 'src/_helpers/constants';
import { useAlertTimeout } from 'src/hooks/user-alert-timeout';

// ----------------------------------------------------------------------

export const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

// ----------------------------------------------------------------------

const Refund = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [refundDailog, setRefundDailog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [filterByPaymentStatus, setFilterByPaymentStatus] = useState('all');

  const {
    orderRefundPage,
    orderRefundList,
    orderRefundLoader,
    orderRefundPaymentLoading,
    orderRefundPaymentMessage,
  } = useSelector(({ refund }) => refund);

  useAlertTimeout(
    orderRefundPaymentMessage,
    () => dispatch(setOrderRefundPaymentMessage(initMessageObj)),
    6000
  );

  useEffect(() => {
    let filteredItems = [...orderRefundList];

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
          item?.paymentStatus?.toLowerCase() === filterByPaymentStatus?.toLowerCase()) &&
        (!searchedValue ||
          moment(item?.createdDate)
            ?.format('MM-DD-YYYY hh:mm a')
            ?.toLowerCase()
            .includes(searchKey) ||
          item?.orderNumber?.toLowerCase().includes(searchKey) ||
          item?.shippingAddress?.name?.toLowerCase().includes(searchKey) ||
          item?.shippingAddress?.email?.toLowerCase().includes(searchKey) ||
          item?.shippingAddress?.mobile?.toString().toLowerCase().includes(searchKey))
      );
    };

    filteredItems = filteredItems?.filter(filterFunction);
    setFilteredOrderList(filteredItems);
    const paginatedItems = filteredItems?.slice(
      orderRefundPage * rowsPerPage,
      orderRefundPage * rowsPerPage + rowsPerPage
    );

    setFilteredItems(paginatedItems);
  }, [
    endDate,
    startDate,
    rowsPerPage,
    searchedValue,
    orderRefundPage,
    orderRefundList,
    filterByPaymentStatus,
  ]);

  const loadData = useCallback(() => {
    dispatch(getOrderRefundList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setOrderRefundPage(0));
  }, []);

  const searchValueHandler = useCallback((e) => {
    let value = e.target.value;
    setSearchedValue(value);
    dispatch(setOrderRefundPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setOrderRefundPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setOrderRefundPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (orderRefundPaymentLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedOrderId();
    },
    [orderRefundPaymentLoading]
  );

  const handleView = useCallback(async () => {
    const order = orderRefundList?.find((x) => x?.id === selectedOrderId);
    if (order) {
      dispatch(setSelectedOrder(order));
      navigate(`/orders/order-detail/${selectedOrderId}`);
    }
  }, [selectedOrderId, orderRefundList]);

  const renderPopup = useMemo(() => {
    const item = orderRefundList?.find((x) => x?.id === selectedOrderId);
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
        <MenuItem onClick={handleView} disabled={orderRefundPaymentLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {['failed_refund', 'refund_initialization_failed', 'cancelled_refund'].includes(
          item?.paymentStatus
        ) && ['confirmed', 'cancelled'].includes(item?.orderStatus) ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            disabled={orderRefundPaymentLoading}
            onClick={() => setRefundDailog(true)}
          >
            {orderRefundPaymentLoading ? (
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
  }, [open, orderRefundList, selectedOrderId, orderRefundPaymentLoading]);

  const clearFilter = useCallback(() => {
    setEndDate(null);
    setStartDate(null);
    setSearchedValue('');
    setFilterByPaymentStatus('all');
  }, []);

  return (
    <>
      {orderRefundLoader ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
          <AnimatedAlert
            messageObj={orderRefundPaymentMessage}
            onClose={() => dispatch(setOrderRefundPaymentMessage(initMessageObj))}
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
                  value={startDate}
                  maxDate={endDate}
                  label="Start Date"
                  onChange={setStartDate}
                  sx={{ width: window.innerWidth >= 567 ? '200px' : '100%' }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DemoContainer components={['DatePicker']}>
                <DatePicker
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
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mobile</TableCell>
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
                        <TableRow key={`order-refund-${i}`}>
                          <TableCell sx={{ width: '80px' }}>{x?.srNo}</TableCell>
                          <TableCell sx={{ minWidth: '150px' }}>
                            {x?.shippingAddress?.name}
                          </TableCell>
                          <TableCell sx={{ minWidth: '270px' }}>
                            {x?.shippingAddress?.email}
                          </TableCell>
                          <TableCell>{x?.shippingAddress?.mobile}</TableCell>
                          <TableCell>{x?.orderNumber}</TableCell>
                          <TableCell sx={{ minWidth: '180px' }}>
                            {moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')}
                          </TableCell>
                          <TableCell>
                            {helperFunctions?.capitalizeCamelCase(x?.paymentMethod)}
                          </TableCell>
                          <TableCell>
                            <Label
                              color={helperFunctions.getStatusBg(x?.paymentStatus) || 'success'}
                            >
                              {x?.paymentStatus}
                            </Label>
                          </TableCell>
                          <TableCell>
                            <Label color={helperFunctions.getStatusBg(x?.orderStatus) || 'success'}>
                              {x?.orderStatus}
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
                                setSelectedOrderId(x?.id);
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

      {orderRefundList?.length > 5 ? (
        <TablePagination
          component="div"
          page={orderRefundPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredOrderList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {/* Menu Popup */}
      {renderPopup}

      {/* Refund Payment Dialog */}
      {refundDailog ? (
        <RefundOrderDialog
          loadData={loadData}
          handlePopup={handlePopup}
          refundDailog={refundDailog}
          setRefundDailog={setRefundDailog}
          selectedOrderId={selectedOrderId}
        />
      ) : null}
    </>
  );
};

export default Refund;
