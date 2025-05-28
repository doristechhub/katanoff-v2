import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import {
  addShowCaseBanner,
  deleteShowCaseBanner,
  getShowCaseBannersList,
} from 'src/actions/showCaseBannerActions';
import Dialog from 'src/components/dialog';
import NoData from 'src/components/no-data';
import Spinner from 'src/components/spinner';
import { getActiveProducts } from 'src/actions';
import { Button, LoadingButton } from 'src/components/button';

import ProductCard from '../products/product-card';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

export default function ShowCaseBanner() {
  const dispatch = useDispatch();

  const [selectedProductList, setSelectedProductList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const { productLoading, activeProductList } = useSelector(({ product }) => product);
  const { showCaseBannersList, showCaseBannerLoading, crudShowCaseBannerLoading } = useSelector(
    ({ showCaseBanner }) => showCaseBanner
  );

  useEffect(() => {
    dispatch(getActiveProducts());
    dispatch(getShowCaseBannersList());
  }, []);

  const handleClose = async (id) => {
    if (id) {
      const res = await dispatch(
        deleteShowCaseBanner({
          showCaseBannerId: id,
        })
      );
      if (res) dispatch(getShowCaseBannersList());
    }
    setActiveProduct(null);
    setOpenDialog(false);
  };

  const saveHandler = useCallback(async () => {
    if (!selectedProductList?.length) {
      toast.error('Please select atleast one product for add show case banner');
      return;
    }

    if (selectedProductList?.length > 2) {
      toast.info('There is a two-banner limit for show case banner');
      return;
    }

    let filtered = selectedProductList?.filter((item1) =>
      showCaseBannersList?.some((item2) => item2?.productId !== item1?.id)
    );

    if (!filtered?.length) filtered = [...selectedProductList];
    const payload = {
      selectedProducts: filtered?.map((item) => {
        return {
          productId: item?.id,
        };
      }),
    };

    const res = await dispatch(addShowCaseBanner(payload));
    if (res) {
      setSelectedProductList([]);
      dispatch(getShowCaseBannersList());
    }
  }, [selectedProductList, showCaseBannersList]);

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
        <Typography variant="h4">Showcase Banners ({showCaseBannersList?.length}/2)</Typography>
        {showCaseBannersList?.length !== 2 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Autocomplete
              multiple
              freeSolo
              id="tags-outlined"
              filterSelectedOptions
              sx={{ width: '300px' }}
              loading={productLoading}
              options={activeProductList}
              loadingText={'loading....'}
              value={selectedProductList || []}
              onChange={(e, newValue) => {
                setSelectedProductList([...newValue]);
              }}
              getOptionLabel={(option) => option?.productName}
              renderOption={({ key, ...optionProps }, option) => {
                const props = { ...optionProps };
                delete props.key;
                return (
                  <li {...props} key={`product-Name-${option?.id}`}>
                    <Box
                      sx={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '10px',
                      }}
                    >
                      <ProgressiveImg
                        src={option?.productImage}
                        alt={'img'}
                        title={'img'}
                        customClassName="w-full h-full rounded-md"
                        // placeHolderClassName={'h-[75px]'}
                      />
                    </Box>
                    {option?.productName}
                  </li>
                );
              }}
              renderTags={(tagValue, getTagProps) => {
                return tagValue?.map((option, index) => {
                  const props = { ...getTagProps({ index }) };
                  delete props.key;
                  return (
                    <Chip
                      {...props}
                      key={`selected-product-${option?.id}`}
                      label={option?.productName}
                    />
                  );
                });
              }}
              renderInput={(params) => (
                <>
                  <TextField {...params} label="Select Products" placeholder="Products" />
                </>
              )}
            />
            <LoadingButton
              variant="contained"
              onClick={saveHandler}
              loading={crudShowCaseBannerLoading}
              startIcon={<Icon icon="material-symbols:save" />}
            >
              Save
            </LoadingButton>
          </Box>
        ) : null}
      </Box>
      <Stack sx={{ height: '99%', display: 'flex', justifyContent: 'space-between' }}>
        {showCaseBannerLoading || productLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          showCaseBannersList?.length > 0 && (
            <>
              <Grid container spacing={3}>
                {showCaseBannersList?.map((product) => (
                  <Grid key={product?.id} xs={12} sm={6} md={3}>
                    <ProductCard
                      isEdit={false}
                      isDuplicate={false}
                      product={product}
                      productId={product?.productId}
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      imagePath={product?.productImage}
                      setActiveProduct={setActiveProduct}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )
        )}
        {showCaseBannersList?.length === 0 && !showCaseBannerLoading && (
          <NoData>
            {showCaseBannersList?.length === 0 ? `Select a Product from productlist` : ''}
          </NoData>
        )}
      </Stack>
      <Dialog
        open={openDialog}
        handleClose={() => handleClose()}
        handleOpen={() => setOpenDialog(true)}
      >
        <StyledDialogTitle>Remove Product?</StyledDialogTitle>
        <StyledDialogContent>Are you sure you want to remove this product?</StyledDialogContent>
        <StyledDialogActions>
          <Button variant="outlined" onClick={() => handleClose()}>
            No
          </Button>
          <LoadingButton
            variant="contained"
            loading={crudShowCaseBannerLoading}
            onClick={() => handleClose(activeProduct?.id)}
          >
            Yes
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </Container>
  );
}
