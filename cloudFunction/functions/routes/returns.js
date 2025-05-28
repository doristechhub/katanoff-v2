const express = require("express");
const router = express.Router();
const {
  rejectReturn,
  sendReturnStatusMailController,
  refundPaymentForReturn,
} = require("../controllers/returns");
const { adminAuth, jwtAuth } = require("../middleware");
const { returnsPageId } = require("../utils/pagesList");

router.post("/rejectReturn", jwtAuth, adminAuth(returnsPageId), rejectReturn);
router.post(
  "/sendReturnStatusMail",
  jwtAuth,
  adminAuth(returnsPageId),
  sendReturnStatusMailController
);
router.post(
  "/refundPaymentForReturn",
  jwtAuth,
  adminAuth(returnsPageId),
  refundPaymentForReturn
);

module.exports = router;
