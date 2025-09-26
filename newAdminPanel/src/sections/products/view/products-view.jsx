import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, InputAdornment, TextField } from '@mui/material';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import NoData from 'src/components/no-data';
import Spinner from 'src/components/spinner';
import Iconify from 'src/components/iconify';
import Pagination from 'src/components/pagination';
import { fPageCount } from 'src/utils/format-number';
import {
  deleteProduct,
  getProducts,
  getAllMenuCategoryList,
  getCustomizationTypeList,
  getCustomizationSubTypeList,
  getSettingStyleList,
  getAllProcessedProducts,
  toastError,
} from 'src/actions';
import { Button, LoadingButton } from 'src/components/button';
import { EXPORT, GENDER_LIST, perPageCountOptions, PRODUCT, productStatusOptions } from 'src/_helpers/constants';
import { getCollectionList } from 'src/actions/collectionActions';
import {
  setCrudProductLoading,
  setExportExcelLoading,
  setIsDuplicateProduct,
  setPerPageCount,
  setFilterState,
  clearFilterState,
} from 'src/store/slices/productSlice';

import ProductCard from '../product-card';
import { generateExcel } from 'src/_helpers/generateExcel';
import { helperFunctions } from 'src/_helpers';
import { adminController } from 'src/_controller';

const genderOptions = [
  {
    title: 'All',
    value: 'all',
  },
  ...GENDER_LIST,
];

// ----------------------------------------------------------------------

