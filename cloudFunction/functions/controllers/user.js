const {
  userService,
  adminService,
  discountService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { sendMail } = require("../helpers/mail");
const otpGenerator = require("otp-generator");
const {
  emailOtpVerification,
  welcomeTemplate,
  signUpDiscountEmail,
} = require("../utils/template");
const jwt = require("jsonwebtoken");
const { SIGN_UP_DISCOUNT } = require("../helpers/common");
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
              const fullName = `${userData?.firstName} ${userData?.lastName}`;
              const mailPayload = {
                fullName,
                otp
              }
              const { subject, description } = emailOtpVerification(mailPayload);
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

/**
  This API is used for sending a sign-up discount email to an existing user.
*/
const signupWithDiscount = async (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeValue(email) ? email.trim() : null;

    if (!email) {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }

    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailResult = emailPattern.test(email);
    if (!emailResult) {
      return res.json({
        status: 400,
        message: message.EMAIL_VALIDATION,
      });
    }

    const findPattern = { email };
    const userData = await userService.findByEmail(findPattern);
    if (!userData) {
      return res.json({
        status: 400,
        message: message.custom(
          "Email does not exist! Please create an account"
        ),
      });
    }

    const adminData = await adminService.findByEmail(findPattern);
    if (adminData) {
      return res.json({
        status: 409,
        message: message.custom(
          "Account Already Exists in Admin Panel. Use Another EmailID"
        ),
      });
    }

    const discountList = await discountService.getAll();
    const discount = discountList.find((d) => d.name === SIGN_UP_DISCOUNT);
    if (!discount) {
      return res.json({
        status: 404,
        message: message.custom("Sign Up Discount not found"),
      });
    }

    const fullName = `${userData.firstName} ${userData.lastName}`;
    const { subject, description } = signUpDiscountEmail(fullName, discount);
    await sendMail(email, subject, description);

    return res.json({
      status: 200,
      message: message.custom("Sign-up discount email sent successfully"),
    });
  } catch (error) {
    console.error("Error sending sign-up discount email:", error);
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
  signupWithDiscount,
};
