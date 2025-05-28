const message = require("../utils/messages");

const userAuthorized = async (req, res, next) => {
  try {
    const userData = req.userData
    if (userData && userData.loggedInType === 'user') {
      next()
    } else {
      return res.status(401).json({
        status: 401,
        message: message.UN_AUTHORIZED,
      });
    }
  } catch (e) {
    console.log(e)
  }
}

module.exports = userAuthorized
