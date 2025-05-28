import { forwardRef } from 'react';

import { StyledButton, StyledLoadingButton } from './styles';

// ----------------------------------------------------------------------

export const Button = forwardRef(({ sx, className, children, ...other }, ref) => {
  return (
    <StyledButton {...other} sx={sx} className={className}>
      {children}
    </StyledButton>
  );
});

export const LoadingButton = forwardRef(({ sx, className, children, ...other }, ref) => {
  return (
    <StyledLoadingButton {...other} sx={sx} className={className}>
      {children}
    </StyledLoadingButton>
  );
});
