import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Table,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
  Popover,
  MenuItem,
  Checkbox,
} from '@mui/material';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { getDiscountList, deleteDiscount, toggleDiscountStatus } from 'src/actions';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import Label from 'src/components/label';
import { DATE_FORMAT } from 'src/_helpers/constants';

const DiscountsViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [toggleDialog, setToggleDialog] = useState({ open: false, action: null });
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState([]);

  const { discountLoading, crudDiscountLoading, discountList } = useSelector(
    ({ discounts }) => discounts
  );

  const searchKey = searchedValue?.trim()?.toLowerCase();
  const filteredItems = discountList?.filter((item) =>
    item?.name?.toLowerCase()?.includes(searchKey)
  );

  const loadData = useCallback(() => {
    dispatch(getDiscountList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const searchValueHandler = useCallback((event) => {
    setSearchedValue(event.target.value);
  }, []);

  const handleEdit = useCallback(() => {
    if (selectedDiscountId) {
      navigate(`/discounts/add?discountId=${selectedDiscountId}`);
    }
  }, [navigate, selectedDiscountId]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteDiscount({ discountId: selectedDiscountId }));
    if (res) {
      loadData();
      setSelectedDiscountIds((prev) => prev.filter((id) => id !== selectedDiscountId));
      setDeleteDialog(false);
      handlePopup();
    }
  }, [dispatch, loadData, selectedDiscountId]);

  const handlePopup = useCallback(
    (e, reason) => {
      if (crudDiscountLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedDiscountId(null);
    },
    [crudDiscountLoading]
  );

  const handleSelectAll = useCallback(
    (event) => {
      if (event.target.checked) {
        setSelectedDiscountIds(filteredItems.map((item) => item.id));
      } else {
        setSelectedDiscountIds([]);
      }
    },
    [filteredItems]
  );

  const handleSelectDiscount = useCallback((discountId) => {
    setSelectedDiscountIds((prev) =>
      prev.includes(discountId) ? prev.filter((id) => id !== discountId) : [...prev, discountId]
    );
  }, []);

  const getToggleableCount = useCallback(
    (action) => {
      return filteredItems
        .filter((item) => selectedDiscountIds.includes(item.id))
        .reduce((count, item) => {
          const now = moment();
          const beginsAt = item.dateRange?.beginsAt
            ? moment(item.dateRange.beginsAt, DATE_FORMAT, true)
            : null;
          const expiresAt = item.dateRange?.expiresAt
            ? moment(item.dateRange.expiresAt, DATE_FORMAT, true)
            : null;
          let status = 'expired';
          if (beginsAt?.isValid()) {
            if (now.isBefore(beginsAt)) {
              status = 'scheduled';
            } else if (!expiresAt || !expiresAt.isValid() || now.isBefore(expiresAt)) {
              status = 'active';
            }
          }
          if (action === 'Activate' && status !== 'active') return count + 1;
          if (action === 'Deactivate' && status === 'active') return count + 1;
          return count;
        }, 0);
    },
    [filteredItems, selectedDiscountIds]
  );

  const handleToggleStatus = useCallback(
    async (action) => {
      const payload = { discountIds: selectedDiscountIds, action };
      const res = await dispatch(toggleDiscountStatus(payload));
      if (res) {
        loadData();
        setSelectedDiscountIds([]); // Clear selection after action
        setToggleDialog({ open: false, action: null }); // Close dialog
      }
    },
    [dispatch, loadData, selectedDiscountIds]
  );

  const handleOpenToggleDialog = useCallback((action) => {
    setToggleDialog({ open: true, action });
  }, []);

  const renderStatus = useCallback((dateRange) => {
    const now = moment();
    const beginsAt = dateRange?.beginsAt ? moment(dateRange.beginsAt, DATE_FORMAT, true) : null;
    const expiresAt = dateRange?.expiresAt ? moment(dateRange.expiresAt, DATE_FORMAT, true) : null;

    let status = 'expired';
    let color = 'gray';
    let backgroundColor = '#0000000f';

    if (beginsAt?.isValid()) {
      if (now.isBefore(beginsAt)) {
        status = 'scheduled';
        color = '#4f4700';
        backgroundColor = '#ffeb78';
      } else if (!expiresAt || !expiresAt.isValid() || now.isBefore(expiresAt)) {
        status = 'active';
        color = 'green';
        backgroundColor = '#affebf';
      }
    }

    return (
      <Label
        variant="filled"
        sx={{
          textTransform: 'capitalize',
          padding: '6px',
          height: '18px',
          fontSize: '12px',
          borderRadius: '3px',
          backgroundColor,
          color,
        }}
      >
        {status}
      </Label>
    );
  }, []);

  const handleOpenMenu = useCallback((event, discountId) => {
    setOpen(event.currentTarget);
    setSelectedDiscountId(discountId);
  }, []);

  return (
    <>
      {discountLoading ? (
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
            <Typography variant="h4">Discounts</Typography>
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
                onClick={() => navigate('/discounts/add')}
              >
                New Discount
              </Button>
              {selectedDiscountIds.length > 0 && (
                <>
                  <LoadingButton
                    variant="outlined"
                    onClick={() => handleOpenToggleDialog('Activate')}
                    disabled={crudDiscountLoading || getToggleableCount('Activate') === 0}
                    loading={crudDiscountLoading}
                    sx={{
                      borderColor: '#4CAF50',
                      color: '#4CAF50',
                      '&:hover': {
                        backgroundColor: '#E8F5E9',
                        borderColor: '#388E3C',
                        color: '#388E3C',
                      },
                    }}
                  >
                    Activate Discounts
                  </LoadingButton>
                  <LoadingButton
                    variant="outlined"
                    onClick={() => handleOpenToggleDialog('Deactivate')}
                    disabled={crudDiscountLoading || getToggleableCount('Deactivate') === 0}
                    loading={crudDiscountLoading}
                    sx={{
                      borderColor: '#F44336',
                      color: '#F44336',
                      '&:hover': {
                        backgroundColor: '#FFEBEE',
                        borderColor: '#D32F2F',
                        color: '#D32F2F',
                      },
                    }}
                  >
                    Deactivate Discounts
                  </LoadingButton>
                </>
              )}
            </Box>
          </Box>
          <Card>
            <Box p={'3px'} />
            <Scrollbar>
              <TableContainer sx={{ overflow: 'unset' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedDiscountIds.length === filteredItems.length &&
                            filteredItems.length > 0
                          }
                          indeterminate={
                            selectedDiscountIds.length > 0 &&
                            selectedDiscountIds.length < filteredItems.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Id</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Promo Code</TableCell>
                      <TableCell>Discount Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems?.length ? (
                      filteredItems.map((x, i) => (
                        <TableRow key={`discount-${x.id}`}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedDiscountIds.includes(x?.id)}
                              onChange={() => handleSelectDiscount(x?.id)}
                            />
                          </TableCell>
                          <TableCell sx={{ width: '100px' }}>{x?.srNo}</TableCell>
                          <TableCell>{x?.name}</TableCell>
                          <TableCell>{x?.promoCode || '-'}</TableCell>
                          <TableCell>{x?.discountType}</TableCell>
                          <TableCell>{renderStatus(x?.dateRange)}</TableCell>
                          <TableCell sx={{ width: '40px' }}>
                            <Iconify
                              className={'cursor-pointer'}
                              icon="iconamoon:menu-kebab-vertical-bold"
                              onClick={(e) => handleOpenMenu(e, x.id)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" sx={{ color: 'text.secondary', p: 2 }}>
                            No Data
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
        </Container>
      )}
      {/* Menu Popup */}
      {open && (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handlePopup}
          PaperProps={{
            sx: { width: 180 },
          }}
          disableEscapeKeyDown
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEdit} disabled={crudDiscountLoading}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={crudDiscountLoading}
            onClick={() => setDeleteDialog(true)}
          >
            {crudDiscountLoading ? (
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
      )}
      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <ConfirmationDialog
          open={deleteDialog}
          setOpen={setDeleteDialog}
          handleConfirm={handleDelete}
          loading={crudDiscountLoading}
          confirmButtonText="Delete"
        >
          Do you want to delete this discount?
        </ConfirmationDialog>
      )}
      {/* Toggle Status Confirmation Dialog */}
      {toggleDialog.open && (
        <ConfirmationDialog
          open={toggleDialog.open}
          setOpen={(open) => setToggleDialog({ ...toggleDialog, open })}
          handleConfirm={() => handleToggleStatus(toggleDialog.action)}
          loading={crudDiscountLoading}
          confirmButtonText={toggleDialog.action}
        >
          {`Do you want to ${toggleDialog?.action?.toLowerCase()} ${getToggleableCount(toggleDialog.action)} discount${getToggleableCount(toggleDialog.action) !== 1 ? 's' : ''}?`}
        </ConfirmationDialog>
      )}
    </>
  );
};

export default DiscountsViewPage;
