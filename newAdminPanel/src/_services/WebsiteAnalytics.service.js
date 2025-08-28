import axios from 'axios';
import { sanitizeObject } from 'src/_helpers';

const getAllWebsiteAnalytics = async (payload) => {
  try {
    const sanitizedPayload = sanitizeObject(payload);

    const resolveAnalyticsData = await axios.get("/analytics/all", {
      params: sanitizedPayload,
    });

    return resolveAnalyticsData;
  } catch (e) {
    throw e;
  }
};

export const WebsiteAnalyticsService = {
  getAllWebsiteAnalytics,
};
