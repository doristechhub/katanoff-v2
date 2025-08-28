import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    websiteAnalyticsData: {
        overview: [],
        trafficSources: [],
        topPages: [],
        devices: [],
        locations: [],
        realTime: [],
        events: [],
        userEngagement: [],
        landingPages: [],
        referrals: [],
    },
    websiteAnalyticsLoading: false,
    websiteAnalyticsError: ""
};

const websiteAnalyticsSlice = createSlice({
    name: 'websiteAnalytics',
    initialState,
    reducers: {
        setWebsiteAnalyticsLoading: (state, action) => {
            state.websiteAnalyticsLoading = action.payload;
        },
        setWebsiteAnalyticsData: (state, action) => {
            state.websiteAnalyticsData = action.payload;
        },
        setWebsiteAnalyticsError: (state, action) => {
            state.websiteAnalyticsError = action.payload;
        },
    },
});

export const { setWebsiteAnalyticsData, setWebsiteAnalyticsLoading, setWebsiteAnalyticsError } = websiteAnalyticsSlice.actions;
export default websiteAnalyticsSlice.reducer;
