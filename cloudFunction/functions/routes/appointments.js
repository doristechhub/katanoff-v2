const express = require("express");
const router = express.Router();
const { updateAppointmentStatus } = require("../controllers/appointments");
const { adminAuth, jwtAuth } = require('../middleware');
const { appointmentsPageId } = require("../utils/pagesList");

router.post("/updateAppointmentStatus",jwtAuth,adminAuth(appointmentsPageId), updateAppointmentStatus);


module.exports = router;
