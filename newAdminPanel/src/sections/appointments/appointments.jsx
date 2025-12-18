import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Box,
  Card,
  Table,
  Popover,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  Container,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  FormHelperText,
  TablePagination,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  deleteAppointment,
  getAppointmentList,
  updateStatusAppointment,
} from 'src/actions/appointmentActions';
import Label from 'src/components/label';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Textarea from 'src/components/textarea';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { getStatusWiseTagBg, setAppointmentPage } from 'src/store/slices/appointmentSlice';

// ----------------------------------------------------------------------

const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

const validationSchema = Yup.object().shape({
  rejectReason: Yup.string().required('Reason is Required'),
});

// ----------------------------------------------------------------------

const Appointments = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const abortControllerRef = useRef(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState();
  const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
  const [openRejectAppointmentDialog, setOpenRejectAppointmentDialog] = useState(false);

  const {
    appointmentPage,
    appointmentList,
    appointmentLoader,
    crudAppointmentLoading,
    rejectAppointmentReason,
    rejectAppointmentLoading,
  } = useSelector(({ appointments }) => appointments);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = appointmentList?.filter((item) => {
    return (
      item?.mobile?.toString()?.includes(searchKey) ||
      item?.name?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey) ||
      item?.dateTime?.toLowerCase()?.includes(searchKey) ||
      item?.appointmentStatus?.toLowerCase()?.includes(searchKey)
    );
  });

  filteredItems = filteredItems?.slice(
    appointmentPage * rowsPerPage,
    appointmentPage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(() => {
    dispatch(getAppointmentList());
  }, []);

  useEffect(() => {
    loadData();
    return () => {
      dispatch(setAppointmentPage(0));
      clearAbortController(); // Cancel request on unmount/route change
    };
  }, []);

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const searchValueHandler = useCallback((event) => {
    let value = event.target.value;
    setSearchedValue(value);
    dispatch(setAppointmentPage(0));
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    dispatch(setAppointmentPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    dispatch(setAppointmentPage(0));
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudAppointmentLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedAppointmentId();
    },
    [crudAppointmentLoading]
  );

  const handleView = useCallback(async () => {
    setOpenAppointmentDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteAppointment({
        appointmentId: selectedAppointmentId,
      })
    );
    if (res) {
      const cPage =
        appointmentPage !== 0 && filteredItems?.length === 1
          ? appointmentPage - 1
          : appointmentPage;
      dispatch(setAppointmentPage(cPage));
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedAppointmentId, appointmentPage, filteredItems]);

  const handleStatus = useCallback(async () => {
    const payload = {
      appointmentId: selectedAppointmentId,
      appointmentStatus: 'approved', // 'pending','approved', 'rejected'
    };
    if (!abortControllerRef.current) {
      abortControllerRef.current = new AbortController();
    }
    const res = await dispatch(updateStatusAppointment(payload, abortControllerRef.current));
    if (res) {
      loadData();
      handlePopup();
    }
  }, [selectedAppointmentId, abortControllerRef]);

  const handleReject = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        appointmentStatus: 'rejected',
        rejectReason: val?.rejectReason,
        appointmentId: selectedAppointmentId,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const res = await dispatch(updateStatusAppointment(payload, abortControllerRef.current));
      if (res) {
        loadData();
        resetForm();
        closeRejectAppointmentPopup();
      }
    },
    [selectedAppointmentId, abortControllerRef]
  );

  const { values, errors, touched, resetForm, handleBlur, handleChange, handleSubmit } = useFormik({
    validationSchema,
    onSubmit: handleReject,
    enableReinitialize: true,
    initialValues: rejectAppointmentReason,
  });

  const closeAppointmentPopup = useCallback(() => {
    setOpenAppointmentDialog(false);
  }, []);

  const closeRejectAppointmentPopup = useCallback(() => {
    setOpenRejectAppointmentDialog(false);
    resetForm();
  }, []);

  const renderPopup = useMemo(() => {
    const item = appointmentList?.find((x) => x?.id === selectedAppointmentId);
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
        <MenuItem onClick={handleView} disabled={crudAppointmentLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        {item?.appointmentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'success.main' }}
            disabled={crudAppointmentLoading}
            onClick={() => handleStatus('approve')}
          >
            {crudAppointmentLoading ? (
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

        {item?.appointmentStatus === 'pending' ? (
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={rejectAppointmentLoading}
            onClick={() => setOpenRejectAppointmentDialog(true)}
          >
            {rejectAppointmentLoading ? (
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
        {item?.appointmentStatus !== 'pending' ? (
          <MenuItem
            // onClick={handleDelete}
            sx={{ color: 'error.main' }}
            disabled={crudAppointmentLoading}
            onClick={() => setDeleteDialog(true)}
          >
            {crudAppointmentLoading ? (
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
      </Popover>
    ) : null;
  }, [
    open,
    appointmentList,
    selectedAppointmentId,
    crudAppointmentLoading,
    rejectAppointmentLoading,
  ]);

  const renderDialog = useMemo(() => {
    const item = appointmentList?.find((x) => x?.id === selectedAppointmentId);
    return openAppointmentDialog ? (
      <Dialog
        fullWidth
        maxWidth={'sm'}
        open={openAppointmentDialog}
        handleClose={closeAppointmentPopup}
        handleOpen={() => setOpenAppointmentDialog(true)}
      >
        <StyledDialogTitle>Appointment Details</StyledDialogTitle>
        <StyledDialogContent sx={{ color: 'text.secondary' }}>
          <Box mb={1}>
            {getTypoGraphy('Customer Name')}
            {item?.name}
          </Box>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6} sx={{ textWrap: 'nowrap' }}>
              {getTypoGraphy('Email')}
              {item?.email}
            </Grid>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Mobile')}
              {item?.mobile}
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Status')}

              <Label color={getStatusWiseTagBg(item?.appointmentStatus) || 'success'}>
                {item?.appointmentStatus}
              </Label>
            </Grid>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Date')}
              {item?.dateTime
                ? moment(item?.dateTime, 'DD-MM-YYYY HH:mm').format('MM-DD-YYYY hh:mm A')
                : '-'}
            </Grid>
          </Grid>
          {item?.createdDate ? (
            <Box mb={1}>
              {getTypoGraphy('Created Date & Time')}
              {moment(item?.createdDate).format('MM-DD-YYYY hh:mm A')}
            </Box>
          ) : null}
          <Box mb={1} sx={{ textWrap: 'wrap', wordBreak: 'break-all' }}>
            {getTypoGraphy('Message')}
            {item?.message}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeAppointmentPopup} variant={'outlined'}>
            Close
          </Button>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [selectedAppointmentId, appointmentList, openAppointmentDialog]);

  const renderRejectDialog = useMemo(() => {
    return openRejectAppointmentDialog ? (
      <Dialog
        open={openRejectAppointmentDialog}
        handleClose={closeRejectAppointmentPopup}
        handleOpen={() => setOpenRejectAppointmentDialog(true)}
      >
        <StyledDialogTitle>Reject Appointment</StyledDialogTitle>
        <StyledDialogContent sx={{ color: 'text.secondary' }}>
          {getTypoGraphy('Reason')}
          <Textarea
            sx={{
              mt: '10px',
              width: '100%',
              minWidth: '300px',
            }}
            minRows={3}
            maxRows={4}
            label="Reason"
            name="rejectReason"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values?.rejectReason || ''}
          />
          {touched?.rejectReason && errors?.rejectReason ? (
            <FormHelperText error={!!(touched?.rejectReason && errors?.rejectReason)}>
              {errors?.rejectReason}
            </FormHelperText>
          ) : null}
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            onClick={closeRejectAppointmentPopup}
            disabled={rejectAppointmentLoading}
            variant="outlined"
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={rejectAppointmentLoading}
          >
            Save
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [values, errors, touched, openRejectAppointmentDialog, rejectAppointmentLoading]);

  return (
    <>
      {appointmentLoader ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <Container>
          <Box
            sx={{
              mb: 5,
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4">Appointments</Typography>
            <Box>
              <TextField
                size="small"
                type="search"
                sx={{ padding: 0 }}
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
              />
            </Box>
          </Box>
          <Card>
            <Box p={'3px'} />
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Date & Time (MM-DD-YYYY)</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`appointment-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.name}</TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.mobile}</TableCell>
                            <TableCell sx={{ minWidth: '150px' }}>{x?.dateTime}</TableCell>
                            <TableCell>
                              <Label color={getStatusWiseTagBg(x?.appointmentStatus) || 'success'}>
                                {x?.appointmentStatus}
                              </Label>
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedAppointmentId(x?.id);
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
            {appointmentList?.length > 5 ? (
              <TablePagination
                component="div"
                page={appointmentPage}
                rowsPerPage={rowsPerPage}
                count={appointmentList?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </Container>
      )}

      {renderPopup}

      {renderDialog}

      {renderRejectDialog}
      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudAppointmentLoading}
        >
          Do you want to delete this appointment?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default Appointments;
