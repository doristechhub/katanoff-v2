import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState, useDeferredValue, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Checkbox,
  FormControlLabel,
  TablePagination,
  InputAdornment,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  createCollection,
  getSingleCollection,
  updateCollection,
} from 'src/actions/collectionActions';
import { setSelectedCollection, initCollection } from 'src/store/slices/collectionSlice';
import { Button, LoadingButton } from 'src/components/button';
import { FileDrop } from 'src/components/file-drop';
import { COLLECTION_TYPES, COLLECTION_FILTER_TYPES } from 'src/_helpers/constants';
import Dialog from 'src/components/dialog';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { grey } from 'src/theme/palette';
import { setProductList } from 'src/store/slices/productSlice';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import { getProducts } from 'src/actions';
import ProgressiveImg from 'src/components/progressive-img';
import { fCurrency } from 'src/utils/format-number';

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  type: Yup.string()
    .oneOf([...Object.values(COLLECTION_TYPES).map((t) => t.value), null, ''])
    .test(
      'type-required-if-thumbnail',
      'Collection type is required when a thumbnail is uploaded',
      function (value) {
        const { thumbnailFile } = this.parent;
        return !(thumbnailFile?.length > 0 && !value);
      }
    ),
  filterType: Yup.string()
    .required('Filter type is required')
    .oneOf(
      ['setting_style', 'sub_categories', 'product_types'],
      'Invalid filter type. Must be Setting Style, Sub Categories, or Product Types'
    ),
  thumbnailPreviewImage: Yup.array().test('thumbnail-required-if-type', function (value) {
    const { type, thumbnailPreviewImage } = this.parent;
    if (!type || type === '' || type === 'default') {
      return thumbnailPreviewImage?.length
        ? this.createError({
            message: 'Thumbnail image is not required when a type is default',
            path: 'thumbnailPreviewImage',
          })
        : true;
    }
    return value && value.length > 0
      ? true
      : this.createError({
          message: 'Thumbnail image is required when a valid collection type is selected',
          path: 'thumbnailPreviewImage',
        });
  }),
});

