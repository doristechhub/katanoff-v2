const express = require("express");
const router = express.Router();
const {
  sendOtpForEmailVerification,
  verifyOtp,
  sendWelcomeMail,
  signupWithDiscount,
} = require("../controllers/user");

router.post("/sendOtpForEmailVerification", sendOtpForEmailVerification);
router.post("/verifyOtp", verifyOtp);
router.post("/sendWelcomeMail", sendWelcomeMail);
router.post("/signup-with-discount", signupWithDiscount);

module.exports = router;
