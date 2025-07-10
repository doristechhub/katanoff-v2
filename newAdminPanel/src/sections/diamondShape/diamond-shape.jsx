import * as Yup from 'yup';
import { Form, Formik, useFormik } from 'formik';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  createDiamondShape,
  deleteDiamondShape,
  updateDiamondShape,
  getDiamondShapeList,
} from 'src/actions/diamondShapeActions';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { initDiamondShape, setSelectedDiamondShape } from 'src/store/slices/diamondShapeSlice';
import { FileDrop } from 'src/components/file-drop';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// ----------------------------------------------------------------------

const DiamondShape = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedDiamondShapeId, setSelectedDiamondShapeId] = useState();
  const [openDiamondShapeDialog, setOpenDiamondShapeDialog] = useState(false);

  const { diamondShapeLoading, diamondShapeList, crudDiamondShapeLoading, selectedDiamondShape } =
    useSelector(({ diamondShape }) => diamondShape);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = diamondShapeList?.filter((item) => {
    return item?.title?.toLowerCase()?.includes(searchKey?.toLowerCase());
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getDiamondShapeList());
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
      if (crudDiamondShapeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedDiamondShapeId();
    },
    [crudDiamondShapeLoading]
  );

  const handleEdit = useCallback(async () => {
    const diamondShapeItem = diamondShapeList?.find((x) => x?.id === selectedDiamondShapeId);
    if (diamondShapeItem) {
      let previewImage = [];
      if (diamondShapeItem?.image) {
        previewImage = [{ type: 'old', image: diamondShapeItem?.image }];
      }

      dispatch(
        setSelectedDiamondShape({
          ...diamondShapeItem,
          imageFile: [],
          deleteUploadedImage: [],
          previewImage,
        })
      );
      setOpenDiamondShapeDialog(true);
    }
  }, [selectedDiamondShapeId, diamondShapeList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteDiamondShape({
        diamondShapeId: selectedDiamondShapeId,
      })
    );
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedDiamondShapeId]);

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const payload = {
      title: val?.title,
    };
    if (val?.imageFile?.length) payload.imageFile = val?.imageFile[0];
    let res;
    let cPage = 0;
    if (val?.id) {
      payload.diamondShapeId = val?.id;
      payload.deletedImage = val?.deleteUploadedImage?.[0]?.image;
      cPage = page;
      res = await dispatch(updateDiamondShape(payload));
    } else {
      res = await dispatch(createDiamondShape(payload));
    }
    if (res) {
      loadData(cPage);
      setOpenDiamondShapeDialog(false);
      resetForm();
      setOpen(null);
    }
  }, []);

  const closeDiamondShapePopup = useCallback(
    (resetForm) => {
      setOpenDiamondShapeDialog(false);
      dispatch(setSelectedDiamondShape(initDiamondShape));
      resetForm();
    },
    [initDiamondShape]
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
        <MenuItem onClick={handleEdit} disabled={crudDiamondShapeLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudDiamondShapeLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudDiamondShapeLoading ? (
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
  }, [open, crudDiamondShapeLoading]);

  return (
    <>
      {diamondShapeLoading ? (
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
            <Typography variant="h4">Diamond Shape</Typography>
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
                onClick={() => {
                  dispatch(setSelectedDiamondShape(initDiamondShape));
                  setOpenDiamondShapeDialog(true);
                }}
              >
                New Diamond Shape
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
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredItems?.length
                      ? filteredItems?.map((x, i) => (
                          <TableRow key={`setting-style-${i}`}>
                            <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                            <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {x?.image ? (
                                <Box
                                  sx={{
                                    borderRadius: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '45px',
                                    height: '45px',
                                  }}
                                >
                                  <ProgressiveImg
                                    src={x?.image}
                                    alt={'diamond-shape-img'}
                                    customClassName="w-full h-full rounded-md !object-contain"
                                    // placeHolderClassName={'h-[75px]'}
                                  />
                                </Box>
                              ) : null}
                              {x?.title}
                            </TableCell>
                            <TableCell sx={{ width: '50px' }}>
                              <Iconify
                                className={'cursor-pointer'}
                                icon="iconamoon:menu-kebab-vertical-bold"
                                onClick={(e) => {
                                  setOpen(e.currentTarget);
                                  setSelectedDiamondShapeId(x?.id);
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
            {diamondShapeList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={diamondShapeList?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </Container>
      )}

      {renderPopup}

      {openDiamondShapeDialog ? (
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={selectedDiamondShape}
          validationSchema={validationSchema}
        >
          {(formik) => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              resetForm,
              setFieldValue,
            } = formik;
            return (
              <Form onSubmit={handleSubmit}>
                <Dialog
                  open={openDiamondShapeDialog}
                  handleClose={() => closeDiamondShapePopup(resetForm)}
                  handleOpen={() => setOpenDiamondShapeDialog(true)}
                >
                  <StyledDialogTitle>
                    {selectedDiamondShape?.id ? 'Update' : 'Add New'} Diamond Shape
                  </StyledDialogTitle>
                  <StyledDialogContent>
                    <TextField
                      sx={{
                        mt: '10px',
                        width: '100%',
                        minWidth: '300px',
                      }}
                      name="title"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Diamond Shape Title"
                      value={values.title || ''}
                      error={!!(touched.title && errors.title)}
                      helperText={touched.title && errors.title ? errors.title : ''}
                    />
                    <FileDrop
                      mediaLimit={1}
                      formik={formik}
                      fileKey={'imageFile'}
                      productId={values?.id}
                      previewKey={'previewImage'}
                      deleteKey={'deleteUploadedImage'}
                      loading={crudDiamondShapeLoading}
                    />
                  </StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => closeDiamondShapePopup(resetForm)}
                      disabled={crudDiamondShapeLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmit}
                      loading={crudDiamondShapeLoading}
                    >
                      {selectedDiamondShape?.id ? 'Update' : 'Save'}
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>{' '}
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
          loading={crudDiamondShapeLoading}
        >
          Do you want to delete this diamondShape?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default DiamondShape;
