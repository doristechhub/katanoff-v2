import { forwardRef } from 'react';

import StyledTextarea from './styles';

// ----------------------------------------------------------------------

const Textarea = forwardRef(({ sx, ...other }, ref) => {
  return <StyledTextarea sx={sx} {...other} />;
});

export default Textarea;
