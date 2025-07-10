import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Card,
  Table,
  Popover,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  TableContainer,
  InputAdornment,
} from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import {
  deleteCollection,
  getCollectionList,
  updateCollectionPosition,
} from 'src/actions/collectionActions';
import Iconify from 'src/components/iconify';
import Spinner from 'src/components/spinner';
import Scrollbar from 'src/components/scrollbar';
import { Button } from 'src/components/button';
import ConfirmationDialog from 'src/components/confirmation-dialog';
import ProgressiveImg from 'src/components/progressive-img';
import { helperFunctions } from 'src/_helpers';
import { COLLECTION_TYPES } from 'src/_helpers/constants';

// Bounce animation for arrow
const bounce = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(0deg); }
  100% { transform: scale(1) rotate(180deg); }
`;

const Collection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [searchedValue, setSearchedValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [filterByType, setFilterByType] = useState('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState();
  const [expandedTypes, setExpandedTypes] = useState({});

  const { collectionLoading, collectionList, crudCollectionLoading } = useSelector(
    ({ collection }) => collection
  );

  useEffect(() => {
    const initialExpanded = {};
    Object.keys(COLLECTION_TYPES).forEach((type) => {
      initialExpanded[type] = true;
    });
    setExpandedTypes(initialExpanded);
  }, []);

  const toggleType = useCallback((type) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  const groupedItems = useMemo(() => {
    const grouped = {};
    collectionList
      .filter((item) => item && item.id)
      .forEach((item) => {
        const type = item.type || 'default';
        if (!grouped[type]) {
          grouped[type] = [];
        }
        grouped[type].push(item);
      });
    Object.keys(grouped).forEach((type) => {
      grouped[type].sort((a, b) => (a.position || 0) - (b.position || 0));
    });
    return grouped;
  }, [collectionList]);

  const filteredItems = useMemo(() => {
    const searchKey = searchedValue?.trim()?.toLowerCase();
    let items = collectionList?.filter((item) => item?.title?.toLowerCase()?.includes(searchKey));
    if (filterByType !== 'all') {
      items = items.filter((item) => (item.type || 'default') === filterByType);
    }
    return items;
  }, [collectionList, searchedValue, filterByType]);

  const groupedFilteredItems = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      const type = item.type || 'default';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const loadData = useCallback(() => {
    dispatch(getCollectionList());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const searchValueHandler = useCallback((event) => {
    setSearchedValue(event.target.value);
  }, []);

  const handleDragEnd = useCallback(
    async (result) => {
      const { source, destination } = result;
      if (
        !destination ||
        source.index === destination.index ||
        source.droppableId !== destination.droppableId
      ) {
        return;
      }

      const type = source.droppableId;
      const updatedCollections = [...(groupedItems[type] || [])];
      const [movedCollection] = updatedCollections.splice(source.index, 1);
      updatedCollections.splice(destination.index, 0, movedCollection);

      const updatedItems = updatedCollections.map((collection, index) => ({
        collectionId: collection?.id,
        position: index + 1,
      }));

      try {
        await dispatch(updateCollectionPosition(updatedItems));
      } catch (error) {
        console.error('Error updating positions:', error);
        toast.error('Failed to update collection positions');
      }
    },
    [dispatch, groupedItems]
  );
  const handlePopup = useCallback(
    (e, reason) => {
      if (crudCollectionLoading && reason === 'backdropClick') return;
      setOpen(null);
      setSelectedCollectionId();
    },
    [crudCollectionLoading]
  );

  const handleEdit = useCallback(() => {
    navigate(`/collection/add?collectionId=${selectedCollectionId}`);
  }, [navigate, selectedCollectionId]);

  const handleDelete = useCallback(async () => {
    const res = await dispatch(deleteCollection({ collectionId: selectedCollectionId }));
    if (res) {
      loadData();
      handlePopup();
      setDeleteDialog(false);
    }
  }, [dispatch, selectedCollectionId, loadData, handlePopup]);

  const renderPopup = useMemo(
    () =>
      open ? (
        <Popover
          open={!!open}
          anchorEl={open}
          PaperProps={{ sx: { width: 140 } }}
          disableEscapeKeyDown
          onClose={handlePopup}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleEdit} disabled={crudCollectionLoading}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem
            sx={{ color: 'error.main' }}
            disabled={crudCollectionLoading}
            onClick={() => setDeleteDialog(true)}
          >
            {crudCollectionLoading ? (
              <Box sx={{ gap: '15px', width: '100%', display: 'flex', alignItems: 'center' }}>
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
      ) : null,
    [open, crudCollectionLoading, handleEdit, handlePopup]
  );

  const collectionTypeOptions = useMemo(() => {
    return ['all', ...Object.values(COLLECTION_TYPES).map((type) => type.value)];
  }, []);

  const renderTypeTables = useMemo(() => {
    const tables = [];
    Object.keys(groupedFilteredItems).forEach((type) => {
      const typeLabel = COLLECTION_TYPES[type]?.label || 'Default';
      const items = groupedFilteredItems[type] || [];
      if (items.length === 0) return;
      const isExpanded = expandedTypes[type] ?? true;
      tables.push(
        <Box key={`type-${type}`} sx={{ mb: 3, borderRadius: 1, overflow: 'hidden', boxShadow: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
              transition: 'background-color 0.3s',
              cursor: 'pointer',
            }}
            onClick={() => toggleType(type)}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'primary.main',
                fontWeight: 'fontWeightSemiBold',
              }}
            >
              {typeLabel}
            </Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify
                icon="material-icons:expand_circle_down"
                sx={{
                  width: 40,
                  height: 40,
                  color: 'primary.main',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                  animation: isExpanded
                    ? `${bounce} 0.4s ease-in-out`
                    : `${bounce} 0.4s ease-in-out`,
                  '&:hover': {
                    transform: isExpanded ? 'rotate(0deg) scale(1.2)' : 'rotate(180deg) scale(1.2)',
                    color: 'primary.dark',
                  },
                }}
              />
            </Box>
          </Box>
          {isExpanded && (
            <TableContainer sx={{ overflow: 'unset', mt: 1 }}>
              <Scrollbar>
                <Table sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: '5%' }}></TableCell>
                      <TableCell sx={{ width: '20%' }}>Title</TableCell>
                      <TableCell sx={{ width: '15%' }}>Type</TableCell>
                      <TableCell sx={{ width: '10%' }}>Position</TableCell>
                      <TableCell sx={{ width: '15%', minWidth: '150px' }}>
                        Thumbnail Image
                      </TableCell>
                      <TableCell sx={{ width: '15%', minWidth: '150px' }}>Desktop Banner</TableCell>
                      <TableCell sx={{ width: '15%', minWidth: '150px' }}>Mobile Banner</TableCell>
                      <TableCell sx={{ width: '5%' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <Droppable droppableId={type} type={`type-${type}`}>
                    {(provided) => (
                      <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((x, index) => (
                          <Draggable key={x.id} draggableId={x.id} index={index}>
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  ...(snapshot.isDragging && {
                                    backgroundColor: 'action.hover',
                                  }),
                                }}
                              >
                                <TableCell sx={{ width: '5%' }}>
                                  <Iconify icon="mdi:drag" sx={{ cursor: 'move' }} />
                                </TableCell>
                                <TableCell sx={{ width: '20%' }}>{x?.title}</TableCell>
                                <TableCell sx={{ width: '15%' }} className="capitalize">
                                  {helperFunctions.stringReplacedWithSpace(x?.type || 'Default')}
                                </TableCell>
                                <TableCell sx={{ width: '10%' }}>{x?.position || '-'}</TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '150px' }}>
                                  {x?.thumbnailImage ? (
                                    <ProgressiveImg
                                      src={x?.thumbnailImage}
                                      alt="Thumbnail"
                                      style={{ maxWidth: '90px', height: 'auto' }}
                                    />
                                  ) : (
                                    'No Image'
                                  )}
                                </TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '150px' }}>
                                  {x?.desktopBannerImage ? (
                                    <ProgressiveImg
                                      src={x?.desktopBannerImage}
                                      alt="Desktop Banner"
                                      style={{ maxWidth: '100px', height: 'auto' }}
                                    />
                                  ) : (
                                    'No Image'
                                  )}
                                </TableCell>
                                <TableCell sx={{ width: '15%', minWidth: '150px' }}>
                                  {x?.mobileBannerImage ? (
                                    <ProgressiveImg
                                      src={x?.mobileBannerImage}
                                      alt="Mobile Banner"
                                      style={{ maxWidth: '100px', height: 'auto' }}
                                    />
                                  ) : (
                                    'No Image'
                                  )}
                                </TableCell>
                                <TableCell sx={{ width: '5%' }}>
                                  <Iconify
                                    className="cursor-pointer"
                                    icon="iconamoon:menu-kebab-vertical-bold"
                                    onClick={(e) => {
                                      setOpen(e.currentTarget);
                                      setSelectedCollectionId(x?.id);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    )}
                  </Droppable>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}
        </Box>
      );
    });
    return tables;
  }, [groupedFilteredItems, expandedTypes, toggleType]);

  return (
    <>
      {collectionLoading ? (
        <div className="flex justify-center items-center h-full p-4">
          <Spinner />
        </div>
      ) : (
        <DragDropContext onDragEnd={collectionLoading ? () => {} : handleDragEnd}>
          <Container>
            <Box
              sx={{
                mb: 3,
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h4">Collection</Typography>
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
                <TextField
                  size="small"
                  select
                  className="capitalize"
                  label="Collection Type"
                  value={filterByType}
                  onChange={(e) => {
                    setFilterByType(e.target.value);
                  }}
                  sx={{ minWidth: 150 }}
                >
                  {collectionTypeOptions.map((option) => (
                    <MenuItem className="capitalize" key={option} value={option}>
                      {option === 'all' ? 'All' : COLLECTION_TYPES[option]?.label || 'Default'}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  onClick={() => {
                    setFilterByType('all');
                    setSearchedValue('');
                  }}
                  variant="outlined"
                  startIcon={<Iconify icon="tdesign:filter-clear" key={Math.random()} />}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/collection/add')}
                >
                  New Collection
                </Button>
              </Box>
            </Box>
            <Card>
              <Box sx={{ p: 2, pb: 0 }}>
                <Scrollbar>
                  <Box>
                    {renderTypeTables}
                    {!filteredItems?.length && (
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', textAlign: 'center', p: 2, mt: 1 }}
                      >
                        No Data
                      </Typography>
                    )}
                  </Box>
                </Scrollbar>
              </Box>
            </Card>
          </Container>
          {renderPopup}
          {deleteDialog && (
            <ConfirmationDialog
              open={deleteDialog}
              setOpen={setDeleteDialog}
              handleConfirm={handleDelete}
              loading={crudCollectionLoading}
            >
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Are you sure you want to delete this collection?
                </p>
                <p style={{ color: '#666' }}>
                  Deleting this collection will also remove it from all linked products.
                </p>
              </div>
            </ConfirmationDialog>
          )}
        </DragDropContext>
      )}
    </>
  );
};

export default Collection;
