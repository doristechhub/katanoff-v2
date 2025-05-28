import { helperFunctions, sanitizeObject } from '../_helpers';
import {
  setSalesGraphData,
  setOrderStatusCountList,
  setOrderStatusLoader,
  setSalesCompLoader,
  setTopSellingLoader,
  setTopSellingProductsList,
} from '../store/slices/reportAndAnalysisSlice';
import { orderService } from './order.service';
import { toast } from 'react-toastify';

export const getOrderStatusCountData = (payload) => async (dispatch) => {
  try {
    dispatch(setOrderStatusLoader(true));
    dispatch(setOrderStatusCountList([]));
    const orderStatusCountData = await orderService.getDateRangeWiseOrderStatusCount(
      sanitizeObject(payload)
    );
    dispatch(setOrderStatusLoader(false));
    if (orderStatusCountData.length) {
      const tempArray = [
        { name: 'pending', y: 0, color: '#FFAB00' },
        { name: 'confirmed', y: 0, color: '#00A76F' },
        { name: 'shipped', y: 0, color: '#8E33FF' },
        { name: 'delivered', y: 0, color: '#00B8D9' },
        { name: 'cancelled', y: 0, color: '#FF5630' },
      ];

      orderStatusCountData.forEach((status) => {
        const foundIndex = tempArray.findIndex((item) => item.name === status.name);
        if (foundIndex !== -1) {
          tempArray[foundIndex].y = status.count;
        }
      });

      dispatch(setOrderStatusCountList(tempArray));
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setOrderStatusLoader(false));
    dispatch(setOrderStatusCountList([]));
  }
};

export const getSalesComparisionData = (payload) => async (dispatch) => {
  try {
    dispatch(setSalesCompLoader(true));
    dispatch(
      setSalesGraphData({
        timePeriodList: [],
        salesAmountList: [],
        refundAmountList: [],
      })
    );
    let salesComparisionData = await orderService.getSalesComparisionData(sanitizeObject(payload));
    dispatch(setSalesCompLoader(false));
    if (salesComparisionData) {
      salesComparisionData = {
        ...salesComparisionData,
        refundAmountList: salesComparisionData?.refundAmountList?.map((x) => Number(x?.toFixed(2))),
        salesAmountList: salesComparisionData?.salesAmountList?.map((x) => Number(x?.toFixed(2))),
      };
      const {
        timePeriodList = [],
        salesAmountList = [],
        refundAmountList = [],
      } = salesComparisionData;
      dispatch(setSalesGraphData({ timePeriodList, salesAmountList, refundAmountList }));
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setSalesCompLoader(false));
    dispatch(
      setSalesGraphData({
        timePeriodList: [],
        salesAmountList: [],
        refundAmountList: [],
      })
    );
  }
};

export const getTopSellingProductsData = (payload) => async (dispatch) => {
  try {
    dispatch(setTopSellingLoader(true));
    dispatch(setTopSellingProductsList([]));
    const sellingProductsData = await orderService.getTopSellingProducts(sanitizeObject(payload));
    dispatch(setTopSellingLoader(false));
    if (sellingProductsData.length) {
      let list = helperFunctions.sortByField(sellingProductsData);
      list = list?.map((x, i) => ({ ...x, srNo: i + 1 }));
      dispatch(setTopSellingProductsList(list));
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setTopSellingLoader(false));
    dispatch(setTopSellingProductsList([]));
  }
};
