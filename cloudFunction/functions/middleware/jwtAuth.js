const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { userService, adminService } = require("../services");
const message = require("../utils/messages");
dotenv.config();
const encryptor = require("simple-encryptor")(process.env.ENC_KEY);

const jwtAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decryptedToken = encryptor.decrypt(token);
      if (decryptedToken) {
        jwt.verify(
          decryptedToken,
          process.env.JWT_PRIVATE_KEY,
          async (err, decoded) => {
            if (decoded) {
              const findPattern = { userId: decoded.id };
              const userData = await userService.findOne(findPattern);
              const adminData = await adminService.findOne(findPattern);
              if (userData) {
                req.userData = userData;
                req.userData.loggedInType = "user";
                next();
              } else if (adminData) {
                req.userData = adminData;
                req.userData.loggedInType = "admins";
                next();
              } else {
                return res.status(401).json({
                  status: 401,
                  message: message.UN_AUTHORIZED,
                });
              }
            } else if (err) {
              return res.status(401).json({
                status: 401,
                message: message.UN_AUTHORIZED,
              });
            }
          }
        );
      } else {
        return res.status(401).json({
          status: 401,
          message: message.UN_AUTHORIZED,
        });
      }
    } else {
      return res.status(401).json({
        status: 401,
        message: message.UN_AUTHORIZED,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = jwtAuth;
