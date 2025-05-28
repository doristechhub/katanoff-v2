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
  Typography,
  TextField,
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
  createMenuSubCategory,
  updateMenuSubCategory,
  deleteMenuSubCategory,
  getMenuSubCategoryList,
} from 'src/actions/menuSubCategoryActions';
import {
  setPage,
  initMenuSubCategory,
  setSelectedMenuSubCategory,
} from 'src/store/slices/menuSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { getMenuCategoryList } from 'src/actions/menuActions';
import { Button, LoadingButton } from 'src/components/button';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  categoryId: Yup.string().required('category is required'),
});

// ----------------------------------------------------------------------

const SubCategory = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState();
  const [openMenuSubCategoryDialog, setOpenMenuSubCategoryDialog] = useState(false);

  const {
    page,
    categoryList,
    menuSubCategoryList,
    menuSubCategoryLoading,
    selectedMenuSubCategory,
    crudMenuSubCategoryLoading,
  } = useSelector(({ menu }) => menu);

  const searchedKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = menuSubCategoryList.filter((item) => {
    return (
      item?.title?.toLowerCase()?.includes(searchedKey) ||
      item?.categoryName?.toLowerCase()?.includes(searchedKey)
    );
  });

  let currentItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const loadData = useCallback(() => {
    dispatch(getMenuCategoryList());
    dispatch(getMenuSubCategoryList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setPage(0));
  }, []);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        title: val?.title,
        categoryId: val?.categoryId,
      };
      let res;
      let cPage = 0;
      if (val?.id) {
        cPage = page;
        payload.subCategoryId = val?.id;
        res = await dispatch(updateMenuSubCategory(payload));
      } else {
        res = await dispatch(createMenuSubCategory(payload));
      }
      if (res) {
        dispatch(getMenuSubCategoryList());
        dispatch(setPage(cPage));
        setOpenMenuSubCategoryDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [page]
  );

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues: selectedMenuSubCategory,
  });

  const handleMenuCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedCategory(value);
    setSearchedValue(value === 'all' ? '' : value);
    dispatch(setPage(0));
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    if (!value) setSelectedCategory('all');
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
      if (crudMenuSubCategoryLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedSubCategoryId();
    },
    [crudMenuSubCategoryLoading]
  );

  const closeMenuSubCategoryPopup = useCallback(() => {
    setOpenMenuSubCategoryDialog(false);
    dispatch(setSelectedMenuSubCategory(initMenuSubCategory));
    resetForm();
  }, []);

  const handleEdit = useCallback(async () => {
    const category = menuSubCategoryList?.find((x) => x?.id === selectedSubCategoryId);
    if (category) {
      dispatch(setSelectedMenuSubCategory(category));
      setOpenMenuSubCategoryDialog(true);
    }
  }, [selectedSubCategoryId, menuSubCategoryList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteMenuSubCategory({
        subCategoryId: selectedSubCategoryId,
      })
    );
    if (res) {
      dispatch(getMenuSubCategoryList());
      const cPage = page !== 0 && currentItems?.length === 1 ? page - 1 : page;
      dispatch(setPage(cPage));
      handlePopup();
    }
  }, [selectedSubCategoryId, page]);

  const renderPopup = useMemo(() => {
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEdit} disabled={crudMenuSubCategoryLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
          disabled={crudMenuSubCategoryLoading}
        >
          {crudMenuSubCategoryLoading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '15px',
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
  }, [open, crudMenuSubCategoryLoading]);

  return (
    <>
      {menuSubCategoryLoading ? (
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
            <Stack direction="row" alignItems="center" gap={2} flexWrap={'wrap'}>
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
                sx={{
                  minWidth: '150px',
                }}
                size="small"
                onBlur={handleBlur}
                label="Category Name"
                name="selectedCategory"
                value={selectedCategory || ''}
                onChange={(e) => handleMenuCategorySelection(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                {categoryList?.length > 0 ? (
                  categoryList?.map((option) => (
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
                dispatch(setSelectedMenuSubCategory(initMenuSubCategory));
                setSelectedSubCategoryId();
                setOpenMenuSubCategoryDialog(true);
              }}
            >
              Menu SubCategory
            </Button>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentItems?.length
                    ? currentItems?.map((x, i) => (
                        <TableRow key={`menu-subcategory-${i}`}>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.title}</TableCell>
                          <TableCell>{x?.categoryName}</TableCell>
                          <TableCell sx={{ width: '50px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedSubCategoryId(x?.id);
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

      {menuSubCategoryList?.length > 5 ? (
        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredItems?.length}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {renderPopup}

      {openMenuSubCategoryDialog ? (
        <Dialog
          open={openMenuSubCategoryDialog}
          handleClose={closeMenuSubCategoryPopup}
          handleOpen={() => setOpenMenuSubCategoryDialog(true)}
        >
          <StyledDialogTitle>
            {selectedMenuSubCategory?.id ? 'Update' : 'Add New'} SubCategory
          </StyledDialogTitle>
          <StyledDialogContent>
            <TextField
              select
              sx={{
                mt: '10px',
                width: '100%',
              }}
              name="categoryId"
              onBlur={handleBlur}
              label="Category Name"
              onChange={handleChange}
              value={values?.categoryId || ''}
              error={!!(touched.categoryId && errors.categoryId)}
              helperText={touched.categoryId && errors.categoryId ? errors.categoryId : ''}
            >
              {categoryList?.length > 0 ? (
                categoryList?.map((option) => (
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
              name="title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title || ''}
              label="Menu SubCategory Title"
              error={!!(touched.title && errors.title)}
              helperText={touched.title && errors.title ? errors.title : ''}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              onClick={closeMenuSubCategoryPopup}
              disabled={crudMenuSubCategoryLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              loading={crudMenuSubCategoryLoading}
              onClick={handleSubmit}
            >
              {selectedMenuSubCategory?.id ? 'Update' : 'Save'}
            </LoadingButton>
          </StyledDialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default SubCategory;
