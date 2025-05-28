import { dashboardController } from '../_controller';
import { setDashLoader, setDashboardDetail } from '../store/slices/dashboardSlice';
import { toast } from 'react-toastify';

export const getDashboardData = () => async (dispatch) => {
  try {
    dispatch(setDashLoader(true));
    dispatch(setDashboardDetail({}));
    const dashboardCountData = await dashboardController.getAllDashboardCount();
    dispatch(setDashLoader(false));
    if (dashboardCountData) {
      dispatch(setDashboardDetail(dashboardCountData));
    }
  } catch (err) {
    toast.error(err.message);
    dispatch(setDashLoader(false));
    dispatch(setDashboardDetail({}));
  }
};
