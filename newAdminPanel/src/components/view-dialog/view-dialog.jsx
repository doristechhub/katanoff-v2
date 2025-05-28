import { memo } from 'react';
import { Dialog, Typography, Grid, Box } from '@mui/material';
import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import { Button } from 'src/components/button';
// Styled components for consistent dialog styling

// Helper function to render field labels
const getTypoGraphy = (title, variant = 'subtitle2') => (
  <Typography variant={variant} sx={{ color: 'text.primary' }}>
    {title}
  </Typography>
);

// ViewDialog component to display contact details
const ViewDialog = ({ open, setOpen, contact, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      //   PaperProps={{
      //     sx: {
      //       boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      //       maxWidth: 600,
      //     },
      //   }}
    >
      <StyledDialogTitle>Contact Details</StyledDialogTitle>
      <StyledDialogContent sx={{ color: 'text.secondary' }}>
        {contact ? (
          <>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={12} sm={6}>
                {getTypoGraphy('First Name')}
                <Typography variant="body1">{contact.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {getTypoGraphy('Last Name')}
                <Typography variant="body1">{contact.lastName}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={12} sm={6}>
                {getTypoGraphy('Email')}
                <Typography variant="body1">{contact.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                {getTypoGraphy('Mobile')}
                <Typography variant="body1">{contact.mobile}</Typography>
              </Grid>
            </Grid>
            <Box mb={1}>
              {getTypoGraphy('Requirement')}
              <Typography variant="body1">{contact.requirement}</Typography>
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No contact selected
          </Typography>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <Button onClick={() => setOpen(false)} variant={'contained'}>
          Cancel
        </Button>
      </StyledDialogActions>
    </Dialog>
  );
};

export default memo(ViewDialog);
