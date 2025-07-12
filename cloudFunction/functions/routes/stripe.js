const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  cancelPaymentIntent,
  checkPaymentIntentStatus,
  stripeWebhook,
  fetchPaymentIntent,
} = require("../controllers/stripe");
const { optionalJwtAuth } = require("../middleware");

router.post("/create-payment-intent", optionalJwtAuth, createPaymentIntent);
// router.post("/create-payment-intent", jwtAuth, userAuth, createPaymentIntent);
router.post("/check-payment-intent-status", checkPaymentIntentStatus);
router.post("/retrive-payment-intent", fetchPaymentIntent);
router.post("/cancel-payment-intent", cancelPaymentIntent);
router.post("/webhook", stripeWebhook);
module.exports = router;
