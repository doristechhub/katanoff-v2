import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import variablePie from 'highcharts/modules/variable-pie.js';

import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';
import { helperFunctions } from 'src/_helpers';
import { setOrderDateRange } from 'src/store/slices/reportAndAnalysisSlice';
import { getOrderStatusCountData } from 'src/_services/reportAndAnalysis.service';
import Spinner from 'src/components/spinner';

// ----------------------------------------------------------------------

exporting(Highcharts);
exportData(Highcharts);
variablePie(Highcharts);

const StyledChart = styled(Chart)(({ theme }) => ({}));

// ----------------------------------------------------------------------

export default function AppCurrentVisits({
  title,
  pieRef,
  subheader,
  getOrderStatusCount,
  ...other
}) {
  const dispatch = useDispatch();

  const {
    filterBy,
    searchValue,
    orderDateRange,
    selectedVariation,
    orderStatusLoader,
    orderStatusCountList,
  } = useSelector(({ reportAndAnalysis }) => reportAndAnalysis);

  const isSearchDisabled =
    !orderDateRange.startDate ||
    !orderDateRange.endDate ||
    orderDateRange.endDate < orderDateRange.startDate;

  const chartOptions = useMemo(
    () => ({
      title: {
        text: '',
      },
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false,
      },
      exporting: {
        enabled: true, // Enable exporting module
      },
      tooltip: {
        pointFormat: '{point.y}',
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          showInLegend: true,
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            connectorColor: 'rgba(128,128,128,0.5)',
            format:
              '<span style="font-size: 1.2em"><b>{point.name}</b>' +
              '</span><br>' +
              '<span style="opacity: 0.6">{point.y} ' +
              '%</span>',
          },
        },
        series: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: [
            {
              enabled: true,
              distance: -40,
              format: '{point.y}',
              style: {
                opacity: 0.7,
                fontSize: '1.2em',
                textOutline: 'none',
              },
              filter: {
                value: 0,
                operator: '>',
                property: 'percentage',
              },
            },
          ],
        },
      },
      series: [
        {
          zMin: 0,
          name: '',
          type: 'pie',
          size: '100%',
          borderWidth: 4,
          minPointSize: 10,
          showInLegend: true,
          borderRadius: '5px',
          borderColor: 'white',
          data: orderStatusCountList,
          dataLabels: {
            enabled: false,
          },
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                align: 'center',
                layout: 'horizontal',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    }),
    [orderStatusCountList]
  );
  const handleClear = useCallback(() => {
    const dateRange = helperFunctions.getWeeksRange();
    dispatch(setOrderDateRange(dateRange));
    let payload = {
      fromDate: moment(dateRange?.startDate).format('MM-DD-YYYY'),
      toDate: moment(dateRange?.endDate).format('MM-DD-YYYY'),
    };
    if (filterBy && searchValue) {
      payload.filterBy = filterBy;
      payload.searchValue = searchValue;
      payload.selectedVariation = selectedVariation;
    }
    dispatch(getOrderStatusCountData(payload));
  }, [filterBy, searchValue, selectedVariation]);

  return (
    <Card
      {...other}
      sx={{
        height: '100%',
        display: 'flex',
        minHeight: '520px',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={title}
        subheader={subheader}
        disabled={isSearchDisabled || orderStatusLoader}
        action={
          <>
            <IconButton
              onClick={handleClear}
              disabled={orderStatusLoader}
              sx={{ color: 'warning.main' }}
            >
              <Iconify icon="material-symbols:filter-alt-off-rounded" />
            </IconButton>
            <IconButton
              ref={pieRef}
              onClick={getOrderStatusCount}
              disabled={isSearchDisabled || orderStatusLoader}
              sx={{
                height: 'fit-content',
                color: isSearchDisabled ? 'default.main' : 'secondary.main',
              }}
            >
              <Iconify icon="iconamoon:search-duotone" width={20} />
            </IconButton>
          </>
        }
      />

      {orderStatusLoader ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : orderStatusCountList.every((item) => item.y === 0) ? (
        <Typography
          variant="p"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <Iconify
            icon="meteocons:not-available"
            sx={{
              width: 60,
              height: 60,
            }}
          />
        </Typography>
      ) : (
        <Box sx={{ mt: 'auto' }}>
          <FilterBox />
          <StyledChart options={chartOptions} highcharts={Highcharts} />
        </Box>
      )}
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

const FilterBox = () => {
  const dispatch = useDispatch();
  const { orderDateRange } = useSelector(({ reportAndAnalysis }) => reportAndAnalysis);

  const today = new Date();

  const handleDateChange = useCallback(
    (key, val) => {
      dispatch(
        setOrderDateRange({
          ...orderDateRange,
          [key]: val,
        })
      );

      if (key === 'startDate' && orderDateRange?.endDate && val > orderDateRange?.endDate) {
        dispatch(
          setOrderDateRange({
            ...orderDateRange,
            endDate: null,
          })
        );
      } else if (
        key === 'endDate' &&
        orderDateRange?.startDate &&
        val < orderDateRange?.startDate
      ) {
        dispatch(
          setOrderDateRange({
            ...orderDateRange,
            startDate: null,
          })
        );
      }
    },
    [orderDateRange]
  );

  return (
    <Stack
      mx={1}
      gap={1}
      flexWrap={'wrap'}
      direction={'row'}
      alignItems={'center'}
      justifyContent={'right'}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            maxDate={today}
            label="Start Date"
            sx={{ width: '150px' }}
            value={orderDateRange?.startDate}
            onChange={(e) => handleDateChange('startDate', e)}
          />
        </DemoContainer>
      </LocalizationProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="End Date"
            sx={{ width: '150px' }}
            value={orderDateRange?.endDate}
            maxDate={orderDateRange?.endDate}
            onChange={(e) => handleDateChange('endDate', e)}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Stack>
  );
};
