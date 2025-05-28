const message = require("../utils/messages");

const allUsersAndAdminPageAuth = (pageId) => {
  return (req, res, next) => {
    try {
      const userData = req.userData;
      if(userData?.loggedInType === 'user'){
        next()
      }else if (userData?.loggedInType === 'admins' && userData.permissions.find(permission => permission.pageId === pageId)) {
        next()
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

module.exports = allUsersAndAdminPageAuth
