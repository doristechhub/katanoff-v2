const message = {
  SUCCESS: "success",
  DATA_NOT_FOUND: "Data not found",
  SERVER_ERROR: "something went wrong",
  INVALID_DATA: "Invalid Data!",
  UN_AUTHORIZED: "unauthorized",
  PASSWORD_MISMATCH: "Password mismatch!...try again!",
  LOGGED_IN: "Logged in successfully",
  EMAIL_VERIFIED: "E-mail verified successfully",
  OTP_EXPIRED: "OTP is expired",
  OTP_MISMATCH: "OTP mismatch",
  BAD_REQUEST: "Bad request",
  PASSWORD_UPDATE_SUCCESSFULLY: "Your password is successfully updated",
  PASSWORD_VALIDATION:
    "Your password must be have at least 8 min characters long, 1 uppercase character & 1 lowercase character, 1 number, 1 symbol",
  MOBILE_VALIDATION: "Please enter valid mobile number",
  EMAIL_VALIDATION: "Please enter valid E-mail",
  SEND_OTP_EMAIL: "OTP sent to your Email please open you Email",
  OTP_VERIFIED: "Otp verified successfully",
  ALREADY_ACCOUNT: "You already have an account please Login",
  RATE_LIMIT_MESSAGE: "Too many requests, please try again after some time",
  createMessage: (item = "") => {
    return item ? `${item} created successfully` : "data created successfully";
  },
  updateMessage: (item = "") => {
    return item ? `${item} updated successfully` : "data updated successfully";
  },
  deleteMessage: (item = "") => {
    return item ? `${item} deleted successfully.` : "data deleted successfully";
  },
  alreadyExist: (item = "") => {
    return item ? `${item} already exist!` : "data already exist!";
  },
  invalid: (item = "") => {
    return item ? `Invalid ${item}` : "Invalid data";
  },
  notFound: (item = "") => {
    return item ? `${item} not Found` : "data not found";
  },
  mustBeRequired: (item = "") => {
    return item ? `${item} must be required` : "data must be required";
  },
  custom: (item = "") => {
    return item;
  },
};

module.exports = message;
