import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Stack,
  Table,
  Popover,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  TableContainer,
  Typography,
  Box,
  alpha,
} from '@mui/material';

import {
  createMenuCategory,
  deleteMenuCategory,
  getMenuCategoryList,
  updateMenuCategoriesPosition,
  updateMenuCategory,
} from 'src/actions/menuActions';
import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button, LoadingButton } from 'src/components/button';
import {
  initMenuCategory,
  setCategoryList,
  setSelectedMenuCategory,
} from 'src/store/slices/menuSlice';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// ----------------------------------------------------------------------

const Category = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [openMenuCategoryDialog, setOpenMenuCategoryDialog] = useState(false);

  const { menuLoading, categoryList, crudMenuLoading, selectedMenuCategory } = useSelector(
    ({ menu }) => menu
  );

  const loadData = useCallback(
    (pageNo = page) => {
      dispatch(getMenuCategoryList());
      setPage(pageNo);
    },
    [dispatch, page]
  );

  useEffect(() => {
    loadData();
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudMenuLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCategoryId();
    },
    [crudMenuLoading]
  );

  const handleEdit = useCallback(async () => {
    const category = categoryList?.find((x) => x?.id === selectedCategoryId);
    if (category) {
      dispatch(setSelectedMenuCategory(category));
      setOpenMenuCategoryDialog(true);
    }
  }, [selectedCategoryId, categoryList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteMenuCategory({
        categoryId: selectedCategoryId,
      })
    );
    if (res) {
      const cPage = page !== 0 && filteredItems?.length === 1 ? page - 1 : page;
      loadData(cPage);
      handlePopup();
    }
  }, [selectedCategoryId, page]);

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      let payload = {
        title: val?.title,
      };
      let res;
      let cPage = 0;
      if (val?.id) {
        payload.categoryId = val?.id;
        cPage = page;
        res = await dispatch(updateMenuCategory(payload));
      } else {
        res = await dispatch(createMenuCategory(payload));
      }
      if (res) {
        loadData(cPage);
        setOpenMenuCategoryDialog(false);
        resetForm();
        setOpen(null);
      }
    },
    [loadData, page, categoryList]
  );

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    enableReinitialize: true,
    initialValues: selectedMenuCategory,
    validationSchema,
    onSubmit,
  });

  const closeMenuCategoryPopup = useCallback(() => {
    setOpenMenuCategoryDialog(false);
    dispatch(setSelectedMenuCategory(initMenuCategory));
    resetForm();
  }, [initMenuCategory]);

  const renderPopup = useMemo(() => {
    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit} disabled={crudMenuLoading}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }} disabled={crudMenuLoading}>
          {crudMenuLoading ? (
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
  }, [open, crudMenuLoading]);

  const handleDragEnd = useCallback(
    (event) => {
      const { destination, source } = event;
      if (!destination) return;

      const updatedCategories = [...categoryList];
      const [movedCategory] = updatedCategories.splice(source.index, 1);
      updatedCategories.splice(destination.index, 0, movedCategory);
      dispatch(setCategoryList(updatedCategories));

      // Prepare payload for updating positions
      const updatedPayload = {
        categories: updatedCategories.map((category, index) => ({
          categoryId: category?.id,
          title: category?.title,
          position: index + 1,
        })),
      };

      // Dispatch action to update menu category positions
      dispatch(updateMenuCategoriesPosition(updatedPayload));
    },
    [categoryList]
  );

  return (
    <>
      {menuLoading ? (
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
            justifyContent="end"
          >
            <Button
              color="inherit"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setSelectedCategoryId();
                dispatch(setSelectedMenuCategory(initMenuCategory));
                setOpenMenuCategoryDialog(true);
              }}
            >
              Menu Category
            </Button>
          </Stack>
          <Scrollbar>
            <DragDropContext onDragEnd={handleDragEnd}>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Sr No.</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <Droppable droppableId="droppable-1">
                    {(provider) => (
                      <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                        {categoryList.map((x, i) => (
                          <Draggable
                            key={`menu-category-${i}`}
                            draggableId={`menu-category-${i}`}
                            index={i}
                          >
                            {(provider, snapshot) => (
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': { border: 0 },
                                  position: 'relative',
                                  ...(snapshot.isDragging && {
                                    color: 'primary.main',
                                    fontWeight: 'fontWeightSemiBold',
                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                                    '&:hover': {
                                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                                    },
                                  }),
                                }}
                                {...provider.draggableProps}
                                ref={provider.innerRef}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  {...provider.dragHandleProps}
                                  sx={{ width: '30px' }}
                                >
                                  <Iconify icon="ic:baseline-drag-indicator" />
                                </TableCell>
                                <TableCell sx={{ minWidth: '100px' }}>{i + 1}</TableCell>
                                <TableCell sx={{ width: '100%' }}>{x?.title}</TableCell>
                                <TableCell sx={{ width: '50px' }}>
                                  <Iconify
                                    className={'cursor-pointer'}
                                    onClick={(e) => {
                                      setOpen(e.currentTarget);
                                      setSelectedCategoryId(x?.id);
                                    }}
                                    icon="iconamoon:menu-kebab-vertical-bold"
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provider.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </Table>
              </TableContainer>
            </DragDropContext>
            {!categoryList?.length ? (
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

      {renderPopup}

      {openMenuCategoryDialog ? (
        <Dialog
          open={openMenuCategoryDialog}
          handleOpen={() => setOpenMenuCategoryDialog(true)}
          handleClose={closeMenuCategoryPopup}
        >
          <StyledDialogTitle>
            {selectedMenuCategory?.id ? 'Update' : 'Add New'} Category
          </StyledDialogTitle>
          <StyledDialogContent>
            <TextField
              sx={{
                minWidth: '300px',
                width: '100%',
                mt: '10px',
              }}
              name="title"
              label="Menu Category Title"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title || ''}
              error={!!(touched.title && errors.title)}
              helperText={touched.title && errors.title ? errors.title : ''}
            />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button variant="outlined" onClick={closeMenuCategoryPopup} disabled={crudMenuLoading}>
              Cancel
            </Button>
            <LoadingButton variant="contained" loading={crudMenuLoading} onClick={handleSubmit}>
              {selectedMenuCategory?.id ? 'Update' : 'Save'}
            </LoadingButton>
          </StyledDialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default Category;
