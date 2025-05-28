import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Table,
  Radio,
  Popover,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  FormLabel,
  Typography,
  RadioGroup,
  FormControl,
  TableContainer,
  InputAdornment,
  TablePagination,
  FormControlLabel,
} from '@mui/material';

import {
  getCustomizationTypeList,
  createCustomizationSubType,
  deleteCustomizationSubType,
  updateCustomizationSubType,
  getCustomizationSubTypeList,
} from 'src/actions';
import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  initCustomizationSubType,
  setPage,
  setSelectedCustomizationSubType,
} from 'src/store/slices/customizationSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import {
  GOLD_TYPE_SUB_TYPES_LIST,
  GOLD_COLOR_SUB_TYPES_LIST,
  SIZE_TYPE_SUB_TYPES_LIST,
} from 'src/_helpers/constants';
import { FileDrop } from 'src/components/file-drop';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  title: Yup.string().required('Title is required'),
  customizationTypeId: Yup.string().required('Customization type is required'),
});

const isImageType = (type) => {
  return type === 'image' ? true : false;
};

const isColorType = (type) => {
  return type === 'color' ? true : false;
};

// ----------------------------------------------------------------------
const NON_EDITABLE_DELETABLE_SUBTYPE = [
  ...GOLD_TYPE_SUB_TYPES_LIST.map((subType) => subType.title),
  ...GOLD_COLOR_SUB_TYPES_LIST.map((subType) => subType.title),
  ...SIZE_TYPE_SUB_TYPES_LIST.map((subType) => subType.title),
];
const CustomizationSubType = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCustomizationType, setSelectedCustomizationType] = useState('all');
  const [selectedCustomizationSubTypeId, setSelectedCustomizationSubTypeId] = useState();
  const [openCustomizationSubTypeDialog, setOpenCustomizationSubTypeDialog] = useState(false);

  const {
    page,
    customizationTypeList,
    customizationSubTypeList,
    customizationTypeLoading,
    customizationSubTypeLoading,
    selectedCustomizationSubType,
    crudCustomizationSubTypeLoading,
  } = useSelector(({ customization }) => customization);

  const selectedItem = useMemo(() => {
    return customizationSubTypeList?.find((item) => item.id == selectedCustomizationSubTypeId);
  }, [customizationSubTypeList, selectedCustomizationSubTypeId]);

  const searchedKey = searchedValue?.trim();
  let filteredItems = customizationSubTypeList?.filter((item) => {
    return (
      item?.title?.toLowerCase()?.includes(searchedKey?.toLowerCase()) ||
      item?.customizationTypeId?.toLowerCase()?.includes(searchedKey?.toLowerCase()) ||
      item?.customizationTypeName?.toLowerCase()?.includes(searchedKey?.toLowerCase()) ||
      item?.type?.toLowerCase()?.includes(searchedKey?.toLowerCase())
    );
  });

  // filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  let currentItems =
    filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  const loadData = useCallback(() => {
    dispatch(getCustomizationTypeList());
    dispatch(getCustomizationSubTypeList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setPage(0));
  }, []);

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const payload = {
      type: val?.type,
      title: val?.title,
      customizationTypeId: val?.customizationTypeId,
    };
    if (isImageType(val?.type) && val?.imageFile?.length) payload.imageFile = val?.imageFile[0];
    if (isColorType(val?.type)) payload.hexCode = val?.hexCode;

    let res;
    let cPage = 0;
    if (val?.id) {
      payload.customizationSubTypeId = val?.id;
      payload.deletedImage = val?.deleteUploadedImage?.[0]?.image;
      cPage = page;
      res = await dispatch(updateCustomizationSubType(payload));
    } else {
      res = await dispatch(createCustomizationSubType(payload));
    }
    if (res) {
      dispatch(setPage(cPage));
      dispatch(getCustomizationSubTypeList());
      setOpenCustomizationSubTypeDialog(false);
      resetForm();
      setOpen(null);
    }
  }, []);

  const handleCustomizationTypeSelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedCustomizationType(value);
    setSearchedValue(value === 'all' ? '' : value);
    dispatch(setPage(0));
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    if (!value) setSelectedCustomizationType('all');
    dispatch(setPage(0));
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    dispatch(setPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    dispatch(setPage(0));
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudCustomizationSubTypeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCustomizationSubTypeId();
    },
    [crudCustomizationSubTypeLoading]
  );

  const closeCustomizationSubTypePopup = useCallback((resetForm) => {
    setOpenCustomizationSubTypeDialog(false);
    dispatch(setSelectedCustomizationSubType(initCustomizationSubType));
    resetForm();
  }, []);

  const handleEdit = useCallback(async () => {
    const customizationSubType = customizationSubTypeList?.find(
      (x) => x?.id === selectedCustomizationSubTypeId
    );
    if (customizationSubType) {
      let previewImage = [];
      if (customizationSubType?.image) {
        previewImage = [{ type: 'old', image: customizationSubType?.image }];
      }
      dispatch(
        setSelectedCustomizationSubType({
          ...customizationSubType,
          imageFile: [],
          deleteUploadedImage: [],
          previewImage,
        })
      );
      setOpenCustomizationSubTypeDialog(true);
    }
  }, [selectedCustomizationSubTypeId, customizationSubTypeList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteCustomizationSubType({
        customizationSubTypeId: selectedCustomizationSubTypeId,
      })
    );
    if (res) {
      dispatch(getCustomizationSubTypeList());
      const cPage = page !== 0 && currentItems?.length === 1 ? page - 1 : page;
      dispatch(setPage(cPage));
      handlePopup();
    }
  }, [selectedCustomizationSubTypeId, page, currentItems]);

  const renderPopup = useMemo(() => {
    if (!open) return null;
    const isNonEditable = selectedItem
      ? NON_EDITABLE_DELETABLE_SUBTYPE.includes(selectedItem.title)
      : false;
    return (
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit} disabled={crudCustomizationSubTypeLoading || isNonEditable}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          disabled={crudCustomizationSubTypeLoading || isNonEditable}
          sx={{ color: 'error.main' }}
        >
          {crudCustomizationSubTypeLoading ? (
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
    );
  }, [open, selectedItem, crudCustomizationSubTypeLoading]);

  return (
    <>
      {customizationTypeLoading || customizationSubTypeLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <>
          <Stack
            my={2}
            mx={2}
            gap={2}
            direction="row"
            flexWrap={'wrap'}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack gap={2} direction="row" alignItems="center" flexWrap={'wrap'}>
              <TextField
                size="small"
                type="search"
                placeholder="Search"
                value={searchedValue}
                onChange={searchValueHandler}
                sx={{ padding: 0, minWidth: '200px' }}
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
                label="Customization Type"
                name="selectedCustomizationType"
                value={selectedCustomizationType || ''}
                onChange={(e) => handleCustomizationTypeSelection(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                {customizationTypeList?.length > 0 ? (
                  customizationTypeList?.map((option) => (
                    <MenuItem key={option?.id} value={option?.title}>
                      {option?.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Item</MenuItem>
                )}
              </TextField>
            </Stack>
            <Button
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                dispatch(setSelectedCustomizationSubType(initCustomizationSubType));
                setOpenCustomizationSubTypeDialog(true);
              }}
            >
              Customization SubType
            </Button>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>CustomizationType</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentItems?.length
                    ? currentItems?.map((x, i) => (
                        <TableRow key={`customization-subtype-${i}`}>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {x?.title}
                            {x?.type === 'color' ? (
                              <Box
                                sx={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  backgroundColor: x?.hexCode,
                                  border: '1px dashed lightgrey',
                                }}
                              />
                            ) : null}
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
                                  alt={'product-img'}
                                  customClassName="w-full h-full rounded-md"
                                  // placeHolderClassName={'h-[75px]'}
                                />
                              </Box>
                            ) : null}
                          </TableCell>
                          <TableCell>{x?.customizationTypeName}</TableCell>
                          <TableCell>{x?.type}</TableCell>
                          <TableCell sx={{ width: '50px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedCustomizationSubTypeId(x?.id);
                              }}
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
        </>
      )}

      {customizationSubTypeList?.length > 5 ? (
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

      {renderPopup}

      {openCustomizationSubTypeDialog ? (
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={selectedCustomizationSubType}
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
                  open={openCustomizationSubTypeDialog}
                  handleClose={() => closeCustomizationSubTypePopup(resetForm)}
                  handleOpen={() => setOpenCustomizationSubTypeDialog(true)}
                >
                  <StyledDialogTitle>
                    {selectedCustomizationSubType?.id ? 'Update' : 'Add New'} CustomizationSubType
                  </StyledDialogTitle>

                  <StyledDialogContent>
                    <FormControl
                      sx={{
                        gap: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel id="Customization SubType">Type</FormLabel>
                      <RadioGroup
                        name="type"
                        onBlur={handleBlur}
                        value={values?.type}
                        onChange={handleChange}
                        aria-labelledby="Customization SubType Type"
                        sx={{ display: 'flex', flexDirection: 'row' }}
                      >
                        <FormControlLabel value="default" control={<Radio />} label="Default" />
                        <FormControlLabel value="color" control={<Radio />} label="Color" />
                        <FormControlLabel value="image" control={<Radio />} label="Image" />
                      </RadioGroup>
                    </FormControl>
                    {values?.type === 'color' ? (
                      <TextField
                        sx={{
                          mt: '10px',
                          width: '100%',
                          minWidth: '300px',
                        }}
                        type="color"
                        name="hexCode"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values?.hexCode || ''}
                        error={!!(touched?.hexCode && errors?.hexCode)}
                        helperText={touched?.hexCode && errors?.hexCode ? errors?.hexCode : ''}
                      />
                    ) : null}
                    <TextField
                      select
                      sx={{
                        mt: '10px',
                        width: '100%',
                      }}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="customizationTypeId"
                      label="Customization Type"
                      value={values?.customizationTypeId || ''}
                      error={!!(touched?.customizationTypeId && errors?.customizationTypeId)}
                      helperText={
                        touched?.customizationTypeId && errors?.customizationTypeId
                          ? errors?.customizationTypeId
                          : ''
                      }
                    >
                      {customizationTypeList?.length > 0 ? (
                        customizationTypeList?.map((option) => (
                          <MenuItem key={option?.id} value={option?.id}>
                            {option?.title}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Item</MenuItem>
                      )}
                    </TextField>
                    <TextField
                      sx={{
                        mt: '10px',
                        width: '100%',
                        minWidth: '300px',
                      }}
                      label="Title"
                      name="title"
                      value={values?.title || ''}
                      error={!!(touched?.title && errors?.title)}
                      onChange={(e) => setFieldValue('title', e.target.value)}
                      helperText={touched?.title && errors?.title ? errors?.title : ''}
                    />
                    {values?.type === 'image' ? (
                      <FileDrop
                        mediaLimit={1}
                        formik={formik}
                        fileKey={'imageFile'}
                        productId={values?.id}
                        previewKey={'previewImage'}
                        deleteKey={'deleteUploadedImage'}
                        loading={crudCustomizationSubTypeLoading}
                      />
                    ) : null}
                  </StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => closeCustomizationSubTypePopup(resetForm)}
                      disabled={crudCustomizationSubTypeLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      onClick={handleSubmit}
                      loading={crudCustomizationSubTypeLoading}
                    >
                      {selectedCustomizationSubType?.id ? 'Update' : 'Save'}
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
      ) : null}
    </>
  );
};

export default CustomizationSubType;
