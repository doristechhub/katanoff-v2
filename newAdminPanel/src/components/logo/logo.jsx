import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import logo from '/assets/logo.webp';
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  return (
    <Link component={RouterLink} href="/">
      <Box
        component="img"
        src={logo}
        sx={{
          mt: 3,
          objectFit: 'contain',
          ...sx,
        }}
      />
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
