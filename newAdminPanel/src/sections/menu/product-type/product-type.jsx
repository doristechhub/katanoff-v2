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
  createMenuProductType,
  updateMenuProductType,
  deleteMenuProductType,
  getMenuProductTypeList,
} from 'src/actions/productTypeActions';
import {
  setProductTypePage,
  initMenuProductType,
  setSelectedMenuProductType,
} from 'src/store/slices/menuSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { getMenuCategoryList } from 'src/actions/menuActions';
import { Button, LoadingButton } from 'src/components/button';
import { getMenuSubCategoryList } from 'src/actions/menuSubCategoryActions';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  categoryId: Yup.string().required('Category is required'),
  subCategoryId: Yup.string().required('Sub category is required'),
});

// ----------------------------------------------------------------------

const ProductType = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [openMenuProductTypeDialog, setOpenMenuProductTypeDialog] = useState(false);
  const [categoryWiseSubCategoryList, setCategoryWiseSubCategoryList] = useState([]);

  const {
    categoryList,
    productTypePage,
    menuProductTypeList,
    menuSubCategoryList,
    menuProductTypeLoading,
    selectedMenuProductType,
    crudMenuProductTypeLoading,
  } = useSelector(({ menu }) => menu);

  const searchedKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = menuProductTypeList?.filter((item) => {
    return (
      item?.title?.toLowerCase()?.includes(searchedKey) ||
      item?.categoryName?.toLowerCase()?.includes(searchedKey) ||
      item?.subCategoryName?.toLowerCase()?.includes(searchedKey)
    );
  });

  let currentItems = filteredItems?.slice(
    productTypePage * rowsPerPage,
    productTypePage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(() => {
    dispatch(getMenuCategoryList());
    dispatch(getMenuSubCategoryList());
    dispatch(getMenuProductTypeList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setProductTypePage(0));
  }, []);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        title: val?.title,
        categoryId: val?.categoryId,
        subCategoryId: val?.subCategoryId,
      };
      let res;
      let cPage = 0;
      if (val?.id) {
        cPage = productTypePage;
        payload.productTypeId = val?.id;
        res = await dispatch(updateMenuProductType(payload));
      } else {
        res = await dispatch(createMenuProductType(payload));
      }
      if (res) {
        dispatch(getMenuProductTypeList());
        dispatch(setProductTypePage(cPage));
        setOpenMenuProductTypeDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [productTypePage]
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues: selectedMenuProductType,
  });

  const handleMenuCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedCategory(value);
    setSelectedSubCategory('all');
    setSearchedValue(value === 'all' ? '' : value);
    dispatch(setProductTypePage(0));
  }, []);

  const handleMenuSubCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedSubCategory(value);
    setSelectedCategory('all');
    setSearchedValue(value === 'all' ? '' : value);
    dispatch(setProductTypePage(0));
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event?.target?.value;
    setSearchedValue(value);
    setSelectedSubCategory('all');
    setSelectedCategory('all');
    dispatch(setProductTypePage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setProductTypePage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    dispatch(setProductTypePage(0));
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudMenuProductTypeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedProductTypeId();
      setCategoryWiseSubCategoryList([]);
    },
    [crudMenuProductTypeLoading]
  );

  const closeMenuProductTypePopup = useCallback(() => {
    setOpenMenuProductTypeDialog(false);
    dispatch(setSelectedMenuProductType(initMenuProductType));
    resetForm();
  }, []);

  const handleEdit = useCallback(async () => {
    const productTypeItem = menuProductTypeList?.find((x) => x?.id === selectedProductTypeId);
    if (productTypeItem) {
      dispatch(setSelectedMenuProductType(productTypeItem));
      setOpenMenuProductTypeDialog(true);
      categoryChangeHandler(productTypeItem.categoryId);
      setFieldValue('subCategoryId', productTypeItem.subCategoryId);
    }
  }, [selectedProductTypeId, menuProductTypeList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteMenuProductType({
        productTypeId: selectedProductTypeId,
      })
    );
    if (res) {
      dispatch(getMenuProductTypeList());
      const cPage =
        productTypePage !== 0 && currentItems?.length === 1 ? productTypePage - 1 : productTypePage;
      dispatch(setProductTypePage(cPage));
      handlePopup();
    }
  }, [selectedProductTypeId, productTypePage]);

  const categoryChangeHandler = useCallback(
    (value) => {
      setFieldValue('categoryId', value);
      setFieldValue('subCategoryId', '');
      const filterdData = menuSubCategoryList.filter((item) => item.categoryId === value);
      setCategoryWiseSubCategoryList(filterdData);
    },
    [menuSubCategoryList]
  );

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
        <MenuItem onClick={handleEdit} disabled={crudMenuProductTypeLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{ color: 'error.main' }}
          disabled={crudMenuProductTypeLoading}
        >
          {crudMenuProductTypeLoading ? (
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
  }, [open, crudMenuProductTypeLoading]);

  return (
    <>
      {menuProductTypeLoading ? (
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
              <TextField
                select
                size="small"
                sx={{
                  minWidth: '150px',
                }}
                onBlur={handleBlur}
                label="SubCategory Name"
                name="selectedSubCategory"
                value={selectedSubCategory || ''}
                onChange={(e) => handleMenuSubCategorySelection(e.target.value)}
              >
                <MenuItem value={'all'}>All</MenuItem>
                {menuSubCategoryList?.length > 0 ? (
                  menuSubCategoryList?.map((option) => (
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
                setOpenMenuProductTypeDialog(true);
                dispatch(setSelectedMenuProductType(initMenuProductType));
                setCategoryWiseSubCategoryList([]);
              }}
            >
              Menu ProductType
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
                    <TableCell>SubCategory Name</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {currentItems?.length
                    ? currentItems?.map((x, i) => (
                        <TableRow key={`menu-product-type-${i}`}>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.title}</TableCell>
                          <TableCell>{x?.categoryName}</TableCell>
                          <TableCell>{x?.subCategoryName}</TableCell>
                          <TableCell sx={{ width: '50px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              onClick={(e) => {
                                setOpen(e.currentTarget);
                                setSelectedProductTypeId(x?.id);
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
        </>
      )}

      {menuProductTypeList?.length > 5 ? (
        <TablePagination
          component="div"
          page={productTypePage}
          rowsPerPage={rowsPerPage}
          count={filteredItems?.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}

      {renderPopup}

      {openMenuProductTypeDialog ? (
        <Dialog
          open={openMenuProductTypeDialog}
          handleOpen={() => setOpenMenuProductTypeDialog(true)}
          handleClose={closeMenuProductTypePopup}
        >
          <StyledDialogTitle>
            {selectedMenuProductType?.id ? 'Update' : 'Add New'} ProductType
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
              onChange={(event) => categoryChangeHandler(event.target.value)}
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
              select
              sx={{
                mt: '10px',
                width: '100%',
              }}
              onBlur={handleBlur}
              name="subCategoryId"
              onChange={handleChange}
              label="SubCategory Name"
              value={values?.subCategoryId || ''}
              error={!!(touched.subCategoryId && errors.subCategoryId)}
              helperText={touched.subCategoryId && errors.subCategoryId ? errors.subCategoryId : ''}
            >
              {categoryWiseSubCategoryList?.length ? (
                categoryWiseSubCategoryList?.map((option) => (
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
              label="ProductType Title"
              error={!!(touched.title && errors.title)}
              helperText={touched.title && errors.title ? errors.title : ''}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              variant="outlined"
              onClick={closeMenuProductTypePopup}
              disabled={crudMenuProductTypeLoading}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={crudMenuProductTypeLoading}
            >
              {selectedMenuProductType?.id ? 'Update' : 'Save'}
            </LoadingButton>
          </StyledDialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default ProductType;
