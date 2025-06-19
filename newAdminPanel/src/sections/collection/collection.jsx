import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  createCollection,
  deleteCollection,
  updateCollection,
  getCollectionList,
} from 'src/actions/collectionActions';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { initCollection, setSelectedCollection } from 'src/store/slices/collectionSlice';
import { FileDrop } from 'src/components/file-drop';
import ProgressiveImg from 'src/components/progressive-img';
import Grid from '@mui/material/Unstable_Grid2';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// ----------------------------------------------------------------------

const Collection = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState();
  const [openCollectionDialog, setOpenCollectionDialog] = useState(false);

  const { collectionLoading, collectionList, crudCollectionLoading, selectedCollection } =
    useSelector(({ collection }) => collection);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = collectionList?.filter((item) => {
    return item?.title?.toLowerCase()?.includes(searchKey?.toLowerCase());
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getCollectionList());
      setPage(cPage);
    },
    [page]
  );

  useEffect(() => {
    loadData();
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
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

  const handleEdit = useCallback(async () => {
    const collection = collectionList?.find((x) => x?.id === selectedCollectionId);
    if (collection) {
      let updatedCollection = { ...initCollection, ...collection };
      // Desktop Banner Image
      const desktopBannerImageUrl = collection?.desktopBannerImage;
      if (desktopBannerImageUrl) {
        const url = new URL(desktopBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const desktopBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: desktopBannerImageUrl,
        };
        updatedCollection = {
          ...updatedCollection,
          desktopBannerFile: [],
          desktopBannerPreviewImage: [desktopBannerPreviewImageObj],
          desktopBannerUploadedDeletedImage: [],
        };
      }
      // Mobile Banner Image
      const mobileBannerImageUrl = collection?.mobileBannerImage;
      if (mobileBannerImageUrl) {
        const url = new URL(mobileBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const mobileBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: mobileBannerImageUrl,
        };
        updatedCollection = {
          ...updatedCollection,
          mobileBannerFile: [],
          mobileBannerPreviewImage: [mobileBannerPreviewImageObj],
          mobileBannerUploadedDeletedImage: [],
        };
      }
      dispatch(setSelectedCollection(updatedCollection));
      setOpenCollectionDialog(true);
    }
  }, [selectedCollectionId, collectionList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteCollection({
        collectionId: selectedCollectionId,
      })
    );
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedCollectionId]);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        title: val?.title,
        desktopBannerFile: val?.desktopBannerFile?.[0] || null,
        mobileBannerFile: val?.mobileBannerFile?.[0] || null,
        deletedDesktopBannerImage: val?.desktopBannerUploadedDeletedImage?.[0]?.image || null,
        deletedMobileBannerImage: val?.mobileBannerUploadedDeletedImage?.[0]?.image || null,
      };
      let res;
      let cPage = 0;
      if (val?.id) {
        payload.collectionId = val?.id;
        cPage = page;
        res = await dispatch(updateCollection(payload));
      } else {
        res = await dispatch(createCollection(payload));
      }
      if (res) {
        loadData(cPage);
        setOpenCollectionDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [page]
  );

  const closeMenuCategoryPopup = useCallback(
    (resetForm) => {
      setOpenCollectionDialog(false);
      dispatch(setSelectedCollection(initCollection));
      resetForm();
    },
    [initCollection]
  );

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
  }, [open, crudCollectionLoading]);

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
              mb: 5,
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
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCollectionDialog(true)}
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
                                className={'cursor-pointer'}
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

      {openCollectionDialog ? (
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={selectedCollection}
          validationSchema={validationSchema}
        >
          {(formik) => {
            const { values, touched, errors, handleBlur, handleChange, handleSubmit, resetForm } =
              formik;
            return (
              <Form onSubmit={handleSubmit}>
                <Dialog
                  open={openCollectionDialog}
                  handleClose={() => closeMenuCategoryPopup(resetForm)}
                  handleOpen={() => setOpenCollectionDialog(true)}
                  maxWidth="md"
                >
                  <StyledDialogTitle>
                    {selectedCollection?.id ? 'Update' : 'Add New'} Collection
                  </StyledDialogTitle>
                  <StyledDialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        sx={{
                          mt: '10px',
                          width: '100%',
                          minWidth: '300px',
                        }}
                        name="title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title || ''}
                        label="Collection Title"
                        error={!!(touched.title && errors.title)}
                        helperText={touched.title && errors.title ? errors.title : ''}
                      />
                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid xs={12} sm={6} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Desktop Banner (1920x448)
                          </Typography>
                          <FileDrop
                            mediaLimit={1}
                            formik={formik}
                            productId={selectedCollection}
                            fileKey="desktopBannerFile"
                            previewKey="desktopBannerPreviewImage"
                            deleteKey="desktopBannerUploadedDeletedImage"
                            loading={crudCollectionLoading}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Mobile Banner (1500x738)
                          </Typography>
                          <FileDrop
                            mediaLimit={1}
                            formik={formik}
                            productId={selectedCollection}
                            fileKey="mobileBannerFile"
                            previewKey="mobileBannerPreviewImage"
                            deleteKey="mobileBannerUploadedDeletedImage"
                            loading={crudCollectionLoading}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => closeMenuCategoryPopup(resetForm)}
                      disabled={crudCollectionLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmit}
                      loading={crudCollectionLoading}
                    >
                      {selectedCollection?.id ? 'Update' : 'Save'}
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
      ) : null}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudCollectionLoading}
        >
          Do you want to delete this collection?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default Collection;
