import { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { helperFunctions } from '../../_helpers';
import { adminService, toast } from '../../_services';
import { setAdminWisePermisisons } from '../../store/slices/adminSlice';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

export default function LoginView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const abortControllerRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  let { adminWisePermisisons } = useSelector(({ admin }) => admin);

  const currentUser = helperFunctions.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const path = helperFunctions.permissionWiseRedirect(adminWisePermisisons);
      if (path) navigate(path);
    }
    return () => clearAbortController(); // Cancel request on unmount/route change
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null; // Reset for next usage
  }, [abortControllerRef]);

  const handleSubmit = useCallback(
    async (fields, { setStatus }) => {
      setStatus();
      const payload = {
        email: fields.email,
        password: fields.password,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }

      const response = await adminService.adminLogin(payload, abortControllerRef.current);
      if (response?.adminData) {
        const permissions = response?.adminData.permissions ?? [];
        dispatch(setAdminWisePermisisons(permissions));
        const path = helperFunctions.permissionWiseRedirect(permissions);
        if (path) {
          localStorage.setItem('adminCurrentUser', JSON.stringify(response?.adminData));
          toast.success('Logged in successfully');
          navigate(path);
        } else {
          toast.error("You don't have any permissions. Contact the administrator.");
        }
      }
    },
    [abortControllerRef]
  );

  const renderForm = (
    <>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
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
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
              <NavLink to="/forget-password">Forgot password?</NavLink>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              loading={isSubmitting}
            >
              Login
            </LoadingButton>
          </form>
        )}
      </Formik>
    </>
  );

  return (
    <Stack
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
        flexDirection: 'row',
        justifyContent: 'center',
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
          <Typography variant="h4" sx={{ mb: 3 }}>
            Sign in
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Stack>
  );
}
