import { forwardRef } from 'react';

import Slide from '@mui/material/Slide';

import { StyledDialog } from './styles';

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Dialog = forwardRef(({ sx, className, handleOpen, handleClose, children, ...other }, ref) => {
  return (
    <>
      <StyledDialog
        disableEscapeKeyDown
        open={handleOpen}
        TransitionComponent={Transition}
        keepMounted={false}
        {...other}
        aria-describedby="Dialog"
        onClose={(e, reason) => {
          if (reason !== 'backdropClick') handleClose(e);
        }}
      >
        {children}
      </StyledDialog>
    </>
  );
});

export default Dialog;
