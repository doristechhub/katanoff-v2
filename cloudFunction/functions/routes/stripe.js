const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  cancelPaymentIntent,
  checkPaymentIntentStatus,
  stripeWebhook,
} = require("../controllers/stripe");
const { jwtAuth, adminAuth, optionalJwtAuth } = require("../middleware");

router.post("/create-payment-intent", optionalJwtAuth, createPaymentIntent);
// router.post("/create-payment-intent", jwtAuth, userAuth, createPaymentIntent);
router.post("/check-payment-intent-status", checkPaymentIntentStatus);
router.post("/cancel-payment-intent", cancelPaymentIntent);
router.post("/webhook", stripeWebhook);
module.exports = router;