export default function ProductsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeProduct, setActiveProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);

  const { collectionList } = useSelector(({ collection }) => collection);
  const { settingStyleList } = useSelector(({ settingStyle }) => settingStyle);
  const {
    productList = [],
    menuList = { subCategories: [], productType: [] },
    productLoading = false,
    crudProductLoading = false,
    perPageCount = 10,
    exportExcelLoading = false,
    categoriesList = [],
    filterState: {
      searchQuery = '',
      selectedProductStatus = 'all',
      filterByCategory = 'all',
      filterBySubCategory = 'all',
      filterByCollection = 'all',
      filterBySettingStyle = 'all',
      filterByProductType = 'all',
      filterByGender = 'all',
      page = 1,
    } = {},
  } = useSelector(({ product }) => product);

  useEffect(() => {
    dispatch(getAllMenuCategoryList());
    dispatch(getCollectionList());
    dispatch(getSettingStyleList());
    dispatch(getCustomizationTypeList());
    dispatch(getCustomizationSubTypeList());
  }, [dispatch]);

  const loadData = useCallback(
    (pageNo = page) => {
      dispatch(getProducts());
      dispatch(setFilterState({ page: pageNo }));
    },
    [dispatch, page]
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filteredList = productList?.filter((item) => {
      const searchValue = typeof searchQuery === 'string' ? searchQuery?.toLowerCase()?.trim() : '';
      const matchesSearch =
        !searchValue ||
        item?.productName?.toLowerCase()?.includes(searchValue) ||
        item?.sku?.toLowerCase()?.includes(searchValue) ||
        item?.saltSKU?.toLowerCase()?.includes(searchValue) ||
        item?.shortDescription?.toLowerCase()?.includes(searchValue) ||
        item?.basePrice?.toString()?.includes(searchValue) ||
        item?.baseSellingPrice?.toString()?.includes(searchValue);

      const matchesCategory =
        filterByCategory === 'all' || String(item.categoryId) === String(filterByCategory);

      const matchesSubCategory =
        filterBySubCategory === 'all' ||
        item?.subCategoryIds?.some((id) => String(id) === String(filterBySubCategory));

      const matchesCollection =
        filterByCollection === 'all' ||
        item?.collectionIds?.some((id) => String(id) === String(filterByCollection));
      const matchesSettingStyle =
        filterBySettingStyle === 'all' ||
        item?.settingStyleIds?.some((id) => String(id) === String(filterBySettingStyle));
      const matchesProductType =
        filterByProductType === 'all' ||
        item?.productTypeIds?.some((id) => String(id) === String(filterByProductType));
      const matchesGender =
        filterByGender === 'all' ||
        String(item?.gender).toLowerCase() === String(filterByGender).toLowerCase();

      const matchesStatus =
        selectedProductStatus === 'all' || String(item.active) === String(selectedProductStatus);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesCollection &&
        matchesSettingStyle &&
        matchesProductType &&
        matchesGender &&
        matchesStatus
      );
    });
    setFilteredList(filteredList);
    const indexOfLastItem = page * perPageCount;
    const indexOfFirstItem = indexOfLastItem - perPageCount;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentPageData(currentItems);
  }, [
    page,
    productList,
    perPageCount,
    searchQuery,
    filterByCategory,
    filterBySubCategory,
    filterByGender,
    filterByProductType,
    selectedProductStatus,
    filterByCollection,
    filterBySettingStyle,
  ]);

  const onChangeProductStatus = (item) => {
    const value = item !== 'all' ? item : '';
    dispatch(setFilterState({ selectedProductStatus: item, searchQuery: value, page: 1 }));
  };

  const productStatus = (
    <TextField
      select
      label="Product Status"
      sx={{ mt: '8px', minWidth: '150px' }}
      size="small"
      value={selectedProductStatus}
      onChange={(e) => onChangeProductStatus(e.target.value)}
    >
      {productStatusOptions.map((option) => (
        <MenuItem key={option?.value} value={option?.value}>
          {option?.label}
        </MenuItem>
      ))}
    </TextField>
  );

  const pageCount = (
    <TextField
      select
      size="small"
      value={perPageCount}
      onChange={(e) => {
        dispatch(setPerPageCount(e.target.value));
        dispatch(setFilterState({ page: 1 }));
      }}
    >
      {perPageCountOptions?.map((option) => (
        <MenuItem key={option?.value} value={option?.value}>
          {option?.label}
        </MenuItem>
      ))}
    </TextField>
  );

  const handleChangePage = (e, newPage) => {
    dispatch(setFilterState({ page: newPage }));
  };

  const handleClose = async (id) => {
    if (id) {
      const res = await dispatch(deleteProduct(id));
      if (res) {
        const cPage = page !== 1 && currentPageData?.length === 1 ? page - 1 : page;
        loadData(cPage);
        dispatch(setCrudProductLoading(false));
      }
    }
    setActiveProduct(null);
    setOpenDialog(false);
  };

  const searchValueHandler = (event) => {
    const value = event.target.value;
    dispatch(setFilterState({ searchQuery: value, selectedProductStatus: 'all', page: 1 }));
  };

  const clearFilter = useCallback(() => {
    dispatch(clearFilterState());
  }, [dispatch]);

  const onExport = useCallback(async () => {
    dispatch(setExportExcelLoading(true));

    // Check if the current admin has permission to export products, and reject if not
    const currentUser = helperFunctions.getCurrentUser();
    const payload = {
      adminId: currentUser?.id,
    };
    const permissionData = await adminController.getPermissionsByAdminId(payload);
    const productPermissions = permissionData.find((perm) => perm.pageId === PRODUCT);

    const canExport = productPermissions?.actions?.some((action) => action.actionId === EXPORT);
    if (!canExport) {
      toastError({ message: 'You do not have permission to export this product.' });
      dispatch(setExportExcelLoading(false));
      return;
    }

    const processedProducts = await dispatch(getAllProcessedProducts());

    const filteredIds = new Set(filteredList.map((item) => item.id));

    const matchedList = processedProducts?.filter((item) => filteredIds.has(item.id));

    const tempArry = matchedList?.map((pItem) => ({
      'Product Name': pItem.productName || '',
      SKU: pItem.sku || '',
      'Salt SKU': pItem.saltSKU || '',
      'Gross Wt (g)': pItem?.grossWeight || '',
      'Net Wt (g)': pItem?.netWeight || '',
      'Center Dia Wt (ctw)': pItem?.centerDiamondWeight || '',
      'Side Dia Wt (ctw)': pItem?.sideDiamondWeight || '',
      'Total Carat Wt (ctw)': pItem?.totalCaratWeight || '',
      'Discount (%)': pItem?.discount || '',

      // Category & Collection
      'Category Name': pItem?.categoryName || '',
      'Sub Categories': pItem?.subCategoryNames?.map((s) => s.title).join(', ') || '',
      'Product Types': pItem?.productTypeNames?.map((t) => t.title).join(', ') || '',
      Collections: pItem?.collectionNames?.join(', ') || '',

      Gender: pItem?.gender || '',
      Length: pItem?.Length || '',
      'Length Unit': pItem?.lengthUnit || '',
      Width: pItem?.width || '',
      'Width Unit': pItem?.widthUnit || '',
      'Short Description': pItem?.shortDescription || '',
      Description: pItem?.description || '',

      // Variations simplified for readability
      Variations:
        pItem?.variations
          ?.map((v) => {
            const types = v.variationTypes.map((t) => t.variationTypeName).join('/');
            return `${v.variationName}: ${types}`;
          })
          .join(' | ') || '',

      Specifications: JSON.stringify(pItem?.specifications),

      Status: pItem?.active ? 'Active' : 'Inactive',
      'Created Date': pItem?.createdDate ? new Date(pItem.createdDate).toLocaleString() : '',
      'Updated Date': pItem?.updatedDate ? new Date(pItem.updatedDate).toLocaleString() : '',

      // Media fields
      'Rose Gold Thumbnail': pItem?.roseGoldThumbnailImage || '',
      'Rose Gold Images': pItem?.roseGoldImages?.map((i) => i.image).join(', ') || '',
      'Rose Gold Video': pItem?.roseGoldVideo || '',
      'Yellow Gold Thumbnail': pItem?.yellowGoldThumbnailImage || '',
      'Yellow Gold Images': pItem?.yellowGoldImages?.map((i) => i.image).join(', ') || '',
      'Yellow Gold Video': pItem?.yellowGoldVideo || '',
      'White Gold Thumbnail': pItem?.whiteGoldThumbnailImage || '',
      'White Gold Images': pItem?.whiteGoldImages?.map((i) => i.image).join(', ') || '',
      'White Gold Video': pItem?.whiteGoldVideo || '',
    }));

    await generateExcel(tempArry, 'Product_List');
    dispatch(setExportExcelLoading(false));
  }, [filteredList, dispatch]);

  const newProduct = useCallback(() => {
    dispatch(setIsDuplicateProduct(false));
    navigate('/product/add');
  }, [dispatch, navigate]);

  const user = helperFunctions.getCurrentUser();

  const canExport = user.permissions.some(
    (perm) =>
      perm.pageId === 'product' && perm.actions.some((action) => action.actionId === 'export')
  );
  const canAddProduct = user.permissions.some(
    (perm) => perm.pageId === 'product' && perm.actions.some((action) => action.actionId === 'add')
  );

  return (
    <Container sx={{ height: '100%' }}>
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
        <Typography variant="h4">Products ({productList?.length || 0})</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            type="search"
            sx={{ padding: 0 }}
            placeholder="Search"
            value={searchQuery}
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

          <LoadingButton
            variant="contained"
            color="success"
            onClick={onExport}
            disabled={!canExport}
            loading={exportExcelLoading}
            startIcon={<Iconify icon={'file-icons:microsoft-excel'} width={25} />}
          >
            Export
          </LoadingButton>

          <Button
            disabled={!canAddProduct}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={newProduct}
          >
            New Product
          </Button>
        </Box>
      </Box>
      <Stack my={2} mx={2} gap={2} direction="row" flexWrap={'wrap'} alignItems="center">
        {productStatus}
        <TextField
          size="small"
          select
          sx={{ mt: '8px', minWidth: '150px' }}
          label="Category"
          value={filterByCategory}
          onChange={(e) => {
            dispatch(
              setFilterState({
                filterByCategory: e.target.value,
                filterBySubCategory: 'all',
                filterByProductType: 'all',
                page: 1,
              })
            );
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {categoriesList.length > 0 ? (
            categoriesList.map((x) => (
              <MenuItem value={x.id} key={x.id}>
                {x.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Item</MenuItem>
          )}
        </TextField>

        <TextField
          size="small"
          select
          sx={{ mt: '8px', minWidth: '150px' }}
          label="Subcategory"
          value={filterBySubCategory}
          onChange={(e) => {
            dispatch(
              setFilterState({
                filterBySubCategory: e.target.value,
                filterByProductType: 'all',
                page: 1,
              })
            );
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {filterByCategory !== 'all' && menuList.subCategories.length > 0 ? (
            menuList.subCategories
              .filter((subCat) => String(subCat.categoryId) === String(filterByCategory))
              .map((subCat) => (
                <MenuItem value={subCat.id} key={subCat.id}>
                  {subCat.title}
                </MenuItem>
              ))
          ) : (
            <MenuItem disabled>No Item</MenuItem>
          )}
        </TextField>
        <TextField
          size="small"
          select
          sx={{ mt: '8px', minWidth: '150px' }}
          label="Product Type"
          value={filterByProductType}
          onChange={(e) => {
            dispatch(setFilterState({ filterByProductType: e.target.value, page: 1 }));
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {filterBySubCategory !== 'all' && menuList.productType.length > 0 ? (
            menuList.productType
              .filter((subCat) => String(subCat.subCategoryId) === String(filterBySubCategory))
              .map((subCat) => (
                <MenuItem value={subCat.id} key={subCat.id}>
                  {subCat.title}
                </MenuItem>
              ))
          ) : (
            <MenuItem disabled>No Item</MenuItem>
          )}
        </TextField>

        <TextField
          size="small"
          select
          sx={{
            mt: '8px',
            minWidth: '150px',
          }}
          label="Collection"
          value={filterByCollection}
          onChange={(e) => {
            dispatch(setFilterState({ filterByCollection: e.target.value, page: 1 }));
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {collectionList?.length > 0 ? (
            collectionList.map((x, i) => (
              <MenuItem value={x?.id} key={`collection-name-${i}`}>
                {x?.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Item</MenuItem>
          )}
        </TextField>
        <TextField
          size="small"
          select
          sx={{
            mt: '8px',
            minWidth: '150px',
          }}
          label="Setting Style"
          value={filterBySettingStyle}
          onChange={(e) => {
            dispatch(setFilterState({ filterBySettingStyle: e.target.value, page: 1 }));
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {settingStyleList?.length > 0 ? (
            settingStyleList.map((x, i) => (
              <MenuItem value={x?.id} key={`setting-style-name-${i}`}>
                {x?.title}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Item</MenuItem>
          )}
        </TextField>
        <TextField
          select
          size="small"
          label="Gender"
          sx={{
            mt: '8px',
            minWidth: '150px',
          }}
          value={filterByGender}
          onChange={(e) => {
            dispatch(setFilterState({ filterByGender: e.target.value, page: 1 }));
          }}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option?.value} value={option?.value}>
              {option?.title}
            </MenuItem>
          ))}
        </TextField>
        <Button
          sx={{ mt: '8px' }}
          variant="contained"
          onClick={clearFilter}
          startIcon={<Iconify icon="tdesign:filter-clear" />}
        >
          Clear
        </Button>
      </Stack>
      <Stack sx={{ height: '99%', display: 'flex', justifyContent: 'space-between' }}>
        {productLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          currentPageData?.length > 0 && (
            <>
              <Grid container spacing={3}>
                {currentPageData?.map((product) => (
                  <Grid key={product?.id} xs={12} sm={6} md={3}>
                    <ProductCard
                      product={product}
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      setActiveProduct={setActiveProduct}
                      imagePath={product?.roseGoldThumbnailImage}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack
                sx={{
                  mb: 6,
                  mt: 2,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Stack
                  sx={{
                    mb: 6,
                    mt: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                      <Typography variant="subtitle2">
                        Products: {filteredList?.length || 0}
                      </Typography>
                      {pageCount}
                    </Stack>
                  </Stack>
                  <Pagination
                    page={page}
                    onChange={handleChangePage}
                    className="flex justify-center items-center"
                    count={fPageCount(filteredList?.length || 0, perPageCount)}
                  />
                </Stack>
              </Stack>
            </>
          )
        )}
        {(productList?.length === 0 || currentPageData?.length === 0) && !productLoading && (
          <NoData>
            {productList?.length === 0
              ? `Click the "New Product" button to get started.`
              : 'Clear all filters'}
          </NoData>
        )}
      </Stack>
      <Dialog
        open={openDialog}
        handleClose={() => handleClose()}
        handleOpen={() => setOpenDialog(true)}
      >
        <StyledDialogTitle>Remove Product?</StyledDialogTitle>
        <StyledDialogContent>Are you sure you want to remove this product?</StyledDialogContent>
        <StyledDialogActions>
          <Button variant="outlined" onClick={() => handleClose()}>
            No
          </Button>
          <LoadingButton
            loading={crudProductLoading}
            onClick={() => handleClose(activeProduct?.id)}
            variant="contained"
          >
            Yes
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </Container>
  );
}
