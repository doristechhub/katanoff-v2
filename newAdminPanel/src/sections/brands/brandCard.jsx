import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import ProgressiveImg from 'src/components/progressive-img';

// ----------------------------------------------------------------------

export default function BrandCard({ brand, setOpenDialog, setActiveBrand }) {
  const renderImg = (
    <div className="min-h-[220px] flex justify-center items-center w-full">
      <ProgressiveImg
        src={brand?.image}
        alt={'Brand'}
        title={'Brand'}
        placeHolderClassName={'h-[75px]'}
        customClassName="!object-contain"
      />
    </div>
  );

  return (
    <Card className="group">
      <Box className="flex justify-center items-center">{renderImg}</Box>
      <Stack
        spacing={2}
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          bgcolor: 'rgba(24, 119, 242, 0.16)',
          backdropFilter: 'blur(50px)',
          gap: '0.5rem',
          transition: 'all 1s ease',
        }}
        className="group-hover:!flex"
      >
        <Iconify
          icon="icon-park-solid:delete-five"
          width={28}
          className="hover:text-[#FF5630] duration-200 transition-all ease-in-out cursor-pointer !mt-0"
          onClick={() => {
            setOpenDialog(true);
            setActiveBrand(brand);
          }}
        />
      </Stack>
    </Card>
  );
}

BrandCard.propTypes = {
  brand: PropTypes.object,
};
