const { userService, adminService } = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { sendMail } = require("../helpers/mail");
const otpGenerator = require("otp-generator");
const { emailOtpVerification, welcomeTemplate } = require("../utils/template");
const jwt = require("jsonwebtoken");
const encryptor = require("simple-encryptor")(process.env.ENC_KEY);

/**
  This API is used for send otp for email verification.
*/
const sendWelcomeMail = async (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeValue(email) ? email.trim() : null;
    if (email) {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const emailResult = emailPattern.test(email);
      if (emailResult) {
        const findPattern = {
          email,
        };
        const userData = await userService.findByEmail(findPattern);
        if (userData) {
          // const description = welcomeTemplate(`${userData.firstName} ${userData.lastName}`);
          // const subject = `Welcome To ${companyInfo.COMPANY_NAME}`
          // await sendMail(email, subject, description);

          return res.json({
            status: 200,
            message: message.SUCCESS,
          });
        } else {
          return res.json({
            status: 400,
            message: message.custom("Email does not exits!"),
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

/**
  This API is used for send otp for email verification.
*/
const sendOtpForEmailVerification = async (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeValue(email) ? email.trim() : null;
    if (email) {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const emailResult = emailPattern.test(email);
      if (emailResult) {
        const findPattern = {
          email,
        };
        const userData = await userService.findByEmail(findPattern);
        const adminData = await adminService.findByEmail(findPattern);
        if (adminData) {
          return res.json({
            status: 409,
            message: message.custom(
              "Account Already Exists in Admin Panel. Use Another EmailID"
            ),
          });
        }
        if (userData) {
          //send otp mail
          const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
          });

          const updatePattern = {
            otp: Number(otp),
            updatedDate: Date.now(),
          };
          const userFindPattern = {
            userId: userData.id,
          };
          userService
            .findOneAndUpdate(userFindPattern, updatePattern)
            .then(async () => {
              const { subject, description } = emailOtpVerification(`${otp}`);
              await sendMail(email, subject, description);

              return res.json({
                status: 200,
                message: message.SEND_OTP_EMAIL,
              });
            })
            .catch((e) => {
              return res.json({
                status: 500,
                message: message.SERVER_ERROR,
              });
            });
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

/**
  This API is used for verify otp.
*/
const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email ? email.trim() : null;
    otp = otp ? Number(otp) : null;
    if (email && otp) {
      const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const emailResult = emailPattern.test(email);
      if (emailResult) {
        const findPattern = {
          email,
        };
        const userData = await userService.findByEmail(findPattern);
        if (userData) {
          if (userData.otp === otp) {
            const userFindPattern = {
              userId: userData.id,
            };
            const updatePattern = {
              otp: null,
            };
            userService
              .findOneAndUpdate(userFindPattern, updatePattern)
              .then(async () => {
                const generatedToken = jwt.sign(
                  { id: userData.id, email: userData.email },
                  process.env.JWT_PRIVATE_KEY
                );
                const token = encryptor.encrypt(generatedToken);
                const userDataObj = {
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  id: userData.id,
                  token: token,
                };
                return res.json({
                  status: 200,
                  userData: userDataObj,
                  message: message.OTP_VERIFIED,
                });
              })
              .catch((e) => {
                return res.json({
                  status: 500,
                  message: message.SERVER_ERROR,
                });
              });
          } else {
            return res.json({
              status: 400,
              message: message.OTP_MISMATCH,
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
  sendWelcomeMail,
  sendOtpForEmailVerification,
  verifyOtp,
};
