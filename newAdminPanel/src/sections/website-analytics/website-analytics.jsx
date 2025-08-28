import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  People,
  TrendingUp,
  Visibility,
  AccessTime,
  Refresh,
  Computer,
  Public,
  Event,
  Pageview,
  Insights,
} from '@mui/icons-material';
import { getAllWebsiteAnalytics } from 'src/actions/WebsiteAnalyticsAction';
import { useEffect, useState } from 'react';
import Spinner from 'src/components/spinner';
import { setWebsiteAnalyticsError } from 'src/store/slices/websiteAnalyticsSlice';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import variablePie from 'highcharts/modules/variable-pie';

exporting(Highcharts);
exportData(Highcharts);
variablePie(Highcharts);

// Utility Functions
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0m 0s';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

const formatPercentage = (value) => {
  if (!value || isNaN(value)) return '0%';
  return `${(parseFloat(value) * 100).toFixed(1)}%`;
};

const formatNumber = (num) => {
  if (!num) return '0';
  return parseInt(num).toLocaleString();
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ p: isMobile ? 1 : 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant={isMobile ? 'caption' : 'body2'} color="text.secondary">
              {title}
            </Typography>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: isMobile ? 30 : 40, color, opacity: 0.8 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const WebsiteAnalytics = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [dateError, setDateError] = useState('');
  let { websiteAnalyticsLoading, websiteAnalyticsData, websiteAnalyticsError } = useSelector(
    ({ websiteAnalytics }) => websiteAnalytics
  );

  const validateDates = (start, end) => {
    const today = new Date();
    if (start && end && start > end) {
      return 'Start date must be before end date';
    }
    if (end && end > today) {
      return 'End date cannot be in the future';
    }
    return '';
  };
  const fetchAnalytics = async ({ startDate = null, endDate = null }) => {
    const error = validateDates(startDate, endDate);
    setDateError(error);
    console.log(error);
    if (!error) {
      await dispatch(
        getAllWebsiteAnalytics({
          startDate: startDate ? startDate.toISOString().split('T')[0] : '',
          endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        })
      );
    }
  };

  const trafficSourcesChartOptions = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
    },
    title: { text: '' },
    tooltip: {
      pointFormat: '{point.y} Sessions ({point.percentage:.1f}%)',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.y}',
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: 'Sessions',
        colorByPoint: true,
        data:
          websiteAnalyticsData.trafficSources?.map((item) => ({
            name: item.sessionSource,
            y: Number(item.sessions) || 0,
          })) || [],
      },
    ],
  };

  useEffect(() => {
    fetchAnalytics({ startDate, endDate });
  }, [startDate, endDate]);

  const handleRefresh = () => {
    setStartDate(thirtyDaysAgo);
    setEndDate(today);
    setDateError('');
    dispatch(setWebsiteAnalyticsError(''));
    fetchAnalytics();
  };

  if (!websiteAnalyticsData) return null;

  const overview = websiteAnalyticsData?.overview?.[0] || {};

  return (
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 4 }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'flex-start' : 'center'}
        mb={isMobile ? 2 : 4}
        gap={isMobile ? 2 : 0}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
          Website Analytics
        </Typography>
        <Box display="flex" flexDirection={'row'} gap={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              maxDate={endDate || new Date()}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: isMobile,
                  error: !!dateError,
                },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate || undefined}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: isMobile,
                  error: !!dateError,
                  helperText: dateError,
                },
              }}
            />
          </LocalizationProvider>

          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {websiteAnalyticsError ? (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            {websiteAnalyticsError}
          </Alert>
        </>
      ) : null}
      {websiteAnalyticsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Spinner />
        </Box>
      ) : (
        <>
          {/* Overview Metrics */}
          <Grid container spacing={isMobile ? 2 : 3} mb={isMobile ? 2 : 4}>
            <Grid item xs={6} sm={6} md={3}>
              <MetricCard
                title="Active Users"
                value={overview?.activeUsers != null ? formatNumber(overview.activeUsers) : '0'}
                icon={People}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <MetricCard
                title="Sessions"
                value={overview?.sessions != null ? formatNumber(overview.sessions) : '0'}
                icon={TrendingUp}
                color="#2e7d32"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <MetricCard
                title="Page Views"
                value={
                  overview?.screenPageViews != null ? formatNumber(overview.screenPageViews) : '0'
                }
                icon={Visibility}
                color="#ed6c02"
              />
            </Grid>
            <Grid item xs={6} sm={6} md={3}>
              <MetricCard
                title="Avg. Duration"
                value={
                  overview?.averageSessionDuration != null
                    ? formatDuration(overview.averageSessionDuration)
                    : '--'
                }
                icon={AccessTime}
                color="#9c27b0"
              />
            </Grid>
          </Grid>

          <Box my={isMobile ? 2 : 4}>
            <Divider />
          </Box>

          {/* Detailed Sections */}
          <Grid container spacing={isMobile ? 2 : 3}>
            {/* Traffic Sources Pie Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold" mb={2}>
                  Traffic Sources
                </Typography>
                {websiteAnalyticsData.trafficSources?.length > 0 ? (
                  <HighchartsReact highcharts={Highcharts} options={trafficSourcesChartOptions} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Referrals */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Public sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Referrals
                  </Typography>
                </Box>
                {websiteAnalyticsData.referrals?.length > 0 ? (
                  websiteAnalyticsData.referrals.map((referral, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      py={1}
                      sx={{
                        borderBottom:
                          index < websiteAnalyticsData.referrals.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>
                        {referral.sessionSource}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={`${referral.activeUsers} Users`}
                          size={isMobile ? 'small' : 'medium'}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${referral.sessions} Sessions`}
                          size={isMobile ? 'small' : 'medium'}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Devices */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Computer sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Devices
                  </Typography>
                </Box>
                {websiteAnalyticsData.devices?.length > 0 ? (
                  websiteAnalyticsData.devices.map((device, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      py={1}
                      sx={{
                        borderBottom:
                          index < websiteAnalyticsData.devices.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        sx={{
                          textTransform: 'capitalize',
                          fontSize: isMobile ? '0.85rem' : '1rem',
                        }}
                      >
                        {device.deviceCategory}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={`${device.activeUsers} Users`}
                          size={isMobile ? 'small' : 'medium'}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${device.sessions} Sessions`}
                          size={isMobile ? 'small' : 'medium'}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Locations */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Public sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Locations
                  </Typography>
                </Box>
                {websiteAnalyticsData.locations?.length > 0 ? (
                  websiteAnalyticsData.locations.map((location, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      py={1}
                      sx={{
                        borderBottom:
                          index < websiteAnalyticsData.locations.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>
                        {location.country}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Chip
                          label={`${location.activeUsers} Users`}
                          size={isMobile ? 'small' : 'medium'}
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`${location.sessions} Sessions`}
                          size={isMobile ? 'small' : 'medium'}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No data available.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Real-Time Analytics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Event sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Real-Time Analytics
                  </Typography>
                </Box>
                {websiteAnalyticsData.realTime && websiteAnalyticsData.realTime.length > 0 ? (
                  <TableContainer sx={{ maxHeight: 300, overflowX: 'auto' }}>
                    <Table size={isMobile ? 'small' : 'medium'}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Country</TableCell>
                          <TableCell align="right">Active Users</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {websiteAnalyticsData.realTime.map((rt, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {rt.country}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {formatNumber(rt.activeUsers)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No real-time data available.
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Events Table */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Insights sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Events
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 300, overflowX: 'auto' }}>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event Name</TableCell>
                        <TableCell align="right">Event Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {websiteAnalyticsData.events?.length > 0 ? (
                        websiteAnalyticsData.events.map((event, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {event.eventName}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {formatNumber(event.eventCount)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No data available.
                        </Typography>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* User Engagement Table */}
            <Grid item xs={12}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    User Engagement
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 300, overflowX: 'auto' }}>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Page Path</TableCell>
                        <TableCell align="right">Engagement Duration</TableCell>
                        {!isMobile && <TableCell align="right">Engaged Sessions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {websiteAnalyticsData.userEngagement?.length > 0 ? (
                        websiteAnalyticsData.userEngagement.map((engagement, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {engagement.pagePath}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {formatDuration(engagement.userEngagementDuration)}
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                                {formatNumber(engagement.engagedSessions)}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <Typography variant="body2" className="p-4" color="text.secondary">
                          No data available.
                        </Typography>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Landing Pages Table */}
            <Grid item xs={12}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Pageview sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Landing Pages
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 300, overflowX: 'auto' }}>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Landing Page</TableCell>
                        <TableCell align="right">Sessions</TableCell>
                        {!isMobile && <TableCell align="right">New Users</TableCell>}
                        {!isMobile && <TableCell align="right">Bounce Rate</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {websiteAnalyticsData.landingPages?.length > 0 ? (
                        websiteAnalyticsData.landingPages.map((page, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {page.landingPage}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {formatNumber(page.sessions)}
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                                {formatNumber(page.newUsers)}
                              </TableCell>
                            )}
                            {!isMobile && (
                              <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                                {formatPercentage(page.bounceRate)}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <Typography variant="body2" className="p-4" color="text.secondary">
                          No data available.
                        </Typography>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Top Pages Table */}
            <Grid item xs={12}>
              <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Pageview sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="bold">
                    Top Pages
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 300, overflowX: 'auto' }}>
                  <Table size={isMobile ? 'small' : 'medium'}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Page Path</TableCell>
                        <TableCell align="right">Page Views</TableCell>
                        {!isMobile && <TableCell align="right">Avg. Duration</TableCell>}
                        {!isMobile && <TableCell align="right">Bounce Rate</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {websiteAnalyticsData.topPages?.length > 0 ? (
                        websiteAnalyticsData.topPages.map((page, index) => (
                          <TableRow key={index} hover>
                            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                              {page.pagePath}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                              {formatNumber(page.screenPageViews)}
                            </TableCell>
                            {!isMobile && (
                              <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                                {formatDuration(page.averageSessionDuration)}
                              </TableCell>
                            )}
                            {!isMobile && (
                              <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                                {formatPercentage(page.bounceRate)}
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <Typography variant="body2" className="p-4" color="text.secondary">
                          No data available.
                        </Typography>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default WebsiteAnalytics;
