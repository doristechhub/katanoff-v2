import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  TextField,
  Typography,
  MenuItem,
  Tooltip,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { createDiscount, getSingleDiscount, updateDiscount } from 'src/actions';
import { setSelectedDiscount, initDiscount } from 'src/store/slices/discountSlice';
import { Button, LoadingButton } from 'src/components/button';
import moment from 'moment';
import Grid from '@mui/material/Unstable_Grid2';
import {
  APPLICATION_METHODS,
  DATE_FORMAT,
  DISCOUNT_DETAILS_TYPES,
  DISCOUNT_TYPES,
  ELIGIBILITY_TYPES,
  PURCHASE_TYPES,
} from 'src/_helpers/constants';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { debounce } from 'lodash';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Discount name is required'),
  discountType: Yup.string()
    .required('Discount type is required')
    .oneOf(
      ['Product Discount', 'Buy X Get Y', 'Order Discount', 'Free Shipping'],
      'Invalid discount type'
    ),
  applicationMethod: Yup.string()
    .required('Application method is required')
    .oneOf(['Code', 'Automatic'], 'Invalid application method'),
  promoCode: Yup.string().when('applicationMethod', {
    is: (value) => value === 'Code',
    then: (schema) => schema.required('Promo code is required for code-based discounts'),
    otherwise: (schema) => schema.nullable(),
  }),
  discountDetails: Yup.object().shape({
    type: Yup.string()
      .required('Discount details type is required')
      .oneOf(['Percentage', 'Fixed'], 'Invalid discount details type'),
    amount: Yup.number()
      .required('Discount amount is required')
      .positive('Discount amount must be greater than 0')
      .when('type', {
        is: (value) => value === 'Percentage',
        then: (schema) => schema.max(100, 'Percentage discount cannot exceed 100%'),
        otherwise: (schema) => schema,
      }),
  }),
  purchaseMode: Yup.string()
    .required('Purchase mode is required')
    .oneOf(['One-Time', 'All'], 'Invalid purchase mode'),
  customerEligibility: Yup.string()
    .required('Customer eligibility is required')
    .oneOf(['Everyone', 'Selected Customers'], 'Invalid customer eligibility'),
  minimumOrderValueType: Yup.string()
    .required('Minimum order value type is required')
    .oneOf(['no_minimum', 'custom'], 'Invalid minimum order value type'),
  minimumOrderValue: Yup.number()
    .required('Minimum order value is required')
    .min(0, 'Minimum order value cannot be negative')
    .when('minimumOrderValueType', {
      is: 'no_minimum',
      then: (schema) => schema.equals([0], 'Minimum order value must be 0 for no minimum'),
      otherwise: (schema) =>
        schema.min(1, 'Minimum order value must be at least 1 for custom amount'),
    }),
  dateRange: Yup.object().shape({
    beginsAtDate: Yup.date()
      .required('Start date is required')
      .typeError('Invalid start date format'),
    beginsAtTime: Yup.date()
      .required('Start time is required')
      .typeError('Invalid start time format'),
    expiresAtDate: Yup.date()
      .nullable()
      .typeError('Invalid expiry date format')
      .test(
        'is-same-or-after-beginsAtDate',
        'Expiry date must be the same as or after start date',
        (value, context) => {
          if (!value) return true; // Allow null (no expiry date)
          const beginsAtDate = context.parent.beginsAtDate;
          return moment(value).isSameOrAfter(moment(beginsAtDate), 'day');
        }
      ),
    expiresAtTime: Yup.date()
      .nullable()
      .typeError('Invalid expiry time format')
      .when(['expiresAtDate', 'beginsAtDate', 'beginsAtTime'], {
        is: (expiresAtDate, beginsAtDate, beginsAtTime) =>
          !!expiresAtDate && moment(expiresAtDate).isSame(moment(beginsAtDate), 'day'),
        then: (schema) =>
          schema
            .required('Expiry time is required when expiry date is the same as start date')
            .test(
              'is-same-or-after-beginsAtTime',
              'Expiry time must be the same as or after start time on the same day',
              (value, context) => {
                if (!value) return false;
                const beginsAtTime = context.parent.beginsAtTime;
                return moment(value).isSameOrAfter(moment(beginsAtTime));
              }
            ),
        otherwise: (schema) =>
          schema.when('expiresAtDate', {
            is: (value) => !!value,
            then: (schema) => schema.required('Expiry time is required when expiry date is set'),
            otherwise: (schema) => schema.nullable(),
          }),
      }),
    beginsAt: Yup.string()
      .required('Start date and time are required')
      .test('is-valid-format', `Start date/time must be in format ${DATE_FORMAT}`, (value) =>
        moment(value, DATE_FORMAT, true).isValid()
      ),
    expiresAt: Yup.string()
      .nullable()
      .test('is-valid-format', `Expiry date/time must be in format ${DATE_FORMAT}`, (value) =>
        value ? moment(value, DATE_FORMAT, true).isValid() : true
      )
      .test(
        'is-same-or-after-beginsAt',
        'Expiry date and time must be the same as or after start date and time',
        (value, context) => {
          if (!value) return true;
          const beginsAt = context?.parent?.beginsAt;
          return moment(value, DATE_FORMAT).isSameOrAfter(moment(beginsAt, DATE_FORMAT));
        }
      ),
  }),
});

const AddDiscountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const discountId = searchParams.get('discountId');
  const { crudDiscountLoading, selectedDiscount } = useSelector(({ discounts }) => discounts);

  const loadData = useCallback(async () => {
    if (discountId) {
      await dispatch(getSingleDiscount(discountId));
    }
  }, [dispatch, discountId]);

  useEffect(() => {
    if (discountId) loadData();
    return () => {
      dispatch(setSelectedDiscount(initDiscount));
    };
  }, [dispatch, discountId, loadData]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...selectedDiscount,
      minimumOrderValueType: selectedDiscount.minimumOrderValue === 0 ? 'no_minimum' : 'custom',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const beginsAtMoment = moment(values?.dateRange?.beginsAtDate).set({
        hour: moment(values?.dateRange?.beginsAtTime).hour(),
        minute: moment(values?.dateRange?.beginsAtTime).minute(),
        second: 0,
        millisecond: 0,
      });
      const beginsAt = beginsAtMoment.format(DATE_FORMAT);

      let expiresAt = null;
      if (values?.dateRange?.expiresAtDate && values?.dateRange?.expiresAtTime) {
        const expiresAtMoment = moment(values?.dateRange?.expiresAtDate).set({
          hour: moment(values?.dateRange?.expiresAtTime).hour(),
          minute: moment(values?.dateRange?.expiresAtTime).minute(),
          second: 0,
          millisecond: 0,
        });
        expiresAt = expiresAtMoment.format(DATE_FORMAT);
      }

      const payload = {
        discountId: values?.discountId,
        name: values?.name,
        discountType: values?.discountType,
        applicationMethod: values?.applicationMethod,
        promoCode: values?.applicationMethod === 'Code' ? values?.promoCode : null,
        discountDetails: values?.discountDetails,
        purchaseMode: values?.purchaseMode,
        customerEligibility: values?.customerEligibility,
        minimumOrderValue: values?.minimumOrderValue,
        dateRange: {
          beginsAt,
          expiresAt,
        },
      };
      const action = values?.discountId ? updateDiscount : createDiscount;
      const res = await dispatch(action(payload));
      if (res) {
        resetForm();
        navigate('/discounts');
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    validateField,
    validateForm,
  } = formik;

  const onCopy = useCallback(async (text) => {
    const res = copy(text, {
      debug: false,
      message: 'Tap to copy',
    });
    if (res) {
      toast('Promo code copied to clipboard', {
        theme: 'light',
        type: 'success',
        position: 'top-center',
      });
    } else {
      toast.error('Failed to copy Text');
    }
  }, []);

  const debouncedValidate = useCallback(
    debounce(async (fields) => {
      for (const field of fields) {
        await validateField(field);
      }
      await validateForm();
    }, 300),
    [validateField, validateForm]
  );

  const handleDateTimeChange = async (field, value) => {
    await setFieldValue(field, value);

    if (field.includes('beginsAt')) {
      const beginsAtDate =
        field === 'dateRange.beginsAtDate' ? value : values?.dateRange.beginsAtDate;
      const beginsAtTime =
        field === 'dateRange.beginsAtTime' ? value : values?.dateRange.beginsAtTime;

      if (beginsAtDate && beginsAtTime) {
        const beginsAtMoment = moment(beginsAtDate).set({
          hour: moment(beginsAtTime).hour(),
          minute: moment(beginsAtTime).minute(),
          second: 0,
          millisecond: 0,
        });
        await setFieldValue('dateRange.beginsAt', beginsAtMoment.format(DATE_FORMAT));
      } else {
        await setFieldValue('dateRange.beginsAt', '');
      }
      debouncedValidate([
        'dateRange.beginsAtDate',
        'dateRange.beginsAtTime',
        'dateRange.beginsAt',
        'dateRange.expiresAtDate',
        'dateRange.expiresAtTime',
        'dateRange.expiresAt',
      ]);
    }

    if (field.includes('expiresAt')) {
      const expiresAtDate =
        field === 'dateRange.expiresAtDate' ? value : values?.dateRange.expiresAtDate;
      const expiresAtTime =
        field === 'dateRange.expiresAtTime' ? value : values?.dateRange.expiresAtTime;

      if (expiresAtDate && expiresAtTime) {
        const expiresAtMoment = moment(expiresAtDate).set({
          hour: moment(expiresAtTime).hour(),
          minute: moment(expiresAtTime).minute(),
          second: 0,
          millisecond: 0,
        });
        await setFieldValue('dateRange.expiresAt', expiresAtMoment.format(DATE_FORMAT));
      } else {
        await setFieldValue('dateRange.expiresAt', null);
        if (field === 'dateRange.expiresAtDate' && !value) {
          await setFieldValue('dateRange.expiresAtTime', null);
        }
      }
      debouncedValidate([
        'dateRange.beginsAtDate',
        'dateRange.beginsAtTime',
        'dateRange.beginsAt',
        'dateRange.expiresAtDate',
        'dateRange.expiresAtTime',
        'dateRange.expiresAt',
      ]);
    }
  };

  const handleInputClick = (event) => {
    event.target.select();
  };

  const handleWheel = (event) => {
    event.target.blur();
  };

  const handleMinimumOrderValueTypeChange = async (event) => {
    const value = event.target.value;
    await setFieldValue('minimumOrderValueType', value);
    if (value === 'no_minimum') {
      await setFieldValue('minimumOrderValue', 0);
    } else {
      await setFieldValue('minimumOrderValue', values.minimumOrderValue || '');
    }
    debouncedValidate(['minimumOrderValueType', 'minimumOrderValue']);
  };

  return (
    <Container>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">{discountId ? 'Update Discount' : 'Create Discount'}</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={8} md={8}>
          <form onSubmit={handleSubmit}>
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={12}>
                  <TextField
                    select
                    fullWidth
                    name="discountType"
                    label="Discount Type"
                    value={values?.discountType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.discountType && !!errors.discountType}
                    helperText={touched.discountType && errors.discountType}
                  >
                    {DISCOUNT_TYPES.map((type) => (
                      <MenuItem key={type?.value} value={type?.value} disabled={type?.disabled}>
                        {type?.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={12}>
                  <TextField
                    select
                    fullWidth
                    name="applicationMethod"
                    label="Method"
                    value={values?.applicationMethod}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.applicationMethod && !!errors.applicationMethod}
                    helperText={touched.applicationMethod && errors.applicationMethod}
                  >
                    {APPLICATION_METHODS.map((method) => (
                      <MenuItem
                        key={method?.value}
                        value={method?.value}
                        disabled={method?.disabled}
                      >
                        {method?.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Discount Name"
                    value={values?.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="promoCode"
                    label="Promo Code"
                    value={values?.promoCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.promoCode && !!errors.promoCode}
                    helperText={touched.promoCode && errors.promoCode}
                    disabled={values?.applicationMethod !== 'Code'}
                  />
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    name="discountDetails.type"
                    label="Discount Value"
                    value={values?.discountDetails.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.discountDetails?.type && !!errors.discountDetails?.type}
                    helperText={touched.discountDetails?.type && errors.discountDetails?.type}
                  >
                    {DISCOUNT_DETAILS_TYPES.map((type) => (
                      <MenuItem key={type?.value} value={type?.value} disabled={type?.disabled}>
                        {type?.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    name="discountDetails.amount"
                    label={`Discount ${values?.discountDetails.type === 'Percentage' ? '(%)' : 'Amount ($)'}`}
                    onClick={handleInputClick}
                    onWheel={handleWheel}
                    value={values?.discountDetails.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.discountDetails?.amount && !!errors.discountDetails?.amount}
                    helperText={touched.discountDetails?.amount && errors.discountDetails?.amount}
                  />
                </Grid>
                <Grid xs={12} sm={12}>
                  <TextField
                    select
                    fullWidth
                    name="purchaseMode"
                    label="Purchase Type"
                    value={values?.purchaseMode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.purchaseMode && !!errors.purchaseMode}
                    helperText={touched.purchaseMode && errors.purchaseMode}
                  >
                    {PURCHASE_TYPES.map((mode) => (
                      <MenuItem key={mode?.value} value={mode?.value} disabled={mode?.disabled}>
                        {mode?.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Customer Eligibility</FormLabel>
                    <RadioGroup
                      column={'true'}
                      name="customerEligibility"
                      value={values?.customerEligibility || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {ELIGIBILITY_TYPES.map((eligibility) => (
                        <FormControlLabel
                          key={eligibility?.value}
                          value={eligibility?.value}
                          control={<Radio />}
                          label={eligibility?.label}
                          disabled={eligibility?.disabled}
                        />
                      ))}
                    </RadioGroup>
                    {touched.customerEligibility && errors.customerEligibility && (
                      <Typography color="error" variant="caption">
                        {errors.customerEligibility}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Minimum Order Amount</FormLabel>
                    <RadioGroup
                      column={'true'}
                      name="minimumOrderValueType"
                      value={values?.minimumOrderValueType || 'no_minimum'}
                      onChange={handleMinimumOrderValueTypeChange}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel
                        value="no_minimum"
                        control={<Radio />}
                        label="No minimum requirements"
                      />
                      <FormControlLabel
                        value="custom"
                        control={<Radio />}
                        label="Minimum purchase amount ($)"
                      />
                    </RadioGroup>
                    {values?.minimumOrderValueType === 'custom' && (
                      <TextField
                        fullWidth
                        type="number"
                        name="minimumOrderValue"
                        label="Minimum Purchase Amount ($)"
                        value={values?.minimumOrderValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={handleInputClick}
                        onWheel={handleWheel}
                        error={touched.minimumOrderValue && !!errors.minimumOrderValue}
                        helperText={touched.minimumOrderValue && errors.minimumOrderValue}
                        sx={{ mt: 2 }}
                      />
                    )}
                    {touched.minimumOrderValueType && errors.minimumOrderValueType && (
                      <Typography color="error" variant="caption">
                        {errors.minimumOrderValueType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Card>
            <Card sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Start Date"
                        value={values?.dateRange.beginsAtDate}
                        onChange={(value) => handleDateTimeChange('dateRange.beginsAtDate', value)}
                        slotProps={{
                          textField: {
                            error:
                              (touched.dateRange?.beginsAtDate &&
                                !!errors.dateRange?.beginsAtDate) ||
                              (touched.dateRange?.beginsAt && !!errors.dateRange?.beginsAt),
                            helperText:
                              (touched.dateRange?.beginsAtDate && errors.dateRange?.beginsAtDate) ||
                              (touched.dateRange?.beginsAt && errors.dateRange?.beginsAt),
                          },
                          actionBar: {
                            actions: ['clear'],
                          },
                        }}
                        sx={{ width: '100%' }}
                        // minDate={discountId ? null : new Date()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['TimePicker']}>
                      <TimePicker
                        label="Start Time"
                        value={values?.dateRange.beginsAtTime}
                        onChange={(value) => handleDateTimeChange('dateRange.beginsAtTime', value)}
                        ampm={false}
                        slotProps={{
                          textField: {
                            error:
                              (touched.dateRange?.beginsAtTime &&
                                !!errors.dateRange?.beginsAtTime) ||
                              (touched.dateRange?.beginsAt && !!errors.dateRange?.beginsAt),
                            helperText:
                              (touched.dateRange?.beginsAtTime && errors.dateRange?.beginsAtTime) ||
                              (touched.dateRange?.beginsAt && errors.dateRange?.beginsAt),
                          },
                          actionBar: {
                            actions: ['clear'],
                          },
                        }}
                        sx={{ width: '100%' }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker
                        label="Expiry Date"
                        value={values?.dateRange.expiresAtDate}
                        onChange={(value) => handleDateTimeChange('dateRange.expiresAtDate', value)}
                        slotProps={{
                          textField: {
                            error:
                              (touched.dateRange?.expiresAtDate &&
                                !!errors.dateRange?.expiresAtDate) ||
                              (touched.dateRange?.expiresAt && !!errors.dateRange?.expiresAt),
                            helperText:
                              (touched.dateRange?.expiresAtDate &&
                                errors.dateRange?.expiresAtDate) ||
                              (touched.dateRange?.expiresAt && errors.dateRange?.expiresAt),
                          },
                          actionBar: {
                            actions: ['clear'],
                          },
                        }}
                        sx={{ width: '100%' }}
                        minDate={values?.dateRange.beginsAtDate || (discountId ? null : new Date())}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['TimePicker']}>
                      <TimePicker
                        label="Expiry Time"
                        value={values?.dateRange.expiresAtTime}
                        onChange={(value) => handleDateTimeChange('dateRange.expiresAtTime', value)}
                        ampm={false}
                        slotProps={{
                          textField: {
                            error:
                              (touched.dateRange?.expiresAtTime &&
                                !!errors.dateRange?.expiresAtTime) ||
                              (touched.dateRange?.expiresAt && !!errors.dateRange?.expiresAt),
                            helperText:
                              (touched.dateRange?.expiresAtTime &&
                                errors.dateRange?.expiresAtTime) ||
                              (touched.dateRange?.expiresAt && errors.dateRange?.expiresAt),
                          },
                          actionBar: {
                            actions: ['clear'],
                          },
                        }}
                        sx={{ width: '100%' }}
                        disabled={!values?.dateRange.expiresAtDate}
                        minTime={
                          values?.dateRange.expiresAtDate &&
                          moment(values?.dateRange.expiresAtDate).isSame(
                            moment(values?.dateRange.beginsAtDate),
                            'day'
                          )
                            ? values?.dateRange.beginsAtTime
                            : null
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Card>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/discounts')}
                disabled={isSubmitting || crudDiscountLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting || crudDiscountLoading}
              >
                {discountId ? 'Update' : 'Save'}
              </LoadingButton>
            </Box>
          </form>
        </Grid>
        <Grid xs={12} sm={4} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'grey.50',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {values?.promoCode || 'No promo code yet'}
              </Typography>
              {values?.promoCode && (
                <Tooltip title="Copy">
                  <IconButton
                    sx={{
                      bgcolor: 'grey.100',
                      '&:hover': {
                        bgcolor: 'grey.200',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s',
                      },
                    }}
                    onClick={() => onCopy(values?.promoCode)}
                  >
                    <Iconify icon="fluent:copy-16-regular" width={20} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}
              >
                Application Method
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {values?.applicationMethod || 'Not set'}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}
              >
                Discount Type
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {DISCOUNT_TYPES?.find((type) => type?.value === values?.discountType)?.label ||
                  'Not set'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Discount Details
              </Typography>
              <List
                dense
                sx={{
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  p: 1,
                }}
              >
                {[
                  { icon: 'mdi:store', text: 'For Online Store' },
                  {
                    icon: 'mdi:cart',
                    text: `Applies to ${values?.purchaseMode?.toLowerCase() || 'all'} purchases`,
                  },
                  {
                    icon: 'mdi:account-group',
                    text: `${values?.customerEligibility || 'Everyone'} eligible`,
                  },
                  {
                    icon: 'mdi:currency-usd',
                    text: `Minimum purchase: ${values?.minimumOrderValue || 'None'}`,
                  },
                  { icon: 'mdi:infinity', text: 'No usage limits' },
                  { icon: 'mdi:link-off', text: 'Can’t combine with other discounts' },
                  {
                    icon: 'mdi:calendar',
                    text: `Active from ${
                      values?.dateRange.beginsAt &&
                      moment(values?.dateRange.beginsAt, DATE_FORMAT).isSame(moment(), 'day')
                        ? 'today'
                        : moment(values?.dateRange.beginsAt, DATE_FORMAT).format('MMM D')
                    }${
                      values?.dateRange.expiresAt
                        ? ` until ${moment(values?.dateRange.expiresAt, DATE_FORMAT).format('MMM D')}`
                        : ''
                    }`,
                  },
                ].map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      py: 1,
                      px: 1,
                      '&:hover': {
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        transition: 'background-color 0.2s',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Iconify icon={item.icon} width={20} sx={{ color: 'text.secondary' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: { color: 'text.primary', fontWeight: 400 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddDiscountPage;
