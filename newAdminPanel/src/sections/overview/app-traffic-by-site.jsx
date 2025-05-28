import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppTrafficBySite({ title, subheader, list, navigate, ...other }) {
  return (
    <Card {...other} sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          p: 3,
          gap: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {list?.map((site) => (
          <Paper
            key={site?.name}
            variant="outlined"
            onClick={navigate}
            sx={{ py: 2.5, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}
          >
            <Box sx={{ mb: 0.5 }}>{site?.icon}</Box>

            <Typography variant="h6">{fShortenNumber(site?.value)}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {site?.name}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Card>
  );
}

AppTrafficBySite.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};
