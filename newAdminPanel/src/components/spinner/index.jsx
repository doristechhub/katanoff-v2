import { memo } from 'react';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const Spinner = ({ width = 50 }) => {
  return <Iconify icon="svg-spinners:12-dots-scale-rotate" width={width} />;
};

export default memo(Spinner);
