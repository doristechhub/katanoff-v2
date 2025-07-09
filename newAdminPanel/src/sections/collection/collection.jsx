import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Table,
  Popover,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { deleteCollection, getCollectionList } from 'src/actions/collectionActions';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import ProgressiveImg from 'src/components/progressive-img';
import { helperFunctions } from 'src/_helpers';

// ----------------------------------------------------------------------

const Collection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [filterByType, setFilterByType] = useState('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState();

  const { collectionLoading, collectionList, crudCollectionLoading } = useSelector(
    ({ collection }) => collection
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();

  let filteredItems = collectionList?.filter((item) => {
    const titleMatch = item?.title?.toLowerCase()?.includes(searchKey);
    const typeMatch = filterByType === 'all' || item?.type === filterByType;
    return titleMatch && typeMatch;
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getCollectionList());
      setPage(cPage);
    },
    [dispatch, page]
  );

  useEffect(() => {
    loadData();
  }, []);

  const searchValueHandler = useCallback((event) => {
    setSearchedValue(event.target.value);
    setPage(0);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudCollectionLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCollectionId();
    },
    [crudCollectionLoading]
  );

  const handleEdit = useCallback(() => {
    navigate(`/collection/add?collectionId=${selectedCollectionId}`);
  }, [navigate, selectedCollectionId]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteCollection({ collectionId: selectedCollectionId }));
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [dispatch, selectedCollectionId, page, filteredItems]);

  const renderPopup = useMemo(
    () =>
      open ? (
        <Popover
          open={!!open}
          anchorEl={open}
          PaperProps={{ sx: { width: 140 } }}
          disableEscapeKeyDown
          onClose={handlePopup}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEdit} disabled={crudCollectionLoading}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={crudCollectionLoading}
            onClick={() => setDeleteDialog(true)}
          >
            {crudCollectionLoading ? (
              <Box sx={{ gap: '15px', width: '100%', display: 'flex', alignItems: 'center' }}>
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
      ) : null,
    [open, crudCollectionLoading, handleEdit, handlePopup]
  );

  const collectionTypeOptions = useMemo(() => {
    const types = collectionList
      .map((item) => item.type)
      .filter((type) => type && type.trim() !== '');
    const uniqueTypes = Array.from(new Set(types));
    return ['all', ...uniqueTypes];
  }, [collectionList]);

  return (
    <>
      {collectionLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <Container>
          <Box
            sx={{
              mb: 3,
              gap: 2,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h4">Collection</Typography>
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
              <TextField
                size="small"
                select
                className="capitalize"
                label="Collection Type"
                value={filterByType}
                onChange={(e) => {
                  setFilterByType(e.target.value);
                  setPage(0);
                }}
                sx={{ minWidth: 150 }}
              >
                {collectionTypeOptions.map((option, index) => (
                  <MenuItem className="capitalize" key={index} value={option}>
                    {option === 'all' ? 'All' : helperFunctions.stringReplacedWithSpace(option)}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                onClick={() => {
                  setFilterByType('all');
                  setSearchedValue('');
                }}
                variant="outlined"
                startIcon={<Iconify icon="tdesign:filter-clear" key={Math.random()} />}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/collection/add')}
              >
                New Collection
              </Button>
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
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Thumbnail Image</TableCell>
                      <TableCell>Desktop Banner</TableCell>
                      <TableCell>Mobile Banner</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`collection-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell>{x?.title}</TableCell>
                            <TableCell className="capitalize">
                              {helperFunctions.stringReplacedWithSpace(x?.type || 'Default')}
                            </TableCell>
                            <TableCell sx={{ minWidth: '150px' }}>
                              {x?.thumbnailImage ? (
                                <ProgressiveImg
                                  src={x?.thumbnailImage}
                                  alt="Desktop Banner"
                                  style={{ maxWidth: '90px', height: 'auto' }}
                                />
                              ) : (
                                'No Image'
                              )}
                            </TableCell>
                            <TableCell sx={{ minWidth: '150px' }}>
                              {x?.desktopBannerImage ? (
                                <ProgressiveImg
                                  src={x?.desktopBannerImage}
                                  alt="Desktop Banner"
                                  style={{ maxWidth: '100px', height: 'auto' }}
                                />
                              ) : (
                                'No Image'
                              )}
                            </TableCell>
                            <TableCell sx={{ minWidth: '150px' }}>
                              {x?.mobileBannerImage ? (
                                <ProgressiveImg
                                  src={x?.mobileBannerImage}
                                  alt="Mobile Banner"
                                  style={{ maxWidth: '100px', height: 'auto' }}
                                />
                              ) : (
                                'No Image'
                              )}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className="cursor-pointer"
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedCollectionId(x?.id);
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
            {collectionList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={collectionList?.length}
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
          loading={crudCollectionLoading}
        >
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Are you sure you want to delete this collection?
            </p>
            <p style={{ color: '#666' }}>
              Deleting this collection will also remove it from all linked products.
            </p>
          </div>
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default Collection;
