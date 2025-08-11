const {
  orderService,
  productService,
  cartService,
  stripeService,
  paypalService,
} = require("../services/index");

const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const {
  getMailTemplateForOrderStatus,
  getMailTemplateForRefundStatus,
} = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const { createOrder } = require("../controllers/stripe");
const {
  getCurrentDate,
  getNonCustomizedProducts,
} = require("../helpers/common");
const { invoiceController } = require("./invoice");

/**
  This API is used for create order.
*/
const insertOrder = async (req, res) => {
  try {
    const userData = req?.userData;

    if (userData) {
      const findPattern = {
        key: "userId",
        value: userData?.id,
      };
      const userWiseCartData = await cartService.find(findPattern);
      req.body.userId = userData?.id;
      req.body.cartList = userWiseCartData;
    }

    const { createdOrder } = await createOrder({
      payload: req.body,
      res,
      userData,
    });
    if (createdOrder) {
      return res.json({
        status: 200,
        createdOrder,
        message: message.SUCCESS,
      });
    } else {
      return res.json({
        status: 500,
        message: message.SERVER_ERROR,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for update payment status into order.
*/
const updatePaymentStatus = async (req, res) => {
  try {
    let { orderId, paymentStatus, cartIds } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    paymentStatus = sanitizeValue(paymentStatus) ? paymentStatus.trim() : null;
    cartIds = Array.isArray(cartIds) ? cartIds : [];
    if (
      orderId &&
      paymentStatus &&
      [
        "pending",
        "success",
        "failed",
        "refunded",
        "pending_refund",
        "failed_refund",
        "cancelled_refund",
        "refund_initialization_failed",
      ].includes(paymentStatus)
    ) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === paymentStatus) {
          return res.json({
            status: 409,
            message: message.alreadyExist("payment status"),
          });
        }
        let updatePattern = {
          paymentStatus: paymentStatus,
          updatedDate: getCurrentDate(),
        };
        await orderService.findOneAndUpdate(findPattern, updatePattern);
        if (paymentStatus == "success") {
          // remove cart
          if (cartIds.length) {
            cartIds.map((cartId) => cartService.deleteOne({ cartId: cartId }));
          }
          const mailPayload = {
            userName: orderData?.shippingAddress?.name,
            orderNumber: orderData?.orderNumber,
            orderStatus: orderData?.orderStatus,
          }
          // send mail for order status
          const { subject, description } = getMailTemplateForOrderStatus(
            mailPayload
          );
          sendMail(orderData?.shippingAddress?.email, subject, description);
        }
        return res.json({
          status: 200,
          message: message.SUCCESS,
          data: { orderNumber: orderData.orderNumber },
        });
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for send pending order mail.
*/
const sendPendingOrderMail = async (req, res) => {
  try {
    let { orderId } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;

    if (orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === "pending") {

          const mailPayload = {
            userName: orderData?.shippingAddress?.name,
            orderNumber: orderData?.orderNumber,
            orderStatus: "pending",
          }

          // send mail for order status
          const { subject, description } = getMailTemplateForOrderStatus(
            mailPayload
          );

          sendMail(orderData.shippingAddress.email, subject, description);
          return res.json({
            status: 200,
            message: message.custom("Mail sent successfully for pending order"),
          });
        } else {
          return res.json({
            status: 404,
            message: message.custom("Please provide Pending Order"),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for delete order.
*/
const deleteOrder = async (req, res) => {
  try {
    let { orderId } = req.params;
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    if (orderId) {
      const findPattern = {
        orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === "pending") {
          await orderService.deleteOne(findPattern);
          //  update product qty for non-customized products
          const nonCustomizedProducts = getNonCustomizedProducts(
            orderData.products
          );

          await productService?.updateProductQty(nonCustomizedProducts);
          if (orderData?.paymentMethod === "stripe") {
            const paymentIntent = await stripeService.cancelPaymentIntent(
              orderData.stripePaymentIntentId
            );
          }
          return res.json({
            status: 200,
            message: message.deleteMessage("order"),
          });
        } else {
          return res.json({
            status: 400,
            message: message.custom(
              `You cannot delete order as the payment status is ${orderData.paymentStatus}`
            ),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.invalid("id"),
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for update order status into order for admin.
*/
const updateOrderStatus = async (req, res) => {
  try {
    let { orderId, orderStatus, cancelReason, trackingNumber } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    orderStatus = sanitizeValue(orderStatus) ? orderStatus.trim() : null;
    cancelReason = sanitizeValue(cancelReason) ? cancelReason.trim() : null;
    trackingNumber = sanitizeValue(trackingNumber)
      ? trackingNumber.trim()
      : null;

    if (
      orderId &&
      orderStatus &&
      ["pending", "confirmed", "shipped", "delivered"].includes(orderStatus)
    ) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.orderStatus === orderStatus) {
          return res.json({
            status: 409,
            message: message.alreadyExist("order status"),
          });
        }
        let updatePattern = {
          orderStatus: orderStatus,
          updatedDate: getCurrentDate(),
        };
        if (orderStatus === "shipped") {
          if (trackingNumber) {
            updatePattern.trackingNumber = trackingNumber;
          } else {
            return res.json({
              status: 500,
              message: message.custom("tracking number required"),
            });
          }
        }
        if (!["shipped", "delivered"].includes(orderStatus)) {
          updatePattern.trackingNumber = "";
        }
        if (orderStatus === "delivered") {
          updatePattern.deliveryDate = Date.now();
        }
        await orderService.findOneAndUpdate(findPattern, updatePattern);
        const mailPayload = {
          userName: orderData?.shippingAddress?.name,
          orderNumber: orderData?.orderNumber,
          trackingNumber: trackingNumber || orderData?.trackingNumber,
          orderStatus,
        }
        // send mail for order status
        const { subject, description } = getMailTemplateForOrderStatus(
          mailPayload
        );
        sendMail(orderData.shippingAddress.email, subject, description);
        return res.json({
          status: 200,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
 * API to cancel order by admin or user (full refund only)
 */
const cancelOrder = async (req, res) => {
  try {
    const userData = req.userData;
    let { orderId, cancelReason } = req.body;
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    cancelReason = sanitizeValue(cancelReason) ? cancelReason.trim() : null;

    if (orderId && cancelReason) {
      const findPattern = { orderId };
      const orderData = await orderService.findOne(findPattern);
      if (!orderData) {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }

      if (orderData.orderStatus === "cancelled") {
        return res.json({
          status: 409,
          message: message.alreadyExist("order status"),
        });
      }

      if (
        orderData.paymentStatus === "success" &&
        ["pending", "confirmed"].includes(orderData.orderStatus)
      ) {
        const updatePattern = {
          cancelReason,
          cancelledBy: userData.id,
          orderStatus: "cancelled",
          updatedDate: getCurrentDate(),
        };
        await orderService.findOneAndUpdate(findPattern, updatePattern);

        // Update product quantities for non-customized products
        const nonCustomizedProducts = getNonCustomizedProducts(
          orderData.products
        );
        await productService?.updateProductQty(nonCustomizedProducts);

        const mailPayload = {
          userName: orderData?.shippingAddress?.name,
          orderNumber: orderData?.orderNumber,
          orderStatus: "cancelled",
        }
        // Send cancellation email
        const { subject, description } = getMailTemplateForOrderStatus(
          mailPayload
        );
        sendMail(orderData?.shippingAddress?.email, subject, description);

        // Handle refund based on payment method
        if (orderData.paymentMethod === "stripe") {
          const pIFindPattern = {
            paymentIntentId: orderData.stripePaymentIntentId,
            options: {
              expand: [
                "latest_charge.balance_transaction",
                "latest_charge.refunds",
              ],
            },
          };
          const paymentIntent = await stripeService.retrivePaymentIntent(
            pIFindPattern
          );
          if (!paymentIntent || paymentIntent.status !== "succeeded") {
            return res.json({
              status: 409,
              message: message.custom(
                `You cannot cancel order as the payment intent is not successful`
              ),
            });
          }

          const refundPaymentParams = {
            paymentIntentId: paymentIntent.id,
            amountInCents: paymentIntent.amount, // Full refund
          };

          try {
            const refundResponse = await stripeService.refundAmount(
              refundPaymentParams
            );
            if (refundResponse?.status === "pending") {
              const orderUpdatePatternWithRefund = {
                stripeRefundId: refundResponse.id,
                paymentStatus: "pending_refund",
                updatedDate: getCurrentDate(),
              };
              await orderService.findOneAndUpdate(
                findPattern,
                orderUpdatePatternWithRefund
              );

              const { subject, description } = getMailTemplateForRefundStatus(
                orderData.shippingAddress.name,
                orderData.orderNumber,
                "pending_refund"
              );
              sendMail(orderData.shippingAddress.email, subject, description);
            }
          } catch (e) {
            const refundsList = paymentIntent?.latest_charge?.refunds?.data;
            if (
              !refundsList?.length ||
              refundsList?.filter((x) => x?.status === "canceled")?.length ===
              refundsList?.length
            ) {
              const orderUpdatePatternWithRefund = {
                paymentStatus: "refund_initialization_failed",
                stripeRefundFailureReason: e?.message,
                updatedDate: getCurrentDate(),
              };
              await orderService.findOneAndUpdate(
                findPattern,
                orderUpdatePatternWithRefund
              );

              const { subject, description } = getMailTemplateForRefundStatus(
                orderData.shippingAddress.name,
                orderData.orderNumber,
                "refund_initialization_failed"
              );
              sendMail(orderData.shippingAddress.email, subject, description);
            }
          }
        } else if (orderData.paymentMethod === "paypal") {
          if (!orderData.paypalCaptureId) {
            return res.json({
              status: 409,
              message: message.custom("PayPal capture ID not found"),
            });
          }

          try {
            const refundResponse = await paypalService.refundPayment({
              captureId: orderData.paypalCaptureId,
              amount: orderData.total, // Full refund
              reason: cancelReason,
            });

            if (refundResponse?.status === "COMPLETED") {
              const orderUpdatePatternWithRefund = {
                paypalRefundId: refundResponse.id,
                paymentStatus: "refunded",
                updatedDate: getCurrentDate(),
              };
              await orderService.findOneAndUpdate(
                findPattern,
                orderUpdatePatternWithRefund
              );

              const { subject, description } = getMailTemplateForRefundStatus(
                orderData.shippingAddress.name,
                orderData.orderNumber,
                "refunded"
              );
              sendMail(orderData.shippingAddress.email, subject, description);
            }
          } catch (e) {
            const orderUpdatePatternWithRefund = {
              paymentStatus: "refund_initialization_failed",
              paypalRefundFailureReason: e?.message,
              updatedDate: getCurrentDate(),
            };
            await orderService.findOneAndUpdate(
              findPattern,
              orderUpdatePatternWithRefund
            );

            const { subject, description } = getMailTemplateForRefundStatus(
              orderData.shippingAddress.name,
              orderData.orderNumber,
              "refund_initialization_failed"
            );
            sendMail(orderData.shippingAddress.email, subject, description);
          }
        }

        // Delay response to ensure async operations complete
        setTimeout(() => {
          res.json({
            status: 200,
            message: message.custom(
              `Order has been cancelled and full refund will be initiated soon`
            ),
          });
        }, 5000);
      } else {
        return res.json({
          status: 409,
          message: message.custom(
            `You cannot cancel order as the payment status is ${orderData.paymentStatus}` +
            ` and order status is ${orderData.orderStatus}`
          ),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for get all order.
*/
const getAllOrder = async (req, res) => {
  try {
    const userData = req.userData;
    orderService
      .getAll()
      .then((orderData) => {
        return res.json({
          status: 200,
          message: message.SUCCESS,
          data: orderData,
        });
      })
      .catch((e) => {
        return res.json({
          status: 500,
          message: message.SERVER_ERROR,
        });
      });
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
 * This API is used for refund payment for an order (supports both Stripe and PayPal).
 */
const refundPayment = async (req, res) => {
  try {
    let { orderId, refundDescription } = req.body;
    orderId = sanitizeValue(orderId) ? orderId.trim() : "";
    refundDescription = sanitizeValue(refundDescription)
      ? refundDescription.trim()
      : "";

    if (orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (!orderData) {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }

      if (
        ![
          "success",
          "failed_refund",
          "refund_initialization_failed",
          "cancelled_refund",
        ].includes(orderData.paymentStatus) ||
        !["confirmed", "cancelled"].includes(orderData.orderStatus)
      ) {
        return res.json({
          status: 409,
          message: message.custom(
            `You cannot refund payment as the payment status is ${orderData.paymentStatus} and order status is ${orderData.orderStatus}`
          ),
        });
      }

      const refundAmountInCents = Math.round(orderData.total * 100); // Full refund in cents
      const updatePattern = {
        refundDescription:
          refundDescription || orderData?.refundDescription || "",
        updatedDate: getCurrentDate(),
      };

      if (orderData.paymentMethod === "stripe") {
        const pIFindPattern = {
          paymentIntentId: orderData.stripePaymentIntentId,
          options: {
            expand: [
              "latest_charge.balance_transaction",
              "latest_charge.refunds",
            ],
          },
        };
        const paymentIntent = await stripeService.retrivePaymentIntent(
          pIFindPattern
        );
        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot refund payment as the payment intent is not successful`
            ),
          });
        }

        if (paymentIntent.amount < refundAmountInCents) {
          return res.json({
            status: 429,
            message: message.custom(
              `The requested refund amount exceeds your payment amount. The maximum refundable amount is $${paymentIntent.amount / 100
              }.`
            ),
          });
        }

        const refundPaymentParams = {
          paymentIntentId: paymentIntent.id,
          amountInCents: refundAmountInCents,
        };

        try {
          const refundResponse = await stripeService.refundAmount(
            refundPaymentParams
          );
          if (refundResponse) {
            updatePattern.stripeRefundId = refundResponse.id;
            if (refundResponse.status === "pending") {
              updatePattern.paymentStatus = "pending_refund";
              const { subject, description } = getMailTemplateForRefundStatus(
                orderData.shippingAddress.name,
                orderData.orderNumber,
                "pending_refund"
              );
              sendMail(orderData.shippingAddress.email, subject, description);
            }
            await orderService.findOneAndUpdate(findPattern, updatePattern);
            setTimeout(() => {
              return res.json({
                status: 200,
                message: message.custom("Refund processed successfully"),
              });
            }, 5000); // 5 seconds delay to ensure async operations complete
          } else {
            return res.json({
              status: 404,
              message: message.notFound(),
            });
          }
        } catch (e) {
          const refundsList = paymentIntent?.latest_charge?.refunds?.data;
          if (
            !refundsList?.length ||
            refundsList?.filter((x) => x?.status === "canceled")?.length ===
            refundsList?.length
          ) {
            updatePattern.paymentStatus = "refund_initialization_failed";
            updatePattern.stripeRefundFailureReason = e?.message;
            await orderService.findOneAndUpdate(findPattern, updatePattern);
            const { subject, description } = getMailTemplateForRefundStatus(
              orderData.shippingAddress.name,
              orderData.orderNumber,
              "refund_initialization_failed"
            );
            sendMail(orderData.shippingAddress.email, subject, description);
          }
          return res.json({
            status: 302,
            message: message.custom(
              `Your refund initialization failed due to ${e?.message}`
            ),
          });
        }
      } else if (orderData.paymentMethod === "paypal") {
        if (!orderData.paypalCaptureId) {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot refund payment as no PayPal capture ID is associated with this order`
            ),
          });
        }

        // Fetch capture details to validate refund amount
        const captureDetails = await paypalService.getCaptureDetails({
          captureId: orderData.paypalCaptureId,
        });

        const capturedAmount = parseFloat(captureDetails.amount.value) * 100; // Convert to cents
        if (capturedAmount < refundAmountInCents) {
          return res.json({
            status: 429,
            message: message.custom(
              `The requested refund amount exceeds your payment amount. The maximum refundable amount is $${capturedAmount / 100
              }.`
            ),
          });
        }

        const refundParams = {
          captureId: orderData.paypalCaptureId,
          amount: orderData.total,
          reason: refundDescription,
        };

        try {
          const refundResult = await paypalService.refundPayment(refundParams);
          if (refundResult && refundResult?.status === "COMPLETED") {
            updatePattern.paypalRefundId = refundResult.id;
            updatePattern.paymentStatus = "refunded";
            await orderService.findOneAndUpdate(findPattern, updatePattern);
            const { subject, description } = getMailTemplateForRefundStatus(
              orderData.shippingAddress.name,
              orderData.orderNumber,
              "refunded"
            );
            sendMail(orderData.shippingAddress.email, subject, description);
            return res.json({
              status: 200,
              message: message.custom("Refund processed successfully"),
            });
          } else {
            updatePattern.paymentStatus = "refund_initialization_failed";
            updatePattern.paypalRefundFailureReason =
              "PayPal refund did not complete";
            await orderService.findOneAndUpdate(findPattern, updatePattern);
            const { subject, description } = getMailTemplateForRefundStatus(
              orderData.shippingAddress.name,
              orderData.orderNumber,
              "refund_initialization_failed"
            );
            sendMail(orderData.shippingAddress.email, subject, description);
            return res.json({
              status: 302,
              message: message.custom("PayPal refund initialization failed"),
            });
          }
        } catch (e) {
          updatePattern.paymentStatus = "refund_initialization_failed";
          updatePattern.paypalRefundFailureReason = e?.message;
          await orderService.findOneAndUpdate(findPattern, updatePattern);
          const { subject, description } = getMailTemplateForRefundStatus(
            orderData.shippingAddress.name,
            orderData.orderNumber,
            "refund_initialization_failed"
          );
          sendMail(orderData.shippingAddress.email, subject, description);
          return res.json({
            status: 302,
            message: message.custom(
              `Your refund initialization failed due to ${e?.message}`
            ),
          });
        }
      } else {
        return res.json({
          status: 400,
          message: message.custom("Invalid payment method"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

const generateOrderInovice = async (req, res) => {
  return invoiceController(req, res, "order");
};

module.exports = {
  insertOrder,
  updatePaymentStatus,
  deleteOrder,
  sendPendingOrderMail,
  updateOrderStatus,
  getAllOrder,
  cancelOrder,
  refundPayment,
  generateOrderInovice,
};
