const { getAppCheck } = require("firebase-admin/app-check");
const message = require("../utils/messages");
const { defaultApp } = require("../firebase");

const appCheckVerification = (app = defaultApp) => {
  return async (req, res, next) => {
    try {
      const appCheckToken = req.header("X-Firebase-AppCheck");
      if (!appCheckToken) {
        return res.status(401).json({
          status: 401,
          message: message.UN_AUTHORIZED,
        });
      }

      const appCheckClaims = await getAppCheck(app).verifyToken(appCheckToken);

      // If verifyToken() succeeds, continue with the next middleware
      // function in the stack.
      next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        message: message.custom(
          "Unauthorized: Invalid or missing App Check token"
        ),
      });
    }
  };
};

module.exports = appCheckVerification;
