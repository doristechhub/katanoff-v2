import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import {
  Box,
  Card,
  Stack,
  Divider,
  Typography,
  TextField,
  Checkbox,
  IconButton,
} from '@mui/material';

import Label from 'src/components/label';
import { grey } from 'src/theme/palette';
import NoData from 'src/components/no-data';
import Spinner from 'src/components/spinner';
import Iconify from 'src/components/iconify';
import { helperFunctions } from 'src/_helpers';
import { fCurrency } from 'src/utils/format-number';
import { Button, LoadingButton } from 'src/components/button';
import { getSingleOrderById } from 'src/actions/ordersActions';
import { submitReturnRequest } from 'src/actions/returnActions';
import ProgressiveImg from 'src/components/progressive-img';
import { getProductsArray } from 'src/_services';

// Utility function to create a unique identifier for a product configuration
const generateProductConfigId = (product, index) => {
  const variationIds = [...(product.variations || [])]
    .sort((a, b) => a.variationId.localeCompare(b.variationId))
    .map((v) => v.variationId)
    .join('-');
  const diamondDetailKey = product.diamondDetail
    ? `${product.diamondDetail.shapeId}-${product.diamondDetail.clarity}-${product.diamondDetail.color}`
    : '';
  return `${product.productId}-${variationIds}-${diamondDetailKey}-${index}`;
};

// Utility function to create a deep copy of products
const deepCopyProducts = (products) => {
  return JSON.parse(JSON.stringify(products)).map((product) => ({
    ...product,
    variations: product.variations ? [...product.variations] : [],
    diamondDetail: product.diamondDetail ? { ...product.diamondDetail } : undefined,
  }));
};

