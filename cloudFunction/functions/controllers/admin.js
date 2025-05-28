const { adminService, userService } = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const jwt = require("jsonwebtoken");
const encryptor = require("simple-encryptor")(process.env.ENC_KEY);
const bcrypt = require("bcryptjs");

/**
  This API is used for admin login.
*/
const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = sanitizeValue(email) ? email.trim() : null;
    password = sanitizeValue(password) ? password.trim() : null;

    if (email && password) {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const emailResult = emailPattern.test(email);
      if (emailResult) {
        const findPattern = {
          email,
        };
        const adminData = await adminService.findByEmail(findPattern);
        const userData = await userService.findByEmail(findPattern);
        if (userData) {
          return res.json({
            status: 409,
            message: message.custom("You do not have permission"),
          });
        }
        if (adminData) {
          if (bcrypt.compareSync(password, adminData.password)) {
            const generatedToken = jwt.sign(
              { id: adminData.id, email: adminData.email },
              process.env.JWT_PRIVATE_KEY
            );
            const token = encryptor.encrypt(generatedToken);

            const adminDataObj = {
              firstName: adminData.firstName,
              lastName: adminData.lastName,
              email: adminData.email,
              mobile: adminData.mobile,
              id: adminData.id,
              token: token,
              permissions: adminData?.permissions ?? [],
            };
            return res.json({
              status: 200,
              adminData: adminDataObj,
              message: message.LOGGED_IN,
            });
          } else {
            return res.json({
              status: 400,
              message: message.PASSWORD_MISMATCH,
            });
          }
        } else {
          return res.json({
            status: 400,
            message: message.custom(
              "Email does not exist! Please create an account"
            ),
          });
        }
      } else {
        return res.json({
          status: 400,
          message: message.EMAIL_VALIDATION,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

module.exports = {
  adminLogin,
};
