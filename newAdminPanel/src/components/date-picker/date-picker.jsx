import { forwardRef } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// ----------------------------------------------------------------------

export const DatePicker = forwardRef(({ sx, ...other }, ref) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker', 'DatePicker']}>
        <DatePicker label={'"year", "month" and "day"'} views={['year', 'month', 'day']} />
        <DatePicker label={'"day"'} views={['day']} />
        <DatePicker label={'"month" and "year"'} views={['month', 'year']} />
      </DemoContainer>
    </LocalizationProvider>
  );
});
