import PropTypes from 'prop-types';
import Highcharts from 'highcharts';
import { useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { MenuItem, Stack, TextField, Typography } from '@mui/material';

import Chart from 'src/components/chart';
import Spinner from 'src/components/spinner';
import { helperFunctions } from 'src/_helpers';
import { fCurrency } from 'src/utils/format-number';
import { useDispatch, useSelector } from 'react-redux';
import { getSalesComparisionData } from 'src/_services/reportAndAnalysis.service';
import { setSelectedYearSalesComp } from 'src/store/slices/reportAndAnalysisSlice';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const currentYear = new Date().getFullYear();
export const lastFiveYears = [{ label: 'All', value: 0 }];
for (let i = currentYear; i > currentYear - 5; i--) {
  lastFiveYears.push({ label: i, value: i });
}

// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ title, subheader, chart, ...other }) {
  const { series } = chart;
  const dispatch = useDispatch();

  let { filterBy, searchValue, salesGraphData, salesCompLoader, selectedYearSalesComp } =
    useSelector(({ reportAndAnalysis }) => reportAndAnalysis);

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: 'spline',
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      exporting: {
        enabled: true, // Enable exporting module
      },
      yAxis: {
        title: {
          text: 'Amount',
        },
      },
      xAxis: {
        title: {
          text: 'Month or Year',
        },
        categories: salesGraphData?.timePeriodList,
      },

      plotOptions: {
        spline: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format:
              '<span style="font-size: 1.2em"><b>{point.name}</b>' +
              '</span><br>' +
              '<span style="opacity: 0.6">{point.y} ' +
              '%</span>',
            connectorColor: 'rgba(128,128,128,0.5)',
          },
          showInLegend: true,
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
          name: 'Sales Amount',
          data: salesGraphData?.salesAmountList,
          dataLabels: {
            formatter: function () {
              return this.y ? helperFunctions.toFixedNumber(this.y) : '';
            },
          },
        },
        {
          name: 'Refund Amount',
          data: salesGraphData?.refundAmountList,
          dataLabels: {
            formatter: function () {
              return this.y ? helperFunctions.toFixedNumber(this.y) : '';
            },
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
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' + Highcharts.numberFormat(this.y, 2);
        },
      },
    }),
    [salesGraphData]
  );
  const totalSalesAmount = salesGraphData?.salesAmountList?.reduce(
    (total, amount) => total + amount,
    0
  );
  const totalRefundAmount = salesGraphData?.refundAmountList?.reduce(
    (total, amount) => total + amount,
    0
  );

  const handleYearChange = useCallback(
    (val) => {
      const obj = lastFiveYears?.find((x) => x?.value === val);
      if (obj) {
        dispatch(setSelectedYearSalesComp(obj));

        let payload = {
          year: val,
        };
        if (filterBy && searchValue) {
          payload.filterBy = filterBy;
          payload.searchValue = searchValue;
        }
        dispatch(getSalesComparisionData(payload));
      }
    },

    [searchValue, filterBy]
  );

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
        action={
          <TextField
            select
            sx={{
              mt: '8px',
              minWidth: '150px',
            }}
            label="Year"
            value={selectedYearSalesComp?.value || 0}
            onChange={(e) => handleYearChange(e.target.value)}
          >
            {lastFiveYears?.length > 0 ? (
              lastFiveYears?.map((x, i) => (
                <MenuItem value={x?.value} key={`year-${i}`}>
                  {x?.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Item</MenuItem>
            )}
          </TextField>
        }
      />

      {salesCompLoader ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <>
          {!salesGraphData?.refundAmountList?.length && !salesGraphData?.salesAmountList?.length ? (
            <>
              <Typography
                variant="p"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <Iconify
                  icon="meteocons:not-available"
                  sx={{
                    width: 60,
                    height: 60,
                  }}
                />
              </Typography>
              <Stack direction={'row'} justifyContent={'space-between'} m={0} px={2} pb={2}>
                <Box>
                  <b>Total Sales:</b> N/A
                </Box>
                <Box>
                  <b>Total Refund:</b> N/A
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <Box sx={{ p: 3, pb: 1 }}>
                <Chart series={series} options={chartOptions} highcharts={Highcharts} />
              </Box>

              <Stack direction={'row'} justifyContent={'space-between'} m={0} px={2} pb={2}>
                <Box>
                  <b>Total Sales:</b> {fCurrency(totalSalesAmount)}
                </Box>
                <Box>
                  <b>Total Refund:</b> {fCurrency(totalRefundAmount)}
                </Box>
              </Stack>
            </>
          )}
        </>
      )}
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};
