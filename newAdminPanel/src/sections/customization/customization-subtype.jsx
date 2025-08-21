import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  Alert,
  Dialog,
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
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import {
  GOLD_TYPE_SUB_TYPES_LIST,
  GOLD_COLOR_SUB_TYPES_LIST,
  UNIT_TYPES,
} from 'src/_helpers/constants';
import { FileDrop } from 'src/components/file-drop';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  type: Yup.string().required('Type is required'),
  title: Yup.string().required('Title is required'),
  customizationTypeId: Yup.string().required('Customization type is required'),
  unit: Yup.string().nullable(),
  price: Yup.number()
    .nullable()
    .when('unit', {
      is: (unit) => unit === UNIT_TYPES.CARAT || unit === UNIT_TYPES.GRAM,
      then: () =>
        Yup.number().min(0, 'Price must be equal or greater than 0').required('Price is required'),
      otherwise: () =>
        Yup.number()
          .nullable()
          .transform(() => null),
    }),
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
];

const CustomizationSubType = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCustomizationType, setSelectedCustomizationType] = useState('all');
  const [selectedCustomizationSubTypeId, setSelectedCustomizationSubTypeId] = useState();
  const [openCustomizationSubTypeDialog, setOpenCustomizationSubTypeDialog] = useState(false);
  // State for navigation confirmation dialog
  const [openNavigationConfirmDialog, setOpenNavigationConfirmDialog] = useState(false);
  const [nextLocation, setNextLocation] = useState(null);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  const {
    page,
    customizationTypeList,
    customizationSubTypeList,
    customizationTypeLoading,
    customizationSubTypeLoading,
    selectedCustomizationSubType,
    crudCustomizationSubTypeLoading,
    failedProductUpdates,
  } = useSelector(({ customization }) => customization);

  // Auto-close dialog when loading completes
  useEffect(() => {
    if (!crudCustomizationSubTypeLoading && openNavigationConfirmDialog) {
      setOpenNavigationConfirmDialog(false);
      setIsBackNavigation(false);
      setNextLocation(null);
    }
  }, [crudCustomizationSubTypeLoading, openNavigationConfirmDialog]);

  // Prevent refresh/close while updating
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (crudCustomizationSubTypeLoading) {
        e.preventDefault();
        e.returnValue =
          'Product price updates are in progress. Leaving the page may interrupt the process. Are you sure?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [crudCustomizationSubTypeLoading]);

  // Custom navigation blocker
  useEffect(() => {
    if (!crudCustomizationSubTypeLoading) return;

    const handlePopState = (e) => {
      if (crudCustomizationSubTypeLoading) {
        e.preventDefault();
        setOpenNavigationConfirmDialog(true);
        setIsBackNavigation(true); // Indicate back navigation attempt
        // Push back to current location to prevent immediate navigation
        window.history.pushState(null, null, location.pathname);
      }
    };

    window.history.pushState(null, null, location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [crudCustomizationSubTypeLoading, location.pathname]);

  const handleCancelNavigation = () => {
    setOpenNavigationConfirmDialog(false);
    setIsBackNavigation(false);
    setNextLocation(null);
  };

  // const handleConfirmNavigation = () => {
  //   setOpenNavigationConfirmDialog(false);
  //   setIsBackNavigation(false);
  //   setNextLocation(null);
  //   if (isBackNavigation) {
  //     if (window.history.length > 1) {
  //       navigate(-1); // Navigate to previous page in history
  //     } else {
  //       navigate('/dashboard'); // Fallback route if no history
  //     }
  //   } else if (nextLocation) {
  //     navigate(nextLocation); // Navigate to specified route
  //   }
  // };

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

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        type: val?.type,
        title: val?.title,
        customizationTypeId: val?.customizationTypeId,
        unit: val?.unit === 'other' ? '' : val?.unit,
        price: val?.unit === 'other' ? null : val?.price,
      };
      if (isImageType(val?.type) && val?.imageFile?.length) payload.imageFile = val?.imageFile[0];
      if (isColorType(val?.type)) payload.hexCode = val?.hexCode;

      let res;
      let cPage = 0;
      if (val?.id) {
        payload.customizationSubTypeId = val?.id;
        payload.deletedImage = val?.deleteUploadedImage?.[0]?.image;
        payload.failedProductUpdates = failedProductUpdates || [];
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
    },
    [failedProductUpdates]
  );

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
          price: customizationSubType?.price || 0,
          unit: customizationSubType?.unit || 'other',
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

  const handleInputClick = (event) => {
    event.target.select();
  };

  const handleWheel = (event) => {
    event.target.blur();
  };

  const renderPopup = useMemo(() => {
    if (!open) return null;
    const isNonDeletable = selectedItem
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
        <MenuItem onClick={handleEdit} disabled={crudCustomizationSubTypeLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          disabled={crudCustomizationSubTypeLoading || isNonDeletable}
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
                    <TableCell>Unit</TableCell>
                    <TableCell>Price</TableCell>
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
                                  customClassName="w-full h-full rounded-md !object-contain"
                                  // placeHolderClassName={'h-[75px]'}
                                />
                              </Box>
                            ) : null}
                          </TableCell>
                          <TableCell>{x?.customizationTypeName}</TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{x?.type}</TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>
                            {x?.unit || 'other'}
                          </TableCell>
                          <TableCell>${x?.price || 0}</TableCell>
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
            const isNonEditable = NON_EDITABLE_DELETABLE_SUBTYPE.includes(values?.title);
            return (
              <Form onSubmit={handleSubmit}>
                <Dialog
                  open={openCustomizationSubTypeDialog}
                  onClose={(e, reason) => {
                    if (reason !== 'backdropClick') closeCustomizationSubTypePopup(resetForm);
                  }}
                >
                  <StyledDialogTitle>
                    {selectedCustomizationSubType?.id ? 'Update' : 'Add New'} CustomizationSubType
                  </StyledDialogTitle>

                  <StyledDialogContent>
                    {failedProductUpdates?.length > 0 && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        Customization sub type was changed, but The following products failed to
                        update prices: {failedProductUpdates.join(', ')}
                      </Alert>
                    )}
                    <FormControl
                      sx={{
                        gap: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel id="Customization SubType">Type :</FormLabel>
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
                      disabled={isNonEditable}
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
                      disabled={isNonEditable}
                    />
                    <FormControl
                      sx={{
                        mt: '10px',
                        gap: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <FormLabel id="Unit">Unit :</FormLabel>
                      <RadioGroup
                        name="unit"
                        onBlur={handleBlur}
                        value={values?.unit}
                        onChange={(e) => {
                          handleChange(e);
                          if (e.target.value === 'other') {
                            setFieldValue('price', null);
                          }
                        }}
                        aria-labelledby="Unit"
                        sx={{ display: 'flex', flexDirection: 'row' }}
                      >
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                        <FormControlLabel
                          value={UNIT_TYPES.CARAT}
                          control={<Radio />}
                          label="Carat"
                        />
                        <FormControlLabel
                          value={UNIT_TYPES.GRAM}
                          control={<Radio />}
                          label="Gram"
                        />
                      </RadioGroup>
                      {touched?.unit && errors?.unit ? (
                        <Typography variant="caption" color="error">
                          {errors?.unit}
                        </Typography>
                      ) : null}
                    </FormControl>
                    <TextField
                      sx={{
                        my: '10px',
                        width: '100%',
                        minWidth: '300px',
                      }}
                      min={0}
                      onBlur={handleBlur}
                      label={`Price ${values?.unit === UNIT_TYPES.CARAT ? 'Per Carat' : values?.unit === UNIT_TYPES.GRAM ? 'Per Gram' : ''}`}
                      name="price"
                      type="number"
                      value={values?.price || 0}
                      error={!!(touched?.price && errors?.price)}
                      onChange={handleChange}
                      onClick={handleInputClick}
                      onWheel={handleWheel}
                      helperText={touched?.price && errors?.price ? errors?.price : ''}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      disabled={
                        values?.unit !== UNIT_TYPES.CARAT && values?.unit !== UNIT_TYPES.GRAM
                      }
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
                    {selectedCustomizationSubType?.id ? (
                      <Alert severity="info">
                        Updating the price or unit for this customization subtype will automatically
                        update the prices of all pre-designed products using this subtype in
                        automatic price calculation mode. Do you wish to proceed?
                      </Alert>
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

      <Dialog
        open={openNavigationConfirmDialog}
        onClose={handleCancelNavigation}
        aria-labelledby="navigation-confirm-dialog-title"
        aria-describedby="navigation-confirm-dialog-description"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 2 }}
      >
        <StyledDialogTitle id="navigation-confirm-dialog-title">
          Confirm Navigation
        </StyledDialogTitle>
        <StyledDialogContent>
          <Typography id="navigation-confirm-dialog-description">
            Product price updates are in progress. Navigating away may interrupt the process.
          </Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button variant="contained" onClick={handleCancelNavigation}>
            Cancel
          </Button>
          {/* <Button variant="contained" onClick={handleConfirmNavigation}>
            Leave
          </Button> */}
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default CustomizationSubType;
