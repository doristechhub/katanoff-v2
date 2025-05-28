import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOrderStatusCountData } from 'src/_services/reportAndAnalysis.service';

import AppCurrentVisits from '../overview/app-current-visits';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const OrderStatusPieChart = ({ pieRef }) => {
  const dispatch = useDispatch();

  let { filterBy, searchValue, selectedVariation, orderDateRange } = useSelector(
    ({ reportAndAnalysis }) => reportAndAnalysis
  );

  const getOrderStatusCount = useCallback(() => {
    let payload = {
      fromDate: moment(orderDateRange?.startDate).format('MM-DD-YYYY'),
      toDate: moment(orderDateRange?.endDate).format('MM-DD-YYYY'),
    };
    if (filterBy && searchValue) {
      payload.filterBy = filterBy;
      payload.searchValue = searchValue;
      payload.selectedVariation = selectedVariation;
    }
    dispatch(getOrderStatusCountData(payload));
  }, [orderDateRange, filterBy, searchValue, selectedVariation]);

  useEffect(() => {
    getOrderStatusCount();
  }, []);

  return (
    <AppCurrentVisits title="Orders" getOrderStatusCount={getOrderStatusCount} pieRef={pieRef} />
  );
};

export default OrderStatusPieChart;
