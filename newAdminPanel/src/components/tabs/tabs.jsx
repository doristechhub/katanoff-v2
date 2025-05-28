import { forwardRef } from 'react';

import { StyledTab, StyledTabList } from './styles';

// ----------------------------------------------------------------------

export const TabList = forwardRef(({ sx, ...other }, ref) => {
  return <StyledTabList sx={sx} {...other} />;
});

export const Tab = forwardRef(({ sx, ...other }, ref) => {
  return <StyledTab sx={sx} {...other} />;
});
