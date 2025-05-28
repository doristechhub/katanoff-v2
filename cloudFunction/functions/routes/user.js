const express = require("express");
const router = express.Router();
const { sendOtpForEmailVerification, verifyOtp, sendWelcomeMail } = require("../controllers/user");

router.post("/sendOtpForEmailVerification", sendOtpForEmailVerification);
router.post("/verifyOtp", verifyOtp);
router.post("/sendWelcomeMail", sendWelcomeMail);

module.exports = router;
