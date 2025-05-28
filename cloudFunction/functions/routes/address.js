const express = require("express");
const router = express.Router();
const { validateAddress } = require("../controllers/address");

router.post("/validateAddress", validateAddress);

module.exports = router;
