import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
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
  setReturnPage,
  returnStatusList,
  initRejectReturn,
  setSelectedReturn,
  returnPaymentStatusList,
  setSelectedRefundReturn,
  setSelectedRejectReturn,
  setSelectedApproveReturn,
  setRefundReturnMessage,
} from 'src/store/slices/returnSlice';
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
import { rejectReturn, getReturnList, recievedReturn } from 'src/actions/returnActions';

import RejectReturnDialog from './returns-reject-dialog';
import RefundReturnsDialog from './returns-refund-dialog';
import ApproveReturnDialog from './returns-approve-dialog';
import { initMessageObj } from 'src/_helpers/constants';
import { useAlertTimeout } from 'src/hooks/user-alert-timeout';
import AnimatedAlert from 'src/components/alert/AnimatedAlert';

// ----------------------------------------------------------------------

export const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

const validationSchema = Yup.object().shape({
  adminNote: Yup.string().required('Reason is Required'),
});

// ----------------------------------------------------------------------

const ReturnList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const [open, setOpen] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [rejectDailog, setRejectDailog] = useState(false);
  const [selectedReturnId, setSelectedReturnId] = useState();
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [filteredReturnList, setFilteredReturnList] = useState([]);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [filterByReturnStatus, setFilterByReturnStatus] = useState('all');
  const [filterByPaymentStatus, setFilterByPaymentStatus] = useState('all');
  const [receivedConfirmationDialog, setReceivedConfirmationDialog] = useState(false);

  const {
    returnPage,
    returnList,
    returnLoading,
    crudReturnLoading,
    refundReturnLoading,
    refundReturnMessage,
    rejectReturnLoading,
    selectedRejectReturn,
    recievedReturnLoading,
  } = useSelector(({ returns }) => returns);

  useAlertTimeout(
    refundReturnMessage,
    () => dispatch(setRefundReturnMessage(initMessageObj)),
    6000
  );

  useEffect(() => {
    let filteredItems = [...returnList];

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
        (!filterByReturnStatus ||
          filterByReturnStatus === 'all' ||
          item?.status?.toLowerCase() === filterByReturnStatus?.toLowerCase()) &&
        (!filterByPaymentStatus ||
          filterByPaymentStatus === 'all' ||
          item?.returnPaymentStatus?.toLowerCase() === filterByPaymentStatus?.toLowerCase()) &&
        (!searchedValue ||
          moment(item?.createdDate)
            ?.format('MM-DD-YYYY hh:mm a')
            ?.toLowerCase()
            .includes(searchKey) ||
          item?.orderNumber?.toLowerCase().includes(searchKey))
      );
    };

    filteredItems = filteredItems?.filter(filterFunction);
    setFilteredReturnList(filteredItems);
    const paginatedItems = filteredItems?.slice(
      returnPage * rowsPerPage,
      returnPage * rowsPerPage + rowsPerPage
    );

    setFilteredItems(paginatedItems);
  }, [
    returnPage,
    endDate,
    startDate,
    returnList,
    rowsPerPage,
    searchedValue,
    filterByReturnStatus,
    filterByPaymentStatus,
  ]);

  const loadData = useCallback(() => {
    dispatch(getReturnList());
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      dispatch(setReturnPage(0));
      clearAbortController();
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
    dispatch(setReturnPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setReturnPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setReturnPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudReturnLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedReturnId();
    },
    [crudReturnLoading]
  );

  const handleView = useCallback(async () => {
    const returnItem = returnList?.find((x) => x?.id === selectedReturnId);
    if (returnItem) {
      dispatch(setSelectedReturn(returnItem));
      navigate(`/returns/return-detail/${selectedReturnId}`);
    }
  }, [selectedReturnId, returnList]);

  const handleRecieved = useCallback(async () => {
    const payload = { returnId: selectedReturnId, returnStatus: 'received' };
    const res = await dispatch(recievedReturn(payload));
    if (res) {
      loadData();
      handlePopup();
      setReceivedConfirmationDialog(false);
    }
  }, [selectedReturnId]);

  const handleReject = useCallback(
    async (val, { resetForm }) => {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const res = await dispatch(
        rejectReturn(
          {
            returnId: selectedReturnId,
            adminNote: val?.adminNote,
          },
          abortControllerRef.current
        )
      );
      if (res) {
        loadData();
        resetForm();
        handlePopup();
        closeRejectPopup();
        setRejectDailog(false);
      }
    },
    [selectedReturnId, abortControllerRef]
  );

  const rejectFormik = useFormik({
    validationSchema,
    onSubmit: handleReject,
    enableReinitialize: true,
    initialValues: selectedRejectReturn,
  });

  const closeRejectPopup = useCallback(() => {
    setRejectDailog(false);
    rejectFormik.resetForm();
    dispatch(setSelectedRejectReturn(initRejectReturn));
  }, []);

  const updateOrApproveReturnRequest = useCallback((item) => {
    setOpenReturnDialog(true);

    if (item?.shippingLabel) {
      const url = new URL(item?.shippingLabel);
      const fileExtension = url.pathname.split('.').pop();

      const payload = [
        {
          type: 'old',
          mimeType: `${fileExtension === 'pdf' ? 'application' : 'image'}/${fileExtension}`,
          image: item?.shippingLabel,
        },
      ];
      dispatch(
        setSelectedApproveReturn({
          imageFile: [],
          previewImage: payload,
          deleteUploadedShippingLabel: [],
        })
      );
    }
  }, []);

  const renderPopup = useMemo(() => {
    const item = returnList?.find((x) => x?.id === selectedReturnId);
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
        <MenuItem onClick={handleView} disabled={rejectReturnLoading || crudReturnLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {item?.status === 'pending' && item?.returnPaymentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => updateOrApproveReturnRequest(item)}
            disabled={rejectReturnLoading || crudReturnLoading}
          >
            {crudReturnLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Approve
              </Box>
            ) : (
              <>
                <Iconify icon="icon-park-solid:success" sx={{ mr: 2 }} />
                Approve
              </>
            )}
          </MenuItem>
        ) : null}

        {item?.status === 'pending' && item?.returnPaymentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'error.main' }}
            onClick={() => setRejectDailog(true)}
            disabled={rejectReturnLoading || crudReturnLoading}
          >
            {rejectReturnLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Reject
              </Box>
            ) : (
              <>
                <Iconify icon="fluent:text-change-reject-24-filled" sx={{ mr: 2 }} />
                Reject
              </>
            )}
          </MenuItem>
        ) : null}

        {/* {item?.status === 'approved' && item?.returnPaymentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'info.main' }}
            aria-label="Update Shipping label"
            onClick={() => updateOrApproveReturnRequest(item)}
            disabled={rejectReturnLoading || crudReturnLoading}
          >
            {crudReturnLoading ? (
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
        ) : null} */}

        {item?.status === 'approved' && item?.returnPaymentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'warning.main' }}
            aria-label="Update Shipping label"
            onClick={() => setReceivedConfirmationDialog(true)}
            disabled={recievedReturnLoading || rejectReturnLoading || crudReturnLoading}
          >
            {recievedReturnLoading ? (
              <Box
                sx={{
                  gap: '15px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spinner width={20} /> Received
              </Box>
            ) : (
              <>
                <Iconify icon="ri:folder-received-fill" sx={{ mr: 2 }} />
                Received
              </>
            )}
          </MenuItem>
        ) : null}

        {item?.status === 'received' &&
        ['pending', 'failed_refund', 'refund_initialization_failed', 'cancelled_refund'].includes(
          item?.returnPaymentStatus
        ) ? (
          <MenuItem
            sx={{ color: 'success.main' }}
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
            disabled={crudReturnLoading || refundReturnLoading}
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
  }, [
    open,
    returnList,
    selectedReturnId,
    crudReturnLoading,
    refundReturnLoading,
    rejectReturnLoading,
    recievedReturnLoading,
  ]);

  const renderConfirmationReceived = useMemo(() => {
    return receivedConfirmationDialog ? (
      <Dialog
        open={receivedConfirmationDialog}
        handleOpen={() => setReceivedConfirmationDialog(true)}
        handleClose={() => setReceivedConfirmationDialog(false)}
      >
        <StyledDialogTitle>Confirmation</StyledDialogTitle>
        <StyledDialogContent>Do you received this parcel?</StyledDialogContent>
        <StyledDialogActions>
          <Button
            variant="outlined"
            disabled={recievedReturnLoading}
            onClick={() => setReceivedConfirmationDialog(false)}
          >
            No
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleRecieved}
            loading={recievedReturnLoading}
          >
            Yes, Received
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [receivedConfirmationDialog, recievedReturnLoading]);

  const clearFilter = useCallback(() => {
    setEndDate(null);
    setStartDate(null);
    setSearchedValue('');
    setFilterByReturnStatus('all');
    setFilterByPaymentStatus('all');
  }, []);
  return (
    <>
      {returnLoading ? (
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
                  label="End Date"
                  value={endDate}
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
              {returnPaymentStatusList?.length > 0 ? (
                returnPaymentStatusList?.map((x, i) => (
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
              label="Return Status"
              value={filterByReturnStatus || 'all'}
              onChange={(e) => setFilterByReturnStatus(e.target.value)}
            >
              {returnStatusList?.length > 0 ? (
                returnStatusList?.map((x, i) => (
                  <MenuItem value={x?.value} key={`filter-returnItem-status-${i}`}>
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

                    <TableCell>Return Payment Status</TableCell>
                    <TableCell>Return Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredItems?.length
                    ? filteredItems?.map((x, i) => (
                        <TableRow key={`returns-order-${i}`}>
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
                          <TableCell sx={{ width: '40px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedReturnId(x?.id);
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

      {returnList?.length > 5 ? (
        <TablePagination
          page={returnPage}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredReturnList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {/* Menu Popup */}
      {renderPopup}

      {/* Approve Return Request */}
      {openReturnDialog && (
        <ApproveReturnDialog
          setOpen={setOpen}
          loadData={loadData}
          openReturnDialog={openReturnDialog}
          selectedReturnId={selectedReturnId}
          setOpenReturnDialog={setOpenReturnDialog}
        />
      )}

      {/* Reject Return Request */}
      {rejectDailog && (
        <RejectReturnDialog
          loadData={loadData}
          handlePopup={handlePopup}
          rejectDailog={rejectDailog}
          setRejectDailog={setRejectDailog}
          selectedReturnId={selectedReturnId}
        />
      )}

      {/* Confirmation dialog for received Return */}
      {renderConfirmationReceived}

      {/* Refund dialog */}
      {openRefundDialog && (
        <RefundReturnsDialog
          setOpen={setOpen}
          loadData={loadData}
          selectedReturnId={selectedReturnId}
          openRefundDialog={openRefundDialog}
          setOpenRefundDialog={setOpenRefundDialog}
        />
      )}
    </>
  );
};

export default ReturnList;
