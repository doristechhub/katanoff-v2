const jwtAuth = require("../middleware/jwtAuth");
const optionalJwtAuth = require("../middleware/optionalJwtAuth");
const adminAuthorized = require("../middleware/adminAuthorized");
const userAuthorized = require("../middleware/userAuthorized");
const allUsersAndAdminPageAuth = require("./allUserAndAdminPageAuth");
const rateLimitMiddleware = require("./rateLimit");
const appCheckVerification = require("./appCheckVerification");

module.exports = {
  jwtAuth: jwtAuth,
  optionalJwtAuth: optionalJwtAuth,
  adminAuth: adminAuthorized,
  userAuth: userAuthorized,
  allUsersAndAdminPageAuth: allUsersAndAdminPageAuth,
  rateLimitMiddleware: rateLimitMiddleware,
  appCheckVerification: appCheckVerification,
};
