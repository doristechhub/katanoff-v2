import * as Yup from 'yup';
import moment from 'moment';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  Box,
  Card,
  Table,
  Select,
  Popover,
  MenuItem,
  TableRow,
  Checkbox,
  Collapse,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  ListItemText,
  OutlinedInput,
  TableContainer,
  InputAdornment,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Unstable_Grid2';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  deleteAdmin,
  updateAdmin,
  insertAdmin,
  getAdminsList,
  updateAdminPermission,
} from 'src/actions/permissionsActions';
import {
  initAdmin,
  setCollapseList,
  setSelectedAdmin,
  setPermissionsOfAllAdmins,
  setPermissionsPage,
} from 'src/store/slices/permissionsSlice';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { email, helperFunctions } from 'src/_helpers';
import { Button, LoadingButton } from 'src/components/button';
import navConfig from 'src/layouts/dashboard/config-navigation';
import ConfirmationDialog from 'src/components/confirmation-dialog';

// ----------------------------------------------------------------------

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

const validationSchema = (isEdit) =>
  Yup.object().shape({
    lastName: Yup.string().required('LastName is required'),
    mobile: Yup.string()
      .matches(/^\+?[0-9]{10,15}$/, 'Invalid mobile number')
      .required('Mobile number is required'),
    firstName: Yup.string().required('FirstName is required'),
    password: isEdit
      ? Yup.string()
      : Yup.string()
          .min(8, 'Password must be at least 8 characters long')
          .required('Password is required'),
    confirmPassword: isEdit
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm password is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

// ----------------------------------------------------------------------

const Permissions = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedPermissionsId, setSelectedPermissionsId] = useState();
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    adminList,
    selectedAdmin,
    permissionsPage,
    permissionsLoading,
    crudPermissionsLoading,
    permissionsOfAllAdmins,
    assignPermissionsLoading,
  } = useSelector(({ permissions }) => permissions);

  const searchKey = searchedValue?.trim()?.toLowerCase();
  let filteredItems = adminList?.filter((item) => {
    return (
      item?.mobile?.toString()?.includes(searchKey?.toString()) ||
      item?.email?.toLowerCase()?.includes(searchKey) ||
      item?.lastName?.toLowerCase()?.includes(searchKey) ||
      item?.firstName?.toLowerCase()?.includes(searchKey) ||
      moment(item?.createdDate)?.format('MM-DD-YYYY hh:mm a')?.includes(searchKey)
    );
  });

  let currentItems = filteredItems?.slice(
    permissionsPage * rowsPerPage,
    permissionsPage * rowsPerPage + rowsPerPage
  );

  const loadData = useCallback(async () => {
    await dispatch(getAdminsList());
  }, []);

  useEffect(() => {
    loadData();
    return () => dispatch(setPermissionsPage(0));
  }, []);

  useEffect(() => {
    const list = adminList?.map((_) => ({
      isCollapsed: false,
    }));
    dispatch(setCollapseList(list));
  }, [adminList?.length]);

  const searchValueHandler = useCallback((e) => {
    const value = e.target.value;
    setSearchedValue(value);
    dispatch(setPermissionsPage(0));
  }, []);

  const handleChangePage = useCallback((e, newPage) => {
    dispatch(setPermissionsPage(newPage));
  }, []);

  const handleChangeRowsPerPage = useCallback((e) => {
    dispatch(setPermissionsPage(0));
    setRowsPerPage(parseInt(e.target.value, 10));
  }, []);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudPermissionsLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedPermissionsId();
    },
    [crudPermissionsLoading]
  );

  const handleEdit = useCallback(async () => {
    let admin = adminList?.find((x) => x?.id === selectedPermissionsId);
    admin = {
      ...admin,
      permissions: admin?.permissions?.map((x) => x?.pageId),
    };
    if (admin) {
      dispatch(setSelectedAdmin(admin));
      setOpenPermissionsDialog(true);
    }
  }, [selectedPermissionsId, adminList]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(
      deleteAdmin({
        adminId: selectedPermissionsId,
      })
    );
    if (res) {
      const cPage =
        permissionsPage !== 0 && currentItems?.length === 1 ? permissionsPage - 1 : permissionsPage;
      dispatch(setPermissionsPage(cPage));
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [selectedPermissionsId]);

  const onSubmit = useCallback(async (val, { resetForm }) => {
    const payload = {
      email: val?.email,
      mobile: val?.mobile,
      lastName: val?.lastName,
      password: val?.password,
      firstName: val?.firstName,
      permissions: val?.permissions?.map((x) => ({ pageId: x })),
      confirmPassword: val?.id ? val?.password : val?.confirmPassword,
    };
    let res;
    if (val?.id) {
      payload.adminId = val?.id;
      res = await dispatch(updateAdmin(payload));
    } else {
      res = await dispatch(insertAdmin(payload));
    }
    if (res) {
      loadData();
      resetForm();
      setOpen(null);
      setOpenPermissionsDialog(false);
      dispatch(setSelectedAdmin(initAdmin));
    }
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    onSubmit,
    enableReinitialize: true,
    initialValues: selectedAdmin,
    validationSchema: () => validationSchema(selectedAdmin?.id),
  });

  const closeMenuCategoryPopup = useCallback(() => {
    setOpenPermissionsDialog(false);
    dispatch(setSelectedAdmin(initAdmin));
    resetForm();
  }, [initAdmin]);

  const isBtnDisabled = useCallback(
    (paramEmail) => {
      return selectedPermissionsId || paramEmail === email;
    },
    [email]
  );

  const handleAssign = useCallback(
    async (item) => {
      if (isBtnDisabled(item?.email)) {
        toast.error('Any action prohibited for superadmins.');
        return;
      }
      const permissionsToUpdate = permissionsOfAllAdmins?.[selectedPermissionsId] || [];
      const payload = {
        permissions: permissionsToUpdate?.map((x) => ({
          pageId: x,
        })),
        adminId: selectedPermissionsId,
      };
      const res = await dispatch(updateAdminPermission(payload));
      if (res) {
        loadData();
        setOpen(null);
        setSelectedPermissionsId();
        dispatch(setSelectedAdmin(initAdmin));
      }
    },
    [selectedPermissionsId, permissionsOfAllAdmins]
  );

  const renderPopup = useMemo(() => {
    const popoverTop = open?.getBoundingClientRect().top || 0;
    const popoverLeft = open?.getBoundingClientRect().left || 0;

    const item = adminList?.find((x) => x?.id === selectedPermissionsId);

    return !!open ? (
      <Popover
        open={!!open}
        anchorEl={open}
        PaperProps={{
          sx: { width: 140 },
        }}
        disableEscapeKeyDown
        onClose={handlePopup}
        anchorReference="anchorPosition"
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        anchorPosition={{ top: popoverTop, left: popoverLeft }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleEdit}
          disabled={
            !!isBtnDisabled(item?.email) || assignPermissionsLoading || crudPermissionsLoading
          }
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem
          sx={{ color: 'success.main' }}
          onClick={() => handleAssign(item)}
          disabled={
            !!isBtnDisabled(item?.email) || assignPermissionsLoading || crudPermissionsLoading
          }
        >
          {assignPermissionsLoading ? (
            <Box
              sx={{
                gap: '15px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Spinner width={20} /> Assign
            </Box>
          ) : (
            <>
              <Iconify icon="ic:baseline-assignment-ind" sx={{ mr: 2 }} />
              Assign
            </>
          )}
        </MenuItem>

        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => setDeleteDialog(true)}
          disabled={
            !!isBtnDisabled(item?.email) || assignPermissionsLoading || crudPermissionsLoading
          }
        >
          {crudPermissionsLoading ? (
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
  }, [
    open,
    isBtnDisabled,
    selectedPermissionsId,
    crudPermissionsLoading,
    assignPermissionsLoading,
  ]);

  const renderDialog = useMemo(() => {
    return openPermissionsDialog ? (
      <Dialog
        open={openPermissionsDialog}
        handleClose={closeMenuCategoryPopup}
        handleOpen={() => setOpenPermissionsDialog(true)}
      >
        <StyledDialogTitle>{selectedAdmin?.id ? 'Update' : 'Add New'} Admin</StyledDialogTitle>
        <StyledDialogContent sx={{ minHeight: '300px' }}>
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              <TextField
                sx={{
                  mt: '10px',
                  width: '100%',
                  minWidth: '250px',
                }}
                name="firstName"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName || ''}
                error={!!(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName ? errors.firstName : ''}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                sx={{
                  mt: '10px',
                  width: '100%',
                  minWidth: '250px',
                }}
                name="lastName"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName || ''}
                error={!!(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName ? errors.lastName : ''}
              />
            </Grid>
          </Grid>
          <TextField
            sx={{
              mt: '10px',
              width: '100%',
              minWidth: '300px',
            }}
            name="email"
            label="Email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email || ''}
            error={!!(touched.email && errors.email)}
            helperText={touched.email && errors.email ? errors.email : ''}
          />
          <TextField
            sx={{
              mt: '10px',
              width: '100%',
              minWidth: '300px',
            }}
            name="mobile"
            type="number"
            label="Mobile"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values?.mobile || ''}
            error={!!(touched?.mobile && errors?.mobile)}
            helperText={touched?.mobile && errors?.mobile ? errors?.mobile : ''}
          />
          {values?.id ? null : (
            <Grid container spacing={2}>
              <Grid xs={12} sm={6}>
                <TextField
                  sx={{
                    mt: '10px',
                    width: '100%',
                    minWidth: '250px',
                  }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password || ''}
                  error={!!(touched.password && errors.password)}
                  helperText={touched.password && errors.password ? errors.password : ''}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid xs={12} sm={6}>
                <TextField
                  sx={{
                    mt: '10px',
                    width: '100%',
                    minWidth: '250px',
                  }}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  label="Confirm Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword || ''}
                  error={!!(touched.confirmPassword && errors.confirmPassword)}
                  helperText={
                    touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          )}

          <FormControl sx={{ mt: '10px', width: '100%' }}>
            <InputLabel id="permissions">Permissions</InputLabel>
            <Select
              multiple
              name="permissions"
              labelId="permissions"
              MenuProps={MenuProps}
              onChange={handleChange}
              value={values?.permissions}
              input={<OutlinedInput label="Permissions" />}
              renderValue={(selected) => selected?.join(', ')}
            >
              {navConfig?.map((x) => (
                <MenuItem key={`permission-key-${x?.pageId}`} value={x?.pageId}>
                  <ListItemText primary={helperFunctions.capitalWords(x?.title)} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button
            variant="outlined"
            onClick={closeMenuCategoryPopup}
            disabled={crudPermissionsLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            loading={crudPermissionsLoading}
          >
            {selectedAdmin?.id ? 'Update' : 'Save'}
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    ) : null;
  }, [
    values,
    errors,
    touched,
    selectedAdmin,
    crudPermissionsLoading,
    openPermissionsDialog,
    showPassword,
    showConfirmPassword,
  ]);

  return (
    <>
      {permissionsLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
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
            <Typography variant="h4">Permissions</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                type="search"
                sx={{ padding: 0 }}
                placeholder="Search"
                value={searchedValue}
                onChange={searchValueHandler}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenPermissionsDialog(true)}
              >
                New User
              </Button>
            </Box>
          </Box>
          <Card>
            <Box p={'3px'} />
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Id</TableCell>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentItems?.length
                      ? currentItems?.map((x, i) => (
                          <Row
                            row={x}
                            index={i}
                            setOpen={setOpen}
                            key={`admin-${i}`}
                            setSelectedPermissionsId={setSelectedPermissionsId}
                          />
                        ))
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
              {!currentItems?.length ? (
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                >
                  No Data
                </Typography>
              ) : null}
            </Scrollbar>
            {adminList?.length > 5 ? (
              <TablePagination
                component="div"
                page={permissionsPage}
                rowsPerPage={rowsPerPage}
                count={filteredItems?.length}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            ) : null}
          </Card>
        </Container>
      )}

      {renderPopup}

      {renderDialog}

      {deleteDialog ? (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudPermissionsLoading}
        >
          Do you want to delete this user?
        </ConfirmationDialog>
      ) : null}
    </>
  );
};

export default Permissions;

// ----------------------------------------------------------------------

const Row = memo(({ row, setOpen, setSelectedPermissionsId, index }) => {
  const dispatch = useDispatch();
  const { permissionsOfAllAdmins, collapseList } = useSelector(({ permissions }) => permissions);
  const isCollapsed = collapseList?.[index]?.isCollapsed;

  const handleCheck = useCallback(
    (adminId, pageId) => {
      const adminPermisisons = permissionsOfAllAdmins?.[adminId] || [];
      const updatedPermissions = adminPermisisons?.includes(pageId)
        ? adminPermisisons?.filter((id) => id !== pageId)
        : [...adminPermisisons, pageId];

      dispatch(
        setPermissionsOfAllAdmins({
          ...permissionsOfAllAdmins,
          [adminId]: updatedPermissions,
        })
      );
    },
    [permissionsOfAllAdmins, dispatch]
  );
  return (
    <React.Fragment key={row?.id}>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: '50px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              let list = [...collapseList];
              list[index] = { isCollapsed: !isCollapsed };
              dispatch(setCollapseList(list));
            }}
          >
            {isCollapsed ? (
              <Iconify icon="iconamoon:arrow-up-2" />
            ) : (
              <Iconify icon="iconamoon:arrow-down-2" />
            )}
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: '60px' }}>{row?.srNo}</TableCell>
        <TableCell>
          {helperFunctions.capitalWords(row?.firstName)}{' '}
          {helperFunctions.capitalWords(row?.lastName)}
        </TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.mobile}</TableCell>
        <TableCell sx={{ minWidth: '180px' }}>
          {moment(row?.createdDate)?.format('MM-DD-YYYY hh:mm a')}
        </TableCell>
        <TableCell sx={{ width: '50px' }}>
          <Iconify
            className={'cursor-pointer'}
            icon="iconamoon:menu-kebab-vertical-bold"
            onClick={(e) => {
              setOpen(e.currentTarget);
              setSelectedPermissionsId(row?.id);
            }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, width: '100%' }} colSpan={12}>
          <Collapse in={isCollapsed} timeout={2} sx={{ width: '100%' }}>
            {navConfig?.map((x, i) => {
              const isChecked = permissionsOfAllAdmins?.[row?.id]?.includes(x?.pageId);
              return (
                <FormControlLabel
                  sx={{ flexGrow: 1, m: 0 }}
                  key={`admin-permissions-${i}`}
                  label={helperFunctions.capitalWords(x?.title)}
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheck(row?.id, x?.pageId)}
                    />
                  }
                />
              );
            })}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
});
