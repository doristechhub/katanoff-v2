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
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { getUserList } from 'src/actions/userActions';

// ----------------------------------------------------------------------

const User = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');

  const { userLoading, userList } = useSelector(({ user }) => user);

  const searchedKey = searchedValue?.toLowerCase()?.trim();
  const filteredItems = useMemo(() => {
    if (!searchedKey) return userList;
    return userList.filter((item) => {
      const matchesCreatedDate = item.createdDate
        ? moment(item.createdDate).format('MM-DD-YYYY hh:mm a').includes(searchedKey)
        : false;
      const matchesEmail = item.email?.toLowerCase()?.includes(searchedKey);
      const matchesFirstName = item.firstName?.toString()?.toLowerCase().includes(searchedKey);
      const matchesLastName = item.lastName?.toString()?.toLowerCase().includes(searchedKey);
      return matchesEmail || matchesFirstName || matchesLastName || matchesCreatedDate;
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
                      <TableCell>Date & Time</TableCell>
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
                          <TableCell sx={{ minWidth: '180px' }}>
                            {moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')}
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
    </>
  );
};

export default User;
