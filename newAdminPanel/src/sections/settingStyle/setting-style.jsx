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
  createSettingStyle,
  deleteSettingStyle,
  updateSettingStyle,
  getSettingStyleList,
} from 'src/actions/settingStyleActions';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { initSettingStyle, setSelectedSettingStyle } from 'src/store/slices/settingStyleSlice';
import { FileDrop } from 'src/components/file-drop';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// ----------------------------------------------------------------------

const SettingStyle = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSettingStyleId, setSelectedSettingStyleId] = useState();
  const [openSettingStyleDialog, setOpenSettingStyleDialog] = useState(false);

  const { settingStyleLoading, settingStyleList, crudSettingStyleLoading, selectedSettingStyle } =
    useSelector(({ settingStyle }) => settingStyle);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = settingStyleList?.filter((item) => {
    return item?.title?.toLowerCase()?.includes(searchKey?.toLowerCase());
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getSettingStyleList());
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
      if (crudSettingStyleLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedSettingStyleId();
    },
    [crudSettingStyleLoading]
  );

  const handleEdit = useCallback(async () => {
    const settingStyleItem = settingStyleList?.find((x) => x?.id === selectedSettingStyleId);
    if (settingStyleItem) {
      let previewImage = [];
      if (settingStyleItem?.image) {
        previewImage = [{ type: 'old', image: settingStyleItem?.image }];
      }

      dispatch(
        setSelectedSettingStyle({
          ...settingStyleItem,
          imageFile: [],
          deleteUploadedImage: [],
          previewImage,
        })
      );
      setOpenSettingStyleDialog(true);
    }
  }, [selectedSettingStyleId, settingStyleList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteSettingStyle({
        settingStyleId: selectedSettingStyleId,
      })
    );
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedSettingStyleId]);

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const payload = {
      title: val?.title,
    };
    if (val?.imageFile?.length) payload.imageFile = val?.imageFile[0];
    let res;
    let cPage = 0;
    if (val?.id) {
      payload.settingStyleId = val?.id;
      payload.deletedImage = val?.deleteUploadedImage?.[0]?.image;
      cPage = page;
      res = await dispatch(updateSettingStyle(payload));
    } else {
      res = await dispatch(createSettingStyle(payload));
    }
    if (res) {
      loadData(cPage);
      setOpenSettingStyleDialog(false);
      resetForm();
      setOpen(null);
    }
  }, []);

  const closeSettingStylePopup = useCallback(
    (resetForm) => {
      setOpenSettingStyleDialog(false);
      dispatch(setSelectedSettingStyle(initSettingStyle));
      resetForm();
    },
    [initSettingStyle]
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
        <MenuItem onClick={handleEdit} disabled={crudSettingStyleLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          disabled={crudSettingStyleLoading}
          onClick={() => setDeleteDialog(true)}
        >
          {crudSettingStyleLoading ? (
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
  }, [open, crudSettingStyleLoading]);

  return (
    <>
      {settingStyleLoading ? (
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
            <Typography variant="h4">Setting Style</Typography>
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
                  dispatch(setSelectedSettingStyle(initSettingStyle));
                  setOpenSettingStyleDialog(true);
                }}
              >
                New Setting Style
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
                                    width: '100%',
                                    height: '100%',
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
                                    alt={'setting-style-img'}
                                    customClassName="w-full h-full rounded-md"
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
                                  setSelectedSettingStyleId(x?.id);
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
            {settingStyleList?.length > 5 ? (
              <TablePagination
                page={page}
                component="div"
                rowsPerPage={rowsPerPage}
                count={settingStyleList?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </Container>
      )}

      {renderPopup}

      {openSettingStyleDialog ? (
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={selectedSettingStyle}
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
                  open={openSettingStyleDialog}
                  handleClose={() => closeSettingStylePopup(resetForm)}
                  handleOpen={() => setOpenSettingStyleDialog(true)}
                >
                  <StyledDialogTitle>
                    {selectedSettingStyle?.id ? 'Update' : 'Add New'} Setting Style
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
                      label="Setting Style Title"
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
                      loading={crudSettingStyleLoading}
                    />
                  </StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => closeSettingStylePopup(resetForm)}
                      disabled={crudSettingStyleLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmit}
                      loading={crudSettingStyleLoading}
                    >
                      {selectedSettingStyle?.id ? 'Update' : 'Save'}
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
          loading={crudSettingStyleLoading}
        >
          Do you want to delete this settingStyle?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default SettingStyle;
