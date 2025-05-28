const message = require("../utils/messages");
const { pagesList } = require("../utils/pagesList");

const adminAuthorized = (pageId) => {
  return (req, res, next) => {
    try {
      const userData = req.userData;
      if (pagesList.find(page => page.pageId === pageId)) {
        if (userData && userData.loggedInType === 'admins' && userData.permissions.find(permission => permission.pageId === pageId)) {
          next();
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
};

module.exports = adminAuthorized
