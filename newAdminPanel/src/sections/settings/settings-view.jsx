import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { Button, LoadingButton } from '../../components/button';
import {
  Box,
  Container,
  TextField,
  Typography,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
} from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  upsertPriceMultiplier,
  fetchPriceMultiplier,
  fetchCustomizedSettings,
  upsertCustomizedSettings,
} from 'src/actions/settingsAction';
import { ALLOWED_DIA_COLORS, ALLOWED_DIA_CLARITIES } from 'src/_helpers/constants';
import { error, primary } from 'src/theme/palette';
import Iconify from 'src/components/iconify';

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

const allowedColorValues = ALLOWED_DIA_COLORS.map((color) => color.value);
const allowedClarityValues = ALLOWED_DIA_CLARITIES.map((clarity) => clarity.value);

// Validation schema for non-customized settings
const validationSchemaNonCustomized = Yup.object().shape({
  priceMultiplier: Yup.number()
    .required('Required')
    .typeError('Must be a number')
    .min(0.01, 'Must be at least 0.01')
    .positive('Must be positive')
    .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
});

// Validation schema for customized settings
const validationSchemaCustomized = Yup.object().shape({
  customProductPriceMultiplier: Yup.number()
    .required('Required')
    .typeError('Must be a number')
    .min(0.01, 'Must be at least 0.01')
    .positive('Must be positive')
    .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
  sideDiamondPricePerCarat: Yup.number()
    .required('Required')
    .typeError('Must be a number')
    .min(0, 'Must be non-negative')
    .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
  metalPricePerGram: Yup.number()
    .required('Required')
    .typeError('Must be a number')
    .min(0, 'Must be non-negative')
    .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
  diamondColors: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('ID required'),
        compatibleOptions: Yup.array()
          .of(
            Yup.string().oneOf(
              allowedColorValues,
              `Must be one of: ${allowedColorValues.join(', ')}`
            )
          )
          .min(1, 'At least one compatible color required')
          .test(
            'no-duplicates',
            'Duplicate compatible colors',
            (value) => new Set(value).size === value.length
          ),
        pricePerCarat: Yup.number()
          .required('Required')
          .typeError('Must be a number')
          .min(0, 'Must be non-negative')
          .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
      })
    )
    .test('no-duplicate-ids', 'Duplicate diamond color', (value) => {
      if (!value) return true;
      return new Set(value.map((item) => item.id)).size === value.length;
    })
    .test('no-duplicate-options', 'Duplicate compatible colors across items', (value) => {
      if (!value) return true;
      const allOptions = value.flatMap((item) => item.compatibleOptions);
      return new Set(allOptions).size === allOptions.length;
    }),
  diamondClarities: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('ID required'),
        compatibleOptions: Yup.array()
          .of(
            Yup.string().oneOf(
              allowedClarityValues,
              `Must be one of: ${allowedClarityValues.join(', ')}`
            )
          )
          .min(1, 'At least one compatible clarity required')
          .test(
            'no-duplicates',
            'Duplicate compatible clarities',
            (value) => new Set(value).size === value.length
          ),
        pricePerCarat: Yup.number()
          .required('Required')
          .typeError('Must be a number')
          .min(0, 'Must be non-negative')
          .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
      })
    )
    .test('no-duplicate-ids', 'Duplicate diamond clarity', (value) => {
      if (!value) return true;
      return new Set(value.map((item) => item.id)).size === value.length;
    })
    .test('no-duplicate-options', 'Duplicate compatible clarities across items', (value) => {
      if (!value) return true;
      const allOptions = value.flatMap((item) => item.compatibleOptions);
      return new Set(allOptions).size === allOptions.length;
    }),
  caratRanges: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required('ID required'),
        minCarat: Yup.number()
          .required('Required')
          .typeError('Must be a number')
          .min(0, 'Must be non-negative')
          .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
        maxCarat: Yup.number()
          .required('Required')
          .typeError('Must be a number')
          .min(0, 'Must be non-negative')
          .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0))
          .when('minCarat', (minCarat, schema) =>
            schema.test(
              'max-greater-than-min',
              'Max carat must be greater than min',
              (value) => value > minCarat
            )
          ),
        pricePerCarat: Yup.number()
          .required('Required')
          .typeError('Must be a number')
          .min(0, 'Must be non-negative')
          .transform((value) => (value ? Number(parseFloat(value).toFixed(2)) : 0)),
      })
    )
    .test('no-duplicate-ranges', 'Duplicate carat ranges', (value) => {
      if (!value) return true;
      const ranges = value.map((item) => `${item.minCarat}-${item.maxCarat}`);
      return new Set(ranges).size === ranges.length;
    })
    .test('no-overlapping-ranges', 'Overlapping carat ranges', (value) => {
      if (!value) return true;
      for (let i = 0; i < value.length; i++) {
        for (let j = i + 1; j < value.length; j++) {
          const { minCarat: min1, maxCarat: max1 } = value[i];
          const { minCarat: min2, maxCarat: max2 } = value[j];
          if (
            (min1 >= min2 && min1 <= max2) ||
            (max1 >= min2 && max1 <= max2) ||
            (min1 <= min2 && max1 >= max2)
          ) {
            return false;
          }
        }
      }
      return true;
    }),
});

