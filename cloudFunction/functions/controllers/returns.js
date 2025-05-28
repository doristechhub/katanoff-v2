const {
  returnService,
  userService,
  orderService,
  stripeService,
  paypalService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const {
  getMailTemplateForReturnStatus,
  getMailTemplateForRefundStatus,
} = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const dotenv = require("dotenv");
const { getCurrentDate } = require("../helpers/common");

dotenv.config();

/**
 * Utility to fetch email and userName from return data.
 * @param {Object} returnData - Return data object
 * @returns {Promise<{email: string, userName: string}>} - Email and user name
 */
const getUserInfoFromReturn = async (returnData) => {
  let email = "";
  let userName = "";

  // Try to get from order details first
  const orderDetail = await orderService.findOne({
    orderId: returnData?.orderId,
  });
  if (orderDetail) {
    const { shippingAddress } = orderDetail;
    email = shippingAddress?.email || "";
    userName = shippingAddress?.name || "";
  }

  // Override with user data if available
  if (returnData?.userId) {
    const userData = await userService.findOne({ userId: returnData?.userId });
    if (userData) {
      email = userData?.email?.toLowerCase() || email;
      userName =
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
        userName;
    }
  }

  return { email, userName };
};

/**
 * This API is used for reject return by admin.
 */
const rejectReturn = async (req, res) => {
  try {
    let { returnId, adminNote } = req.body;
    // required
    returnId = sanitizeValue(returnId) ? returnId.trim() : null;
    adminNote = sanitizeValue(adminNote) ? adminNote.trim() : null;

    if (returnId && adminNote) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (returnData) {
        if (returnData.status === "rejected") {
          return res.json({
            status: 409,
            message: message.alreadyExist("return status"),
          });
        }

        if (
          returnData.returnPaymentStatus === "pending" &&
          returnData.status === "pending"
        ) {
          const updatePattern = {
            adminNote: adminNote,
            status: "rejected",
            updatedDate: getCurrentDate(),
          };
          await returnService.findOneAndUpdate(findPattern, updatePattern);

          const { email, userName } = await getUserInfoFromReturn(returnData);

          // send mail for return status
          sendReturnStatusEmail(
            email,
            userName,
            returnData.orderNumber,
            "rejected",
            adminNote,
            returnData.shippingLabel
          );
          return res.json({
            status: 200,
            message: message.custom(`Return has been rejected successfully`),
          });
        } else {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot reject return as the return payment status is ${returnData.returnPaymentStatus} and return status is ${returnData.status}`
            ),
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
 * This API is used for send return request by admin.
 */
const sendReturnStatusMailController = async (req, res) => {
  try {
    let { returnId } = req.body;
    // required
    returnId = sanitizeValue(returnId) ? returnId.trim() : null;

    if (returnId) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (returnData) {
        const { orderNumber, status, adminNote, shippingLabel } = returnData;

        const { email, userName } = await getUserInfoFromReturn(returnData);

        // send mail for return status
        sendReturnStatusEmail(
          email,
          userName,
          orderNumber,
          status,
          adminNote,
          shippingLabel
        );

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
 * This API is used for refund payment for a return request (supports both Stripe and PayPal).
 */
const refundPaymentForReturn = async (req, res) => {
  try {
    let { returnId, refundAmount, refundDescription } = req.body;
    returnId = sanitizeValue(returnId) ? returnId.trim() : "";
    refundAmount = refundAmount ? Number(refundAmount) : 0;

    if (returnId && refundAmount) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (!returnData) {
        return res.json({
          status: 404,
          message: message.notFound("return"),
        });
      }

      if (
        ![
          "pending",
          "failed_refund",
          "refund_initialization_failed",
          "cancelled_refund",
        ].includes(returnData.returnPaymentStatus) ||
        !["received"].includes(returnData.status)
      ) {
        return res.json({
          status: 409,
          message: message.custom(
            `You cannot refund payment as the return payment status is ${returnData.returnPaymentStatus} and return status is ${returnData.status}`
          ),
        });
      }

      const orderFindPattern = {
        orderId: returnData.orderId,
      };
      const orderData = await orderService.findOne(orderFindPattern);
      if (!orderData) {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }

      const refundAmountInCents = Math.round(refundAmount * 100); // Convert to cents for Stripe/PayPal
      let returnUpdatePattern = {
        refundDescription: sanitizeValue(refundDescription)
          ? refundDescription.trim()
          : returnData?.refundDescription || "",
        updatedDate: getCurrentDate(),
        refundAmount,
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
              `The requested refund amount exceeds your payment amount. The maximum refundable amount is $${
                paymentIntent.amount / 100
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
            returnUpdatePattern.stripeRefundId = refundResponse.id;
            if (refundResponse.status === "pending") {
              returnUpdatePattern.returnPaymentStatus = "pending_refund";
              sendRefundStatusEmail("pending_refund", orderData);
            }

            await returnService.findOneAndUpdate(
              findPattern,
              returnUpdatePattern
            );
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
            returnUpdatePattern.returnPaymentStatus =
              "refund_initialization_failed";
            returnUpdatePattern.stripeRefundFailureReason = e?.message;
            await returnService.findOneAndUpdate(
              findPattern,
              returnUpdatePattern
            );
            sendRefundStatusEmail("refund_initialization_failed", orderData);
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
              `The requested refund amount exceeds your payment amount. The maximum refundable amount is $${
                capturedAmount / 100
              }.`
            ),
          });
        }

        const refundParams = {
          captureId: orderData.paypalCaptureId,
          amount: refundAmount,
          reason: returnUpdatePattern?.refundDescription,
        };

        try {
          const refundResult = await paypalService.refundPayment(refundParams);
          if (refundResult && refundResult?.status === "COMPLETED") {
            returnUpdatePattern.paypalRefundId = refundResult.id;
            returnUpdatePattern.returnPaymentStatus = "refunded";
            await returnService.findOneAndUpdate(
              findPattern,
              returnUpdatePattern
            );
            sendRefundStatusEmail("refunded", orderData);
            return res.json({
              status: 200,
              message: message.custom("Refund processed successfully"),
            });
          } else {
            returnUpdatePattern.returnPaymentStatus =
              "refund_initialization_failed";
            returnUpdatePattern.paypalRefundFailureReason =
              "PayPal refund did not complete";
            await returnService.findOneAndUpdate(
              findPattern,
              returnUpdatePattern
            );
            sendRefundStatusEmail("refund_initialization_failed", orderData);
            return res.json({
              status: 302,
              message: message.custom("PayPal refund initialization failed"),
            });
          }
        } catch (e) {
          returnUpdatePattern.returnPaymentStatus =
            "refund_initialization_failed";
          returnUpdatePattern.paypalRefundFailureReason = e?.message;
          await returnService.findOneAndUpdate(
            findPattern,
            returnUpdatePattern
          );
          sendRefundStatusEmail("refund_initialization_failed", orderData);
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

const sendReturnStatusEmail = async (
  email,
  userName,
  orderNumber,
  status,
  adminNote,
  shippingLabel
) => {
  try {
    const { subject, description } = getMailTemplateForReturnStatus(
      userName,
      orderNumber,
      status,
      adminNote,
      shippingLabel
    );

    await sendMail(email, subject, description);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Sends an email to notify the customer about the refund status based on the event status.
 * @param {string} eventStatus - The status of the refund event (e.g., 'pending_refund', 'succeeded', 'refunded', 'failed', etc.).
 * @param {Object} orderData - The order data containing customer and order details.
 * @param {Object} orderData.shippingAddress - The customer's shipping address details.
 * @param {string} orderData.shippingAddress.name - The customer's name.
 * @param {string} orderData.shippingAddress.email - The customer's email address.
 * @param {string} orderData.orderNumber - The order number associated with the refund.
 * @returns {void}
 */
const sendRefundStatusEmail = (eventStatus, orderData) => {
  let statusKey;

  switch (eventStatus) {
    case "pending_refund":
      statusKey = "pending_refund";
      break;
    case "succeeded":
    case "refunded": // Both succeeded and refunded statuses map to 'refunded' template
      statusKey = "refunded";
      break;
    case "refund_initialization_failed":
      statusKey = "refund_initialization_failed";
      break;
    case "failed":
      statusKey = "failed_refund";
      break;
    case "canceled":
      statusKey = "cancelled_refund";
      break;
    default:
      return;
  }

  const { subject, description } = getMailTemplateForRefundStatus(
    orderData.shippingAddress.name,
    orderData.orderNumber,
    statusKey
  );

  sendMail(orderData.shippingAddress.email, subject, description);
};

module.exports = {
  rejectReturn,
  sendReturnStatusMailController,
  refundPaymentForReturn,
};
