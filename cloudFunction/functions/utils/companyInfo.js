const dotenv = require("dotenv");
dotenv.config();
const companyInfo = {
  COMPANY_NAME: process.env.COMPANY_NAME,
  COMPANY_EMAIL: process.env.COMPANY_EMAIL,
  COMPANY_MOBILE_NO: process.env.COMPANY_MOBILE_NO,
  WEBSITE_URL: process.env.WEBSITE_URL,
  LOGO: process.env.LOGO,
  INSTAGRAM: process.env.INSTAGRAM,
  INSTAGRAM_URL: process.env.INSTAGRAM_URL,
  FACEBOOK: process.env.FACEBOOK,
  FACEBOOK_URL: process.env.FACEBOOK_URL,
};

module.exports = companyInfo;
