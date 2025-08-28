const express = require("express");
const router = express.Router();
const { getAllAnalyticsData } = require("../controllers/analyticsController");

router.get("/all", getAllAnalyticsData);

module.exports = router;
