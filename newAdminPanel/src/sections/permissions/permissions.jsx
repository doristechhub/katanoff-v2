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
import { Masonry } from '@mui/lab';

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
      permissions:
        admin?.permissions?.map((p) => ({
          pageId: p.pageId,
          actions: p?.actions || [],
        })) || [],
    };

    dispatch(setSelectedAdmin(admin));
    setOpenPermissionsDialog(true);
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

  const onSubmit = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        email: val?.email,
        mobile: val?.mobile,
        lastName: val?.lastName,
        firstName: val?.firstName,
        password: val?.password,
        confirmPassword: val?.id ? val?.password : val?.confirmPassword,
        permissions: val?.permissions?.map((p) => ({
          pageId: p.pageId,
          actions: p.actions?.map((a) => ({ actionId: a.actionId })) || [],
        })),
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
        setOpenPermissionsDialog(false);
        setOpen(null);
        dispatch(setSelectedAdmin(initAdmin));
      }
    },
    [loadData, dispatch]
  );

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

      const permissionsToUpdate = permissionsOfAllAdmins[selectedPermissionsId] || [];

      // Include actions
      const payload = {
        adminId: selectedPermissionsId,
        permissions: permissionsToUpdate.map((p) => ({
          pageId: p.pageId,
          actions: p.actions?.map((a) => ({ actionId: a.actionId })) || [],
        })),
      };

      const res = await dispatch(updateAdminPermission(payload));
      if (res) {
        loadData();
        setOpen(null);
        setSelectedPermissionsId(null);
        dispatch(setSelectedAdmin(initAdmin));
      }
    },
    [selectedPermissionsId, permissionsOfAllAdmins, dispatch, loadData]
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

          <FormControl sx={{ mt: 2, width: '100%' }}>
            <InputLabel id="permissions">Permissions</InputLabel>
            <Select
              multiple
              labelId="permissions"
              value={values?.permissions || []}
              input={<OutlinedInput label="Permissions" />}
              renderValue={
                (selected) =>
                  selected
                    .map((p) => {
                      const page = navConfig.find((page) => page.pageId === p.pageId);
                      if (!page) return p.pageId;
                      if (!p.actions || p.actions.length === 0) return page.title; // no actions
                      return `${page.title} (${p.actions.map((a) => a.actionId).join(', ')})`;
                    })
                    .filter(Boolean) // remove null/undefined
                    .join(', ') // only adds '; ' between items
              }
              MenuProps={MenuProps}
            >
              {navConfig?.map((page) => {
                // check if this page is already selected
                const pagePermission = values.permissions?.find(
                  (p) => p.pageId === page.pageId
                ) || { pageId: page.pageId, actions: [] };

                const pageChecked =
                  (page.actions?.length > 0 &&
                    pagePermission.actions?.length === page.actions?.length) ||
                  (page.actions?.length === 0 &&
                    values.permissions?.some((p) => p.pageId === page.pageId));

                const indeterminate =
                  pagePermission.actions?.length > 0 &&
                  pagePermission.actions?.length < page.actions?.length;

                return (
                  <MenuItem key={page?.pageId} value={page.pageId} sx={{ display: 'block' }}>
                    {/* Page checkbox */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={pageChecked}
                          indeterminate={indeterminate}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            let updatedPermissions = [...values.permissions];
                            // Page checkbox
                            if (checked) {
                              updatedPermissions = updatedPermissions.filter(
                                (p) => p.pageId !== page.pageId
                              );

                              updatedPermissions.push({
                                pageId: page.pageId,
                                actions:
                                  page.actions?.length > 0
                                    ? page.actions.map((a) => ({ actionId: a.value }))
                                    : [],
                              });
                            } else {
                              updatedPermissions = updatedPermissions.filter(
                                (p) => p.pageId !== page.pageId
                              );
                            }
                            handleChange({
                              target: { name: 'permissions', value: updatedPermissions },
                            });
                          }}
                        />
                      }
                      label={helperFunctions.capitalWords(page.title)}
                    />

                    {/* Actions under page */}
                    <Box sx={{ pl: 3, display: 'flex', flexDirection: 'column' }}>
                      {page.actions?.map((action) => {
                        const actionChecked = pagePermission.actions?.some(
                          (a) => a.actionId === action.value
                        );

                        return (
                          <FormControlLabel
                            key={action.value}
                            control={
                              <Checkbox
                                checked={actionChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  // Create a new permissions array
                                  let updatedPermissions =
                                    values.permissions?.map((p) => ({ ...p })) || [];

                                  // Find or create page
                                  let pagePerm = updatedPermissions.find(
                                    (p) => p.pageId === page.pageId
                                  );
                                  if (!pagePerm) {
                                    pagePerm = { pageId: page.pageId, actions: [] };
                                    updatedPermissions.push(pagePerm);
                                  } else {
                                    // clone actions to avoid mutation
                                    pagePerm.actions = [...pagePerm.actions];
                                  }

                                  if (checked) {
                                    // Add action if not exists
                                    if (
                                      !pagePerm.actions.some((a) => a.actionId === action.value)
                                    ) {
                                      pagePerm.actions.push({ actionId: action.value });
                                    }
                                  } else {
                                    // Remove action
                                    pagePerm.actions = pagePerm.actions.filter(
                                      (a) => a.actionId !== action.value
                                    );
                                  }

                                  // Remove empty pages
                                  updatedPermissions = updatedPermissions.filter(
                                    (p) => p.actions.length > 0 || page.actions?.length === 0
                                  );

                                  handleChange({
                                    target: { name: 'permissions', value: updatedPermissions },
                                  });
                                }}
                              />
                            }
                            label={helperFunctions.capitalWords(action.label)}
                          />
                        );
                      })}
                    </Box>
                  </MenuItem>
                );
              })}
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

  const handleCheckPage = useCallback(
    (adminId, page) => {
      const adminPermissions = permissionsOfAllAdmins?.[adminId] || [];
      let updatedPermissions = [...adminPermissions];

      const pageIndex = updatedPermissions.findIndex((p) => p.pageId === page.pageId);

      if (pageIndex > -1) {
        const pagePerm = updatedPermissions[pageIndex];
        const allActionsChecked = pagePerm.actions.length === page.actions.length;

        if (allActionsChecked) {
          // If all actions are already checked, uncheck all
          updatedPermissions = updatedPermissions.filter((p) => p.pageId !== page.pageId);
        } else {
          // If some actions are checked (indeterminate), check all actions
          updatedPermissions[pageIndex] = {
            pageId: page.pageId,
            actions: page.actions?.map((a) => ({ actionId: a.value })) || [],
          };
        }
      } else {
        // Page doesn't exist, add it with all actions checked
        updatedPermissions.push({
          pageId: page.pageId,
          actions: page.actions?.map((a) => ({ actionId: a.value })) || [],
        });
      }

      dispatch(
        setPermissionsOfAllAdmins({
          ...permissionsOfAllAdmins,
          [adminId]: updatedPermissions,
        })
      );
    },
    [permissionsOfAllAdmins, dispatch]
  );

  const handleCheckAction = useCallback(
    (adminId, page, actionId) => {
      const adminPermissions = permissionsOfAllAdmins?.[adminId] || [];
      let updatedPermissions = adminPermissions.map((p) => ({
        pageId: p.pageId,
        actions: [...p.actions],
      }));

      let pagePerm = updatedPermissions.find((p) => p.pageId === page.pageId);

      if (!pagePerm) {
        pagePerm = { pageId: page.pageId, actions: [] };
        updatedPermissions.push(pagePerm);
      }

      const actionExists = pagePerm.actions.some((a) => a.actionId === actionId);

      if (actionExists) {
        pagePerm.actions = pagePerm.actions.filter((a) => a.actionId !== actionId);
      } else {
        pagePerm.actions.push({ actionId });
      }

      // Remove page if it originally had actions but now empty
      if (page.actions?.length > 0 && pagePerm.actions.length === 0) {
        updatedPermissions = updatedPermissions.filter((p) => p.pageId !== page.pageId);
      }

      dispatch(
        setPermissionsOfAllAdmins({
          ...permissionsOfAllAdmins,
          [adminId]: updatedPermissions,
        })
      );
    },
    [permissionsOfAllAdmins, dispatch]
  );

  const adminPermissions = permissionsOfAllAdmins?.[row?.id] || [];

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: 50 }}>
          <IconButton
            size="small"
            onClick={() => {
              const list = [...collapseList];
              list[index] = { isCollapsed: !isCollapsed };
              dispatch(setCollapseList(list));
            }}
          >
            <Iconify icon={isCollapsed ? 'iconamoon:arrow-up-2' : 'iconamoon:arrow-down-2'} />
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: 60 }}>{row?.srNo}</TableCell>
        <TableCell>
          {helperFunctions.capitalWords(row?.firstName)}{' '}
          {helperFunctions.capitalWords(row?.lastName)}
        </TableCell>
        <TableCell>{row?.email}</TableCell>
        <TableCell>{row?.mobile}</TableCell>
        <TableCell sx={{ minWidth: 180 }}>
          {moment(row?.createdDate)?.format('MM-DD-YYYY hh:mm a')}
        </TableCell>
        <TableCell sx={{ width: 50 }}>
          <Iconify
            className="cursor-pointer"
            icon="iconamoon:menu-kebab-vertical-bold"
            onClick={(e) => {
              setOpen(e.currentTarget);
              setSelectedPermissionsId(row?.id);
            }}
          />
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={isCollapsed} timeout={200}>
            <Masonry
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              spacing={1.5}
              style={{ marginTop: 10 }}
            >
              {navConfig?.map((page, i) => {
                const pagePerm = adminPermissions.find((p) => p.pageId === page.pageId);
                const isPageChecked = !!pagePerm;
                const isIndeterminate =
                  pagePerm?.actions?.length > 0 && pagePerm?.actions?.length < page.actions?.length;

                return (
                  <Box
                    key={`admin-permissions-${i}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #eee',
                      borderRadius: 1,
                      p: 1,
                      backgroundColor: '#fff',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isPageChecked}
                          indeterminate={isIndeterminate}
                          onChange={() => handleCheckPage(row?.id, page)}
                        />
                      }
                      label={helperFunctions.capitalWords(page.title)}
                    />
                    <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column' }}>
                      {page.actions?.map((action) => {
                        const isActionChecked =
                          pagePerm?.actions?.some((a) => a.actionId === action.value) ?? false;

                        return (
                          <FormControlLabel
                            key={action.value}
                            control={
                              <Checkbox
                                checked={isActionChecked}
                                onChange={() => handleCheckAction(row?.id, page, action.value)}
                              />
                            }
                            label={helperFunctions.capitalWords(action.label)}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Masonry>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});
