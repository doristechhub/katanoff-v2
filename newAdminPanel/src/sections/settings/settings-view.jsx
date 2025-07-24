import * as Yup from 'yup';
import { useCallback, useEffect } from 'react';
import { LoadingButton } from '../../components/button';
import { Box, Container, TextField, Typography, Stack, Alert } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { upsertPriceMultiplier, fetchPriceMultiplier } from 'src/actions/settingsAction';

const validationSchema = Yup.object().shape({
  priceMultiplier: Yup.number()
    .required('Price Multiplier is required')
    .typeError('Price Multiplier must be a number')
    .min(0.01, 'Price Multiplier must be at least 0.01'),
});

const SettingsViewPage = () => {
  const dispatch = useDispatch();
  const { priceMultiplier, loading, setttingsError } = useSelector(({ settings }) => settings);

  useEffect(() => {
    dispatch(fetchPriceMultiplier());
  }, [dispatch]);

  const onNonCustomizedSubmit = useCallback(
    async (values, { setSubmitting }) => {
      const payload = {
        priceMultiplier: values?.priceMultiplier,
      };
      await dispatch(upsertPriceMultiplier(payload));
      setSubmitting(false);
    },
    [dispatch]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      priceMultiplier: Number(parseFloat(priceMultiplier).toFixed(2)) || 1,
    },
    validationSchema,
    onSubmit: onNonCustomizedSubmit,
  });

  const { values, errors, touched, handleBlur, handleSubmit, setFieldValue } = formik;

  // Handler to select input value on click
  const handleInputClick = (event) => {
    event?.target?.select();
  };

  // Handler to disable mouse wheel value change
  const handleWheel = (event) => {
    event?.target?.blur();
  };

  const handlePositivePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseFloat(value) > 0) {
      setFieldValue('priceMultiplier', Number(parseFloat(value).toFixed(2)));
    }
  };

  return (
    <>
      <Container>
        <Box
          sx={{
            mb: 5,
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4">Settings</Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Non Customized
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack direction="row" gap={1} alignItems="flex-start">
            <TextField
              // min={0}
              type="number"
              name="priceMultiplier"
              label="Price Multiplier"
              onBlur={handleBlur}
              onChange={(e) => handlePositivePriceChange(e)}
              onClick={handleInputClick}
              onWheel={handleWheel}
              value={values.priceMultiplier || 1}
              error={!!(touched?.priceMultiplier && errors?.priceMultiplier)}
              helperText={
                touched?.priceMultiplier && errors?.priceMultiplier ? errors?.priceMultiplier : ''
              }
            />

            <Box sx={{ marginTop: '4px' }}>
              <LoadingButton
                size="large"
                variant="contained"
                onClick={handleSubmit}
                loading={loading}
              >
                Save Changes
              </LoadingButton>
            </Box>
          </Stack>
        </form>
        {setttingsError && (
          <Typography color="error" sx={{ mt: 1, mb: 2 }}>
            {setttingsError}
          </Typography>
        )}
        <Alert sx={{ mt: 2 }} severity="info">
          The value you set here will automatically be multiplied with the base price of all
          pre-designed products whose price calculate with automatic mode.
        </Alert>
      </Container>
    </>
  );
};

export default SettingsViewPage;
