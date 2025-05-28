import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  orderStatusList,
  setSelectedOrder,
  paymentStatusList,
  setSelectedOrderStatus,
  setOrderPage,
} from 'src/store/slices/ordersSlice';
import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Label from 'src/components/label';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { helperFunctions } from 'src/_helpers';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import { deleteOrder, getOrdersList } from 'src/actions/ordersActions';

import CancelOrderDialog from './order-cancel-dialog';
import UpdateStatusOrderDialog from './order-update-status-dialog';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

// ----------------------------------------------------------------------

const OrderList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const abortControllerRef = useRef(null);

  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [cancelDailog, setCancelDailog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [filterByOrderStatus, setFilterByOrderStatus] = useState('all');
  const [filterByPaymentStatus, setFilterByPaymentStatus] = useState('all');
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false);

  const { orderPage, ordersList, ordersLoading, crudOrdersLoading, cancelOrderLoading } =
    useSelector(({ orders }) => orders);

  useEffect(() => {
    let filteredItems = [...ordersList];

    // Combine filter conditions using a single filter function for efficiency
    const searchKey = searchedValue?.trim()?.toLowerCase(); // Preprocess search key once
    const filterFunction = (item) => {
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
        (!filterByOrderStatus ||
          filterByOrderStatus === 'all' ||
          item?.orderStatus?.toLowerCase() === filterByOrderStatus?.toLowerCase()) &&
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
      orderPage * rowsPerPage,
      orderPage * rowsPerPage + rowsPerPage
    );

    setFilteredItems(paginatedItems);
  }, [
    endDate,
    orderPage,
    startDate,
    ordersList,
    rowsPerPage,
    searchedValue,
    filterByOrderStatus,
    filterByPaymentStatus,
  ]);

  const loadData = useCallback(() => {
    dispatch(getOrdersList());
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      dispatch(setOrderPage(0));
      clearAbortController(); // Cancel request on unmount/route change
    };
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const searchValueHandler = useCallback((e) => {
    let value = e.target.value;
    setSearchedValue(value);
    dispatch(setOrderPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setOrderPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setOrderPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudOrdersLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedOrderId();
    },
    [crudOrdersLoading]
  );

  const handleView = useCallback(async () => {
    const order = ordersList?.find((x) => x?.id === selectedOrderId);
    if (order) {
      dispatch(setSelectedOrder(order));
      navigate(`/orders/order-detail/${selectedOrderId}`);
    }
  }, [selectedOrderId, ordersList]);

  const handleReturnRequest = useCallback(async () => {
    const order = ordersList?.find((x) => x?.id === selectedOrderId);
    if (order) {
      dispatch(setSelectedOrder(order));
      navigate(`/orders/return-request/${selectedOrderId}`);
    }
  }, [selectedOrderId, ordersList]);

  const handleDelete = useCallback(async () => {
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    const res = await dispatch(deleteOrder(selectedOrderId, abortControllerRef.current));
    if (res) {
      const cPage = orderPage !== 0 && filteredItems?.length === 1 ? orderPage - 1 : orderPage;
      dispatch(setOrderPage(cPage));
      loadData();
      handlePopup();
      setDeleteConfirmationDialog(false);
    }
  }, [selectedOrderId, filteredItems, orderPage, abortControllerRef]);

  const renderPopup = useMemo(() => {
    const item = ordersList?.find((x) => x?.id === selectedOrderId);
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{
          sx: { width: 180 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleView} disabled={cancelOrderLoading || crudOrdersLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {['pending', 'confirmed', 'shipped', 'delivered'].includes(item?.orderStatus) &&
        item?.paymentStatus === 'success' ? (
          <MenuItem
            sx={{ color: '#1C9CEA' }}
            disabled={cancelOrderLoading || crudOrdersLoading}
            onClick={() => {
              setOpenOrderDialog(true);
              const payload = {
                status: item?.orderStatus,
                trackingNumber: item?.orderStatus === 'shipped' ? item?.trackingNumber : '',
              };
              dispatch(setSelectedOrderStatus(payload));
            }}
          >
            {crudOrdersLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Update
              </Box>
            ) : (
              <>
                <Iconify icon="ic:round-update" sx={{ mr: 2 }} />
                Update
              </>
            )}
          </MenuItem>
        ) : null}

        {['pending', 'confirmed'].includes(item?.orderStatus) &&
        item?.paymentStatus === 'success' ? (
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={cancelOrderLoading || crudOrdersLoading}
            onClick={() => setCancelDailog(true)}
          >
            {cancelOrderLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Cancel
              </Box>
            ) : (
              <>
                <Iconify icon="mdi:archive-cancel" sx={{ mr: 2 }} />
                Cancel
              </>
            )}
          </MenuItem>
        ) : null}

        {item?.paymentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={crudOrdersLoading || cancelOrderLoading}
            onClick={() => setDeleteConfirmationDialog(true)}
          >
            {crudOrdersLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Delete
              </Box>
            ) : (
              <>
                <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                Delete
              </>
            )}
          </MenuItem>
        ) : null}
        {/* add condition for 15 return */}

        {['delivered'].includes(item?.orderStatus) &&
        item?.hasActiveReturns &&
        item?.paymentStatus === 'success' &&
        helperFunctions.isReturnValid(item?.deliveryDate) ? (
          <MenuItem
            sx={{ color: '#007BFF' }}
            onClick={handleReturnRequest}
            disabled={cancelOrderLoading || crudOrdersLoading}
          >
            <AssignmentReturnIcon fontSize="small" sx={{ mr: 2 }} />
            Return Request
          </MenuItem>
        ) : null}
      </Popover>
    ) : null;
  }, [open, ordersList, selectedOrderId, crudOrdersLoading, cancelOrderLoading]);

  const clearFilter = useCallback(() => {
    setEndDate(null);
    setStartDate(null);
    setSearchedValue('');
    setFilterByOrderStatus('all');
    setFilterByPaymentStatus('all');
  }, []);

  return (
    <>
      {ordersLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
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
              {paymentStatusList?.length > 0 ? (
                paymentStatusList?.map((x, i) => (
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
            <TextField
              select
              sx={{
                mt: '8px',
                minWidth: '150px',
              }}
              label="Order Status"
              value={filterByOrderStatus || 'all'}
              onChange={(e) => setFilterByOrderStatus(e.target.value)}
            >
              {orderStatusList?.length > 0 ? (
                orderStatusList?.map((x, i) => (
                  <MenuItem value={x?.value} key={`filter-order-status-${i}`}>
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
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredItems?.length
                    ? filteredItems?.map((x, i) => (
                        <TableRow key={`order-${i}`}>
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
                          <TableCell>{x?.paymentMethod}</TableCell>
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
                          <TableCell sx={{ width: '40px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedOrderId(x?.id);
                              }}
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

      {ordersList?.length > 5 ? (
        <TablePagination
          page={orderPage}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredOrderList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {/* Menu Popup */}
      {renderPopup}

      {/* Update Order Status */}
      {openOrderDialog ? (
        <UpdateStatusOrderDialog
          loadData={loadData}
          openOrderDialog={openOrderDialog}
          selectedOrderId={selectedOrderId}
          setOpenOrderDialog={setOpenOrderDialog}
        />
      ) : null}

      {/* Cancel Order Status */}
      {cancelDailog ? (
        <CancelOrderDialog
          loadData={loadData}
          handlePopup={handlePopup}
          cancelDailog={cancelDailog}
          selectedOrderId={selectedOrderId}
          setCancelDailog={setCancelDailog}
        />
      ) : null}

      {/* Confirmation dialog for Delete Order */}
      {deleteConfirmationDialog && (
        <Dialog
          open={deleteConfirmationDialog}
          handleOpen={() => setDeleteConfirmationDialog(true)}
          handleClose={() => setDeleteConfirmationDialog(false)}
        >
          <StyledDialogTitle>Confirmation</StyledDialogTitle>
          <StyledDialogContent>Do you want to delete this order?</StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              disabled={crudOrdersLoading}
              onClick={() => setDeleteConfirmationDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton variant="contained" onClick={handleDelete} loading={crudOrdersLoading}>
              Confirm
            </LoadingButton>
          </StyledDialogActions>
        </Dialog>
      )}
    </>
  );
};

export default OrderList;
