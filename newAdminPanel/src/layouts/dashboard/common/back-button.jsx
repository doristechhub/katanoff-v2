import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <IconButton
        title="Back"
        aria-label="Back"
        onClick={() => navigate(-1)}
        sx={{ width: '40px', height: '40px' }}
      >
        <Iconify icon="tabler:arrow-back-up" width={25} />
      </IconButton>
    </>
  );
};

export default BackButton;
