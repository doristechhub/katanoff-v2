import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { authenticationService } from 'src/_services';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const navigate = useNavigate();

  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: 'fixed',
        p: (theme) => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) }),
      }}
    >
      <Logo />
    </Box>
  );
  const logOutHandler = () => {
    authenticationService.logOut();
    navigate('/login');
  };

  return (
    <>
      {renderHeader}

      <Container>
        <Box
          sx={{
            py: 12,
            maxWidth: 480,
            mx: 'auto',
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            Access Denied
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Oops! It looks like you don't have permission to see this yet, please contact the admin.
          </Typography>
          <Button size="large" sx={{ mt: 3 }} variant="contained" onClick={logOutHandler}>
            Logout
          </Button>

          <Box
            component="img"
            src="/assets/illustrations/unauthorized.png"
            sx={{
              mx: 'auto',
              height: 320,
              my: { xs: 5, sm: 10 },
            }}
          />
        </Box>
      </Container>
    </>
  );
}
