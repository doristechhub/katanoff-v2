import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  Stack,
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
import { deleteReview } from 'src/actions';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import { Button } from 'src/components/button';
import Scrollbar from 'src/components/scrollbar';
import { getReviewAndRatingsList } from 'src/_services';
import RenderRatingStars from 'src/components/rating-stars';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { setReviewPage } from 'src/store/slices/reviewAndRatingSlice';

// ----------------------------------------------------------------------

const starsList = [
  { label: '1 Star', value: '1' },
  { label: '2 Stars', value: '2' },
  { label: '3 Stars', value: '3' },
  { label: '4 Stars', value: '4' },
  { label: '5 Stars', value: '5' },
];

const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

// ----------------------------------------------------------------------

const Review = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [searchedStars, setSearchedStars] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [filterByStar, setFilterByStar] = useState('all');
  const [selectedReviewId, setSelectedReviewId] = useState();
  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  const { reviewPage, reviewLoading, crudReviewLoading, reviewAndRatingsList } = useSelector(
    ({ reviewAndRating }) => reviewAndRating
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = reviewAndRatingsList?.filter((item) => {
    if (searchedStars) return Number(item?.stars) === Number(searchedStars);
    return (
      item?.name?.toLowerCase()?.includes(searchKey) ||
      item?.email?.toLowerCase()?.includes(searchKey) ||
      item?.productName?.toLowerCase()?.includes(searchKey)
    );
  });

  let currentItems = filteredItems?.slice(
    reviewPage * rowsPerPage,
    reviewPage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(() => {
    dispatch(getReviewAndRatingsList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setReviewPage(0));
  }, []);

  const searchValueHandler = useCallback((e) => {
    const value = e.target.value;
    setSearchedValue(value);
    dispatch(setReviewPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setReviewPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setReviewPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudReviewLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedReviewId();
    },
    [crudReviewLoading]
  );

  const handleView = useCallback(async () => {
    setOpenReviewDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteReview({
        rrId: selectedReviewId,
      })
    );
    if (res) {
      const cPage = reviewPage !== 0 && currentItems?.length === 1 ? reviewPage - 1 : reviewPage;
      dispatch(setReviewPage(cPage));
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedReviewId, currentItems, reviewPage]);

  const closeMenuCategoryPopup = useCallback(() => {
    setOpenReviewDialog(false);
  }, []);

  const handleFilterRatingsByStars = useCallback((val) => {
    const v = val === 'all' ? '' : val;
    setFilterByStar(val);
    setSearchedStars(v);
    dispatch(setReviewPage(0));
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
        <MenuItem onClick={handleView} disabled={crudReviewLoading}>
          <Iconify icon="carbon:view-filled" sx={{ mr: 2 }} />
          View
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudReviewLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudReviewLoading ? (
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
  }, [open, reviewAndRatingsList, selectedReviewId, crudReviewLoading]);

  const renderDialog = useMemo(() => {
    const item = reviewAndRatingsList?.find((x) => x?.id === selectedReviewId);
    return openReviewDialog ? (
      <Dialog
        fullWidth
        maxWidth={'sm'}
        open={openReviewDialog}
        handleClose={closeMenuCategoryPopup}
        handleOpen={() => setOpenReviewDialog(true)}
      >
        <StyledDialogTitle>Review Details</StyledDialogTitle>
        <StyledDialogContent sx={{ color: 'text.secondary' }}>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12}>
              {getTypoGraphy('Product')}
              {item?.productName}
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Reviewer')}
              {item?.name}
            </Grid>
            <Grid xs={12} sm={6}>
              <Box mb={1}>
                {getTypoGraphy('Email')}
                {item?.email}
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={1}>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Created Date & Time(MM-DD-YYYY)')}
              {moment(item?.createdDate).format('MM-DD-YYYY hh:mm A')}
            </Grid>
            <Grid xs={12} sm={6}>
              {getTypoGraphy('Ratings')}
              <RenderRatingStars rating={item?.stars} />
            </Grid>
          </Grid>
          <Box mb={1}>
            {getTypoGraphy('Description')}
            {item?.review}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeMenuCategoryPopup} variant="contained">
            Cancel
          </Button>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [selectedReviewId, reviewAndRatingsList, openReviewDialog]);

  return (
    <>
      {reviewLoading ? (
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
            <Typography variant="h4">Reviews & Ratings</Typography>
            <Stack gap={2} direction={'row'} flexWrap={'wrap'}>
              <TextField
                size="small"
                type="search"
                placeholder="Search"
                value={searchedValue}
                onChange={searchValueHandler}
                sx={{ padding: 0, minWidth: '150px' }}
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
              <TextField
                select
                size="small"
                sx={{
                  minWidth: '150px',
                }}
                label="Filter by Star"
                value={filterByStar || ''}
                onChange={(e) => handleFilterRatingsByStars(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                {starsList?.length > 0 ? (
                  starsList?.map((option) => (
                    <MenuItem key={Math.random()} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Item</MenuItem>
                )}
              </TextField>
            </Stack>
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
                      <TableCell>Product</TableCell>
                      <TableCell>Ratings</TableCell>
                      <TableCell>Date & Time (MM-DD-YYYY)</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentItems?.length
                      ? currentItems?.map((x, i) => (
                          <TableRow key={`review-${i}`}>
                            <TableCell sx={{ width: '50px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.name}</TableCell>
                            <TableCell>{x?.email}</TableCell>
                            <TableCell>{x?.productName}</TableCell>
                            <TableCell>{<RenderRatingStars rating={x?.stars} />}</TableCell>
                            <TableCell sx={{ minWidth: '180px' }}>
                              {x?.createdDate
                                ? moment(x?.createdDate).format('MM-DD-YYYY hh:mm a')
                                : '-'}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedReviewId(x?.id);
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
            {reviewAndRatingsList?.length > 5 ? (
              <TablePagination
                component="div"
                page={reviewPage}
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
          loading={crudReviewLoading}
        >
          Do you want to delete this review?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default Review;
