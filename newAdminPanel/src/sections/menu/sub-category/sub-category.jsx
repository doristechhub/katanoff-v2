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
  Typography,
  TextField,
  TableContainer,
  InputAdornment,
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
  updateMenuSubCategoryPosition,
} from 'src/actions/menuSubCategoryActions';
import { initMenuSubCategory, setSelectedMenuSubCategory } from 'src/store/slices/menuSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { getMenuCategoryList } from 'src/actions/menuActions';
import { Button, LoadingButton } from 'src/components/button';
import { FileDrop } from 'src/components/file-drop';
import Grid from '@mui/material/Unstable_Grid2';
import ProgressiveImg from 'src/components/progressive-img';

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
  position: Yup.number()
    .typeError('Position must be a number')
    .min(1, 'Position must be at least 1')
    .required('Position is required'),
});

// ----------------------------------------------------------------------

const SubCategory = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [openMenuSubCategoryDialog, setOpenMenuSubCategoryDialog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const {
    categoryList,
    menuSubCategoryList,
    menuSubCategoryLoading,
    selectedMenuSubCategory,
    crudMenuSubCategoryLoading,
  } = useSelector(({ menu }) => menu);

  // Initialize expandedCategories with all categories set to true
  useEffect(() => {
    const initialExpanded = {};
    categoryList.forEach((category) => {
      initialExpanded[category.id] = true;
    });
    setExpandedCategories(initialExpanded);
  }, [categoryList]);

  // Toggle expand/collapse for a category
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  // Group subcategories by categoryId
  const groupedItems = useMemo(() => {
    const grouped = {};
    menuSubCategoryList
      .filter((item) => item && item.id && item.categoryId) // Filter out invalid items
      .forEach((item) => {
        if (!grouped[item.categoryId]) {
          grouped[item.categoryId] = [];
        }
        grouped[item.categoryId].push(item);
      });
    // Sort each group by position
    Object.keys(grouped).forEach((categoryId) => {
      grouped[categoryId].sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    return grouped;
  }, [menuSubCategoryList]);

  // Filter items based on search and selected category
  const filteredItems = useMemo(() => {
    const searchedKey = searchedValue?.trim()?.toLowerCase();
    let items = menuSubCategoryList.filter(
      (item) =>
        item &&
        item.id &&
        item.categoryId &&
        (item.title?.toLowerCase()?.includes(searchedKey) ||
          item.categoryName?.toLowerCase()?.includes(searchedKey))
    );

    // Apply category filter
    if (selectedCategory !== 'all') {
      const selectedCategoryId = categoryList.find((cat) => cat.title === selectedCategory)?.id;
      items = items.filter((item) => item.categoryId === selectedCategoryId);
    }
    return items;
  }, [menuSubCategoryList, searchedValue, selectedCategory, categoryList]);

  // Group filtered items for display
  const groupedFilteredItems = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.categoryId]) {
        grouped[item.categoryId] = [];
      }
      grouped[item.categoryId].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const loadData = useCallback(() => {
    dispatch(getMenuCategoryList());
    dispatch(getMenuSubCategoryList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calculate default position for new subcategory
  const getDefaultPosition = useCallback(
    (categoryId) => {
      const categorySubCategories = menuSubCategoryList.filter(
        (item) => item && item.categoryId === categoryId
      );
      const maxPosition = categorySubCategories.reduce(
        (max, sub) => Math.max(max, sub.position || 0),
        0
      );
      return maxPosition + 1;
    },
    [menuSubCategoryList]
  );

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        title: val?.title,
        categoryId: val?.categoryId,
        position: parseInt(val?.position, 10),
        desktopBannerFile: val?.desktopBannerFile?.[0] || null,
        mobileBannerFile: val?.mobileBannerFile?.[0] || null,
        deletedDesktopBannerImage: val?.desktopBannerUploadedDeletedImage?.[0]?.image || null,
        deletedMobileBannerImage: val?.mobileBannerUploadedDeletedImage?.[0]?.image || null,
      };
      let res;
      if (val?.id) {
        payload.subCategoryId = val?.id;
        res = await dispatch(updateMenuSubCategory(payload));
      } else {
        res = await dispatch(createMenuSubCategory(payload));
      }
      if (res) {
        dispatch(getMenuSubCategoryList());
        setOpenMenuSubCategoryDialog(false);
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

      // Use source.droppableId to ensure correct categoryId
      const categoryId = source.droppableId;
      const updatedSubCategories = groupedItems[categoryId] || [];
      const [movedSubCategory] = updatedSubCategories.splice(source.index, 1);
      updatedSubCategories.splice(destination.index, 0, movedSubCategory);

      const updatedItems = updatedSubCategories.map((subCategory, index) => ({
        subCategoryId: subCategory?.id,
        position: index + 1,
      }));

      // Dispatch action to update subcategory positions
      try {
        await dispatch(updateMenuSubCategoryPosition(updatedItems));
      } catch (error) {
        console.error('Error updating positions:', error);
      }
    },
    [dispatch, groupedItems]
  );

  const handleMenuCategorySelection = useCallback((item) => {
    const value = item ? item.trim() : '';
    setSelectedCategory(value);
    setSearchedValue(value === 'all' ? '' : value);
  }, []);

  const searchValueHandler = useCallback((event) => {
    const value = event.target.value;
    setSearchedValue(value);
    if (!value) setSelectedCategory('all');
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudMenuSubCategoryLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedSubCategoryId(null);
    },
    [crudMenuSubCategoryLoading]
  );

  const closeMenuSubCategoryPopup = useCallback(
    (resetForm) => {
      setOpenMenuSubCategoryDialog(false);
      dispatch(setSelectedMenuSubCategory({ ...initMenuSubCategory, position: '' }));
      resetForm();
    },
    [dispatch]
  );

  const handleEdit = useCallback(async () => {
    const subCategory = menuSubCategoryList?.find((x) => x?.id === selectedSubCategoryId);
    if (subCategory) {
      let updatedSubCategory = {
        ...initMenuSubCategory,
        ...subCategory,
        position: subCategory.position || getDefaultPosition(subCategory.categoryId),
      };
      // Desktop Banner Image
      const desktopBannerImageUrl = subCategory?.desktopBannerImage;
      if (desktopBannerImageUrl) {
        const url = new URL(desktopBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const desktopBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: desktopBannerImageUrl,
        };
        updatedSubCategory = {
          ...updatedSubCategory,
          desktopBannerFile: [],
          desktopBannerPreviewImage: [desktopBannerPreviewImageObj],
          desktopBannerUploadedDeletedImage: [],
        };
      }

      // Mobile Banner Image
      const mobileBannerImageUrl = subCategory?.mobileBannerImage;
      if (mobileBannerImageUrl) {
        const url = new URL(mobileBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const mobileBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: mobileBannerImageUrl,
        };
        updatedSubCategory = {
          ...updatedSubCategory,
          mobileBannerFile: [],
          mobileBannerPreviewImage: [mobileBannerPreviewImageObj],
          mobileBannerUploadedDeletedImage: [],
        };
      }
      dispatch(setSelectedMenuSubCategory(updatedSubCategory));
      setOpenMenuSubCategoryDialog(true);
    }
  }, [dispatch, selectedSubCategoryId, menuSubCategoryList, getDefaultPosition]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteMenuSubCategory({
        subCategoryId: selectedSubCategoryId,
      })
    );
    if (res) {
      dispatch(getMenuSubCategoryList());
      handlePopup();
    }
  }, [dispatch, selectedSubCategoryId, handlePopup]);

  // Handler to select input value on click
  const handleInputClick = (event) => {
    event.target.select();
  };

  // Handler to disable mouse wheel value change
  const handleWheel = (event) => {
    event.target.blur();
  };

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
  }, [open, crudMenuSubCategoryLoading, handleEdit, handleDelete]);

  // Render category-wise tables
  const renderCategoryTables = useMemo(() => {
    const tables = [];
    Object.keys(groupedFilteredItems).forEach((categoryId) => {
      const category = categoryList.find((cat) => cat.id === categoryId);
      const categoryName = category?.title || 'Unknown Category';
      const items = groupedFilteredItems[categoryId] || [];

      if (items.length === 0) return;

      const isExpanded = expandedCategories[categoryId] ?? true;

      tables.push(
        <Box
          key={`category-${categoryId}`}
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
            onClick={() => toggleCategory(categoryId)}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {categoryName}
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
                      <TableCell sx={{ width: '10%' }}>Position</TableCell>
                      <TableCell sx={{ width: '17.5%', minWidth: '150px' }}>
                        Desktop Banner
                      </TableCell>
                      <TableCell sx={{ width: '17.5%', minWidth: '150px' }}>
                        Mobile Banner
                      </TableCell>
                      <TableCell sx={{ width: '5%' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <Droppable droppableId={categoryId} type={`category-${categoryId}`}>
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
                                <TableCell sx={{ width: '25%' }}>{x?.title}</TableCell>
                                <TableCell sx={{ width: '25%' }}>{x?.categoryName}</TableCell>
                                <TableCell sx={{ width: '10%' }}>{x?.position || '-'}</TableCell>
                                <TableCell sx={{ width: '17.5%', minWidth: '150px' }}>
                                  {x?.desktopBannerImage ? (
                                    <ProgressiveImg
                                      src={x?.desktopBannerImage}
                                      alt="Desktop Banner"
                                      style={{ maxWidth: '100px', height: 'auto' }}
                                    />
                                  ) : (
                                    'No Image'
                                  )}
                                </TableCell>
                                <TableCell sx={{ width: '17.5%', minWidth: '150px' }}>
                                  {x?.mobileBannerImage ? (
                                    <ProgressiveImg
                                      src={x?.mobileBannerImage}
                                      alt="Mobile Banner"
                                      style={{ maxWidth: '100px', height: 'auto' }}
                                    />
                                  ) : (
                                    'No Image'
                                  )}
                                </TableCell>
                                <TableCell sx={{ width: '5%' }}>
                                  <Iconify
                                    className="cursor-pointer"
                                    icon="iconamoon:menu-kebab-vertical-bold"
                                    onClick={(e) => {
                                      setOpen(e.currentTarget);
                                      setSelectedSubCategoryId(x?.id);
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
  }, [groupedFilteredItems, categoryList, expandedCategories, toggleCategory]);

  return (
    <>
      {menuSubCategoryLoading ? (
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
        <DragDropContext onDragEnd={menuSubCategoryLoading ? () => {} : handleDragEnd}>
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
                sx={{ minWidth: '150px' }}
                size="small"
                label="Category Name"
                name="selectedCategory"
                value={selectedCategory || ''}
                onChange={(e) => handleMenuCategorySelection(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {categoryList?.length > 0 ? (
                  categoryList.map((option) => (
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
                dispatch(
                  setSelectedMenuSubCategory({
                    ...initMenuSubCategory,
                    position:
                      selectedCategory !== 'all'
                        ? getDefaultPosition(
                            categoryList.find((cat) => cat.title === selectedCategory)?.id
                          )
                        : '',
                  })
                );
                setSelectedSubCategoryId(null);
                setOpenMenuSubCategoryDialog(true);
              }}
            >
              Menu SubCategory
            </Button>
          </Stack>
          <Box sx={{ px: 2 }}>
            <Scrollbar>
              <Box>
                {renderCategoryTables}
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
          {openMenuSubCategoryDialog && (
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              initialValues={selectedMenuSubCategory}
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
                } = formik;
                return (
                  <Form onSubmit={handleSubmit}>
                    <Dialog
                      open={openMenuSubCategoryDialog}
                      handleClose={() => closeMenuSubCategoryPopup(resetForm)}
                      handleOpen={() => setOpenMenuSubCategoryDialog(true)}
                      maxWidth="md"
                    >
                      <StyledDialogTitle>
                        {selectedMenuSubCategory?.id ? 'Update' : 'Add New'} SubCategory
                      </StyledDialogTitle>
                      <StyledDialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          <TextField
                            select
                            sx={{ mt: '10px', width: '100%' }}
                            name="categoryId"
                            onBlur={handleBlur}
                            label="Category Name"
                            onChange={(e) => {
                              handleChange(e);
                              if (!selectedMenuSubCategory?.id) {
                                formik.setFieldValue(
                                  'position',
                                  getDefaultPosition(e.target.value)
                                );
                              }
                            }}
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
                            sx={{ mt: '10px', width: '100%', minWidth: '300px' }}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.title || ''}
                            label="Menu SubCategory Title"
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
                          <Grid container spacing={3}>
                            <Grid xs={12} sm={6} md={6}>
                              <Typography variant="subtitle2" gutterBottom>
                                Desktop Banner (1920x448)
                              </Typography>
                              <FileDrop
                                mediaLimit={1}
                                formik={formik}
                                productId={selectedMenuSubCategory}
                                fileKey="desktopBannerFile"
                                previewKey="desktopBannerPreviewImage"
                                deleteKey="desktopBannerUploadedDeletedImage"
                                loading={crudMenuSubCategoryLoading}
                                dropzoneProps={{ disabled: crudMenuSubCategoryLoading }}
                              />
                            </Grid>
                            <Grid xs={12} sm={6} md={6}>
                              <Typography variant="subtitle2" gutterBottom>
                                Mobile Banner (1500x738)
                              </Typography>
                              <FileDrop
                                mediaLimit={1}
                                formik={formik}
                                productId={selectedMenuSubCategory}
                                fileKey="mobileBannerFile"
                                previewKey="mobileBannerPreviewImage"
                                deleteKey="mobileBannerUploadedDeletedImage"
                                loading={crudMenuSubCategoryLoading}
                                dropzoneProps={{ disabled: crudMenuSubCategoryLoading }}
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </StyledDialogContent>
                      <StyledDialogActions>
                        <Button
                          variant="outlined"
                          onClick={() => closeMenuSubCategoryPopup(resetForm)}
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

export default SubCategory;
