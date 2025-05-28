import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import { Box, TextField } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import NoData from 'src/components/no-data';
import Spinner from 'src/components/spinner';
import Pagination from 'src/components/pagination';
import { FileDrop } from 'src/components/file-drop';
import { fPageCount } from 'src/utils/format-number';
import { perPageCountOptions } from 'src/_helpers/constants';
import { Button, LoadingButton } from 'src/components/button';
import { createBrand, deleteBrand, getBrands } from 'src/actions/brandActions';
import { setCrudBrandLoading, setPerPageCount } from 'src/store/slices/brandSlice';

import BrandCard from './brandCard';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  previewImage: Yup.array().min(1).required('Brand image is required'),
});

// ----------------------------------------------------------------------

export default function SliderViewAdd() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [activeBrand, setActiveBrand] = useState(null);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [openBrandDropDialog, setBrandDropDialog] = useState(false);

  const initialValues = {
    imageFile: null,
    previewImage: null,
  };

  const { brandsList, brandLoading, crudBrandLoading, perPageCount } = useSelector(
    ({ brand }) => brand
  );

  const loadData = useCallback(
    (pageNo = page) => {
      dispatch(getBrands());
      setPage(pageNo);
    },
    [dispatch, page]
  );

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredList(brandsList);
    const indexOfLastItem = page * perPageCount;
    const indexOfFirstItem = indexOfLastItem - perPageCount;
    const currentItems = brandsList?.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentPageData(currentItems);
  }, [page, brandsList, perPageCount]);

  const pageCount = (
    <TextField
      select
      size="small"
      value={perPageCount}
      onChange={(e) => {
        dispatch(setPerPageCount(e.target.value));
        setPage(1);
      }}
    >
      {perPageCountOptions?.map((option) => (
        <MenuItem key={option?.value} value={option?.value}>
          {option?.label}
        </MenuItem>
      ))}
    </TextField>
  );

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleClose = async (id) => {
    if (id) {
      const res = await dispatch(deleteBrand(id));
      if (res) {
        const cPage = page !== 1 && currentPageData?.length === 1 ? page - 1 : page;
        loadData(cPage);
        dispatch(setCrudBrandLoading(false));
      }
    }
    setActiveBrand(null);
    setOpenDialog(false);
  };

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      imageFile: values.imageFile?.[0],
    };
    const res = await dispatch(createBrand(payload));
    if (res) {
      dispatch(getBrands());
      resetForm();
      dispatch(setCrudBrandLoading(false));
    }
    setBrandDropDialog(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const onBrandDialogClose = async () => {
    setBrandDropDialog(false);
    formik.resetForm();
  };

  return (
    <Container sx={{ height: '100%' }}>
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
        <Typography variant="h4">Brands</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setBrandDropDialog(true)}
            variant="contained"
          >
            New Brand
          </Button>
        </Box>
      </Box>
      <Stack sx={{ height: '99%', display: 'flex', justifyContent: 'space-between' }}>
        {brandLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          currentPageData?.length > 0 && (
            <>
              <Grid container spacing={3}>
                {currentPageData?.map((brand) => (
                  <Grid key={brand?.id} xs={12} sm={6} md={3}>
                    <BrandCard
                      brand={brand}
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      setActiveBrand={setActiveBrand}
                    />
                  </Grid>
                ))}
              </Grid>
              <Stack
                sx={{
                  mb: 6,
                  mt: 2,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Typography variant="subtitle2">Total Products: {brandsList?.length}</Typography>
                  {pageCount}
                </Stack>
                <Pagination
                  className="flex justify-center items-center"
                  page={page}
                  onChange={handleChangePage}
                  count={fPageCount(filteredList?.length, perPageCount)}
                />
              </Stack>
            </>
          )
        )}
        {(brandsList?.length === 0 || currentPageData?.length === 0) && !brandLoading && (
          <NoData>Click the "New Brand" button to get started.</NoData>
        )}
      </Stack>

      {/*  ---------------------------------------------------------------------- */}

      <Dialog
        open={openDialog}
        handleClose={() => handleClose()}
        handleOpen={() => setOpenDialog(true)}
      >
        <StyledDialogTitle>Remove Brand?</StyledDialogTitle>
        <StyledDialogContent>Are you sure you want to remove this brand?</StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={() => handleClose()} variant="outlined">
            No
          </Button>
          <LoadingButton
            variant="contained"
            loading={crudBrandLoading}
            onClick={() => handleClose(activeBrand?.id)}
          >
            Yes
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>

      {/*  ---------------------------------------------------------------------- */}

      <Dialog
        open={openBrandDropDialog}
        handleClose={onBrandDialogClose}
        handleOpen={() => setBrandDropDialog(true)}
      >
        <StyledDialogTitle>New Brand</StyledDialogTitle>
        <StyledDialogContent>
          <FileDrop
            mediaLimit={1}
            formik={formik}
            fileKey={'imageFile'}
            loading={crudBrandLoading}
            previewKey={'previewImage'}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <Button variant="outlined" disabled={crudBrandLoading} onClick={onBrandDialogClose}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={crudBrandLoading}
            onClick={formik.handleSubmit}
          >
            Save
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </Container>
  );
}