// Component
const AddCollectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get('collectionId');
  const { crudCollectionLoading, selectedCollection } = useSelector(({ collection }) => collection);
  const { productLoading, productList } = useSelector(({ product }) => product);
  const [browseDialog, setBrowseDialog] = useState(false);
  const [confirmSelectProductDialog, setConfirmSelectProductDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredQuery = useDeferredValue(searchQuery);
  const [filteredList, setFilteredList] = useState([]);
  const [productPage, setProductPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedProductCount, setSelectedProductCount] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState({
    desktopBanner: false,
    mobileBanner: false,
    thumbnail: false,
  });

  const loadData = useCallback(async () => {
    try {
      const sortedProducts = await dispatch(getProducts());
      if (collectionId) {
        const res = await dispatch(getSingleCollection(collectionId));
        const updatedList = sortedProducts.map((p) => ({
          ...p,
          selected: res.products.some((selected) => selected.id === p.id),
        }));
        // Only dispatch if there are actual changes to avoid infinite loops
        const hasChanges = updatedList.some((p, i) => p.selected !== sortedProducts[i]?.selected);
        if (hasChanges) {
          dispatch(setProductList(updatedList));
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch(setProductList([]));
    }
  }, [dispatch, collectionId]);

  useEffect(() => {
    loadData();
    return () => {
      dispatch(setSelectedCollection(initCollection));
    };
  }, [dispatch, collectionId, loadData]);

  useEffect(() => {
    setProductPage(0);
    const filtered =
      productList?.filter((item) => {
        const searchValue = deferredQuery?.toLowerCase()?.trim() || '';
        return (
          item?.productName?.toLowerCase()?.includes(searchValue) ||
          item?.sku?.toLowerCase()?.includes(searchValue) ||
          item?.gender?.toLowerCase()?.includes(searchValue) ||
          (item?.baseSellingPrice !== undefined &&
            item.baseSellingPrice.toString().toLowerCase().includes(searchValue))
        );
      }) || [];

    setFilteredList(filtered);
    setIsAllSelected(filtered.length > 0 && filtered.every((x) => x?.selected));
    setSelectedProductCount(filtered.filter((x) => x.selected).length);
  }, [productList, deferredQuery]);

  const paginatedItems = useMemo(() => {
    return filteredList.slice(productPage * rowsPerPage, productPage * rowsPerPage + rowsPerPage);
  }, [filteredList, productPage, rowsPerPage]);

  const handleProductSelection = useCallback(
    (e, product) => {
      const updated = productList.map((p) =>
        p.id === product.id ? { ...p, selected: e.target.checked } : p
      );
      setSelectedProductCount(updated.filter((x) => x.selected).length);
      dispatch(setProductList(updated));
    },
    [dispatch, productList]
  );

  const toggleSelectAll = useCallback(() => {
    const updated = productList.map((x) => ({ ...x, selected: !isAllSelected }));
    setSelectedProductCount(updated.filter((x) => x.selected).length);
    dispatch(setProductList(updated));
  }, [dispatch, isAllSelected, productList]);

  const onSubmit = useCallback(
    async (values, { resetForm }) => {
      try {
        const payload = {
          title: values?.title,
          type: values?.type === 'default' ? '' : values?.type,
          filterType: values?.filterType,
          desktopBannerFile: values?.desktopBannerFile?.[0] || null,
          mobileBannerFile: values?.mobileBannerFile?.[0] || null,
          thumbnailFile: values?.thumbnailFile?.[0] || null,
          deletedDesktopBannerImage: values?.desktopBannerUploadedDeletedImage?.[0]?.image || null,
          deletedThumbnailImage: values?.thumbnailUploadedDeletedImage?.[0]?.image || null,
          deletedMobileBannerImage: values?.mobileBannerUploadedDeletedImage?.[0]?.image || null,
          productIds: values?.selectedProductsList?.map((x) => x.id),
        };

        if (values?.id) {
          payload.collectionId = values?.id;
        }
        const action = values?.id ? updateCollection : createCollection;
        const res = await dispatch(action(payload));
        if (res) {
          resetForm();
          navigate('/collection');
        }
      } catch (error) {
        console.error('Failed to submit collection:', error);
      }
    },
    [dispatch, navigate]
  );

  const formik = useFormik({
    enableReinitialize: true,
    onSubmit,
    initialValues: selectedCollection,
    validationSchema,
  });

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } = formik;

  const handleConfirmSelectedProducts = useCallback(() => {
    const allSelectedProducts = productList.filter((x) => x.selected);
    formik.setFieldValue('selectedProductsList', allSelectedProducts);
    setBrowseDialog(false);
    setConfirmSelectProductDialog(false);
  }, [productList, formik]);

  const removeSelectedProduct = useCallback(
    (e, product) => {
      const updated = formik.values.selectedProductsList.filter((p) => p.id !== product.id);
      formik.setFieldValue('selectedProductsList', updated);
      dispatch(
        setProductList(
          productList.map((p) => (p.id === product.id ? { ...p, selected: false } : p))
        )
      );
    },
    [formik, productList, dispatch]
  );

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [panel]: isExpanded,
    }));
  };

  const renderProductInfo = (product) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 40, height: 40, borderRadius: 1, overflow: 'hidden', flexShrink: 0 }}>
        <ProgressiveImg
          alt={product?.productName}
          title={product?.productName}
          customClassName="h-[40px] w-[40px] object-cover"
          placeHolderClassName="h-[40px] w-[40px]"
          src={product?.yellowGoldThumbnailImage || product?.yellowGoldThumbnailImage?.[0]?.image}
        />
      </Box>
      <Typography variant="body2" fontWeight={500}>
        {product?.productName}
      </Typography>
    </Box>
  );

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">
          {collectionId ? 'Update Collection' : 'Create Collection'}
        </Typography>
      </Box>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid container xs={12} spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                name="title"
                label="Collection Title"
                value={values?.title || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid container xs={12} md={6} spacing={2}>
              <Grid xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  name="type"
                  label="Collection Type"
                  value={values?.type || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.type && !!errors.type}
                  helperText={touched.type && errors.type}
                >
                  {Object.values(COLLECTION_TYPES).map((type) => (
                    <MenuItem key={type.label} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  name="filterType"
                  label="Filter Type"
                  value={values?.filterType || 'setting_style'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.filterType && !!errors.filterType}
                  helperText={touched.filterType && errors.filterType}
                >
                  {COLLECTION_FILTER_TYPES.map((option) => (
                    <MenuItem key={option.value} value={option.value} className="capitalize">
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} lg={4} mt={3}>
            <Accordion defaultExpanded={false} onChange={handleAccordionChange('desktopBanner')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:chevron-down-fill" />}>
                <Typography variant="subtitle2">Desktop Banner (1920x448)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FileDrop
                  mediaLimit={1}
                  formik={formik}
                  productId={selectedCollection}
                  fileKey="desktopBannerFile"
                  previewKey="desktopBannerPreviewImage"
                  deleteKey="desktopBannerUploadedDeletedImage"
                  loading={crudCollectionLoading}
                />
              </AccordionDetails>
            </Accordion>
            {!expandedAccordions.desktopBanner &&
              formik.touched.desktopBannerPreviewImage &&
              formik.errors.desktopBannerPreviewImage && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {formik.errors.desktopBannerPreviewImage}
                </Typography>
              )}
          </Grid>
          <Grid xs={12} lg={4} mt={3}>
            <Accordion defaultExpanded={false} onChange={handleAccordionChange('mobileBanner')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:chevron-down-fill" />}>
                <Typography variant="subtitle2">Mobile Banner (1500x738)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FileDrop
                  mediaLimit={1}
                  formik={formik}
                  productId={selectedCollection}
                  fileKey="mobileBannerFile"
                  previewKey="mobileBannerPreviewImage"
                  deleteKey="mobileBannerUploadedDeletedImage"
                  loading={crudCollectionLoading}
                />
              </AccordionDetails>
            </Accordion>
            {!expandedAccordions.mobileBanner &&
              formik.touched.mobileBannerPreviewImage &&
              formik.errors.mobileBannerPreviewImage && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {formik.errors.mobileBannerPreviewImage}
                </Typography>
              )}
          </Grid>
          <Grid xs={12} lg={4} mt={3}>
            <Accordion defaultExpanded={false} onChange={handleAccordionChange('thumbnail')}>
              <AccordionSummary expandIcon={<Iconify icon="eva:chevron-down-fill" />}>
                <Typography variant="subtitle2">
                  Thumbnail Images ({COLLECTION_TYPES[values.type]?.thumbnailDimensions})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FileDrop
                  mediaLimit={1}
                  formik={formik}
                  productId={selectedCollection}
                  fileKey="thumbnailFile"
                  previewKey="thumbnailPreviewImage"
                  deleteKey="thumbnailUploadedDeletedImage"
                  loading={crudCollectionLoading}
                />
              </AccordionDetails>
            </Accordion>
            {!expandedAccordions.thumbnail &&
              formik.touched.thumbnailPreviewImage &&
              formik.errors.thumbnailPreviewImage && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {formik.errors.thumbnailPreviewImage}
                </Typography>
              )}
          </Grid>
          <Grid xs={12} mt={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">Add Products</Typography>
              <LoadingButton
                disabled={productLoading}
                loading={productLoading}
                variant="contained"
                onClick={() => setBrowseDialog(true)}
                startIcon={<Iconify icon="eva:search-fill" />}
              >
                Browse Products
              </LoadingButton>
            </Stack>
            <Card sx={{ border: `1px solid ${grey[200]}`, maxHeight: 800 }}>
              <Scrollbar>
                <TableContainer sx={{ maxHeight: 800 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ width: 60 }}>
                          ID
                        </TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Product</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Gender</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>SKU</TableCell>
                        <TableCell sx={{ minWidth: 80 }}>Price</TableCell>
                        <TableCell align="center">
                          <button
                            className="underline text-sm"
                            onClick={() => {
                              formik.setFieldValue('selectedProductsList', []);
                              dispatch(
                                setProductList(productList.map((p) => ({ ...p, selected: false })))
                              );
                            }}
                          >
                            Clear All
                          </button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.selectedProductsList?.length ? (
                        values.selectedProductsList.map((product, index) => (
                          <TableRow key={`selected-product-${index}`} hover>
                            <TableCell align="center">{index + 1}</TableCell>
                            <TableCell
                              sx={{ cursor: 'pointer', color: 'primary.main' }}
                              onClick={() => {
                                navigate(`/product/add?productId=${product.id}`);
                              }}
                            >
                              {renderProductInfo(product)}
                            </TableCell>
                            <TableCell sx={{ textTransform: 'capitalize' }}>
                              {product?.gender || 'N/A'}
                            </TableCell>
                            <TableCell>{product?.sku || 'N/A'}</TableCell>
                            <TableCell>{fCurrency(product.baseSellingPrice)}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={(e) => removeSelectedProduct(e, product)}
                              >
                                <Iconify icon="ix:cancel" width={15} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                              No products selected
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/collection')}
            disabled={crudCollectionLoading}
          >
            Cancel
          </Button>
          <LoadingButton variant="contained" onClick={handleSubmit} loading={crudCollectionLoading}>
            {collectionId ? 'Update' : 'Save'}
          </LoadingButton>
        </Box>
      </Card>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={browseDialog}
        handleClose={() => setBrowseDialog(false)}
        handleOpen={() => setBrowseDialog(true)}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Products
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {selectedProductCount} product(s) selected
            </Typography>
          </Typography>
          <TextField
            fullWidth
            size="small"
            type="search"
            placeholder="Search by Title, Gender or SKU"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
        </Box>
        <Scrollbar>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 4, width: 50 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={
                            productList.some((product) => product.selected) &&
                            !productList.every((product) => product.selected)
                          }
                          onChange={toggleSelectAll}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>Product</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Gender</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>SKU</TableCell>
                  <TableCell sx={{ minWidth: 80 }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems?.length ? (
                  paginatedItems.map((product, i) => (
                    <TableRow key={`product-${i}`} hover>
                      <TableCell sx={{ pl: 3 }}>
                        <FormControlLabel
                          sx={{ ml: 0, mr: 0 }}
                          control={
                            <Checkbox
                              checked={product.selected || false}
                              onChange={(e) => handleProductSelection(e, product)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>{renderProductInfo(product)}</TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        {product.gender || 'N/A'}
                      </TableCell>
                      <TableCell>{product.sku || 'N/A'}</TableCell>
                      <TableCell>{fCurrency(product.baseSellingPrice)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No Data
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
        <Box
          sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}
        >
          {filteredList.length > rowsPerPage && (
            <TablePagination
              page={productPage}
              component="div"
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, newPage) => setProductPage(newPage)}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setProductPage(0);
              }}
            />
          )}
          <Button className="h-fit" variant="outlined" onClick={() => setBrowseDialog(false)}>
            Cancel
          </Button>
          <LoadingButton
            className="h-fit"
            variant="contained"
            onClick={() => {
              const allSelectedProducts = productList.filter((x) => x.selected);
              if (allSelectedProducts.length) {
                setConfirmSelectProductDialog(true);
              }
            }}
            loading={productLoading}
          >
            Select
          </LoadingButton>
        </Box>
      </Dialog>
      {confirmSelectProductDialog && (
        <ConfirmationDialog
          loading={false}
          open={confirmSelectProductDialog}
          setOpen={setConfirmSelectProductDialog}
          handleConfirm={handleConfirmSelectedProducts}
        >
          <Typography variant="button" sx={{ mt: 1, fontSize: '16px' }}>
            Are you sure you want to proceed?
          </Typography>
          <p>By confirming, selected products will be added to the collection.</p>
        </ConfirmationDialog>
      )}
    </Container>
  );
};

export default AddCollectionPage;
