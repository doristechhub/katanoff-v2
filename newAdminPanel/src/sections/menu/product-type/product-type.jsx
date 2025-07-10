import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { alpha, keyframes } from '@mui/material/styles';

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
  updateMenuProductTypePosition,
} from 'src/actions/productTypeActions';
import { initMenuProductType, setSelectedMenuProductType } from 'src/store/slices/menuSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { getMenuCategoryList } from 'src/actions/menuActions';
import { Button, LoadingButton } from 'src/components/button';
import { getMenuSubCategoryList } from 'src/actions/menuSubCategoryActions';
import { productTypeService } from 'src/_services';

// ----------------------------------------------------------------------

// Bounce animation for arrow
const bounce = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  100% { transform: scale(1) rotate(180deg); }
`;

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  categoryId: Yup.string().required('Category is required'),
  subCategoryId: Yup.string().required('Sub category is required'),
  position: Yup.number()
    .typeError('Position must be a number')
    .min(1, 'Position must be at least 1')
    .required('Position is required'),
});

// ----------------------------------------------------------------------

const ProductType = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [openMenuProductTypeDialog, setOpenMenuProductTypeDialog] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [categoryWiseSubCategoryList, setCategoryWiseSubCategoryList] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const {
    categoryList,
    menuProductTypeList,
    menuSubCategoryList,
    menuProductTypeLoading,
    selectedMenuProductType,
    crudMenuProductTypeLoading,
  } = useSelector(({ menu }) => menu);

  // Initialize expandedGroups with valid category-subcategory combinations
  useEffect(() => {
    const initialExpanded = {};
    menuProductTypeList.forEach((item) => {
      if (item.id && item.categoryId && item.subCategoryId) {
        const groupKey = `${item.categoryId}-${item.subCategoryId}`;
        initialExpanded[groupKey] = true;
      }
    });
    setExpandedGroups(initialExpanded);
  }, [menuProductTypeList]);

  // Toggle expand/collapse for a category-subcategory group
  const toggleGroup = useCallback((groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  // Group product types by categoryId and subCategoryId
  const groupedItems = useMemo(() => {
    const grouped = {};
    menuProductTypeList.forEach((item) => {
      if (item.id && item.categoryId && item.subCategoryId) {
        const groupKey = `${item.categoryId}-${item.subCategoryId}`;
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(item);
      } else {
        console.warn('Skipping invalid product type in groupedItems', { item });
      }
    });
    // Sort each group by position, treating undefined/null as Infinity
    Object.keys(grouped).forEach((groupKey) => {
      grouped[groupKey].sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity));
    });
    return grouped;
  }, [menuProductTypeList]);

  // Filter items based on search and selected category/subcategory
  const searchedKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = menuProductTypeList.filter(
    (item) =>
      item?.title?.toLowerCase()?.includes(searchedKey) ||
      item?.categoryName?.toLowerCase()?.includes(searchedKey) ||
      item?.subCategoryName?.toLowerCase()?.includes(searchedKey)
  );

  // Apply category and subcategory filters
  if (selectedCategory !== 'all') {
    const selectedCategoryId = categoryList.find((cat) => cat.title === selectedCategory)?.id;
    filteredItems = filteredItems.filter((item) => item.categoryId === selectedCategoryId);
  }
  if (selectedSubCategory !== 'all') {
    const selectedSubCategoryId = menuSubCategoryList.find(
      (subCat) => subCat.title === selectedSubCategory
    )?.id;
    filteredItems = filteredItems.filter((item) => item.subCategoryId === selectedSubCategoryId);
  }

  // Group filtered items for display
  const groupedFilteredItems = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (item.id && item.categoryId && item.subCategoryId) {
        const groupKey = `${item.categoryId}-${item.subCategoryId}`;
        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
        }
        grouped[groupKey].push(item);
      } else {
        console.warn('Skipping invalid product type in groupedFilteredItems', { item });
      }
    });
    return grouped;
  }, [filteredItems]);

  const loadData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      await Promise.all([
        dispatch(getMenuCategoryList()),
        dispatch(getMenuSubCategoryList()),
        dispatch(getMenuProductTypeList()),
      ]);
    } catch (error) {
      console.error('Error loading data:', error.message);
    } finally {
      setIsDataLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Category change handler
  const categoryChangeHandler = useCallback(
    (value, setFieldValue) => {
      setFieldValue('categoryId', value);
      setFieldValue('subCategoryId', '');
      const filteredData = menuSubCategoryList.filter((item) => item.categoryId === value);
      setCategoryWiseSubCategoryList(filteredData);
    },
    [menuSubCategoryList]
  );

  const handleEdit = useCallback(async () => {
    const productType = menuProductTypeList?.find((x) => x?.id === selectedProductTypeId);
    if (productType) {
      const updatedProductType = {
        ...productType,
        position:
          productType.position ||
          (await productTypeService.getDefaultPosition(
            productType.categoryId,
            productType.subCategoryId
          )),
      };

      // Dispatch the updated product type to Redux
      dispatch(setSelectedMenuProductType(updatedProductType));

      // Open the dialog
      setOpenMenuProductTypeDialog(true);
    }
  }, [dispatch, selectedProductTypeId, menuProductTypeList]);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        title: val?.title,
        categoryId: val?.categoryId,
        subCategoryId: val?.subCategoryId,
        position: parseInt(val?.position, 10),
      };
      let res;
      if (val?.id) {
        payload.productTypeId = val?.id;
        res = await dispatch(updateMenuProductType(payload));
      } else {
        res = await dispatch(createMenuProductType(payload));
      }
      if (res) {
        dispatch(getMenuProductTypeList());
        setOpenMenuProductTypeDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [dispatch]
  );

  const handleDragEnd = useCallback(
    async (result) => {
      const { source, destination } = result;

      // Exit if no destination, same position, or different droppable
      if (
        !destination ||
        source.index === destination.index ||
        source.droppableId !== destination.droppableId
      ) {
        return;
      }

      // Parse droppableId to extract categoryId and subCategoryId
      const idParts = source?.droppableId?.split('-');
      if (idParts.length !== 3 || idParts[0] !== 'group') {
        console.warn('Invalid droppableId format', { droppableId, idParts });
        return;
      }

      const [_, categoryId, subCategoryId] = idParts;
      if (!categoryId || !subCategoryId) {
        console.warn('Invalid categoryId or subCategoryId', { categoryId, subCategoryId });
        return;
      }

      // Get the items for the specific category-subcategory group
      const groupKey = `${categoryId}-${subCategoryId}`;

      const groupItems = groupedItems[groupKey] || [];
      if (!groupItems.length) {
        console.warn('No items found for group', { groupKey, categoryId, subCategoryId });
        return;
      }

      const [movedProductType] = groupItems.splice(source.index, 1);
      groupItems.splice(destination.index, 0, movedProductType);

      const updatedItems = groupItems.map((item, index) => ({
        productTypeId: item.id,
        position: index + 1,
      }));

      try {
        await dispatch(
          updateMenuProductTypePosition({
            productTypes: updatedItems,
            categoryId,
            subCategoryId,
          })
        );
      } catch (error) {
        console.error('Error updating product type positions:', error.message);
      }
    },
    [dispatch, groupedItems]
  );

  const handleMenuCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedCategory(value);
    setSelectedSubCategory('all');
    setSearchedValue(value === 'all' ? '' : value);
  }, []);

  const handleMenuSubCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedSubCategory(value);
    setSelectedCategory('all');
    setSearchedValue(value === 'all' ? '' : value);
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    if (!value) {
      setSelectedCategory('all');
      setSelectedSubCategory('all');
    }
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudMenuProductTypeLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedProductTypeId(null);
    },
    [crudMenuProductTypeLoading]
  );

  // Handler to select input value on click
  const handleInputClick = (event) => {
    event.target.select();
  };

  // Handler to disable mouse wheel value change
  const handleWheel = (event) => {
    event.target.blur();
  };

  const closeMenuProductTypePopup = useCallback(
    (resetForm) => {
      setOpenMenuProductTypeDialog(false);
      dispatch(setSelectedMenuProductType(initMenuProductType));
      resetForm();
    },
    [dispatch]
  );

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteMenuProductType({
        productTypeId: selectedProductTypeId,
      })
    );
    if (res) {
      dispatch(getMenuProductTypeList());
      handlePopup();
    }
  }, [dispatch, selectedProductTypeId, handlePopup]);

  const renderPopup = useMemo(() => {
    return open ? (
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
  }, [open, crudMenuProductTypeLoading, handleEdit, handleDelete]);

  // Render category-subcategory-wise tables, sorted by category and subcategory position
  const renderGroupTables = useMemo(() => {
    if (isDataLoading || !categoryList.length || !menuSubCategoryList.length) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 4,
          }}
        >
          <Spinner />
        </Box>
      );
    }

    const tables = [];
    // Sort group keys by category position, then subcategory position
    const sortedGroupKeys = Object.keys(groupedFilteredItems).sort((a, b) => {
      const [catIdA, subCatIdA] = a.split('-');
      const [catIdB, subCatIdB] = b.split('-');
      const catA = categoryList.find((cat) => cat.id === catIdA);
      const catB = categoryList.find((cat) => cat.id === catIdB);
      const subCatA = menuSubCategoryList.find((subCat) => subCat.id === subCatIdA);
      const subCatB = menuSubCategoryList.find((subCat) => subCat.id === subCatIdB);
      const catPosA = catA?.position ?? Infinity;
      const catPosB = catB?.position ?? Infinity;
      const subCatPosA = subCatA?.position ?? Infinity;
      const subCatPosB = subCatB?.position ?? Infinity;
      return catPosA !== catPosB ? catPosA - catPosB : subCatPosA - subCatPosB;
    });

    sortedGroupKeys.forEach((groupKey) => {
      const [categoryId, subCategoryId] = groupKey.split('-');
      const category = categoryList.find((cat) => cat.id === categoryId);
      const subCategory = menuSubCategoryList.find((subCat) => subCat.id === subCategoryId);
      if (!categoryId || !subCategoryId || !category || !subCategory) {
        console.warn('Skipping invalid group in renderGroupTables', {
          groupKey,
          categoryId,
          subCategoryId,
          hasCategory: !!category,
          hasSubCategory: !!subCategory,
        });
        return;
      }
      const groupName = `Category: ${category?.title || 'Unknown Category'} | Subcategory: ${subCategory?.title || 'Unknown Subcategory'}`;
      const items = groupedFilteredItems[groupKey];

      if (!items?.length) return;

      const isExpanded = expandedGroups[groupKey] ?? true;

      tables.push(
        <Box
          key={`group-${groupKey}`}
          sx={{ mb: 3, borderRadius: 1, overflow: 'hidden', boxShadow: 2 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
              transition: 'background-color 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => toggleGroup(groupKey)}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {groupName}
            </Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon="material-icons:expand_circle_down"
                sx={{
                  width: 40,
                  height: 40,
                  color: 'primary.main',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  animation: isExpanded
                    ? `${bounce} 0.4s ease-in-out`
                    : `${bounce} 0.4s ease-in-out`,
                  '&:hover': {
                    transform: isExpanded ? 'rotate(0deg) scale(1.2)' : 'rotate(180deg) scale(1.2)',
                    color: 'primary.dark',
                  },
                }}
              />
            </Box>
          </Box>
          {isExpanded && (
            <TableContainer sx={{ overflow: 'unset', mt: 1 }}>
              <Scrollbar>
                <Table sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '5%' }}></TableCell>
                      <TableCell sx={{ width: '25%' }}>Title</TableCell>
                      <TableCell sx={{ width: '25%' }}>Category Name</TableCell>
                      <TableCell sx={{ width: '25%' }}>SubCategory Name</TableCell>
                      <TableCell sx={{ width: '10%' }}>Position</TableCell>
                      <TableCell sx={{ width: '10%' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <Droppable
                    droppableId={`group-${categoryId}-${subCategoryId}`}
                    type={`group-${categoryId}-${subCategoryId}`}
                  >
                    {(provided) => (
                      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((x, index) => (
                          <Draggable key={x.id} draggableId={x.id} index={index}>
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  ...(snapshot.isDragging && {
                                    backgroundColor: 'action.hover',
                                  }),
                                }}
                              >
                                <TableCell sx={{ width: '5%' }}>
                                  <Iconify icon="mdi:drag" sx={{ cursor: 'move' }} />
                                </TableCell>
                                <TableCell sx={{ width: '25%' }}>{x?.title || '-'}</TableCell>
                                <TableCell sx={{ width: '25%' }}>
                                  {x?.categoryName || '-'}
                                </TableCell>
                                <TableCell sx={{ width: '25%' }}>
                                  {x?.subCategoryName || '-'}
                                </TableCell>
                                <TableCell sx={{ width: '10%' }}>{x?.position || '-'}</TableCell>
                                <TableCell sx={{ width: '10%' }}>
                                  <Iconify
                                    className="cursor-pointer"
                                    icon="iconamoon:menu-kebab-vertical-bold"
                                    onClick={(e) => {
                                      setOpen(e.currentTarget);
                                      setSelectedProductTypeId(x?.id);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}
        </Box>
      );
    });
    return tables;
  }, [
    groupedFilteredItems,
    categoryList,
    menuSubCategoryList,
    expandedGroups,
    toggleGroup,
    isDataLoading,
  ]);

  return (
    <>
      {menuProductTypeLoading || isDataLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 4,
          }}
        >
          <Spinner />
        </Box>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Stack
            my={2}
            mx={2}
            gap={2}
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
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
                label="Category Name"
                name="selectedCategory"
                value={selectedCategory || ''}
                onChange={(e) => handleMenuCategorySelection(e.target.value)}
                sx={{ minWidth: '150px' }}
              >
                <MenuItem value="all">All</MenuItem>
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
                label="SubCategory Name"
                name="selectedSubCategory"
                value={selectedSubCategory || ''}
                onChange={(e) => handleMenuSubCategorySelection(e.target.value)}
                sx={{ minWidth: '150px' }}
              >
                <MenuItem value="all">All</MenuItem>
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
              onClick={async () => {
                const categoryId = categoryList[0]?.id || '';
                const subCategoryId =
                  menuSubCategoryList.filter((item) => item.categoryId === categoryId)[0]?.id || '';
                const defaultPosition =
                  categoryId && subCategoryId
                    ? await productTypeService.getDefaultPosition(categoryId, subCategoryId)
                    : '';
                dispatch(
                  setSelectedMenuProductType({
                    ...initMenuProductType,
                    categoryId,
                    subCategoryId,
                    position: defaultPosition,
                  })
                );
                setOpenMenuProductTypeDialog(true);
                categoryChangeHandler(categoryId, (key, value) =>
                  dispatch(
                    setSelectedMenuProductType({
                      ...initMenuProductType,
                      [key]: value,
                      position: defaultPosition,
                    })
                  )
                );
              }}
            >
              Menu ProductType
            </Button>
          </Stack>
          <Box sx={{ px: 2 }}>
            <Scrollbar>
              <Box>
                {renderGroupTables}
                {!filteredItems?.length && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                  >
                    No Data
                  </Typography>
                )}
              </Box>
            </Scrollbar>
          </Box>
          {renderPopup}
          {openMenuProductTypeDialog && (
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              initialValues={selectedMenuProductType}
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

                // Call categoryChangeHandler when dialog opens with a product type
                useEffect(() => {
                  if (openMenuProductTypeDialog && selectedMenuProductType?.id) {
                    categoryChangeHandler(selectedMenuProductType.categoryId, setFieldValue);
                    setFieldValue('subCategoryId', selectedMenuProductType.subCategoryId);
                  }
                }, [openMenuProductTypeDialog, selectedMenuProductType]);

                return (
                  <Form onSubmit={handleSubmit}>
                    <Dialog
                      open={openMenuProductTypeDialog}
                      handleClose={() => closeMenuProductTypePopup(resetForm)}
                      handleOpen={() => setOpenMenuProductTypeDialog(true)}
                      maxWidth="md"
                    >
                      <StyledDialogTitle>
                        {selectedMenuProductType?.id ? 'Update' : 'Add New'} ProductType
                      </StyledDialogTitle>
                      <StyledDialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <TextField
                            select
                            sx={{ mt: '10px', width: '100%' }}
                            name="categoryId"
                            onBlur={handleBlur}
                            label="Category Name"
                            onChange={(event) =>
                              categoryChangeHandler(event.target.value, setFieldValue)
                            }
                            value={values?.categoryId || ''}
                            error={!!(touched.categoryId && errors.categoryId)}
                            helperText={
                              touched.categoryId && errors.categoryId ? errors.categoryId : ''
                            }
                          >
                            {categoryList?.length > 0 ? (
                              categoryList.map((option) => (
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
                            sx={{ mt: '10px', width: '100%' }}
                            name="subCategoryId"
                            onBlur={handleBlur}
                            onChange={async (event) => {
                              handleChange(event);
                              if (!selectedMenuProductType?.id) {
                                const position = await productTypeService.getDefaultPosition(
                                  values.categoryId,
                                  event.target.value
                                );
                                setFieldValue('position', position);
                              }
                            }}
                            label="SubCategory Name"
                            value={values?.subCategoryId || ''}
                            error={!!(touched.subCategoryId && errors.subCategoryId)}
                            helperText={
                              touched.subCategoryId && errors.subCategoryId
                                ? errors.subCategoryId
                                : ''
                            }
                          >
                            {categoryWiseSubCategoryList?.length ? (
                              categoryWiseSubCategoryList.map((option) => (
                                <MenuItem key={option?.id} value={option?.id}>
                                  {option?.title}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>No Item</MenuItem>
                            )}
                          </TextField>
                          <TextField
                            sx={{ mt: '10px', width: '100%', minWidth: '300px' }}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.title || ''}
                            label="ProductType Title"
                            error={!!(touched.title && errors.title)}
                            helperText={touched.title && errors.title ? errors.title : ''}
                          />
                          <TextField
                            sx={{ mt: '10px', width: '100%', minWidth: '300px' }}
                            name="position"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onClick={handleInputClick}
                            onWheel={handleWheel}
                            value={values.position || ''}
                            label="Position"
                            error={!!(touched.position && errors.position)}
                            helperText={touched.position && errors.position ? errors.position : ''}
                          />
                        </Stack>
                      </StyledDialogContent>
                      <StyledDialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => closeMenuProductTypePopup(resetForm)}
                          disabled={crudMenuProductTypeLoading}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant="contained"
                          loading={crudMenuProductTypeLoading}
                          onClick={handleSubmit}
                        >
                          {selectedMenuProductType?.id ? 'Update' : 'Save'}
                        </LoadingButton>
                      </StyledDialogActions>
                    </Dialog>
                  </Form>
                );
              }}
            </Formik>
          )}
        </DragDropContext>
      )}
    </>
  );
};

export default ProductType;
