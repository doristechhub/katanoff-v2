const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { sendMail } = require("../helpers/mail");
const { contactUsEmail } = require("../utils/template");
const { contactService } = require("../services");

const contactUs = async (req, res) => {
  try {
    let { firstName, lastName, email, mobile, requirement } = req.body;

    // Sanitize input
    firstName = sanitizeValue(firstName) ? firstName.trim() : null;
    lastName = sanitizeValue(lastName) ? lastName.trim() : null;
    email = sanitizeValue(email) ? email.trim() : null;
    mobile = sanitizeValue(mobile) ? mobile.trim() : null;
    requirement = sanitizeValue(requirement) ? requirement.trim() : null;

    // Validate required fields
    if (firstName && lastName && email && mobile) {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailPattern.test(email)) {
        return res.json({ status: 400, message: message.EMAIL_VALIDATION });
      }

      const params = {
        firstName,
        lastName,
        email,
        mobile,
        requirement,
      };

      await contactService.create(params);

      try {
        const fullName = `${firstName} ${lastName}`;
        const { subject, description } = contactUsEmail({
          fullName,
        });
        await sendMail(email, subject, description);
      } catch (e) {
        console.log("Failed to send user confirmation email:", e?.message);
      }

      return res.json({ status: 200, message: message.SUCCESS });
    }

    return res.json({ status: 400, message: message.INVALID_DATA });
  } catch (err) {
    console.error("Contact error:", err.message);
    return res.json({ status: 500, message: message.SERVER_ERROR });
  }
};

module.exports = {
  contactUs,
};
