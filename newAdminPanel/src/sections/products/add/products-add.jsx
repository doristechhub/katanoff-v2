import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import DuplicateProductDialog from './duplicate-product-dialog';
import {
  Card,
  FormControlLabel,
  FormGroup,
  Box,
  FormHelperText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListItemText,
} from '@mui/material';

import {
  getSingleProduct,
  getAllMenuCategoryList,
  getAllCustomizationTypeList,
  getAllCustomizationSubTypeList,
  updateStatusProduct,
  updateProductPhotosAction,
  updateProductVideoAction,
  getSettingStyleList,
  getDiamondShapeList,
  updateProductThumbnailPhotoAction,
} from 'src/actions';
import {
  productInitDetails,
  setSelectedProduct,
  setProductTypesList,
  setSubCategoriesList,
  initDiamondFilters,
} from 'src/store/slices/productSlice';
import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Variations from './Variations';
import Dialog from 'src/components/dialog';
import Switch from 'src/components/switch';
import Spinner from 'src/components/spinner';
import Iconify from 'src/components/iconify';
import Specifications from './specifications';
import { Editor } from 'src/components/editor';
import { helperFunctions } from 'src/_helpers';
import { FileDrop } from 'src/components/file-drop';
import { Button, LoadingButton } from 'src/components/button';
import { getCollectionList } from 'src/actions/collectionActions';
import CombinationDialog, { generateCombinations } from './combination-dialog';
import DiamondFilters from './diamond-filters';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  GOLD_COLOR,
  GOLD_COLOR_SUB_TYPES_LIST,
  GOLD_TYPE,
  INIT_GOLD_TYPE_SUB_TYPES_LIST,
} from 'src/_helpers/constants';

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  previewImages: Yup.array().min(1, 'At least one image is required'),
  previewThumbnailImage: Yup.array().min(1, 'ThumbnailImage is required'),
  productName: Yup.string()
    .required('Product name is required')
    .max(60, 'Product name should not exceed 60 characters.')
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      'Product name can only contain letters (a-z, A-Z), numbers (0-9), and spaces.'
    ),
  sku: Yup.string().required('Sku is required'),
  discount: Yup.number().min(0, 'Discount must be positive').max(100, 'Maximum discount is 100'),
  categoryId: Yup.string().required('Category is required'),
  // subCategoryId: Yup.string().required('SubCategory is required'),
  description: Yup.string().required('Description is required'),
  // productTypeIds: Yup.array().min(1, 'ProductType is required'),
  variations: Yup.array()
    .min(1, 'Variation is required')
    .of(
      Yup.object().shape({
        variationId: Yup.string().required('Variation is required'),
        variationTypes: Yup.array().of(
          Yup.object().shape({
            variationTypeId: Yup.string().required('VariationType is required'),
          })
        ),
      })
    ),
  specifications: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
    })
  ),
  isDiamondFilter: Yup.boolean(),
  diamondFilters: Yup.lazy((value, { parent }) => {
    if (parent.isDiamondFilter) {
      return Yup.object().shape({
        diamondShapeIds: Yup.array().min(1, 'At least one diamond shape is required'),
        caratWeightRange: Yup.object().shape({
          min: Yup.number().min(ALLOW_MIN_CARAT_WEIGHT, 'Minimum carat weight must be positive'),
          max: Yup.number()
            .min(Yup.ref('min'), 'Maximum carat weight must be greater than or equal to minimum')
            .max(ALLOW_MAX_CARAT_WEIGHT, 'Maximum carat weight must be less than or equal to 10'),
        }),
      });
    }
    // If isDiamondFilter is false, diamondFilters is not required.
    return Yup.mixed().notRequired();
  }),
  netWeight: Yup.lazy((value, { parent }) => {
    if (parent.isDiamondFilter) {
      return Yup.number()
        .required('Net weight is required')
        .positive('Net weight must be positive');
    }
    return Yup.mixed().notRequired();
  }),
});

