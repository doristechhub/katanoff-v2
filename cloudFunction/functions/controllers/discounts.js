const { sendMail } = require("../helpers/mail");
const { userService } = require("../services");
const message = require("../utils/messages");
const { discountEmail } = require("../utils/template");
const getDiscountStatus = require("../helpers/discount");


const sendDiscountToAllUsers = async (req, res) => {
  try {
    const discount = req.body;
    if (!discount) {
      return res.status(400).json({ status: 400, message: message.custom("Discount data is missing.") });
    }

    const usersList = await userService.getAll();
    if (!usersList?.length) {
      return res.status(404).json({ status: 404, message: message.custom("No users found.") });
    }
    const discountStatus = getDiscountStatus(discount?.dateRange);

    for (let i = 0; i < usersList.length; i++) {
      const { email, firstName, lastName } = usersList[i] || {};

      if (!email) continue;
      const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
      const { subject, description } = discountEmail({ userName: fullName, discount, status: discountStatus });
      sendMail(email, subject, description);


      if (usersList.length === i + 1) {
        return res.status(200).json({
          status: 200,
          message: message.SUCCESS,
        });
      }
    }
  } catch (err) {
    console.error("Error in sendDiscountToAllUsers:", err);
    return res.status(500).json({ status: 500, message: message.SERVER_ERROR });
  }
};

module.exports = {
  sendDiscountToAllUsers,
};
