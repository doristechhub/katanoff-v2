import { memo } from 'react';
import HighchartsReact from 'highcharts-react-official';

import { alpha, styled } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';

// ----------------------------------------------------------------------

const Chart = styled(HighchartsReact)(({ theme }) => ({}));

export default memo(Chart);
