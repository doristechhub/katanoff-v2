import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { helperFunctions } from 'src/_helpers';
import { authenticationService } from 'src/_services';
import profileLogo from '/assets/images/avatars/avatar_25.jpg';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Forget Password',
    path: '/forget-password',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const currentUser = helperFunctions.getCurrentUser();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (path) => {
    setOpen(null);
    if (typeof path === 'string') navigate(path);
  };

  const logOutHandler = () => {
    authenticationService.logOut();
    setOpen(null);
    navigate('/login');
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={profileLogo}
          alt={currentUser?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {currentUser?.firstName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      {!!open ? (
        <Popover
          open={!!open}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
              width: 200,
            },
          }}
        >
          <Box sx={{ my: 1.5, px: 2 }}>
            <Typography variant="subtitle2" noWrap>
              {currentUser?.firstName} {currentUser?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {currentUser?.email}
            </Typography>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          {MENU_OPTIONS?.map((option) => (
            <MenuItem key={option?.label} onClick={() => handleClose(option?.path)}>
              {option?.label}
            </MenuItem>
          ))}

          <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

          <MenuItem
            disableRipple
            disableTouchRipple
            onClick={logOutHandler}
            sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
          >
            Logout
          </MenuItem>
        </Popover>
      ) : null}
    </>
  );
}
