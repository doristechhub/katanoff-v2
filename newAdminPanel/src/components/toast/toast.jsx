import { memo } from 'react';
import { ToastContainer } from 'react-toastify';

// ----------------------------------------------------------------------

const Toast = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3000}
    hideProgressBar
    theme="colored"
    className={'text-sm'}
  />
);

export default memo(Toast);
