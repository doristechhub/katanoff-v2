import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  Table,
  TableRow,
  TableBody,
  Container,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
  Popover,
  MenuItem,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { deleteUser, getUserList } from 'src/actions/userActions';

// ----------------------------------------------------------------------

const User = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [open, setOpen] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState();

  const { userLoading, crudUserLoading, userList } = useSelector(({ user }) => user);

  const searchedKey = searchedValue?.toLowerCase()?.trim();
  const filteredItems = useMemo(() => {
    if (!searchedKey) return userList;
    return userList.filter((item) => {
      const matchesCreatedDate = item.createdDate
        ? moment(item.createdDate).format('MM-DD-YYYY hh:mm a').includes(searchedKey)
        : false;
      const matchesEmail = item.email?.toLowerCase()?.includes(searchedKey);
      const matchesPhoneNumber = item.phoneNumber?.toLowerCase()?.includes(searchedKey);
      const matchesFirstName = item.firstName?.toString()?.toLowerCase().includes(searchedKey);
      const matchesLastName = item.lastName?.toString()?.toLowerCase().includes(searchedKey);
      return (
        matchesEmail ||
        matchesPhoneNumber ||
        matchesFirstName ||
        matchesLastName ||
        matchesCreatedDate
      );
    });
  }, [userList, searchedKey]);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  const loadData = useCallback(() => {
    dispatch(getUserList());
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const searchValueHandler = useCallback((e) => {
    const value = e.target.value;
    setSearchedValue(value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    setPage(0);
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback((e, reason) => {
    setOpen(null);
    setSelectedUserId(undefined);
  }, []);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteUser({
        userId: selectedUserId,
      })
    );

    if (res) {
      const cPage = page !== 0 && paginatedItems?.length === 1 ? page - 1 : page;

      setPage(cPage);
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedUserId, paginatedItems, page]);

  const renderPopup = useMemo(() => {
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{ sx: { width: 140 } }}
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={() => setDeleteDialog(true)}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    ) : null;
  }, [open]);

  return (
    <>
      {userLoading ? (
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
            <Typography variant="h4">Users</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
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
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone Number</TableCell>
                      <TableCell>Date & Time (MM-DD-YYYY)</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedItems?.length ? (
                      paginatedItems?.map((x, i) => (
                        <TableRow key={`menu-category-${i}`}>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.firstName}</TableCell>
                          <TableCell>{x?.lastName}</TableCell>
                          <TableCell>{x?.email}</TableCell>
                          <TableCell>{x?.phoneNumber || '-'}</TableCell>
                          <TableCell sx={{ minWidth: '180px' }}>
                            {moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')}
                          </TableCell>
                          <TableCell sx={{ width: '50px' }}>
                            <Iconify
                              className="cursor-pointer"
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedUserId(x?.id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No Data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {userList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
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

      <ConfirmationDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        handleConfirm={handleDelete}
        loading={crudUserLoading}
      >
        Do you want to delete this user?
      </ConfirmationDialog>
    </>
  );
};

export default User;