// ----------------------------------------------------------------------
const ReturnRequestPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const abortControllerRef = useRef(null);
  const theme = useTheme();

  const { ordersLoading, selectedOrder } = useSelector(({ orders }) => orders);
  const { crudReturnLoading } = useSelector(({ returns }) => returns);

  const loadData = useCallback(() => {
    dispatch(getSingleOrderById(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    loadData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [loadData]);

  const validationSchema = Yup.object().shape({
    returnItems: Yup.array()
      .of(
        Yup.object().shape({
          configId: Yup.string().required('Config ID is required'),
          productId: Yup.string().required('Product ID is required'),
          returnQuantity: Yup.number()
            .min(1, 'Quantity must be at least 1')
            .required('Return quantity is required'),
          isSelected: Yup.boolean(),
        })
      )
      .min(1, 'At least one product must be selected for return')
      .test('at-least-one-selected', 'At least one product must be selected', (items) =>
        items.some((item) => item.isSelected)
      ),
    returnReason: Yup.string()
      .required('Return reason is required')
      .min(10, 'Reason must be at least 10 characters'),
  });

  const formik = useFormik({
    initialValues: {
      returnItems:
        selectedOrder?.products?.length > 0
          ? deepCopyProducts(selectedOrder.products).map((product, index) => ({
              configId: generateProductConfigId(product, index),
              productId: product?.productId,
              returnQuantity: product?.cartQuantity || 1,
              isSelected: false,
            }))
          : [],
      returnReason: '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const selectedProducts = values.returnItems
          .filter((item) => item.isSelected)
          .map((item) => {
            const product = selectedOrder?.products?.find(
              (p, idx) => generateProductConfigId(p, idx) === item.configId
            );
            return {
              productId: item.productId,
              returnQuantity: item.returnQuantity,
              productPrice: product?.productPrice || 0,
              variations: product?.variations || [],
              diamondDetail: product?.diamondDetail || null,
            };
          });

        const returnData = {
          orderId: selectedOrder?.id,
          products: getProductsArray(selectedProducts),
          returnRequestReason: values.returnReason,
        };
        const response = await dispatch(submitReturnRequest(returnData));

        if (response) {
          resetForm();
          navigate('/orders/list');
        }
      } catch (error) {
        console.error('Return submission failed:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleSubmit, setFieldValue } = formik;

  const handleQuantityChange = (configId, delta) => {
    const itemIndex = values.returnItems.findIndex((item) => item?.configId === configId);
    if (itemIndex === -1) return;
    const product = selectedOrder?.products?.find(
      (p, idx) => generateProductConfigId(p, idx) === configId
    );
    const maxQuantity = product?.cartQuantity || 1;
    const currentQuantity = values.returnItems[itemIndex]?.returnQuantity;
    const newQuantity = Math.max(1, Math.min(currentQuantity + delta, maxQuantity));
    setFieldValue(`returnItems[${itemIndex}].returnQuantity`, newQuantity);
  };

  const handleCheckboxChange = (configId) => {
    const itemIndex = values?.returnItems?.findIndex((item) => item?.configId === configId);
    if (itemIndex === -1) return;
    setFieldValue(
      `returnItems[${itemIndex}].isSelected`,
      !values?.returnItems[itemIndex]?.isSelected
    );
  };

  const calculateTotalReturnAmount = () => {
    return values.returnItems.reduce((total, item) => {
      if (item.isSelected) {
        const product = selectedOrder?.products?.find(
          (p, idx) => generateProductConfigId(p, idx) === item?.configId
        );
        const unitPrice = product?.productPrice || 0;
        return total + unitPrice * item?.returnQuantity;
      }
      return total;
    }, 0);
  };

  return (
    <>
      {ordersLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        Object.keys(selectedOrder)?.length !== 0 && (
          <Container sx={{ height: '100%' }}>
            <Stack
              gap={2}
              flexWrap={'wrap'}
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Stack direction={'row'} alignItems={'center'} gap={2} flexWrap={'wrap'}>
                <Typography variant="h4">Order #{selectedOrder?.orderNumber}</Typography>
              </Stack>
            </Stack>
            <Typography mt={1} variant="body2" color={'grey.600'}>
              {moment(selectedOrder?.createdDate)?.format('MM-DD-YYYY hh:mm a')}
            </Typography>
            <Stack sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <Card sx={{ p: 2, borderRadius: 2 }} spacing={2} component={Stack}>
                    <Typography variant="h6">Return Request</Typography>
                    <Stack sx={{ overflowX: 'auto' }}>
                      {selectedOrder?.products?.map((product, index) => {
                        const configId = generateProductConfigId(product, index);
                        const itemIndex = values.returnItems.findIndex(
                          (item) => item?.configId === configId
                        );
                        const returnQuantity =
                          itemIndex !== -1
                            ? values.returnItems[itemIndex]?.returnQuantity || 1
                            : product?.cartQuantity;
                        const unitPrice = product?.productPrice || 0;
                        const totalPrice = unitPrice * returnQuantity;

                        return (
                          <React.Fragment key={configId}>
                            <Stack direction="row" alignItems="center" gap={2} sx={{ py: 2 }}>
                              <Checkbox
                                checked={
                                  itemIndex !== -1 && values.returnItems[itemIndex]?.isSelected
                                    ? true
                                    : false
                                }
                                onChange={() => handleCheckboxChange(configId)}
                              />
                              <Box sx={{ width: '60px', height: '60px', flexShrink: 0 }}>
                                <ProgressiveImg
                                  src={product?.productImage}
                                  alt={product?.productName}
                                  customClassName="w-full h-full rounded-md"
                                />
                              </Box>
                              <Stack flexGrow={1} gap={1}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="subtitle2">
                                    {product?.productName}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                    {fCurrency(totalPrice)}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" gap={2} alignItems="center">
                                  <Stack direction="row" gap={1} flexWrap="wrap">
                                    {product?.variations?.map((v, j) => (
                                      <Stack key={`var-${j}`}>
                                        <Typography variant="caption">
                                          {v?.variationName}
                                        </Typography>
                                        <Label color="default" sx={{ fontSize: '11px' }}>
                                          {v?.variationTypeName}
                                        </Label>
                                      </Stack>
                                    ))}
                                  </Stack>

                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={0.5}
                                    sx={{
                                      border: `1px solid ${theme.palette.grey[300]}`,
                                      borderRadius: 0.75,
                                      bgcolor: theme.palette.grey[50],
                                      p: 0.25,
                                    }}
                                  >
                                    <IconButton
                                      onClick={() => handleQuantityChange(configId, -1)}
                                      disabled={
                                        itemIndex === -1 ||
                                        !values.returnItems[itemIndex]?.isSelected ||
                                        values.returnItems[itemIndex]?.returnQuantity <= 1
                                      }
                                      size="small"
                                      sx={{
                                        bgcolor: theme.palette.grey[200],
                                        '&:hover': { bgcolor: theme.palette.grey[300] },
                                        borderRadius: 0.5,
                                        p: 0.5,
                                      }}
                                      aria-label="Decrease quantity"
                                    >
                                      <Iconify icon="mdi:minus" sx={{ fontSize: '14px' }} />
                                    </IconButton>

                                    <Typography
                                      sx={{
                                        width: '30px',
                                        textAlign: 'center',
                                        fontSize: '0.875rem',
                                        fontWeight: 'medium',
                                        color: theme.palette.text.primary,
                                      }}
                                    >
                                      {returnQuantity}
                                    </Typography>

                                    <IconButton
                                      onClick={() => handleQuantityChange(configId, 1)}
                                      disabled={
                                        itemIndex === -1 ||
                                        !values.returnItems[itemIndex]?.isSelected ||
                                        values.returnItems[itemIndex]?.returnQuantity >=
                                          product?.cartQuantity
                                      }
                                      size="small"
                                      sx={{
                                        bgcolor: theme.palette.grey[200],
                                        '&:hover': { bgcolor: theme.palette.grey[300] },
                                        borderRadius: 0.5,
                                        p: 0.5,
                                      }}
                                      aria-label="Increase quantity"
                                    >
                                      <Iconify icon="mdi:plus" sx={{ fontSize: '14px' }} />
                                    </IconButton>
                                  </Stack>
                                </Stack>

                                <Box sx={{ fontSize: '12px' }}>
                                  {fCurrency(product?.productPrice)} per item
                                </Box>
                                {product?.diamondDetail ? (
                                  <>
                                    <Typography variant="subtitle2" mt={2}>
                                      Diamond Detail
                                    </Typography>
                                    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                                      {helperFunctions
                                        .getDiamondDetailArray(product?.diamondDetail)
                                        .map(({ label, value }, idx) => (
                                          <Stack key={`dia-${idx}`}>
                                            <Typography variant="caption">{label}</Typography>
                                            <Label
                                              color={'default'}
                                              sx={{ width: 'fit-content', fontSize: '11px' }}
                                            >
                                              {value}
                                            </Label>
                                          </Stack>
                                        ))}
                                    </Stack>
                                  </>
                                ) : null}
                              </Stack>
                            </Stack>
                            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                          </React.Fragment>
                        );
                      })}
                      {touched?.returnItems && errors?.returnItems && (
                        <Typography color="error" variant="caption">
                          {errors?.returnItems}
                        </Typography>
                      )}
                      <Stack gap={2} mt={2}>
                        <TextField
                          name="returnReason"
                          label="Return Reason"
                          multiline
                          rows={4}
                          value={values.returnReason}
                          onChange={(e) => setFieldValue('returnReason', e.target.value)}
                          error={touched?.returnReason && !!errors?.returnReason}
                          helperText={touched?.returnReason && errors?.returnReason}
                        />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1">Total Return Amount</Typography>
                          <Typography variant="subtitle1">
                            {fCurrency(calculateTotalReturnAmount())}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end" gap={2}>
                          <Button
                            variant="outlined"
                            disabled={crudReturnLoading}
                            onClick={() => {
                              formik.resetForm();
                              navigate('/orders/list');
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            onClick={handleSubmit}
                            loading={crudReturnLoading}
                          >
                            Submit Return
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </Container>
        )
      )}
      {Object.keys(selectedOrder)?.length === 0 && !ordersLoading && (
        <NoData>No Order found</NoData>
      )}
    </>
  );
};

export default ReturnRequestPage;
