const message = require("../utils/messages");
const { orderService, paypalService } = require("../services");
const { getNonCustomizedProducts } = require("../helpers/common");
const { updateProductQty } = require("../services/product");

// Utility function to handle order deletion and product quantity update
const deleteOrderAndUpdateProductQty = async ({ orderId }) => {
  const findPattern = { orderId };
  const orderData = await orderService.findOne(findPattern);
  await orderService.deleteOne(findPattern);
  const nonCustomizedProducts = getNonCustomizedProducts(orderData?.products);
  await updateProductQty(nonCustomizedProducts);
};

/**
 * API to get PayPal access token
 */
const getAccessToken = async (req, res) => {
  try {
    const { access_token } = await paypalService.getAccessToken();
    return res.json({
      status: 200,
      message: message.SUCCESS,
      data: { access_token },
    });
  } catch (error) {
    console.error("Error getting PayPal access token:", error.message);
    return res.json({
      status: 400,
      message: message.custom(error?.message),
    });
  }
};

/**
 * API to create a PayPal order
 */
const createPaypalOrder = async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.json({
        status: 400,
        message: message.custom("order number not found"),
      });
    }
    const orderData = await orderService.findByOrderNumber({ orderNumber });

    if (!orderData) {
      return res.json({
        status: 400,
        message: message.custom("Order not found"),
      });
    }

    try {
      const paypalOrderData = await paypalService.createOrder({ orderData });

      if (paypalOrderData) {
        // Save paypalOrderId to order document
        await orderService.findOneAndUpdate(
          { orderId: orderData?.id },
          { paypalOrderId: paypalOrderData?.id }
        );
        return res.json({
          status: 200,
          message: message.SUCCESS,
          paypalOrderData,
        });
      } else {
        await deleteOrderAndUpdateProductQty({ orderId: orderData?.id });
        return res.json({
          status: 200,
          message: message.SUCCESS,
          paypalOrderData,
        });
      }
    } catch (error) {
      await deleteOrderAndUpdateProductQty({ orderId: orderData?.id });
      console.error("Error creating PayPal order:", error?.message);
      return res.json({
        status: 500,
        message: error.message || "Failed to create order",
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * API to capture a PayPal order
 */
const capturePaypalOrder = async (req, res) => {
  try {
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.json({
        message: message.custom("Missing paypalOrderId parameter"),
        status: 400,
      });
    }

    const paypalOrderCaptureResult = await paypalService.captureOrder({
      paypalOrderId,
    });

    if (paypalOrderCaptureResult?.status === "COMPLETED") {
      // Find order by paypalOrderId
      const order = await orderService.findByPaypalOrderId({ paypalOrderId });

      if (!order) {
        return res.json({
          status: 404,
          message: message.custom(
            "Order not found for the provided paypalOrderId"
          ),
        });
      }

      // Save paypalCaptureId to order document
      const captureId =
        paypalOrderCaptureResult?.purchase_units?.[0]?.payments?.captures?.[0]
          ?.id;
      await orderService.findOneAndUpdate(
        { orderId: order?.id },
        {
          paypalCaptureId: captureId,
        }
      );
    }

    return res.json({
      status: 200,
      message: message.custom("Order captured successfully"),
      paypalOrderCaptureResult,
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error.message);
    return res.json({
      status: 500,
      message: error.message || "Failed to capture order",
    });
  }
};

/**
 * API to refund a PayPal payment
 */
const refundPaypalPayment = async (req, res) => {
  try {
    const { captureId, amount, currency, reason } = req.body;

    if (!captureId || !amount) {
      return res.json({
        status: 400,
        message: message.custom("Missing captureId or amount parameter"),
      });
    }

    const refundResult = await paypalService.refundPayment({
      captureId,
      amount,
      currency,
      reason,
    });

    return res.json({
      status: 200,
      message: message.custom("Refund processed successfully"),
      refundResult,
    });
  } catch (error) {
    console.error("Error processing PayPal refund:", error.message);
    return res.json({
      status: 500,
      message: error.message || "Failed to process refund",
    });
  }
};

module.exports = {
  getAccessToken,
  createPaypalOrder,
  capturePaypalOrder,
  refundPaypalPayment,
};