// ----------------------------------------------------------------------

export default function AddProductPage() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const [openCombinationDialog, setCombinantionDialog] = useState(false);
  const [statusConfirmationDialog, setStatusConfirmationDialog] = useState(false);

  const {
    menuList,
    categoriesList,
    productLoading,
    selectedProduct,
    productTypesList,
    subCategoriesList,
    crudProductLoading,
    duplicateProductLoading,
    customizationTypesList,
    customizationSubTypesList,
  } = useSelector(({ product }) => product);
  const { collectionList } = useSelector(({ collection }) => collection);
  const { settingStyleList } = useSelector(({ settingStyle }) => settingStyle);

  useEffect(() => {
    dispatch(getCollectionList());
    dispatch(getSettingStyleList());
    dispatch(getDiamondShapeList());
    dispatch(getAllMenuCategoryList());
    dispatch(getAllCustomizationTypeList());
    dispatch(getAllCustomizationSubTypeList());
    return () => dispatch(setSelectedProduct(productInitDetails));
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const onSubmit = useCallback((fields, { setStatus, setSubmitting, values, errors }) => {
    setStatus();
    setSubmitting(false);
    setCombinantionDialog(true);
  }, []);

  const randomNumber = useMemo(() => helperFunctions.getRandomNumberLimitedDigits(), []);

  const skuChangeHandler = useCallback(
    (val, formik) => {
      const lastDigits = productId ? selectedProduct?.saltSKU?.split('-')?.pop() : randomNumber;
      formik.setFieldValue('sku', val);
      const saltSKU = val ? `UJ-${val}-${lastDigits}` : '';
      formik.setFieldValue('saltSKU', saltSKU);
    },
    [randomNumber, productId, selectedProduct?.saltSKU]
  );

  const categoryChangeHandler = useCallback(
    (val, formik) => {
      formik.setFieldValue('categoryId', val);
      formik.setFieldValue('subCategoryId', '');
      formik.setFieldValue('productTypeIds', []);

      let list = menuList.subCategories?.filter((c) => c.categoryId === val);
      dispatch(setSubCategoriesList(list));
    },
    [menuList]
  );

  const subCategoryChangeHandler = useCallback(
    (val, formik) => {
      formik.setFieldValue('subCategoryId', val);
      formik.setFieldValue('productTypeIds', []);
      let list = menuList.productType?.filter((c) => c.subCategoryId === val);
      dispatch(setProductTypesList(list));
    },
    [menuList]
  );

  const getCombinationDetail = useCallback(
    (values) => {
      const customizations = {
        customizationType: customizationTypesList,
        customizationSubType: customizationSubTypesList,
      };
      const newVariation = helperFunctions.getVariationsArray(values.variations, customizations);
      return generateCombinations(newVariation);
    },
    [customizationTypesList, customizationSubTypesList]
  );

  const changeProductStatus = useCallback(async (values, setFieldValue) => {
    const payload = {
      productId,
      active: !values.active,
    };

    const res = await dispatch(updateStatusProduct(payload));
    if (res) {
      setFieldValue('active', !values.active);
      setStatusConfirmationDialog(false);
    }
  }, []);

  const updateProductPhotos = async (formik) => {
    if (!formik.values.previewImages.length) {
      toast.error('At least one image is required');
      return;
    }
    const payload = {
      productId,
      imageFiles: formik.values.imageFiles,
      deletedImages: formik.values.uploadedDeletedImages.map((item) => item.image),
    };

    const res = await dispatch(updateProductPhotosAction(payload));
    if (res) dispatch(getSingleProduct(productId));
  };

  const updateProductThumbnailImage = async (formik) => {
    const payload = {
      productId,
      thumbnailImageFile: formik.values.thumbnailImageFile?.[0],
      deletedThumbnailImage: formik.values.uploadedDeletedThumbnailImage?.[0]?.image,
    };
    const res = await dispatch(updateProductThumbnailPhotoAction(payload));
    if (res) {
      dispatch(getSingleProduct(productId));
    }
  };

  const updateProductVideo = async (formik) => {
    const payload = {
      productId,
      videoFile: formik.values.videoFile?.[0],
      deletedVideo: formik.values.deleteUploadedVideo?.[0]?.video,
    };

    const res = await dispatch(updateProductVideoAction(payload));

    if (res) {
      dispatch(getSingleProduct(productId));
    }
  };

  // set  default variations selected
  const setInitVariation = ({ customizationTypesList, customizationSubTypesList }) => {
    const findCustomizationByName = (list, name) =>
      list.find(
        (customization) =>
          customization.title === name || customization.customizationTypeName === name
      );
    const foundedGoldType = findCustomizationByName(customizationTypesList, GOLD_TYPE.title);
    const foundedGoldColor = findCustomizationByName(customizationTypesList, GOLD_COLOR.title);
    if (foundedGoldType && foundedGoldColor) {
      const foundedGoldTypeWiseSubTypes = customizationSubTypesList.filter(
        (subType) => subType.customizationTypeName === GOLD_TYPE.title
      );

      const foundedGoldColorWiseSubTypes = customizationSubTypesList.filter(
        (subType) => subType.customizationTypeName === foundedGoldColor.title
      );

      const matchedGoldTypeSubTypes = INIT_GOLD_TYPE_SUB_TYPES_LIST.map(
        (goldType) =>
          customizationSubTypesList.find((subType) => subType.title === goldType.title) || null
      );

      const matchedGoldColorSubTypes = GOLD_COLOR_SUB_TYPES_LIST.map(
        (goldType) =>
          customizationSubTypesList.find((subType) => subType.title === goldType.title) || null
      );

      const createVariation = (variationId, foundedSubTypes, matchedSubTypes) => ({
        variationId,
        subTypes: foundedSubTypes,
        variationTypes: matchedSubTypes.map((subType) => ({
          variationTypeId: subType.id,
        })),
      });

      const newVariations = [
        createVariation(foundedGoldType.id, foundedGoldTypeWiseSubTypes, matchedGoldTypeSubTypes),
        createVariation(
          foundedGoldColor.id,
          foundedGoldColorWiseSubTypes,
          matchedGoldColorSubTypes
        ),
      ];
      const newPayload = {
        ...selectedProduct,
        variations: newVariations,
      };
      if (JSON.stringify(newPayload) !== JSON.stringify(selectedProduct)) {
        dispatch(setSelectedProduct(newPayload));
      }
    }
  };

  return (
    <>
      <Container sx={{ height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Product</Typography>
          {productId && (
            <Button
              variant="filled"
              onClick={() => setDuplicateDialog(true)}
              startIcon={<Iconify icon="ion:duplicate" />}
            >
              Duplicate
            </Button>
          )}
        </Box>

        <Stack
          sx={{
            height: '99%',
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
            overflow: 'initial',
          }}
        >
          {productLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              validateOnChange={false}
              initialValues={selectedProduct}
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
                  setFieldValue,
                } = formik;
                // const [productDetail, setProductDetail] = useState({});
                const { selectedProduct, isDuplicateProduct } = useSelector(
                  ({ product }) => product
                );

                const loadData = useCallback(async () => {
                  const product = await dispatch(getSingleProduct(productId));
                  if (product) {
                    formik.setFieldValue('productName', product?.productName);
                    formik.setFieldValue('sku', product?.sku);
                    formik.setFieldValue('saltSKU', product?.saltSKU);
                    formik.setFieldValue('discount', product?.discount);
                    formik.setFieldValue('shortDescription', product?.shortDescription);
                    formik.setFieldValue('description', product?.description);
                    formik.setFieldValue('specifications', product?.specifications || []);
                    formik.setFieldValue('active', product?.active);
                    const imagesArray = product?.images?.map((image) => {
                      return {
                        type: 'old',
                        image: image.image,
                      };
                    });
                    formik.setFieldValue('imageFiles', []);
                    formik.setFieldValue('previewImages', imagesArray);
                    formik.setFieldValue('uploadedDeletedImages', []);

                    const thumbnailImageUrl = product?.thumbnailImage;
                    if (thumbnailImageUrl) {
                      const url = new URL(thumbnailImageUrl);
                      const fileExtension = url.pathname.split('.').pop();

                      const previewImageObj = {
                        type: 'old',
                        mimeType: `image/${fileExtension}`,
                        image: thumbnailImageUrl,
                      };
                      formik.setFieldValue('previewThumbnailImage', [previewImageObj]);
                    }
                    formik.setFieldValue('thumbnailImageFile', []);
                    formik.setFieldValue('uploadedDeletedThumbnailImage', []);

                    const videoUrl = product?.video;
                    if (videoUrl) {
                      const url = new URL(videoUrl);
                      const fileExtension = url.pathname.split('.').pop();

                      const previewVideoObj = {
                        type: 'old',
                        mimeType: `video/${fileExtension}`,
                        video: videoUrl,
                      };
                      formik.setFieldValue('previewVideo', [previewVideoObj]);
                    }
                    formik.setFieldValue('videoFile', []);
                    formik.setFieldValue('deleteUploadedVideo', []);
                  }
                }, [productId]);

                useEffect(() => {
                  if (productId) loadData();
                }, [productId]);

                useEffect(() => {
                  if (
                    !productId &&
                    !isDuplicateProduct &&
                    Object.keys(selectedProduct).length &&
                    customizationSubTypesList.length
                  ) {
                    setInitVariation({
                      customizationTypesList,
                      customizationSubTypesList,
                    });
                  }
                }, [productId, customizationTypesList, customizationSubTypesList]);

                useEffect(() => {
                  if (Object.keys(selectedProduct).length && menuList) {
                    categoryChangeHandler(selectedProduct.categoryId, formik);
                    subCategoryChangeHandler(selectedProduct.subCategoryId, formik);
                    setFieldValue('productTypeIds', selectedProduct.productTypeIds);
                  }
                }, [selectedProduct, menuList]);

                useEffect(() => {
                  if (Object.keys(selectedProduct).length && customizationSubTypesList.length) {
                    const variationArray = selectedProduct?.variations?.map((variation) => {
                      const customizationTypeWiseCustomizationSubTypes =
                        customizationSubTypesList.filter(
                          (customization) =>
                            customization.customizationTypeId === variation.variationId
                        );
                      return {
                        variationId: variation.variationId,
                        variationTypes: variation.variationTypes.map((variationType) => {
                          return {
                            variationTypeId: variationType.variationTypeId,
                          };
                        }),
                        subTypes: customizationTypeWiseCustomizationSubTypes,
                      };
                    });
                    formik.setFieldValue('variations', variationArray);
                  }
                }, [selectedProduct, customizationSubTypesList]);

                useEffect(() => {
                  if (
                    Object.keys(selectedProduct)?.length &&
                    customizationTypesList?.length &&
                    customizationSubTypesList?.length
                  ) {
                    const tempCombinationArray = selectedProduct?.variComboWithQuantity?.map(
                      (mainItem) => {
                        return {
                          ...mainItem,
                          combination: mainItem.combination.map((combiItem) => {
                            const findedcustomization = customizationTypesList.find(
                              (item) => item.id === combiItem.variationId
                            );
                            const findedcustomizationSubType = customizationSubTypesList.find(
                              (item) => item.id === combiItem.variationTypeId
                            );
                            return {
                              ...combiItem,
                              variationName: findedcustomization.title,
                              variationTypeName: findedcustomizationSubType.title,
                            };
                          }),
                        };
                      }
                    );
                    setFieldValue('tempVariComboWithQuantity', tempCombinationArray);
                  }
                }, [selectedProduct, customizationTypesList, customizationSubTypesList]);

                useEffect(() => {
                  if (Object.keys(selectedProduct).length && collectionList) {
                    setFieldValue('collectionIds', selectedProduct.collectionIds);
                  }
                }, [selectedProduct, collectionList]);

                useEffect(() => {
                  if (Object.keys(selectedProduct).length && settingStyleList) {
                    setFieldValue('settingStyleIds', selectedProduct.settingStyleIds);
                  }
                }, [selectedProduct, settingStyleList]);

                return (
                  <>
                    <Form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Details</Typography>

                          <Typography variant="body2">
                            Title, Short Description, image...
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            component={Stack}
                            spacing={2}
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              overflow: 'initial !important',
                            }}
                          >
                            <Grid xs={12} sm={12} md={12}>
                              <TextField
                                sx={{
                                  mb: 2,
                                  width: '100%',
                                }}
                                name="productName"
                                onBlur={handleBlur}
                                label="Product Name"
                                onChange={handleChange}
                                value={values.productName || ''}
                                error={!!(touched.productName && errors.productName)}
                                helperText={
                                  touched.productName && errors.productName
                                    ? errors.productName
                                    : ''
                                }
                              />
                              <TextField
                                rows={4}
                                multiline
                                sx={{
                                  mb: 2,
                                  width: '100%',
                                }}
                                onBlur={handleBlur}
                                name="shortDescription"
                                label="Short Description"
                                onChange={handleChange}
                                value={values?.shortDescription || ''}
                                error={!!(touched?.shortDescription && errors?.shortDescription)}
                                helperText={
                                  touched?.shortDescription && errors?.shortDescription
                                    ? errors?.shortDescription
                                    : ''
                                }
                              />

                              <Stack sx={{ my: 1, mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Description
                                </Typography>
                                <Editor
                                  name={'description'}
                                  onChange={(e, editor) => {
                                    const data = editor.getData();
                                    formik.setFieldValue('description', data);
                                  }}
                                  data={values?.description}
                                  className={
                                    touched?.description && errors?.description ? 'error' : ''
                                  }
                                />
                                {touched?.description && errors?.description ? (
                                  <FormHelperText sx={{ color: 'error.main', px: 2 }}>
                                    {errors?.description}
                                  </FormHelperText>
                                ) : null}
                              </Stack>

                              <Stack sx={{ my: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Thumbnail Images
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  productId={productId}
                                  fileKey={'thumbnailImageFile'}
                                  previewKey={'previewThumbnailImage'}
                                  deleteKey={'uploadedDeletedThumbnailImage'}
                                  loading={crudProductLoading || productLoading}
                                />
                                {productId && (
                                  <Stack sx={{ my: 0 }} justifyContent={'end'} direction={'row'}>
                                    <LoadingButton
                                      variant="contained"
                                      loading={crudProductLoading}
                                      disabled={
                                        formik.values?.thumbnailImageFile?.length === 0 ||
                                        crudProductLoading
                                      }
                                      onClick={() => {
                                        updateProductThumbnailImage(formik);
                                      }}
                                      startIcon={<Iconify icon="line-md:upload-loop" />}
                                    >
                                      Upload
                                    </LoadingButton>
                                  </Stack>
                                )}
                              </Stack>
                              <Stack sx={{ my: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Images
                                </Typography>
                                <FileDrop
                                  mediaLimit={8}
                                  formik={formik}
                                  productId={productId}
                                  fileKey={'imageFiles'}
                                  previewKey={'previewImages'}
                                  deleteKey={'uploadedDeletedImages'}
                                  loading={crudProductLoading || productLoading}
                                />
                                {productId && (
                                  <Stack sx={{ my: 0 }} justifyContent={'end'} direction={'row'}>
                                    <LoadingButton
                                      variant="contained"
                                      loading={crudProductLoading}
                                      disabled={crudProductLoading}
                                      onClick={() => updateProductPhotos(formik)}
                                      startIcon={<Iconify icon="line-md:upload-loop" />}
                                    >
                                      Upload
                                    </LoadingButton>
                                  </Stack>
                                )}
                              </Stack>

                              <Stack sx={{ my: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Video
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  mediaType={'video'}
                                  fileKey={'videoFile'}
                                  productId={productId}
                                  previewKey={'previewVideo'}
                                  deleteKey={'deleteUploadedVideo'}
                                  loading={crudProductLoading || productLoading}
                                />
                                {productId && (
                                  <Stack sx={{ my: 0 }} justifyContent={'end'} direction={'row'}>
                                    <LoadingButton
                                      variant="contained"
                                      loading={crudProductLoading}
                                      disabled={
                                        formik.values?.videoFile?.length === 0 || crudProductLoading
                                      }
                                      onClick={() => {
                                        updateProductVideo(formik);
                                      }}
                                      startIcon={<Iconify icon="line-md:upload-loop" />}
                                    >
                                      Upload
                                    </LoadingButton>
                                  </Stack>
                                )}
                              </Stack>
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Properties</Typography>
                          <Typography variant="body2">
                            Additional functions and attributes...
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            component={Stack}
                            spacing={2}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                            }}
                          >
                            <Grid container spacing={2}>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  sx={{
                                    width: '100%',
                                  }}
                                  name="sku"
                                  label="Product SKU"
                                  onBlur={handleBlur}
                                  onChange={(e) => skuChangeHandler(e.target.value, formik)}
                                  value={values.sku || ''}
                                  error={!!(touched.sku && errors.sku)}
                                  helperText={touched.sku && errors.sku ? errors.sku : ''}
                                />
                                {values.sku ? (
                                  <Typography
                                    color="textSecondary"
                                    sx={{ fontSize: '0.875rem', marginTop: '5px' }}
                                  >
                                    <strong>salt SKU :</strong> {values.saltSKU}
                                  </Typography>
                                ) : null}
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  type="number"
                                  name="discount"
                                  label="Discount %"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.discount || ''}
                                  error={!!(touched.discount && errors.discount)}
                                  helperText={
                                    touched.discount && errors.discount ? errors.discount : ''
                                  }
                                  sx={{
                                    width: '100%',
                                  }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 1, marginTop: '0 !important' }}>
                              <Grid xs={12} sm={6} md={6}>
                                <FormControl sx={{ width: '100%' }}>
                                  <InputLabel id="connectionName">Collection Name</InputLabel>
                                  <Select
                                    sx={{ width: '100%' }}
                                    multiple
                                    MenuProps={MenuProps}
                                    labelId="connectionName"
                                    name="collectionIds"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.collectionIds || []}
                                    input={<OutlinedInput label="Collection Name" />}
                                    renderValue={(selected) => {
                                      let updated = selected?.map((x) => {
                                        const selectedItem = collectionList?.find(
                                          (option) => option.id === x
                                        );
                                        return selectedItem ? selectedItem?.title : x;
                                      });

                                      if (updated?.length > 1) return updated?.join(', ');
                                      return updated;
                                    }}
                                  >
                                    {collectionList?.length > 0 ? (
                                      collectionList.map((option) => (
                                        <MenuItem key={option?.id} value={option?.id}>
                                          <ListItemText primary={option?.title} />
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <MenuItem disabled>No Item</MenuItem>
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <FormControl sx={{ width: '100%' }}>
                                  <InputLabel id="settingStyleName">Setting Style</InputLabel>
                                  <Select
                                    sx={{ width: '100%' }}
                                    multiple
                                    MenuProps={MenuProps}
                                    labelId="settingStyleName"
                                    name="settingStyleIds"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.settingStyleIds || []}
                                    input={<OutlinedInput label="Setting Style" />}
                                    renderValue={(selected) => {
                                      let updated = selected?.map((x) => {
                                        const selectedItem = settingStyleList?.find(
                                          (option) => option.id === x
                                        );
                                        return selectedItem ? selectedItem?.title : x;
                                      });

                                      if (updated?.length > 1) return updated?.join(', ');
                                      return updated;
                                    }}
                                  >
                                    {settingStyleList?.length > 0 ? (
                                      settingStyleList.map((option) => (
                                        <MenuItem key={option?.id} value={option?.id}>
                                          <ListItemText primary={option?.title} />
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <MenuItem disabled>No Item</MenuItem>
                                    )}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ marginTop: '0 !important' }}>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  select
                                  sx={{
                                    width: '100%',
                                  }}
                                  label="Category"
                                  name="categoryId"
                                  onBlur={handleBlur}
                                  onChange={(e) => categoryChangeHandler(e.target.value, formik)}
                                  value={values.categoryId}
                                  error={!!(touched.categoryId && errors.categoryId)}
                                  helperText={
                                    touched.categoryId && errors.categoryId ? errors.categoryId : ''
                                  }
                                >
                                  {categoriesList?.length > 0 ? (
                                    categoriesList?.map((option) => (
                                      <MenuItem key={option?.id} value={option?.id}>
                                        {option?.title}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem disabled>No Item</MenuItem>
                                  )}
                                </TextField>
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  select
                                  sx={{
                                    width: '100%',
                                  }}
                                  onBlur={handleBlur}
                                  name="subCategoryId"
                                  label="Sub category"
                                  value={values?.subCategoryId}
                                  onChange={(e) => subCategoryChangeHandler(e.target.value, formik)}
                                  error={!!(touched.subCategoryId && errors.subCategoryId)}
                                  helperText={
                                    touched.subCategoryId && errors.subCategoryId
                                      ? errors.subCategoryId
                                      : ''
                                  }
                                >
                                  {subCategoriesList?.length > 0 ? (
                                    subCategoriesList?.map((option) => (
                                      <MenuItem key={option?.id} value={option?.id}>
                                        {option?.title}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <MenuItem disabled>No Item</MenuItem>
                                  )}
                                </TextField>
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <FormControl sx={{ width: '100%' }}>
                                  <InputLabel id="productTypeName">Product Type</InputLabel>
                                  <Select
                                    sx={{ width: '100%' }}
                                    multiple
                                    MenuProps={MenuProps}
                                    labelId="productTypeName"
                                    name="productTypeIds"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values?.productTypeIds || []}
                                    input={<OutlinedInput label="Product Type" />}
                                    renderValue={(selected) => {
                                      let updated = selected?.map((x) => {
                                        const selectedItem = productTypesList?.find(
                                          (option) => option.id === x
                                        );
                                        return selectedItem ? selectedItem?.title : x;
                                      });

                                      if (updated?.length > 1) return updated?.join(', ');
                                      return updated;
                                    }}
                                  >
                                    {productTypesList?.length > 0 ? (
                                      productTypesList.map((option) => (
                                        <MenuItem key={option?.id} value={option?.id}>
                                          <ListItemText primary={option?.title} />
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <MenuItem disabled>No Item</MenuItem>
                                    )}
                                  </Select>
                                  {touched.productTypeIds && errors.productTypeIds ? (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: '#FF5630',
                                        fontWeight: 'normal',
                                        fontSize: '12px',
                                        margin: '3px 14px 0 14px',
                                      }}
                                    >
                                      {errors.productTypeIds}
                                    </Typography>
                                  ) : null}
                                </FormControl>
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  type="number"
                                  name="netWeight"
                                  label="Net Weight"
                                  onBlur={handleBlur}
                                  onChange={(event) => {
                                    const value = event?.target?.value;
                                    const roundedValue = value
                                      ? Math.round(parseFloat(value) * 100) / 100
                                      : '';
                                    setFieldValue('netWeight', roundedValue);
                                  }}
                                  value={values.netWeight || ''}
                                  error={!!(touched.netWeight && errors.netWeight)}
                                  helperText={
                                    touched.netWeight && errors.netWeight ? errors.netWeight : ''
                                  }
                                  sx={{
                                    width: '100%',
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Variations</Typography>
                          <Typography variant="body2">Add custom varirations</Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                            }}
                            spacing={2}
                            component={Stack}
                          >
                            <Variations formik={formik} />
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Diamond Filters</Typography>
                          <Typography variant="body2">Add Diamond Filters</Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            sx={{
                              p: 1,
                              borderRadius: 2,
                            }}
                            spacing={2}
                            component={Stack}
                          >
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="isDiamondFilter"
                                    sx={{ mx: 1 }}
                                    checked={values?.isDiamondFilter}
                                    onBlur={handleBlur}
                                    onChange={() => {
                                      setFieldValue('isDiamondFilter', !values?.isDiamondFilter);
                                      setFieldValue('diamondFilters', initDiamondFilters);
                                    }}
                                  />
                                }
                                label="Apply Diamond Filter"
                              />
                            </FormGroup>
                            <DiamondFilters formik={formik} />
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Specifications</Typography>
                          <Typography variant="body2">Extra details</Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            sx={{
                              p: 1,
                              borderRadius: 2,
                            }}
                            spacing={2}
                            component={Stack}
                          >
                            <Specifications formik={formik} />
                          </Card>
                          <Stack
                            gap={2}
                            sx={{ mt: 2 }}
                            direction={'row'}
                            justifyContent={'space-between'}
                          >
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="active"
                                    sx={{ mx: 1 }}
                                    checked={values?.active}
                                    onBlur={handleBlur}
                                    onChange={() => setStatusConfirmationDialog(true)}
                                  />
                                }
                                label="Active"
                              />
                            </FormGroup>
                            <LoadingButton
                              size="large"
                              variant="contained"
                              onClick={handleSubmit}
                              loading={crudProductLoading}
                            >
                              {productId ? 'Update' : 'Save'} Changes
                            </LoadingButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Form>
                    {openCombinationDialog && (
                      <CombinationDialog
                        fields={values}
                        productId={productId}
                        openDialog={openCombinationDialog}
                        onCloseDialog={setCombinantionDialog}
                        combinationsDetail={getCombinationDetail(values)}
                      />
                    )}
                    {statusConfirmationDialog && (
                      <Dialog
                        open={statusConfirmationDialog}
                        handleOpen={() => setStatusConfirmationDialog(true)}
                        handleClose={() => setStatusConfirmationDialog(false)}
                      >
                        <StyledDialogTitle>Confirmation</StyledDialogTitle>
                        <StyledDialogContent>
                          Do you want to {values?.active ? 'DEACTIVE' : 'ACTIVE'} this product?
                        </StyledDialogContent>
                        <StyledDialogActions>
                          <Button
                            variant="outlined"
                            disabled={crudProductLoading}
                            onClick={() => setStatusConfirmationDialog(false)}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            loading={crudProductLoading}
                            onClick={() => {
                              if (productId) {
                                changeProductStatus(values, setFieldValue);
                              } else {
                                setFieldValue('active', !values.active);
                                setStatusConfirmationDialog(false);
                              }
                            }}
                          >
                            Confirm
                          </LoadingButton>
                        </StyledDialogActions>
                      </Dialog>
                    )}
                    {duplicateDialog ? (
                      <DuplicateProductDialog
                        open={duplicateDialog}
                        setOpen={setDuplicateDialog}
                        loading={duplicateProductLoading}
                      />
                    ) : null}
                  </>
                );
              }}
            </Formik>
          )}

          {/* {(productList?.length === 0 || currentPageData?.length === 0) && !productLoading && (
          <NoData>
            {productList?.length === 0
              ? `Click the "New Product" button to get started.`
              : 'Product Does not exist'}
          </NoData>
        )} */}
        </Stack>
      </Container>
    </>
  );
}
