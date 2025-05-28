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
  processBulkProductsWithApi,
} from 'src/actions';
import { Button, LoadingButton } from 'src/components/button';
import {
  GOLD_COLOR,
  GOLD_COLOR_SUB_TYPES_LIST,
  GOLD_TYPE,
  INIT_GOLD_TYPE_SUB_TYPES_LIST,
  perPageCountOptions,
  productStatusOptions,
} from 'src/_helpers/constants';
import { getCollectionList } from 'src/actions/collectionActions';
import {
  setCrudProductLoading,
  setExportExcelLoading,
  setIsDuplicateProduct,
  setPerPageCount,
  setSelectedProduct,
} from 'src/store/slices/productSlice';

import ProductCard from '../product-card';
import { generateExcel } from 'src/_helpers/generateExcel';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchedValue, setSearchedValue] = useState('');
  const [activeProduct, setActiveProduct] = useState(null);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [selectedProductStatus, setSelectedProductStatus] = useState('all');

  const [filterByCategory, setFilterByCategory] = useState('all');
  const [filterBySubCategory, setFilterBySubCategory] = useState('all');
  const [filterByCollection, setFilterByCollection] = useState('all');
  const [filterBySettingStyle, setFilterBySettingStyle] = useState('all');
  const [filterByProductType, setFilterByProductType] = useState('all');

  useEffect(() => {
    dispatch(getAllMenuCategoryList());
    dispatch(getCollectionList());
    dispatch(getSettingStyleList());
    dispatch(getCustomizationTypeList());
    dispatch(getCustomizationSubTypeList());
  }, []);
  const { collectionList } = useSelector(({ collection }) => collection);
  const { settingStyleList } = useSelector(({ settingStyle }) => settingStyle);

  const {
    productList = [],
    menuList,
    productLoading,
    crudProductLoading,
    perPageCount,
    exportExcelLoading,
    categoriesList,
    selectedProduct,
  } = useSelector(({ product }) => product);

  const { customizationTypeList, customizationSubTypeList } = useSelector(
    ({ customization }) => customization
  );

  const loadData = useCallback(
    (pageNo = page) => {
      dispatch(getProducts());
      setPage(pageNo);
    },
    [dispatch, page]
  );

  const bulkNewProduct = useCallback(() => {
    dispatch(processBulkProductsWithApi());
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filteredList = productList?.filter((item) => {
      const searchValue = typeof searchQuery !== 'boolean' && searchQuery?.toLowerCase()?.trim();
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
        filterBySubCategory === 'all' || String(item.subCategoryId) === String(filterBySubCategory);

      const matchesCollection =
        filterByCollection === 'all' ||
        item.collectionIds.some((id) => String(id) === String(filterByCollection));
      const matchesSettingStyle =
        filterBySettingStyle === 'all' ||
        item?.settingStyleIds?.some((id) => String(id) === String(filterBySettingStyle));
      const matchesProductType =
        filterByProductType === 'all' ||
        item.productTypeIds.some((id) => String(id) === String(filterByProductType));

      const matchesStatus =
        selectedProductStatus === 'all' || String(item.active) === String(selectedProductStatus);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubCategory &&
        matchesCollection &&
        matchesSettingStyle &&
        matchesProductType &&
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
    filterByProductType,
    selectedProductStatus,
    filterByCollection,
    filterBySettingStyle,
  ]);

  const onChangeProductStatus = (item) => {
    const value = item !== 'all' ? item : '';
    setSelectedProductStatus(item);
    setSearchQuery(value);
    setSearchedValue('');
    setPage(1);
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
        setPage(1);
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
    setPage(newPage);
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
    setSearchedValue(value);
    setSearchQuery(value);
    setSelectedProductStatus('all');
    setPage(1);
  };

  const clearFilter = useCallback(() => {
    setFilterByCategory('all');
    setFilterByCollection('all');
    setFilterByProductType('all');
    setFilterBySubCategory('all');
    onChangeProductStatus('all');
  }, []);

  const onExport = useCallback(async () => {
    dispatch(setExportExcelLoading(true));
    const tempArry = productList?.map((pItem) => {
      return {
        productName: pItem.productName,
        sku: pItem.sku,
      };
    });
    await generateExcel(tempArry, 'Product List');
    dispatch(setExportExcelLoading(false));
  }, [productList]);

  const newProduct = useCallback(() => {
    dispatch(setIsDuplicateProduct(false));
    navigate('/product/add');
  }, []);

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
        <Typography variant="h4">Products ({productList?.length})</Typography>
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

          <LoadingButton
            variant="contained"
            color="success"
            onClick={onExport}
            loading={exportExcelLoading}
            startIcon={<Iconify icon={'file-icons:microsoft-excel'} width={25} />}
          >
            Export
          </LoadingButton>
          {/* <LoadingButton
            variant="contained"
            color="success"
            onClick={bulkNewProduct}
            loading={crudProductLoading}
            startIcon={<AddIcon />}
          >
            Bulk New Product With API
          </LoadingButton> */}

          <Button variant="contained" startIcon={<AddIcon />} onClick={newProduct}>
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
            setFilterByCategory(e.target.value);
            setFilterBySubCategory('all');
            setFilterByProductType('all');
            setPage(1);
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
            setFilterBySubCategory(e.target.value);
            setFilterByProductType('all');
            setPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {filterByCategory !== 'all' && menuList.subCategories.length > 0 ? (
            menuList.subCategories
              .filter((subCat) => subCat.categoryId === filterByCategory) // Filter subcategories based on selected category
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
            setFilterByProductType(e.target.value);
            setPage(1);
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {filterBySubCategory !== 'all' && menuList.productType.length > 0 ? (
            menuList.productType
              .filter((subCat) => subCat.subCategoryId === filterBySubCategory)
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
            setFilterByCollection(e.target.value);
            setPage(1);
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
            setFilterBySettingStyle(e.target.value);
            setPage(1);
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
                      imagePath={product?.thumbnailImage}
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
                      <Typography variant="subtitle2">Products: {filteredList?.length}</Typography>
                      {pageCount}
                    </Stack>
                  </Stack>
                  <Pagination
                    page={page}
                    onChange={handleChangePage}
                    className="flex justify-center items-center"
                    count={fPageCount(filteredList?.length, perPageCount)}
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
