const order = require("./order");
const cart = require("./cart");
const product = require("./product");
const user = require("./user");
const admin = require("./admin");
const appointment = require("./appointment");
const stripe = require("./stripe");
const returns = require("./returns");
const contact = require("./contact");
const paypal = require("./paypal");

module.exports = {
  orderService: order,
  returnService: returns,
  cartService: cart,
  productService: product,
  userService: user,
  adminService: admin,
  appointmentService: appointment,
  stripeService: stripe,
  contactService: contact,
  paypalService: paypal,
};
