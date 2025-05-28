import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getSalesComparisionData } from 'src/_services/reportAndAnalysis.service';

import AppWebsiteVisits from '../overview/app-website-visits';

// ----------------------------------------------------------------------

const SalesChart = () => {
  const dispatch = useDispatch();

  let { filterBy, searchValue, salesGraphData, selectedYearSalesComp } = useSelector(
    ({ reportAndAnalysis }) => reportAndAnalysis
  );

  useEffect(() => {
    getSalesComparisionList();
  }, []);

  const getSalesComparisionList = (year = selectedYearSalesComp) => {
    let payload = {
      year,
    };
    if (filterBy && searchValue) {
      payload.filterBy = filterBy;
      payload.searchValue = searchValue;
    }
    dispatch(getSalesComparisionData(payload));
  };

  return (
    <AppWebsiteVisits
      title="Sales"
      chart={{
        labels: salesGraphData?.timePeriodList,
        data: salesGraphData,
        series: [
          {
            type: 'line',
            fill: 'solid',
            name: 'Sales',
            data: salesGraphData?.salesAmountList,
          },
          {
            type: 'line',
            fill: 'solid',
            name: 'Refund',
            data: salesGraphData?.refundAmountList,
          },
        ],
      }}
    />
  );
};

export default SalesChart;