const SettingsViewPage = () => {
  const dispatch = useDispatch();
  const {
    priceMultiplier,
    customizedSettings,
    nonCustomizedLoading,
    customizedLoading,
    nonCustomizedError,
    customizedError,
  } = useSelector(({ settings }) => settings);

  useEffect(() => {
    dispatch(fetchPriceMultiplier());
    dispatch(fetchCustomizedSettings());
  }, [dispatch]);

  // Formik for Non-Customized Settings
  const formikNonCustomized = useFormik({
    enableReinitialize: true,
    initialValues: {
      priceMultiplier: priceMultiplier ? Number(parseFloat(priceMultiplier).toFixed(2)) : 1,
    },
    validationSchema: validationSchemaNonCustomized,
    onSubmit: async (values, { setSubmitting }) => {
      await dispatch(upsertPriceMultiplier({ priceMultiplier: values.priceMultiplier }));
      setSubmitting(false);
    },
  });

  // Formik for Customized Settings
  const formikCustomized = useFormik({
    enableReinitialize: true,
    initialValues: customizedSettings,
    validationSchema: validationSchemaCustomized,
    onSubmit: async (values, { setSubmitting }) => {
      await dispatch(upsertCustomizedSettings(values));
      setSubmitting(false);
    },
  });

  const handleInputClick = useCallback((event) => event?.target?.select(), []);
  const handleWheel = useCallback((event) => event?.target?.blur(), []);

  const handlePositivePriceChange = useCallback((e, field, formik) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) >= 0) {
      formik.setFieldValue(field, value === '' ? '' : Number(parseFloat(value).toFixed(2)));
    }
  }, []);

  const handleAddItem = useCallback(
    async (field) => {
      if (!['diamondColors', 'diamondClarities', 'caratRanges'].includes(field)) {
        return;
      }

      formikCustomized.setSubmitting(true);

      // Check if there are any validation errors in the specified field
      if (formikCustomized.errors[field]) {
        formikCustomized.handleSubmit();
        // For example, using a toast or alert (you can integrate a library like react-toastify)
        console.log(`Cannot add new item to ${field}. Please fix existing errors.`);
        return;
      }
      // Prevent adding new item if there are validation errors for the field
      if (formikCustomized.errors[field]) return;

      const newItem = { id: `new-${Date.now()}`, compatibleOptions: [], pricePerCarat: 0 };
      if (field === 'caratRanges') {
        newItem.minCarat = 0;
        newItem.maxCarat = 0;
      }

      const currentFieldValues = formikCustomized.values[field] || [];
      formikCustomized.setFieldValue(field, [...currentFieldValues, newItem]);
    },
    [formikCustomized]
  );
  const handleRemoveItem = useCallback(
    (field, index) => {
      formikCustomized.setFieldValue(
        field,
        formikCustomized.values[field].filter((_, i) => i !== index)
      );
    },
    [formikCustomized]
  );

  const renderTable = (field, title, options, optionType) => {
    // Check if the field has no data
    if (!formikCustomized.values[field] || formikCustomized.values[field].length === 0) {
      return (
        <Box sx={{ mb: 3 }}>
          <Stack sx={{ mb: 2 }} direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Button
              sx={{
                width: 'fit-content',
                border: `none !important`,
                color: `${primary?.main} !important`,
                backgroundColor: `transparent !important`,
                ':hover': {
                  border: `none !important`,
                  boxShadow: 'none !important',
                  backgroundColor: `${primary?.lighter} !important`,
                },
                ':disabled': {
                  opacity: 0.7,
                },
              }}
              onClick={() => handleAddItem(field)}
              disabled={!!formikCustomized.errors[field]}
              startIcon={<Iconify icon="lucide:circle-plus" />}
            >
              Add{' '}
              {title === 'Carat Ranges'
                ? 'Carat Range'
                : title === 'Diamond Colors'
                  ? 'Color'
                  : 'Clarity'}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            No {title.toLowerCase()} data available
          </Typography>
        </Box>
      );
    }

    // Existing renderTable logic for when data exists
    const allSelectedOptions = formikCustomized.values[field]
      .flatMap((item) => item.compatibleOptions)
      .filter((opt, index, self) => self.indexOf(opt) === index);

    return (
      <Box sx={{ mb: 3 }}>
        <Stack sx={{ mb: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Button
            sx={{
              width: 'fit-content',
              border: `none !important`,
              color: `${primary?.main} !important`,
              backgroundColor: `transparent !important`,
              ':hover': {
                border: `none !important`,
                boxShadow: 'none !important',
                backgroundColor: `${primary?.lighter} !important`,
              },
              ':disabled': {
                opacity: 0.7,
              },
            }}
            onClick={() => handleAddItem(field)}
            disabled={!!formikCustomized.errors[field]}
            startIcon={<Iconify icon="lucide:circle-plus" />}
          >
            Add{' '}
            {title === 'Carat Ranges'
              ? 'Carat Range'
              : title === 'Diamond Colors'
                ? 'Color'
                : 'Clarity'}
          </Button>
        </Stack>
        <Table>
          <TableHead>
            <TableRow>
              {optionType === 'caratRanges' ? <TableCell> Min Carat</TableCell> : null}
              {optionType !== 'caratRanges' && <TableCell>Compatible Options</TableCell>}
              {optionType === 'caratRanges' && <TableCell>Max Carat</TableCell>}
              <TableCell>Price Per Carat</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formikCustomized.values[field].map((item, index) => (
              <TableRow key={item.id}>
                {optionType === 'caratRanges' ? (
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.minCarat}
                      onChange={(e) =>
                        handlePositivePriceChange(
                          e,
                          `${field}[${index}].minCarat`,
                          formikCustomized
                        )
                      }
                      onClick={handleInputClick}
                      onWheel={handleWheel}
                      error={
                        !!formikCustomized.touched[field]?.[index]?.minCarat &&
                        !!formikCustomized.errors[field]?.[index]?.minCarat
                      }
                      FormHelperTextProps={{ sx: { marginLeft: 0 } }}
                    />
                    {formikCustomized.touched[field]?.[index]?.minCarat &&
                      formikCustomized.errors[field]?.[index]?.minCarat && (
                        <Typography color="error" variant="caption" sx={{ ml: 0, mt: 1 }}>
                          {formikCustomized.errors[field][index].minCarat}
                        </Typography>
                      )}
                  </TableCell>
                ) : null}
                {optionType !== 'caratRanges' && (
                  <TableCell>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id={`${field}-${index}-compatible-options`}>
                        Compatible Options
                      </InputLabel>
                      <Select
                        multiple
                        labelId={`${field}-${index}-compatible-options`}
                        value={item.compatibleOptions}
                        onChange={(e) =>
                          formikCustomized.setFieldValue(
                            `${field}[${index}].compatibleOptions`,
                            e.target.value
                          )
                        }
                        input={<OutlinedInput label="Compatible Options" />}
                        MenuProps={MenuProps}
                        renderValue={(selected) =>
                          options
                            .filter((opt) => selected.includes(opt.value))
                            .map((opt) => opt.title)
                            .join(', ')
                        }
                        error={
                          !!formikCustomized.touched[field]?.[index]?.compatibleOptions &&
                          !!formikCustomized.errors[field]?.[index]?.compatibleOptions
                        }
                      >
                        {options.map((opt) => (
                          <MenuItem
                            key={opt.value}
                            value={opt.value}
                            disabled={
                              allSelectedOptions.includes(opt.value) &&
                              !item.compatibleOptions.includes(opt.value)
                            }
                          >
                            <ListItemText primary={opt.title} />
                          </MenuItem>
                        ))}
                      </Select>
                      {formikCustomized.touched[field]?.[index]?.compatibleOptions &&
                        formikCustomized.errors[field]?.[index]?.compatibleOptions && (
                          <Typography color="error" variant="caption" sx={{ ml: 0, mt: 1 }}>
                            {formikCustomized.errors[field][index].compatibleOptions}
                          </Typography>
                        )}
                    </FormControl>
                  </TableCell>
                )}
                {optionType === 'caratRanges' && (
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.maxCarat}
                      onChange={(e) =>
                        handlePositivePriceChange(
                          e,
                          `${field}[${index}].maxCarat`,
                          formikCustomized
                        )
                      }
                      onClick={handleInputClick}
                      onWheel={handleWheel}
                      error={
                        !!formikCustomized.touched[field]?.[index]?.maxCarat &&
                        !!formikCustomized.errors[field]?.[index]?.maxCarat
                      }
                      FormHelperTextProps={{ sx: { marginLeft: 0 } }}
                    />
                    {formikCustomized.touched[field]?.[index]?.maxCarat &&
                      formikCustomized.errors[field]?.[index]?.maxCarat && (
                        <Typography color="error" variant="caption" sx={{ ml: 0, mt: 1 }}>
                          {formikCustomized.errors[field][index].maxCarat}
                        </Typography>
                      )}
                  </TableCell>
                )}
                <TableCell>
                  <TextField
                    type="number"
                    value={item.pricePerCarat}
                    onChange={(e) =>
                      handlePositivePriceChange(
                        e,
                        `${field}[${index}].pricePerCarat`,
                        formikCustomized
                      )
                    }
                    onClick={handleInputClick}
                    onWheel={handleWheel}
                    error={
                      !!formikCustomized.touched[field]?.[index]?.pricePerCarat &&
                      !!formikCustomized.errors[field]?.[index]?.pricePerCarat
                    }
                    FormHelperTextProps={{ sx: { marginLeft: 0 } }}
                  />
                  {formikCustomized.touched[field]?.[index]?.pricePerCarat &&
                    formikCustomized.errors[field]?.[index]?.pricePerCarat && (
                      <Typography color="error" variant="caption" sx={{ ml: 0, mt: 1 }}>
                        {formikCustomized.errors[field][index].pricePerCarat}
                      </Typography>
                    )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    sx={{
                      padding: '5px !important',
                      minWidth: '30px !important',
                      border: `none !important`,
                      color: `${error?.main} !important`,
                      ':hover': {
                        backgroundColor: `${error?.lighter} !important`,
                        border: `none !important`,
                        boxShadow: 'none !important',
                      },
                      ':disabled': {
                        opacity: 0.7,
                      },
                    }}
                    onClick={() => handleRemoveItem(field, index)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {formikCustomized.touched[field] &&
          formikCustomized.errors[field] &&
          typeof formikCustomized.errors[field] === 'string' && (
            <Typography color="error" variant="caption">
              {formikCustomized.errors[field]}
            </Typography>
          )}
      </Box>
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>
      {/* Non-Customized Settings Form */}
      <Box component="form" onSubmit={formikNonCustomized.handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Non-Customized Settings
        </Typography>
        {nonCustomizedError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {nonCustomizedError}
          </Alert>
        )}
        <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 3 }}>
          <TextField
            type="number"
            name="priceMultiplier"
            label="Price Multiplier"
            onBlur={formikNonCustomized.handleBlur}
            onChange={(e) => handlePositivePriceChange(e, 'priceMultiplier', formikNonCustomized)}
            onClick={handleInputClick}
            onWheel={handleWheel}
            value={formikNonCustomized.values.priceMultiplier}
            error={
              !!formikNonCustomized.touched.priceMultiplier &&
              !!formikNonCustomized.errors.priceMultiplier
            }
            helperText={
              formikNonCustomized.touched.priceMultiplier &&
              formikNonCustomized.errors.priceMultiplier
            }
            sx={{ maxWidth: 200 }}
          />
          <LoadingButton
            type="submit"
            size="medium"
            variant="contained"
            loading={nonCustomizedLoading}
            disabled={formikNonCustomized.isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
        <Alert sx={{ mt: 2 }} severity="info">
          The value you set here will automatically be multiplied with the base price of all
          pre-designed products whose price calculate with automatic mode.
        </Alert>
      </Box>

      {/* Customized Settings Form */}
      <Box component="form" onSubmit={formikCustomized.handleSubmit}>
        <Stack sx={{ mb: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Customized Settings</Typography>
          <LoadingButton
            type="submit"
            size="medium"
            variant="contained"
            loading={customizedLoading}
            disabled={customizedLoading || formikCustomized.isSubmitting}
          >
            Save
          </LoadingButton>
        </Stack>
        {customizedError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {customizedError}
          </Alert>
        )}
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} display="flex" flexDirection="column" gap={5}>
              <Typography variant="subtitle1">Pricing Details</Typography>
              <TextField
                type="number"
                name="customProductPriceMultiplier"
                label="Price Multiplier"
                onBlur={formikCustomized.handleBlur}
                onChange={(e) =>
                  handlePositivePriceChange(e, 'customProductPriceMultiplier', formikCustomized)
                }
                onClick={handleInputClick}
                onWheel={handleWheel}
                value={formikCustomized.values.customProductPriceMultiplier}
                error={
                  !!formikCustomized.touched.customProductPriceMultiplier &&
                  !!formikCustomized.errors.customProductPriceMultiplier
                }
                helperText={
                  formikCustomized.touched.customProductPriceMultiplier &&
                  formikCustomized.errors.customProductPriceMultiplier
                }
                fullWidth
              />
              <TextField
                type="number"
                name="sideDiamondPricePerCarat"
                label="Side Diamond Price (Per Carat)"
                onBlur={formikCustomized.handleBlur}
                onChange={(e) =>
                  handlePositivePriceChange(e, 'sideDiamondPricePerCarat', formikCustomized)
                }
                onClick={handleInputClick}
                onWheel={handleWheel}
                value={formikCustomized.values.sideDiamondPricePerCarat}
                error={
                  !!formikCustomized.touched.sideDiamondPricePerCarat &&
                  !!formikCustomized.errors.sideDiamondPricePerCarat
                }
                helperText={
                  formikCustomized.touched.sideDiamondPricePerCarat &&
                  formikCustomized.errors.sideDiamondPricePerCarat
                }
                fullWidth
              />
              <TextField
                type="number"
                name="metalPricePerGram"
                label="Metal Price (Per Gram)"
                onBlur={formikCustomized.handleBlur}
                onChange={(e) =>
                  handlePositivePriceChange(e, 'metalPricePerGram', formikCustomized)
                }
                onClick={handleInputClick}
                onWheel={handleWheel}
                value={formikCustomized.values.metalPricePerGram}
                error={
                  !!formikCustomized.touched.metalPricePerGram &&
                  !!formikCustomized.errors.metalPricePerGram
                }
                helperText={
                  formikCustomized.touched.metalPricePerGram &&
                  formikCustomized.errors.metalPricePerGram
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTable('caratRanges', 'Carat Ranges', [], 'caratRanges')}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderTable('diamondColors', 'Diamond Colors', ALLOWED_DIA_COLORS, 'Diamond Color')}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderTable(
                'diamondClarities',
                'Diamond Clarities',
                ALLOWED_DIA_CLARITIES,
                'Diamond Clarity'
              )}
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </Container>
  );
};

export default SettingsViewPage;
