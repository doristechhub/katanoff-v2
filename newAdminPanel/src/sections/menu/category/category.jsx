import * as Yup from 'yup';
import { Form, Formik } from 'formik';
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
import { FileDrop } from 'src/components/file-drop';
import {
  initMenuCategory,
  setCategoryList,
  setSelectedMenuCategory,
} from 'src/store/slices/menuSlice';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { validateImageResolution } from 'src/_helpers';
import Grid from '@mui/material/Unstable_Grid2';
import ProgressiveImg from 'src/components/progressive-img';

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
      let updatedCategory = { ...initMenuCategory, ...category };
      // Desktop Banner Image
      const desktopBannerImageUrl = category?.desktopBannerImage;
      if (desktopBannerImageUrl) {
        const url = new URL(desktopBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const desktopBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: desktopBannerImageUrl,
        };
        updatedCategory = {
          ...updatedCategory,
          desktopBannerFile: [],
          desktopBannerPreviewImage: [desktopBannerPreviewImageObj],
          desktopBannerUploadedDeletedImage: [],
        };
      }

      // Mobile Banner Image
      const mobileBannerImageUrl = category?.mobileBannerImage;
      if (mobileBannerImageUrl) {
        const url = new URL(mobileBannerImageUrl);
        const fileExtension = url.pathname.split('.').pop();
        const mobileBannerPreviewImageObj = {
          type: 'old',
          mimeType: `image/${fileExtension}`,
          image: mobileBannerImageUrl,
        };
        updatedCategory = {
          ...updatedCategory,
          mobileBannerFile: [],
          mobileBannerPreviewImage: [mobileBannerPreviewImageObj],
          mobileBannerUploadedDeletedImage: [],
        };
      }
      dispatch(setSelectedMenuCategory(updatedCategory));
      setOpenMenuCategoryDialog(true);
    }
  }, [selectedCategoryId, categoryList, dispatch]);

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
        desktopBannerFile: val?.desktopBannerFile?.[0] || null,
        mobileBannerFile: val?.mobileBannerFile?.[0] || null,
        deletedDesktopBannerImage: val?.desktopBannerUploadedDeletedImage?.[0]?.image || null,
        deletedMobileBannerImage: val?.mobileBannerUploadedDeletedImage?.[0]?.image || null,
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
    [dispatch, loadData, page]
  );

  const closeMenuCategoryPopup = useCallback(
    (resetForm) => {
      setOpenMenuCategoryDialog(false);
      dispatch(setSelectedMenuCategory(initMenuCategory));
      resetForm();
    },
    [dispatch, initMenuCategory]
  );

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
  }, [open, crudMenuLoading, handleEdit, handleDelete, handlePopup]);

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
    [categoryList, dispatch]
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
                      <TableCell>Desktop Banner</TableCell>
                      <TableCell>Mobile Banner</TableCell>
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
                                <TableCell sx={{ minWidth: '150px' }}>
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
                                <TableCell sx={{ minWidth: '150px' }}>
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
        <Formik
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={selectedMenuCategory}
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
            return (
              <Form onSubmit={handleSubmit}>
                <Dialog
                  open={openMenuCategoryDialog}
                  handleOpen={() => setOpenMenuCategoryDialog(true)}
                  handleClose={() => closeMenuCategoryPopup(resetForm)}
                  maxWidth="md"
                  fullWidth
                >
                  <StyledDialogTitle>
                    {selectedMenuCategory?.id ? 'Update' : 'Add New'} Category
                  </StyledDialogTitle>
                  <StyledDialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <TextField
                        name="title"
                        label="Menu Category Title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title || ''}
                        error={!!(touched.title && errors.title)}
                        helperText={touched.title && errors.title ? errors.title : ''}
                        sx={{ minWidth: '300px', width: '100%' }}
                      />
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={6} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Desktop Banner (1920x448)
                          </Typography>
                          <FileDrop
                            mediaLimit={1}
                            formik={formik}
                            productId={selectedCategoryId}
                            fileKey="desktopBannerFile"
                            previewKey="desktopBannerPreviewImage"
                            deleteKey="desktopBannerUploadedDeletedImage"
                            loading={crudMenuLoading}
                          />
                        </Grid>
                        <Grid xs={12} sm={6} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            Mobile Banner (1500x738)
                          </Typography>
                          <FileDrop
                            mediaLimit={1}
                            formik={formik}
                            productId={selectedCategoryId}
                            fileKey="mobileBannerFile"
                            previewKey="mobileBannerPreviewImage"
                            deleteKey="mobileBannerUploadedDeletedImage"
                            loading={crudMenuLoading}
                          />
                        </Grid>
                      </Grid>
                    </Stack>
                  </StyledDialogContent>
                  <StyledDialogActions>
                    <Button
                      variant="outlined"
                      onClick={() => closeMenuCategoryPopup(resetForm)}
                      disabled={crudMenuLoading}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      loading={crudMenuLoading}
                      onClick={handleSubmit}
                    >
                      {selectedMenuCategory?.id ? 'Update' : 'Save'}
                    </LoadingButton>
                  </StyledDialogActions>
                </Dialog>
              </Form>
            );
          }}
        </Formik>
      ) : null}
    </>
  );
};

export default Category;
