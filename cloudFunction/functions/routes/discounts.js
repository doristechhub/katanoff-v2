const express = require("express");
const router = express.Router();
const {
  sendDiscountToAllUsers
} = require("../controllers/discounts");
const { discountsPageId } = require("../utils/pagesList");
const { adminAuth, jwtAuth } = require("../middleware");

router.post("/notify-users", jwtAuth, adminAuth(discountsPageId), sendDiscountToAllUsers);

module.exports = router;
