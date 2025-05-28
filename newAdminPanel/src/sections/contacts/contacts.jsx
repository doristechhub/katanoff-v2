import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { deleteContact } from 'src/actions/contactsActions';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setContactsPage } from 'src/store/slices/contactSlice';
import { getContactsList } from 'src/actions/contactsActions';
import ViewDialog from 'src/components/view-dialog';

// ----------------------------------------------------------------------

const Contacts = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState();

  const { contactsPage, contactsList, contactsLoading, crudContactsLoading } = useSelector(
    ({ contacts }) => contacts
  );

  let filteredItems = contactsList?.filter((item) => {
    const searchedKey = searchedValue?.toLowerCase()?.trim();
    const matchesCreatedDate = item?.createdDate
      ? moment(item?.createdDate)?.format('MM-DD-YYYY hh:mm a')?.includes(searchedKey)
      : false;
    const matchesEmail = item?.email?.toLowerCase()?.includes(searchedKey);
    const matchesFirstName = item?.firstName?.toLowerCase()?.includes(searchedKey);
    const matchesLastName = item?.lastName?.toLowerCase()?.includes(searchedKey);

    return matchesEmail || matchesFirstName || matchesLastName || matchesCreatedDate;
  });

  let currentItems = filteredItems?.slice(
    contactsPage * rowsPerPage,
    contactsPage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(() => {
    dispatch(getContactsList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
    return () => dispatch(setContactsPage(0));
  }, [loadData]);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    dispatch(setContactsPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setContactsPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    dispatch(setContactsPage(0));
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudContactsLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedContactId();
    },
    [crudContactsLoading]
  );

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteContact({
        contactId: selectedContactId,
      })
    );
    if (res) {
      const cPage =
        contactsPage !== 0 && currentItems?.length === 1 ? contactsPage - 1 : contactsPage;
      dispatch(setContactsPage(cPage));
      loadData();
      handlePopup();
      setDeleteDialog(false);
      setViewDialog(false);
    }
  }, [selectedContactId, currentItems, contactsPage]);
  const selectedContact = contactsList?.find((item) => item.id === selectedContactId);

  const renderPopup = useMemo(() => {
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
        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudContactsLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudContactsLoading ? (
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
        <MenuItem disabled={crudContactsLoading} onClick={() => setViewDialog(true)}>
          {crudContactsLoading ? (
            <Box
              sx={{
                gap: '15px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Spinner width={20} /> View
            </Box>
          ) : (
            <>
              <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
              View
            </>
          )}
        </MenuItem>
      </Popover>
    ) : null;
  }, [open, contactsList, selectedContactId, crudContactsLoading]);

  return (
    <>
      {contactsLoading ? (
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
            <Typography variant="h4">Contacts</Typography>
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
                      <TableCell>Date & Time</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentItems?.length
                      ? currentItems?.map((x, i) => (
                          <TableRow key={`subscribers-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>
                              {x?.firstName} {x?.lastName}
                            </TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.mobile}</TableCell>
                            <TableCell sx={{ minWidth: '180px' }}>
                              {moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedContactId(x?.id);
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
              {!currentItems?.length ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                >
                  No Data
                </Typography>
              ) : null}
            </Scrollbar>
            {contactsList?.length > 5 ? (
              <TablePagination
                component="div"
                page={contactsPage}
                rowsPerPage={rowsPerPage}
                count={filteredItems?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </Container>
      )}

      {renderPopup}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudContactsLoading}
        >
          Do you want to delete this contact?
        </ConfirmationDialog>
      ) : null}
      {viewDialog && selectedContact ? (
        <ViewDialog
          open={viewDialog}
          setOpen={setViewDialog}
          contact={selectedContact}
          loading={crudContactsLoading}
        />
      ) : null}
    </>
  );
};

export default Contacts;
