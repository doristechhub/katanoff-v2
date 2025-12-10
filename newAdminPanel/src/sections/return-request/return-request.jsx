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
import { FileDrop } from 'src/components/file-drop';

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
    returnRequestImageFiles: Yup.array()
      .max(5, "You can upload maximum 5 images")
  });

  const getSelectedProducts = (returnItems) => {
    const products = returnItems
      ?.filter((item) => item?.isSelected)
      ?.map((item) => {
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
    return products;
  };

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
      returnRequestImageFiles: [],
      returnRequestPreviewImages: [],
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const selectedProducts = getSelectedProducts(values.returnItems);
        const returnData = {
          orderId: selectedOrder?.id,
          products: getProductsArray(selectedProducts),
          returnRequestReason: values.returnReason,
          returnRequestImageFiles: values.returnRequestImageFiles,
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

  const renderReturnRequestTotalSummary = () => {
    const selectedProducts = getSelectedProducts(values.returnItems);

    const productArray = getProductsArray(selectedProducts);
    const { subTotal, discount, salesTax, returnRequestAmount } =
      helperFunctions?.calcReturnPayment(productArray, selectedOrder);

    return (
      <Stack
        gap={0.5}
        sx={{
          marginTop: 1,
          textAlign: { xs: 'left', sm: 'right' },
          width: { xs: '100%', sm: 'auto' },
          minWidth: { sm: '200px' },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Subtotal:</span>
          <span>{subTotal > 0 ? fCurrency(subTotal) : 'N/A'}</span>
        </Typography>
        <Typography
          variant="body2"
          color="error.main"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Discount:</span>
          <span>{discount > 0 ? `-${fCurrency(discount)}` : 'N/A'}</span>
        </Typography>
        <Typography
          variant="body2"
          color="success.main"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Tax:</span>
          <span>{salesTax > 0 ? `+${fCurrency(salesTax)}` : 'N/A'}</span>
        </Typography>
        <Divider />
        <Typography
          variant="caption"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          <span>Estimated Total:</span>
          <span>{returnRequestAmount > 0 ? fCurrency(returnRequestAmount) : 'N/A'}</span>
        </Typography>
      </Stack>
    );
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
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              gap={1}
                              sx={{ py: 2 }}
                            >
                              {/* Checkbox and Image Row for Mobile */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                              >
                                <Checkbox
                                  checked={
                                    itemIndex !== -1 && values.returnItems[itemIndex]?.isSelected
                                      ? true
                                      : false
                                  }
                                  onChange={() => handleCheckboxChange(configId)}
                                />
                                <Box
                                  sx={{
                                    width: { xs: '100px', sm: '150px' },
                                    height: { xs: '100px', sm: '150px' },
                                    flexShrink: 0,
                                  }}
                                >
                                  <ProgressiveImg
                                    src={product?.productImage}
                                    alt={product?.productName}
                                    customClassName="w-full h-full rounded-md"
                                  />
                                </Box>

                                {/* Product Name - Mobile Only */}
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    display: { xs: 'block', sm: 'none' },
                                    flexGrow: 1,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                  }}
                                >
                                  {product?.productName}
                                </Typography>
                              </Stack>

                              <Stack
                                flexGrow={1}
                                gap={1}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                              >
                                {/* Product Info Header - Desktop */}
                                <Stack
                                  direction={{ xs: 'column', sm: 'row' }}
                                  justifyContent="space-between"
                                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                                  gap={{ xs: 1, sm: 0 }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      display: { xs: 'none', sm: 'block' },
                                      fontSize: { xs: '0.875rem', sm: '1rem' },
                                    }}
                                  >
                                    {product?.productName}
                                  </Typography>

                                  {/* Price Section */}
                                  <Stack
                                    spacing={0.5}
                                    sx={{
                                      mt: { xs: 0, sm: 1 },
                                      alignItems: { xs: 'flex-start', sm: 'flex-end' },
                                      width: { xs: '100%', sm: 'auto' },
                                    }}
                                  >
                                    <Typography
                                      textAlign={{ xs: 'left', sm: 'right' }}
                                      variant="body2"
                                      sx={{ fontWeight: 'medium' }}
                                    >
                                      {fCurrency(totalPrice)}
                                    </Typography>
                                    {product?.perQuantityDiscountAmount > 0 ? (
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: { xs: '100%', sm: 'auto' },
                                          minWidth: { sm: '120px' },
                                        }}
                                      >
                                        <Typography variant="caption" color="error.main">
                                          Discount:
                                        </Typography>
                                        <Typography variant="caption" color="error.main">
                                          -
                                          {fCurrency(
                                            product.perQuantityDiscountAmount * returnQuantity
                                          )}
                                        </Typography>
                                      </Stack>
                                    ) : null}
                                    {product?.perQuantitySalesTaxAmount > 0 ? (
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        sx={{
                                          width: { xs: '100%', sm: 'auto' },
                                          minWidth: { sm: '120px' },
                                        }}
                                      >
                                        <Typography variant="caption" color="success.main">
                                          Tax:
                                        </Typography>
                                        <Typography variant="caption" color="success.main">
                                          +
                                          {fCurrency(
                                            product.perQuantitySalesTaxAmount * returnQuantity
                                          )}
                                        </Typography>
                                      </Stack>
                                    ) : null}
                                  </Stack>
                                </Stack>

                                {/* Variations and Quantity Controls */}
                                <Stack
                                  direction={{ xs: 'column', md: 'row' }}
                                  gap={2}
                                  alignItems={{ xs: 'flex-start', md: 'center' }}
                                  sx={{ width: '100%' }}
                                >
                                  {/* Variations */}
                                  <Stack
                                    direction="row"
                                    gap={1}
                                    flexWrap="wrap"
                                    sx={{ flex: { md: 1 } }}
                                  >
                                    {product?.variations?.map((v, j) => (
                                      <Stack key={`var-${j}`}>
                                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                          {v?.variationName}
                                        </Typography>
                                        <Label
                                          color="default"
                                          sx={{
                                            fontSize: { xs: '10px', sm: '11px' },
                                            px: { xs: 0.5, sm: 1 },
                                          }}
                                        >
                                          {v?.variationTypeName}
                                        </Label>
                                      </Stack>
                                    ))}
                                  </Stack>

                                  {/* Quantity Controls */}
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    gap={0.5}
                                    sx={{
                                      border: `1px solid ${theme.palette.grey[300]}`,
                                      borderRadius: 0.75,
                                      bgcolor: theme.palette.grey[50],
                                      p: 0.25,
                                      alignSelf: { xs: 'flex-end', md: 'center' },
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
                                        p: { xs: 0.4, sm: 0.5 },
                                        minWidth: { xs: '28px', sm: '32px' },
                                        minHeight: { xs: '28px', sm: '32px' },
                                      }}
                                      aria-label="Decrease quantity"
                                    >
                                      <Iconify
                                        icon="mdi:minus"
                                        sx={{ fontSize: { xs: '12px', sm: '14px' } }}
                                      />
                                    </IconButton>

                                    <Typography
                                      sx={{
                                        width: { xs: '25px', sm: '30px' },
                                        textAlign: 'center',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
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
                                        p: { xs: 0.4, sm: 0.5 },
                                        minWidth: { xs: '28px', sm: '32px' },
                                        minHeight: { xs: '28px', sm: '32px' },
                                      }}
                                      aria-label="Increase quantity"
                                    >
                                      <Iconify
                                        icon="mdi:plus"
                                        sx={{ fontSize: { xs: '12px', sm: '14px' } }}
                                      />
                                    </IconButton>
                                  </Stack>
                                </Stack>

                                {/* Per Item Price */}
                                <Box
                                  sx={{
                                    fontSize: { xs: '11px', sm: '12px' },
                                    color: theme.palette.text.secondary,
                                  }}
                                >
                                  {fCurrency(product?.productPrice)} per item
                                </Box>

                                {/* Diamond Detail */}
                                {product?.diamondDetail ? (
                                  <>
                                    <Typography
                                      variant="subtitle2"
                                      mt={2}
                                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                    >
                                      Diamond Detail
                                    </Typography>
                                    <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
                                      {helperFunctions
                                        .getDiamondDetailArray(product?.diamondDetail)
                                        .map(({ label, value }, idx) => (
                                          <Stack key={`dia-${idx}`}>
                                            <Typography
                                              variant="caption"
                                              sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                            >
                                              {label}
                                            </Typography>
                                            <Label
                                              color={'default'}
                                              sx={{
                                                width: 'fit-content',
                                                fontSize: { xs: '10px', sm: '11px' },
                                                px: { xs: 0.5, sm: 1 },
                                              }}
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
                          value={values.returnReason}
                          onChange={(e) => setFieldValue('returnReason', e.target.value)}
                          error={touched?.returnReason && !!errors?.returnReason}
                          helperText={touched?.returnReason && errors?.returnReason}
                          sx={{
                            '& .MuiInputBase-root': {
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                          }}
                        />

                        <Grid xs={12} sm={12} md={12} sx={{ marginTop: '0 !important' }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Attach Images
                          </Typography>
                          <FileDrop
                            formik={formik}
                            mediaLimit={5}
                            mediaType="image"
                            fileKey="returnRequestImageFiles"
                            previewKey="returnRequestPreviewImages"
                            loading={crudReturnLoading}
                          />
                        </Grid>

                        {/* Total Summary */}

                        {values.returnItems.some((item) => item.isSelected) && (
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="end"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                          >
                            {renderReturnRequestTotalSummary()}
                          </Stack>
                        )}

                        {/* Action Buttons */}
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="flex-end"
                          gap={2}
                          sx={{ mt: { xs: 2, sm: 0 } }}
                        >
                          <Button
                            variant="outlined"
                            disabled={crudReturnLoading}
                            onClick={() => {
                              formik.resetForm();
                              navigate('/orders/list');
                            }}
                            sx={{
                              order: { xs: 2, sm: 1 },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}
                          >
                            Cancel
                          </Button>
                          <LoadingButton
                            variant="contained"
                            onClick={handleSubmit}
                            loading={crudReturnLoading}
                            sx={{
                              order: { xs: 1, sm: 2 },
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                            }}
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
