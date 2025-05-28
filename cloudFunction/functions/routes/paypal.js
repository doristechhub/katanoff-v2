const express = require("express");
const { optionalJwtAuth } = require("../middleware");
const {
  createPaypalOrder,
  capturePaypalOrder,
  getAccessToken,
  refundPaypalPayment,
} = require("../controllers/paypal");
const router = express.Router();

router.post("/create-paypal-order", optionalJwtAuth, createPaypalOrder);

router.post("/capture-order", optionalJwtAuth, capturePaypalOrder);

router.get("/access-token", optionalJwtAuth, getAccessToken);

router.post("/refund-paypal-payment", optionalJwtAuth, refundPaypalPayment);

module.exports = router;
