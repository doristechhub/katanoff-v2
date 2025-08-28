
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");
const { propertyId } = require("../helpers/environment");
const message = require("../utils/messages");
const sanitizeValue = require("../helpers/sanitizeParams");

// Initialize GA4 Data API client
const client = new BetaAnalyticsDataClient({
    keyFilename: path.join(__dirname, "../credentials/google-service-katanoff-account.json"),
});

// Helper: Parse GA API response into clean JSON
const parseResponse = (response) => {
    if (!response || !response.rows) return [];
    return response.rows.map((row) => {
        const data = {};
        response.dimensionHeaders.forEach((dim, i) => {
            data[dim.name] = row.dimensionValues[i]?.value || null;
        });
        response.metricHeaders.forEach((metric, i) => {
            data[metric.name] = row.metricValues[i]?.value || null;
        });
        return data;
    });
};

// Main API: Get all analytics data (historical + real-time)
const getAllAnalyticsData = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        startDate = sanitizeValue(startDate) ? startDate.trim() : null;
        endDate = sanitizeValue(endDate) ? endDate.trim() : null;
        const dateRange = [{
            startDate: startDate || "30daysAgo",
            endDate: endDate || "today"
        }];
        const [
            [overviewRes],
            [topPagesRes],
            [trafficRes],
            [deviceRes],
            [locationRes],
            [realTimeRes],
            [eventsRes],
            [conversionsRes],
            [demographicsRes],
            [userEngagementRes],
            [referralRes],
            [searchTermsRes],
            [landingPagesRes]
        ] = await Promise.all([
            // 1. Overview (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                metrics: [
                    { name: "activeUsers" },
                    { name: "newUsers" },
                    { name: "sessions" },
                    { name: "screenPageViews" },
                    { name: "averageSessionDuration" },
                    { name: "bounceRate" },
                    { name: "eventCount" },
                    { name: "conversions" }
                ],
            }),

            // 2. Top Pages (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "pagePath" }],
                metrics: [
                    { name: "screenPageViews" },
                    { name: "averageSessionDuration" },
                    { name: "bounceRate" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "screenPageViews" } }],
                limit: 10,
            }),

            // 3. Traffic Sources (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
                metrics: [
                    { name: "sessions" },
                    { name: "activeUsers" },
                    { name: "conversions" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
                limit: 10,
            }),

            // 4. Devices
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "deviceCategory" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "sessions" },
                    { name: "bounceRate" }
                ],
            }),

            // 5. Locations (Top 10 countries)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "country" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "sessions" },
                    { name: "conversions" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "activeUsers" } }],
                limit: 10,
            }),

            // 6. Real-Time Active Users (LIVE DATA)
            client.runRealtimeReport({
                property: `properties/${propertyId}`,
                metrics: [{ name: "activeUsers" }],
                dimensions: [{ name: "country" }],
            }),

            // 7. Events (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "eventName" }],
                metrics: [
                    { name: "eventCount" },
                    { name: "eventValue" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "eventCount" } }],
                limit: 10,
            }),

            // 8. Conversions (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "eventName" }],
                metrics: [{ name: "conversions" }],
                orderBys: [{ desc: true, metric: { metricName: "conversions" } }],
                limit: 10,
            }),

            // 9. Demographics (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "userGender" }, { name: "userAgeBracket" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "sessions" }
                ],
                limit: 10,
            }),

            // 10. User Engagement (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "pagePath" }],
                metrics: [
                    { name: "userEngagementDuration" },
                    { name: "engagedSessions" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "engagedSessions" } }],
                limit: 10,
            }),

            // 11. Referral Traffic (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "sessionSource" }],
                metrics: [
                    { name: "sessions" },
                    { name: "activeUsers" }
                ],
                dimensionFilter: {
                    filter: {
                        fieldName: "sessionMedium",
                        stringFilter: { matchType: "EXACT", value: "referral" }
                    }
                },
                orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
                limit: 10,
            }),

            // 12. Search Terms (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "sessionDefaultChannelGrouping" }, { name: "searchTerm" }],
                metrics: [
                    { name: "sessions" },
                    { name: "activeUsers" }
                ],
                dimensionFilter: {
                    filter: {
                        fieldName: "sessionDefaultChannelGrouping",
                        stringFilter: { matchType: "EXACT", value: "Organic Search" }
                    }
                },
                orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
                limit: 10,
            }),

            // 13. Landing Pages (Last 30 days)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: dateRange,
                dimensions: [{ name: "landingPage" }],
                metrics: [
                    { name: "sessions" },
                    { name: "newUsers" },
                    { name: "bounceRate" }
                ],
                orderBys: [{ desc: true, metric: { metricName: "sessions" } }],
                limit: 10,
            })
        ]);

        const analyticsData = {
            overview: parseResponse(overviewRes),
            topPages: parseResponse(topPagesRes),
            trafficSources: parseResponse(trafficRes),
            devices: parseResponse(deviceRes),
            locations: parseResponse(locationRes),
            realTime: parseResponse(realTimeRes),
            events: parseResponse(eventsRes),
            conversions: parseResponse(conversionsRes),
            demographics: parseResponse(demographicsRes),
            userEngagement: parseResponse(userEngagementRes),
            referrals: parseResponse(referralRes),
            searchTerms: parseResponse(searchTermsRes),
            landingPages: parseResponse(landingPagesRes)
        }
        // Send JSON response
        return res.json({
            status: 200,
            message: message.SUCCESS,
            analyticsData
        });

    } catch (error) {
        console.error("GA API Error:", error);
        return res.status(500).json({
            status: 500,
            error: error?.message ||
                (error?.details && error.details[0]?.message)
        });
    }
};

module.exports = { getAllAnalyticsData };