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
  InputAdornment,
  IconButton,
} from '@mui/material';

import {
  getSingleProduct,
  getAllMenuCategoryList,
  getAllCustomizationTypeList,
  getAllCustomizationSubTypeList,
  updateStatusProduct,
  getSettingStyleList,
  getDiamondShapeList,
  updateRoseGoldMediaAction,
  updateWhiteGoldMediaAction,
  updateYellowGoldMediaAction,
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
import CombinationDialog from './combination-dialog';
import DiamondFilters from './diamond-filters';
import DuplicateProductDialog from './duplicate-product-dialog';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  GENDER_LIST,
  GOLD_COLOR,
  GOLD_COLOR_SUB_TYPES_LIST,
  GOLD_TYPE,
  INIT_GOLD_TYPE_SUB_TYPES_LIST,
  RING_SIZE,
} from 'src/_helpers/constants';
import ClearIcon from '@mui/icons-material/Clear';
import GroupBySection from './GroupBySection';

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  previewThumbnailImage: Yup.array().min(1, 'Thumbnail image is required'),
  roseGoldPreviewImages: Yup.array().min(1, 'At least one rose gold image is required'),
  roseGoldPreviewThumbnailImage: Yup.array().min(1, 'Rose gold thumbnail image is required'),
  yellowGoldPreviewImages: Yup.array().min(1, 'At least one yellow gold image is required'),
  yellowGoldPreviewThumbnailImage: Yup.array().min(1, 'Yellow gold thumbnail image is required'),
  whiteGoldPreviewImages: Yup.array().min(1, 'At least one white gold image is required'),
  whiteGoldPreviewThumbnailImage: Yup.array().min(1, 'White gold thumbnail image is required'),
  productName: Yup.string()
    .required('Product name is required')
    .max(60, 'Product name should not exceed 60 characters.')
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      'Product name can only contain letters (a-z, A-Z), numbers (0-9), and spaces.'
    ),
  sku: Yup.string().required('SKU is required'),
  discount: Yup.number().min(0, 'Discount must be positive').max(100, 'Maximum discount is 100'),
  categoryId: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  variations: Yup.array()
    .min(1, 'Variation is required')
    .of(
      Yup.object().shape({
        variationId: Yup.string().required('Variation is required'),
        variationTypes: Yup.array().of(
          Yup.object().shape({
            variationTypeId: Yup.string().required('Variation type is required'),
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
  sideDiamondWeight: Yup.lazy((value, { parent }) => {
    if (parent.isDiamondFilter) {
      return Yup.number()
        .required('Side diamond weight is required')
        .positive('Side diamond weight must be positive');
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
  }, [dispatch]);

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

  const onSubmit = useCallback((fields, { setStatus, setSubmitting }) => {
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
    [dispatch, menuList]
  );

  const subCategoryChangeHandler = useCallback(
    (val, formik) => {
      formik.setFieldValue('subCategoryId', val);
      formik.setFieldValue('productTypeIds', []);
      let list = menuList.productType?.filter((c) => c.subCategoryId === val);
      dispatch(setProductTypesList(list));
    },
    [dispatch, menuList]
  );

  const changeProductStatus = useCallback(
    async (values, setFieldValue) => {
      const payload = { productId, active: !values.active };
      const res = await dispatch(updateStatusProduct(payload));
      if (res) {
        setFieldValue('active', !values.active);
        setStatusConfirmationDialog(false);
      }
    },
    [dispatch, productId]
  );

  const updateRoseGoldMedia = async (formik) => {
    const payload = {
      productId,
      roseGoldThumbnailImageFile: formik?.values?.roseGoldThumbnailImageFile?.[0],
      roseGoldImageFiles: formik?.values?.roseGoldImageFiles,
      roseGoldVideoFile: formik?.values?.roseGoldVideoFile?.[0],
      deletedRoseGoldImages: formik?.values?.roseGoldUploadedDeletedImages?.map(
        (item) => item?.image
      ),
      deletedRoseGoldVideo: formik?.values?.roseGoldDeleteUploadedVideo?.[0]?.video,
    };

    const res = await dispatch(updateRoseGoldMediaAction(payload));

    if (res) {
      dispatch(getSingleProduct(productId));
    }
  };

  const updateYellowGoldMedia = async (formik) => {
    const payload = {
      productId,
      yellowGoldThumbnailImageFile: formik?.values?.yellowGoldThumbnailImageFile?.[0],
      yellowGoldImageFiles: formik?.values?.yellowGoldImageFiles,
      yellowGoldVideoFile: formik?.values?.yellowGoldVideoFile?.[0],
      deletedYellowGoldImages: formik?.values?.yellowGoldUploadedDeletedImages?.map(
        (item) => item?.image
      ),
      deletedYellowGoldVideo: formik?.values?.yellowGoldDeleteUploadedVideo?.[0]?.video,
    };

    const res = await dispatch(updateYellowGoldMediaAction(payload));

    if (res) {
      dispatch(getSingleProduct(productId));
    }
  };

  const updateWhiteGoldMedia = async (formik) => {
    const payload = {
      productId,
      whiteGoldThumbnailImageFile: formik?.values?.whiteGoldThumbnailImageFile?.[0],
      whiteGoldImageFiles: formik?.values?.whiteGoldImageFiles,
      whiteGoldVideoFile: formik?.values?.whiteGoldVideoFile?.[0],
      deletedWhiteGoldImages: formik?.values?.whiteGoldUploadedDeletedImages?.map(
        (item) => item?.image
      ),
      deletedWhiteGoldVideo: formik?.values?.whiteGoldDeleteUploadedVideo?.[0]?.video,
    };

    const res = await dispatch(updateWhiteGoldMediaAction(payload));

    if (res) {
      dispatch(getSingleProduct(productId));
    }
  };

  // set  default variations selected
  const setInitVariation = useCallback(
    ({ customizationTypesList, customizationSubTypesList }) => {
      const findCustomization = (name) =>
        customizationTypesList.find(
          (item) => item.title === name || item.customizationTypeName === name
        );

      const findSubTypesByTypeName = (typeName) =>
        customizationSubTypesList.filter((subType) => subType.customizationTypeName === typeName);

      const mapSubTypesFromList = (subTypeTitles) =>
        subTypeTitles
          .map(
            (item) =>
              customizationSubTypesList.find((subType) => subType.title === item.title) || null
          )
          .filter(Boolean);

      const goldType = findCustomization(GOLD_TYPE.title);
      const goldColor = findCustomization(GOLD_COLOR.title);
      const ringSize = findCustomization(RING_SIZE.title);

      const newVariations = [];

      if (goldType) {
        const goldTypeSubTypes = findSubTypesByTypeName(GOLD_TYPE.title);
        const matchedGoldTypeSubTypes = mapSubTypesFromList(INIT_GOLD_TYPE_SUB_TYPES_LIST);
        newVariations.push(createVariation(goldType.id, goldTypeSubTypes, matchedGoldTypeSubTypes));
      }

      if (goldColor) {
        const goldColorSubTypes = findSubTypesByTypeName(goldColor.title);
        const matchedGoldColorSubTypes = mapSubTypesFromList(GOLD_COLOR_SUB_TYPES_LIST);
        newVariations.push(
          createVariation(goldColor.id, goldColorSubTypes, matchedGoldColorSubTypes)
        );
      }

      if (ringSize) {
        const ringSizeSubTypes = findSubTypesByTypeName(ringSize.title);
        const sortedRingSizes = [...ringSizeSubTypes].sort(
          (a, b) => parseFloat(a.title) - parseFloat(b.title)
        );
        newVariations.push(createVariation(ringSize.id, ringSizeSubTypes, sortedRingSizes));
      }

      const newPayload = {
        ...selectedProduct,
        variations: newVariations,
      };

      if (JSON.stringify(newPayload) !== JSON.stringify(selectedProduct)) {
        dispatch(setSelectedProduct(newPayload));
      }
      const customizations = {
        customizationType: customizationTypesList,
        customizationSubType: customizationSubTypesList,
      };
      const tempVariComboWithQuantity = helperFunctions?.getCombinationDetail({
        variations: newVariations,
        customizations,
      });
      dispatch(setSelectedProduct({ ...newPayload, tempVariComboWithQuantity }));

      // Helper inside callback for reuse
      function createVariation(variationId, subTypes, matchedSubTypes) {
        return {
          variationId,
          subTypes,
          variationTypes: matchedSubTypes.map(({ id }) => ({ variationTypeId: id })),
        };
      }
    },
    [dispatch, selectedProduct]
  );

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
                    customizationSubTypesList?.length &&
                    (productId || isDuplicateProduct)
                  ) {
                    const tempVariComboWithQuantity = selectedProduct?.variComboWithQuantity?.map(
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
                    setFieldValue('tempVariComboWithQuantity', tempVariComboWithQuantity);
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
                            Title, Short Description, images...
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card
                            component={Stack}
                            spacing={2}
                            sx={{ p: 1, borderRadius: 2, overflow: 'initial !important' }}
                          >
                            <Grid xs={12} sm={12} md={12}>
                              <TextField
                                sx={{ mb: 2, width: '100%' }}
                                name="productName"
                                onBlur={handleBlur}
                                label="Product Name"
                                onChange={handleChange}
                                value={values.productName || ''}
                                error={!!(touched?.productName && errors?.productName)}
                                helperText={
                                  touched?.productName && errors?.productName
                                    ? errors?.productName
                                    : ''
                                }
                              />
                              <TextField
                                rows={4}
                                multiline
                                sx={{ mb: 2, width: '100%' }}
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
                                  name="description"
                                  onChange={(e, editor) => {
                                    const data = editor.getData();
                                    setFieldValue('description', data);
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
                          <Card component={Stack} spacing={2} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  sx={{ width: '100%' }}
                                  name="sku"
                                  label="Product SKU"
                                  onBlur={handleBlur}
                                  onChange={(e) =>
                                    skuChangeHandler(e.target.value, { values, setFieldValue })
                                  }
                                  value={values.sku || ''}
                                  error={!!(touched?.sku && errors?.sku)}
                                  helperText={touched?.sku && errors?.sku ? errors?.sku : ''}
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
                                  error={!!(touched?.discount && errors?.discount)}
                                  helperText={
                                    touched?.discount && errors?.discount ? errors?.discount : ''
                                  }
                                  sx={{ width: '100%' }}
                                />
                              </Grid>
                            </Grid>
                            <Grid container spacing={2} sx={{ mb: 1, marginTop: '0 !important' }}>
                              <Grid xs={12} sm={6} md={6}>
                                <FormControl sx={{ width: '100%' }}>
                                  <InputLabel id="collectionName">Collection Name</InputLabel>
                                  <Select
                                    sx={{ width: '100%' }}
                                    multiple
                                    MenuProps={MenuProps}
                                    labelId="collectionName"
                                    name="collectionIds"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.collectionIds || []}
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
                                    value={values.settingStyleIds || []}
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
                                  sx={{ width: '100%' }}
                                  label="Category"
                                  name="categoryId"
                                  onBlur={handleBlur}
                                  onChange={(e) =>
                                    categoryChangeHandler(e.target.value, { values, setFieldValue })
                                  }
                                  value={values.categoryId || ''}
                                  error={!!(touched?.categoryId && errors?.categoryId)}
                                  helperText={
                                    touched?.categoryId && errors?.categoryId
                                      ? errors?.categoryId
                                      : ''
                                  }
                                >
                                  {categoriesList?.length > 0 ? (
                                    categoriesList.map((option) => (
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
                                  sx={{ width: '100%' }}
                                  onBlur={handleBlur}
                                  name="subCategoryId"
                                  label="Sub category"
                                  value={values?.subCategoryId || ''}
                                  onChange={(e) =>
                                    subCategoryChangeHandler(e.target.value, {
                                      values,
                                      setFieldValue,
                                    })
                                  }
                                  error={!!(touched?.subCategoryId && errors?.subCategoryId)}
                                  helperText={
                                    touched?.subCategoryId && errors?.subCategoryId
                                      ? errors?.subCategoryId
                                      : ''
                                  }
                                >
                                  {subCategoriesList?.length > 0 ? (
                                    subCategoriesList.map((option) => (
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
                                  {touched?.productTypeIds && errors?.productTypeIds ? (
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        color: '#FF5630',
                                        fontWeight: 'normal',
                                        fontSize: '12px',
                                        margin: '3px 14px 0 14px',
                                      }}
                                    >
                                      {errors?.productTypeIds}
                                    </Typography>
                                  ) : null}
                                </FormControl>
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  select
                                  sx={{ width: '100%' }}
                                  label="Gender"
                                  name="gender"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values?.gender || ''}
                                  InputProps={{
                                    endAdornment: values?.gender && (
                                      <InputAdornment position="end" sx={{ marginRight: '24px' }}>
                                        <IconButton
                                          aria-label="clear selection"
                                          onClick={() =>
                                            handleChange({ target: { name: 'gender', value: '' } })
                                          }
                                          edge="end"
                                        >
                                          <ClearIcon sx={{ fontSize: '20px' }} />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                >
                                  {GENDER_LIST?.length > 0 ? (
                                    GENDER_LIST?.map((option) => (
                                      <MenuItem key={option?.value} value={option?.value}>
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
                                  type="number"
                                  name="netWeight"
                                  label="Net Weight (g)"
                                  onBlur={handleBlur}
                                  onChange={(event) => {
                                    const value = event?.target?.value;
                                    const roundedValue = value
                                      ? Math.round(parseFloat(value) * 100) / 100
                                      : '';
                                    setFieldValue('netWeight', roundedValue);
                                  }}
                                  value={values.netWeight || ''}
                                  error={!!(touched?.netWeight && errors?.netWeight)}
                                  helperText={
                                    touched?.netWeight && errors?.netWeight ? errors?.netWeight : ''
                                  }
                                  sx={{ width: '100%' }}
                                  inputProps={{ min: 0 }}
                                />
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <TextField
                                  type="number"
                                  name="sideDiamondWeight"
                                  label="Side Diamond Weight (Ct.)"
                                  onBlur={handleBlur}
                                  onChange={(event) => {
                                    const value = event?.target?.value;
                                    const roundedValue = value
                                      ? Math.round(parseFloat(value) * 100) / 100
                                      : '';
                                    setFieldValue('sideDiamondWeight', roundedValue);
                                  }}
                                  value={values.sideDiamondWeight || ''}
                                  error={
                                    !!(touched?.sideDiamondWeight && errors?.sideDiamondWeight)
                                  }
                                  helperText={
                                    touched?.sideDiamondWeight && errors?.sideDiamondWeight
                                      ? errors?.sideDiamondWeight
                                      : ''
                                  }
                                  sx={{ width: '100%' }}
                                  inputProps={{ min: 0 }}
                                />
                              </Grid>
                            </Grid>
                          </Card>
                        </Grid>
                      </Grid>
                      {/* Rose Gold Media */}
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Rose Gold Media</Typography>
                          <Typography variant="body2">
                            Add thumbnails, images, or videos.
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card component={Stack} spacing={2} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Rose Gold Thumbnail Image
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  productId={productId}
                                  fileKey="roseGoldThumbnailImageFile"
                                  previewKey="roseGoldPreviewThumbnailImage"
                                  deleteKey="roseGoldUploadedDeletedThumbnailImage"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Rose Gold Video
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  mediaType="video"
                                  fileKey="roseGoldVideoFile"
                                  productId={productId}
                                  previewKey="roseGoldPreviewVideo"
                                  deleteKey="roseGoldDeleteUploadedVideo"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} sx={{ marginTop: '0 !important' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Rose Gold Images
                              </Typography>
                              <FileDrop
                                mediaLimit={8}
                                formik={formik}
                                productId={productId}
                                fileKey="roseGoldImageFiles"
                                previewKey="roseGoldPreviewImages"
                                deleteKey="roseGoldUploadedDeletedImages"
                                loading={crudProductLoading || productLoading}
                              />
                            </Grid>
                            {productId && (
                              <Stack sx={{ my: 0 }} justifyContent="end" direction="row">
                                <LoadingButton
                                  variant="contained"
                                  loading={crudProductLoading}
                                  disabled={crudProductLoading}
                                  onClick={() => updateRoseGoldMedia(formik)}
                                  startIcon={<Iconify icon="line-md:upload-loop" />}
                                >
                                  Upload Rose Gold Media
                                </LoadingButton>
                              </Stack>
                            )}
                          </Card>
                        </Grid>
                      </Grid>

                      {/* Yellow Gold Media */}
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Yellow Gold Media</Typography>
                          <Typography variant="body2">
                            Add thumbnails, images, or videos.
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card component={Stack} spacing={2} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Yellow Gold Thumbnail Image
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  productId={productId}
                                  fileKey="yellowGoldThumbnailImageFile"
                                  previewKey="yellowGoldPreviewThumbnailImage"
                                  deleteKey="yellowGoldUploadedDeletedThumbnailImage"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Yellow Gold Video
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  mediaType="video"
                                  fileKey="yellowGoldVideoFile"
                                  productId={productId}
                                  previewKey="yellowGoldPreviewVideo"
                                  deleteKey="yellowGoldDeleteUploadedVideo"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} sx={{ marginTop: '0 !important' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Yellow Gold Images
                              </Typography>
                              <FileDrop
                                mediaLimit={8}
                                formik={formik}
                                productId={productId}
                                fileKey="yellowGoldImageFiles"
                                previewKey="yellowGoldPreviewImages"
                                deleteKey="yellowGoldUploadedDeletedImages"
                                loading={crudProductLoading || productLoading}
                              />
                            </Grid>
                            {productId && (
                              <Stack sx={{ my: 0 }} justifyContent="end" direction="row">
                                <LoadingButton
                                  variant="contained"
                                  loading={crudProductLoading}
                                  disabled={crudProductLoading}
                                  onClick={() => updateYellowGoldMedia(formik)}
                                  startIcon={<Iconify icon="line-md:upload-loop" />}
                                >
                                  Upload Yellow Gold Media
                                </LoadingButton>
                              </Stack>
                            )}
                          </Card>
                        </Grid>
                      </Grid>

                      {/* White Gold Media */}
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">White Gold Media</Typography>
                          <Typography variant="body2">
                            Add thumbnails, images, or videos.
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card component={Stack} spacing={2} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  White Gold Thumbnail Image
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  productId={productId}
                                  fileKey="whiteGoldThumbnailImageFile"
                                  previewKey="whiteGoldPreviewThumbnailImage"
                                  deleteKey="whiteGoldUploadedDeletedThumbnailImage"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                              <Grid xs={12} sm={6} md={6}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  White Gold Video
                                </Typography>
                                <FileDrop
                                  mediaLimit={1}
                                  formik={formik}
                                  mediaType="video"
                                  fileKey="whiteGoldVideoFile"
                                  productId={productId}
                                  previewKey="whiteGoldPreviewVideo"
                                  deleteKey="whiteGoldDeleteUploadedVideo"
                                  loading={crudProductLoading || productLoading}
                                />
                              </Grid>
                            </Grid>
                            <Grid xs={12} sm={12} md={12} sx={{ marginTop: '0 !important' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                White Gold Images
                              </Typography>
                              <FileDrop
                                mediaLimit={8}
                                formik={formik}
                                productId={productId}
                                fileKey="whiteGoldImageFiles"
                                previewKey="whiteGoldPreviewImages"
                                deleteKey="whiteGoldUploadedDeletedImages"
                                loading={crudProductLoading || productLoading}
                              />
                            </Grid>
                            {productId && (
                              <Stack sx={{ my: 0 }} justifyContent="end" direction="row">
                                <LoadingButton
                                  variant="contained"
                                  loading={crudProductLoading}
                                  disabled={crudProductLoading}
                                  onClick={() => updateWhiteGoldMedia(formik)}
                                  startIcon={<Iconify icon="line-md:upload-loop" />}
                                >
                                  Upload White Gold Media
                                </LoadingButton>
                              </Stack>
                            )}
                          </Card>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Variations</Typography>
                          <Typography variant="body2">Add custom variations</Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card sx={{ p: 1.5, borderRadius: 2 }} spacing={2} component={Stack}>
                            <Variations formik={formik} />
                            <GroupBySection formik={formik} />
                          </Card>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid xs={12} sm={4} md={4}>
                          <Typography variant="h6">Diamond Filters</Typography>
                          <Typography variant="body2">Add Diamond Filters</Typography>
                        </Grid>
                        <Grid xs={12} sm={8} md={8}>
                          <Card sx={{ p: 1, borderRadius: 2 }} spacing={2} component={Stack}>
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Switch
                                    name="isDiamondFilter"
                                    sx={{ mx: 1 }}
                                    checked={values.isDiamondFilter}
                                    onBlur={handleBlur}
                                    onChange={() => {
                                      setFieldValue('isDiamondFilter', !values.isDiamondFilter);
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
                          <Card sx={{ p: 1, borderRadius: 2 }} spacing={2} component={Stack}>
                            <Specifications formik={formik} />
                          </Card>
                          <Stack
                            gap={2}
                            sx={{ mt: 2 }}
                            direction="row"
                            justifyContent="space-between"
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
                        combinationsDetail={values?.tempVariComboWithQuantity}
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
                          Do you want to {values.active ? 'DEACTIVATE' : 'ACTIVATE'} this product?
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
                    {duplicateDialog && (
                      <DuplicateProductDialog
                        open={duplicateDialog}
                        setOpen={setDuplicateDialog}
                        loading={duplicateProductLoading}
                      />
                    )}
                  </>
                );
              }}
            </Formik>
          )}
        </Stack>
      </Container>
    </>
  );
}
