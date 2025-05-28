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
import Grid from '@mui/material/Unstable_Grid2';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { deleteCustomJewelry, getCustomJewelryList } from 'src/actions';
import { setCustomJewelryPage } from 'src/store/slices/customJewelrySlice';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

// ----------------------------------------------------------------------

const CustomJewelry = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCustomJewelryId, setSelectedCustomJewelryId] = useState();
  const [openCustomJewelryDialog, setOpenCustomJewelryDialog] = useState(false);

  const { customJewelryPage, customJewelryLoader, customJewelryList, crudCustomJewelryLoading } =
    useSelector(({ customJewelry }) => customJewelry);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = customJewelryList?.filter((item) => {
    return (
      item?.mobile?.toString()?.includes(searchKey) ||
      item?.name?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey)
    );
  });

  let currentItems = filteredItems?.slice(
    customJewelryPage * rowsPerPage,
    customJewelryPage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(() => {
    dispatch(getCustomJewelryList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setCustomJewelryPage(0));
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    dispatch(setCustomJewelryPage(0));
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    dispatch(setCustomJewelryPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    dispatch(setCustomJewelryPage(0));
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudCustomJewelryLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCustomJewelryId();
    },
    [crudCustomJewelryLoading]
  );

  const handleView = useCallback(async () => {
    setOpenCustomJewelryDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteCustomJewelry({
        customJewelryId: selectedCustomJewelryId,
      })
    );
    if (res) {
      const cPage =
        customJewelryPage !== 0 && currentItems?.length === 1
          ? customJewelryPage - 1
          : customJewelryPage;
      dispatch(setCustomJewelryPage(cPage));
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedCustomJewelryId, currentItems, customJewelryPage]);

  const closeMenuCategoryPopup = useCallback(() => {
    setOpenCustomJewelryDialog(false);
  }, []);

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
        <MenuItem onClick={handleView} disabled={crudCustomJewelryLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudCustomJewelryLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudCustomJewelryLoading ? (
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
      </Popover>
    ) : null;
  }, [open, customJewelryList, selectedCustomJewelryId, crudCustomJewelryLoading]);

  const renderDialog = useMemo(() => {
    const item = customJewelryList?.find((x) => x?.id === selectedCustomJewelryId);
    return openCustomJewelryDialog ? (
      <Dialog
        fullWidth
        maxWidth={'sm'}
        open={openCustomJewelryDialog}
        handleClose={closeMenuCategoryPopup}
        handleOpen={() => setOpenCustomJewelryDialog(true)}
      >
        <StyledDialogTitle>CustomJewelry Details</StyledDialogTitle>
        <StyledDialogContent sx={{ color: 'text.secondary' }}>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: '300px',
                  height: '300px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ProgressiveImg
                  src={item?.image}
                  alt={item?.name}
                  title={item?.name}
                  customClassName="w-full h-full rounded-md"
                  // placeHolderClassName={'h-[75px]'}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Email')}
              {item?.email}
            </Grid>
            <Grid xs={12} sm={6}>
              <Box mb={1}>
                {getTypoGraphy('Mobile')}
                {item?.mobile}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6}>
              <Box mb={1}>
                {getTypoGraphy('Created Date & Time')}
                {moment(item?.createdDate).format('MM-DD-YYYY hh:mm A')}
              </Box>
            </Grid>
          </Grid>
          <Box mb={1}>
            {getTypoGraphy('Description')}
            {item?.description}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeMenuCategoryPopup} variant={'contained'}>
            Cancel
          </Button>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [selectedCustomJewelryId, customJewelryList, openCustomJewelryDialog]);

  return (
    <>
      {customJewelryLoader ? (
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
            <Typography variant="h4">Custom Jewelry</Typography>
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
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentItems?.length
                      ? currentItems?.map((x, i) => (
                          <TableRow key={`Custom-Jewelry-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
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
                                  src={x?.image}
                                  alt={x?.name}
                                  title={x?.name}
                                  customClassName="w-full h-full rounded-md"
                                  // placeHolderClassName={'h-[75px]'}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{x?.name}</TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.mobile}</TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedCustomJewelryId(x?.id);
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
            {customJewelryList?.length > 5 ? (
              <TablePagination
                component="div"
                page={customJewelryPage}
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

      {renderDialog}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudCustomJewelryLoading}
        >
          Do you want to delete this Custom Jewelry Request?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default CustomJewelry;
