import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import Logo from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';

import { helperFunctions } from '../../_helpers';
import { adminService, toast } from '../../_services';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .transform((value) => value?.trim())
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// ----------------------------------------------------------------------

export default function ForgetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let { adminWisePermisisons } = useSelector(({ admin }) => admin);

  const currentUser = helperFunctions.getCurrentUser();

  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  useEffect(() => {
    if (currentUser) {
      const path = helperFunctions.permissionWiseRedirect(adminWisePermisisons);
      if (path) {
        navigate(path);
      } else {
        navigate('/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (fields, { setStatus, setSubmitting }) => {
    setStatus();
    adminService
      .forgotPassword(fields)
      .then(() => {
        setSubmitting(false);
        toast.success(`Congratulations! You've successfully reset your password`);
        navigate('/login');
      })
      .catch((err) => {
        setSubmitting(false);
        const errorMessage = err.message || 'something went wrong';
        toast.error(errorMessage);
      });
  };

  const renderForm = (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors, values, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                name="email"
                error={!!(touched.email && errors.email)}
                label="Email address"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.email && errors.email ? errors.email : ''}
              />

              <TextField
                name="password"
                label="Password"
                error={!!(touched.password && errors.password)}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.password && errors.password ? errors.password : ''}
              />

              <TextField
                name="confirmPassword"
                label="Confirm Password"
                error={!!(touched.confirmPassword && errors.confirmPassword)}
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''
                }
              />
            </Stack>

            <LoadingButton
              sx={{ my: 3 }}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Reset Password
            </LoadingButton>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 1 }}>
              <NavLink to="/login">Login</NavLink>
            </Stack>
          </form>
        )}
      </Formik>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Logo />
        <Card
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
            mt: 5,
            width: { sm: '100%', md: 460 },

            maxWidth: '100%',
            mx: 'auto', // center horizontally
          }}
        >
          <Typography variant="h4" sx={{ mb: 4 }}>
            Forgot Password
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
