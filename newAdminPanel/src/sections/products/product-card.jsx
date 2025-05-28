import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { helperFunctions, productWebsiteUrl } from 'src/_helpers';
import { Tooltip } from '@mui/material';
import { grey } from 'src/theme/palette';
import { useCallback, useState } from 'react';
import DuplicateProductDialog from './add/duplicate-product-dialog';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedProduct } from 'src/store/slices/productSlice';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

export default function ProductCard({
  product,
  // openDialog,
  productId = null,
  imagePath = '',
  setOpenDialog,
  isEdit = true,
  isDuplicate = true,
  setActiveProduct,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [duplicateDialog, setDuplicateDialog] = useState(false);
  const { duplicateProductLoading } = useSelector(({ product }) => product);
  const renderStatus = (
    <Label
      variant="filled"
      color={product?.active ? 'success' : 'error'}
      sx={{
        top: 8,
        zIndex: 9,
        right: 8,
        position: 'absolute',
        textTransform: 'uppercase',
        padding: '6px',
        height: '18px',
        fontSize: '9px',
        borderRadius: '3px',
      }}
    >
      {product?.active ? 'active' : 'inActive'}
    </Label>
  );
  const handleDuplicateProduct = useCallback(
    (e) => {
      setDuplicateDialog(true);
      dispatch(setSelectedProduct(product));
    },
    [product]
  );

  const renderImg = (
    <div className="min-h-[220px] flex justify-center items-center w-full">
      <ProgressiveImg
        src={imagePath}
        alt={product?.title}
        title={product?.title}
        placeHolderClassName={'h-[75px]'}
      />
    </div>
  );

  const renderPrice = (
    <Typography variant="subtitle2" className="!mt-0">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product?.discount && product?.basePrice ? fCurrency(product?.basePrice) : null}
      </Typography>
      &nbsp;
      {product?.baseSellingPrice ? fCurrency(product?.baseSellingPrice) : '$0.00'}
    </Typography>
  );

  return (
    <Card className="group !rounded-lg">
      <Box className="flex justify-center items-center">
        {renderStatus}
        {renderImg}
      </Box>
      <Stack spacing={1} sx={{ py: 1, px: 2, bgcolor: 'white' }}>
        <Stack direction="row" alignItems="center" justifyContent={'space-between'} gap={1}>
          <Link
            color={grey[600]}
            underline="hover"
            variant="subtitle2"
            noWrap
            mt={0}
            sx={{ fontSize: '10px' }}
          >
            {product.sku}
          </Link>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" className="!mt-0">
          <Link color="inherit" underline="hover" variant="subtitle2" noWrap className="!mt-0">
            {product?.productName}
          </Link>
        </Stack>
        {renderPrice}
      </Stack>

      <Stack
        spacing={2}
        sx={{
          top: 0,
          width: '100%',
          gap: '0.5rem',
          height: '100%',
          display: 'none',
          position: 'absolute',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          transition: 'all 1s ease',
          backdropFilter: 'blur(50px)',
          bgcolor: 'rgba(33, 43, 54, 0.8)',
        }}
        className="group-hover:!flex"
      >
        <Tooltip title="Visit Product">
          <Iconify
            width={28}
            icon="ci:external-link"
            className="hover:text-white duration-200 transition-all ease-in-out cursor-pointer text-slate-300"
            onClick={() =>
              window.open(
                `${productWebsiteUrl}/${helperFunctions.stringReplacedWithUnderScore(product?.productName)}`,
                '_blank'
              )
            }
          />
        </Tooltip>
        {isEdit ? (
          <Tooltip title="Edit">
            <Iconify
              width={28}
              icon="flowbite:edit-solid"
              onClick={() => navigate(`/product/add?productId=${productId || product?.id}`)}
              className="hover:text-white text-slate-300 duration-200 transition-all ease-in-out cursor-pointer w-fit !mt-0"
            />
          </Tooltip>
        ) : null}
        {isDuplicate ? (
          <Tooltip title="Duplicate">
            <Iconify
              width={28}
              icon="ion:duplicate"
              onClick={handleDuplicateProduct}
              className="hover:text-white text-slate-300 duration-200 transition-all ease-in-out cursor-pointer w-fit !mt-0"
            />
          </Tooltip>
        ) : null}
        <Tooltip title="Delete">
          <Iconify
            width={28}
            onClick={() => {
              setOpenDialog(true);
              setActiveProduct(product);
            }}
            icon="icon-park-solid:delete-five"
            className="hover:text-white text-slate-300 duration-200 transition-all ease-in-out cursor-pointer !mt-0"
          />
        </Tooltip>
      </Stack>
      {duplicateDialog ? (
        <DuplicateProductDialog
          open={duplicateDialog}
          setOpen={setDuplicateDialog}
          loading={duplicateProductLoading}
        />
      ) : null}
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object,
};
