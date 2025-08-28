import { WebsiteAnalyticsService } from "src/_services/WebsiteAnalytics.service";
import {
    setWebsiteAnalyticsData,
    setWebsiteAnalyticsError,
    setWebsiteAnalyticsLoading
} from "src/store/slices/websiteAnalyticsSlice";

export const getAllWebsiteAnalytics = (payload) => async (dispatch) => {
    try {
        dispatch(setWebsiteAnalyticsLoading(true));

        const res = await WebsiteAnalyticsService.getAllWebsiteAnalytics(payload);

        if (res?.data?.status === 200) {
            dispatch(setWebsiteAnalyticsData(res.data.analyticsData));
            return true;
        }
    } catch (e) {
        const errorMessage = e?.response?.data?.error ||
            "Something went wrong while fetching website analytics.";

        console.error(errorMessage);
        dispatch(setWebsiteAnalyticsError(errorMessage));
        return false;
    } finally {
        dispatch(setWebsiteAnalyticsLoading(false));
    }
};
