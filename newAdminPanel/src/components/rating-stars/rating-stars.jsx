import { memo } from 'react';

import Iconify from '../iconify';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

const RenderRatingStars = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const halfStars = rating - filledStars >= 0.5 ? 1 : 0;
  const unfilledStars = 5 - filledStars - halfStars;

  return filledStars ? (
    <Stack direction={'row'}>
      {Array(filledStars)
        .fill()
        .map((_) => (
          <Iconify icon="ic:baseline-star-rate" key={Math.random()} color="#ffc41f" />
        ))}
      {Array(halfStars)
        .fill()
        .map((_) => (
          <Iconify icon="ic:outline-star-half" key={Math.random()} color="#ffc41f" />
        ))}
      {Array(unfilledStars)
        .fill()
        .map((_) => (
          <Iconify icon="ic:outline-star-rate" key={Math.random()} color="#ffc41f" />
        ))}
    </Stack>
  ) : null;
};

export default memo(RenderRatingStars);
