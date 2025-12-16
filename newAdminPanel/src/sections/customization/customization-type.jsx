import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Stack,
  Table,
  Popover,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  initCustomizationType,
  setSelectedCustomizationType,
} from 'src/store/slices/customizationSlice';
import {
  createCustomizationType,
  updateCustomizationType,
  deleteCustomizationType,
  getCustomizationTypeList,
} from 'src/actions/customizationTypeActions';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import { GOLD_TYPE, GOLD_COLOR, DIAMOND_SHAPE } from 'src/_helpers/constants';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// ----------------------------------------------------------------------
const NON_EDITABLE_DELETABLE_TYPE = [GOLD_TYPE.title, GOLD_COLOR.title, DIAMOND_SHAPE.title];
const CustomizationType = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCustomizationTypeId, setSelectedCustomizationTypeId] = useState();
  const [openCustomizationTypeDialog, setOpenCustomizationTypeDialog] = useState(false);

  const {
    customizationTypeLoading,
    customizationTypeList,
    selectedCustomizationType,
    crudCustomizationTypeLoading,
  } = useSelector(({ customization }) => customization);

  const selectedItem = useMemo(() => {
    return customizationTypeList?.find((item) => item.id === selectedCustomizationTypeId);
  }, [customizationTypeList, selectedCustomizationTypeId]);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = customizationTypeList?.filter((item) => {
    return item?.title?.toLowerCase()?.includes(searchKey?.toLowerCase());
  });

  filteredItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(
    (cPage = page) => {
      dispatch(getCustomizationTypeList());
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

  const handleChangePage = useCallback((e, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudCustomizationTypeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCustomizationTypeId();
    },
    [crudCustomizationTypeLoading]
  );

  const handleEdit = useCallback(async () => {
    const customizationType = customizationTypeList?.find(
      (x) => x?.id === selectedCustomizationTypeId
    );
    if (customizationType) {
      dispatch(setSelectedCustomizationType(customizationType));
      setOpenCustomizationTypeDialog(true);
    }
  }, [selectedCustomizationTypeId, customizationTypeList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteCustomizationType({
        customizationTypeId: selectedCustomizationTypeId,
      })
    );
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
    }
  }, [selectedCustomizationTypeId, page]);

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const payload = {
      title: val?.title,
    };
    let res;
    let cPage = 0;
    if (val?.id) {
      payload.customizationTypeId = val?.id;
      cPage = page;
      res = await dispatch(updateCustomizationType(payload));
    } else {
      res = await dispatch(createCustomizationType(payload));
    }
    if (res) {
      loadData(cPage);
      setOpenCustomizationTypeDialog(false);
      resetForm();
      setOpen(null);
    }
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues: selectedCustomizationType,
  });

  const closeCustomizationTypePopup = useCallback(() => {
    setOpenCustomizationTypeDialog(false);
    dispatch(setSelectedCustomizationType(initCustomizationType));
    resetForm();
  }, [initCustomizationType]);

  const renderPopup = useMemo(() => {
    if (!open) return null;
    const isNonEditable = selectedItem
      ? NON_EDITABLE_DELETABLE_TYPE.includes(selectedItem?.title)
      : false;
    return (
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleEdit}
          disabled={crudCustomizationTypeLoading || isNonEditable}
          aria-label="Edit"
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
          disabled={crudCustomizationTypeLoading || isNonEditable}
          aria-label="Delete"
        >
          {crudCustomizationTypeLoading ? (
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
  }, [open, selectedItem, crudCustomizationTypeLoading, handleEdit, handleDelete, handlePopup]);

  return (
    <>
      {customizationTypeLoading ? (
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
            <TextField
              size="small"
              type="search"
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
              sx={{ padding: 0, width: window.innerWidth >= 567 ? '200px' : '100%' }}
            />
            <Button
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => setOpenCustomizationTypeDialog(true)}
            >
              Customization Type
            </Button>
          </Stack>
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
                        <TableRow key={`Customization-type-${i}`}>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.title}</TableCell>
                          <TableCell sx={{ width: '50px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedCustomizationTypeId(x?.id);
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
        </>
      )}

      {customizationTypeList?.length > 5 ? (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={customizationTypeList?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {renderPopup}

      {openCustomizationTypeDialog ? (
        <Dialog
          open={openCustomizationTypeDialog}
          handleClose={closeCustomizationTypePopup}
          handleOpen={() => setOpenCustomizationTypeDialog(true)}
        >
          <StyledDialogTitle>
            {selectedCustomizationType?.id ? 'Update' : 'Add New'} Customization Type
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
              value={values.title || ''}
              label="Customization Type Title"
              error={!!(touched.title && errors.title)}
              helperText={touched.title && errors.title ? errors.title : ''}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              onClick={closeCustomizationTypePopup}
              disabled={crudCustomizationTypeLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={crudCustomizationTypeLoading}
            >
              {selectedCustomizationType?.id ? 'Update' : 'Save'}
            </LoadingButton>
          </StyledDialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default CustomizationType;
